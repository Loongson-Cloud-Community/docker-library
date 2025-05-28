package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	gatekeeperv3 "github.com/open-policy-agent/gatekeeper/v3/apis"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	runtimeutil "k8s.io/apimachinery/pkg/util/runtime"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/kubernetes/scheme"
	"k8s.io/klog/v2"
	"k8s.io/klog/v2/klogr"
	"sigs.k8s.io/controller-runtime/pkg/client/config"
	"sigs.k8s.io/controller-runtime/pkg/cluster"
	"sigs.k8s.io/controller-runtime/pkg/log"

	"api/query"
)

const constraintsGV = "constraints.gatekeeper.sh/v1beta1"

func main() {
	klog.InitFlags(flag.CommandLine)
	flag.Parse()

	log.SetLogger(klogr.New())
	conf := config.GetConfigOrDie()
	localScheme := runtime.NewScheme()
	runtimeutil.Must(scheme.AddToScheme(localScheme))
	runtimeutil.Must(gatekeeperv3.AddToScheme(localScheme))

	client, err := cluster.New(conf, func(options *cluster.Options) {
		options.Scheme = localScheme
	})
	if err != nil {
		klog.Fatalf("Failed to create cluster client: %v", err)
	}
	ctx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	go func() {
		if err := client.Start(ctx); err != nil {
			klog.Fatalf("Failed to start cluster client: %v", err)
		}
	}()

	r := mux.NewRouter()
	r.NewRoute().
		Methods(http.MethodGet).
		Path(fmt.Sprintf("/kapis/%s/constraints", constraintsGV)).
		Handler(&listConstraintsHandler{client: client})
	if err := http.ListenAndServe(":8080", r); err != nil {
		klog.Infof("Failed to listen and serve: %v", err)
	}
}

type listConstraintsHandler struct {
	client cluster.Cluster
}

func convertGVKToList(gvk schema.GroupVersionKind) schema.GroupVersionKind {
	if strings.HasSuffix(gvk.Kind, "List") {
		return gvk
	}
	gvk.Kind = gvk.Kind + "List"
	return gvk
}

func (h *listConstraintsHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	groupVersionKinds, err := h.getAllGroupVersionKinds()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get kinds: %v", err), http.StatusInternalServerError)
		return
	}

	var objects []runtime.Object
	for _, gvk := range groupVersionKinds {
		objectList := &unstructured.UnstructuredList{}
		objectList.SetGroupVersionKind(convertGVKToList(gvk))
		if err := h.client.GetCache().List(req.Context(), objectList); err != nil {
			http.Error(w, fmt.Sprintf("Failed to list %s: %v", gvk.String(), err), http.StatusInternalServerError)
			return
		}
		extractList, err := meta.ExtractList(objectList)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to extract list %s: %v", gvk.String(), err), http.StatusInternalServerError)
			return
		}
		objects = append(objects, extractList...)
	}

	list := &unstructured.UnstructuredList{}
	filtered, remainingItemCount, totalCount := query.DefaultList(objects, query.ParseQueryParameter(req), DefaultCompare, DefaultFilter)
	list.SetRemainingItemCount(remainingItemCount)
	list.SetContinue(strconv.Itoa(int(*totalCount)))

	if err := meta.SetList(list, filtered); err != nil {
		http.Error(w, fmt.Sprintf("Failed to encode response: %s", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(list); err != nil {
		klog.Infof("Failed to write response: %v", err)
	}
}

func DefaultCompare(left, right runtime.Object, field query.Field) bool {
	l, err := meta.Accessor(left)
	if err != nil {
		return false
	}
	r, err := meta.Accessor(right)
	if err != nil {
		return false
	}
	return query.DefaultObjectMetaCompare(l, r, field)
}

func DefaultFilter(object runtime.Object, filter query.Filter) bool {
	o, err := meta.Accessor(object)
	if err != nil {
		return false
	}
	return query.DefaultObjectMetaFilter(o, filter)
}

func (h *listConstraintsHandler) getAllGroupVersionKinds() ([]schema.GroupVersionKind, error) {
	var ret []schema.GroupVersionKind
	discoveryClient, err := discovery.NewDiscoveryClientForConfig(h.client.GetConfig())
	if err != nil {
		return nil, err
	}
	l, err := discoveryClient.ServerResourcesForGroupVersion(constraintsGV)
	if err != nil {
		if apierrors.IsNotFound(err) {
			return ret, nil
		}
		return nil, err
	}
	resourceGV := strings.Split(constraintsGV, "/")
	group := resourceGV[0]
	version := resourceGV[1]
	// We have seen duplicate GVK entries on shifting to status client, remove them
	unique := make(map[schema.GroupVersionKind]bool)
	for i := range l.APIResources {
		unique[schema.GroupVersionKind{Group: group, Version: version, Kind: l.APIResources[i].Kind}] = true
	}

	for gvk := range unique {
		ret = append(ret, gvk)
	}
	return ret, nil
}
