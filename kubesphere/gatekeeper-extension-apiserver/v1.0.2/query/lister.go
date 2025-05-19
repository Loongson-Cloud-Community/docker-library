package query

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/klog/v2"
	"sort"
	"strings"
)

// CompareFunc return true is left greater than right
type CompareFunc func(runtime.Object, runtime.Object, Field) bool

type FilterFunc func(runtime.Object, Filter) bool

type TransformFunc func(runtime.Object) runtime.Object

func DefaultList(objects []runtime.Object, q *Query, compareFunc CompareFunc, filterFunc FilterFunc, transformFuncs ...TransformFunc) ([]runtime.Object, *int64, *int64) {
	// selected matched ones
	var filtered []runtime.Object
	if len(q.Filters) != 0 {
		for _, object := range objects {
			selected := true
			for field, value := range q.Filters {
				if !filterFunc(object, Filter{Field: field, Value: value}) {
					selected = false
					break
				}
			}

			if selected {
				for _, transform := range transformFuncs {
					object = transform(object)
				}
				filtered = append(filtered, object)
			}
		}
	} else {
		filtered = objects
	}

	// sort by sortBy field
	sort.Slice(filtered, func(i, j int) bool {
		if !q.Ascending {
			return compareFunc(filtered[i], filtered[j], q.SortBy)
		}
		return !compareFunc(filtered[i], filtered[j], q.SortBy)
	})

	total := len(filtered)

	if q.Pagination == nil {
		q.Pagination = NoPagination
	}

	start, end := q.Pagination.GetValidPagination(total)
	remainingItemCount := int64(total - end)
	totalCount := int64(total)

	return filtered[start:end], &remainingItemCount, &totalCount
}

// DefaultObjectMetaCompare return true is left greater than right
func DefaultObjectMetaCompare(left, right metav1.Object, sortBy Field) bool {
	switch sortBy {
	// ?sortBy=name
	case FieldName:
		return strings.Compare(left.GetName(), right.GetName()) > 0
	//	?sortBy=creationTimestamp
	default:
		fallthrough
	case FieldCreateTime:
		fallthrough
	case FieldCreationTimeStamp:
		// compare by name if creation timestamp is equal
		ltime := left.GetCreationTimestamp()
		rtime := right.GetCreationTimestamp()
		if ltime.Equal(&rtime) {
			return strings.Compare(left.GetName(), right.GetName()) > 0
		}
		return left.GetCreationTimestamp().After(right.GetCreationTimestamp().Time)
	}
}

// DefaultObjectMetaFilter filters the metadata of Kubernetes objects based on the given filter conditions.
// Supported filter fields include: FieldNames, FieldName, FieldUID, FieldNamespace,
// FieldOwnerReference, FieldOwnerKind, FieldAnnotation, FieldLabel, and ParameterFieldSelector.
// Returns true if the object satisfies the filter conditions; otherwise, returns false.
//
// Parameters:
//   - item: Metadata of the Kubernetes object to be filtered.
//   - filter: Query object containing filter conditions.
//
// Returns:
//   - bool: True if the object satisfies the filter conditions; false otherwise.
func DefaultObjectMetaFilter(item metav1.Object, filter Filter) bool {
	switch filter.Field {
	case FieldNames:
		// Check if the object's name matches any name in the filter.
		for _, name := range strings.Split(string(filter.Value), ",") {
			if item.GetName() == name {
				return true
			}
		}
		return false
	// /namespaces?page=1&limit=10&name=default
	case FieldName:
		return strings.Contains(item.GetName(), string(filter.Value))
		// /namespaces?page=1&limit=10&uid=a8a8d6cf-f6a5-4fea-9c1b-e57610115706
	case FieldUID:
		return strings.Compare(string(item.GetUID()), string(filter.Value)) == 0
		// /deployments?page=1&limit=10&namespace=kubesphere-system
	case FieldNamespace:
		return strings.Compare(item.GetNamespace(), string(filter.Value)) == 0
		// /namespaces?page=1&limit=10&ownerReference=a8a8d6cf-f6a5-4fea-9c1b-e57610115706
	case FieldOwnerReference:
		for _, ownerReference := range item.GetOwnerReferences() {
			if strings.Compare(string(ownerReference.UID), string(filter.Value)) == 0 {
				return true
			}
		}
		return false
		// /namespaces?page=1&limit=10&ownerKind=Workspace
	case FieldOwnerKind:
		for _, ownerReference := range item.GetOwnerReferences() {
			if strings.Compare(ownerReference.Kind, string(filter.Value)) == 0 {
				return true
			}
		}
		return false
	case ParameterLabelSelector:
		return labelSelectorMatch(item.GetLabels(), string(filter.Value))
	default:
		return true
	}
}

func labelSelectorMatch(objLabels map[string]string, filter string) bool {
	selector, err := labels.Parse(filter)
	if err != nil {
		klog.V(4).Infof("failed parse labelSelector error: %s", err)
		return false
	}
	return selector.Matches(labels.Set(objLabels))
}
