package filter

import (
	"fmt"

	"kubesphere.io/fluentbit-operator/api/fluentbitoperator/v1alpha2/plugins"
	"kubesphere.io/fluentbit-operator/api/fluentbitoperator/v1alpha2/plugins/params"
)

// +kubebuilder:object:generate:=true

// Throttle filter allows you to set the average rate of messages per internal, based on leaky bucket and sliding window algorithm.
type Throttle struct {
	// Rate is the amount of messages for the time.
	Rate *int64 `json:"rate,omitempty"`
	// Window is the amount of intervals to calculate average over.
	Window *int64 `json:"window,omitempty"`
	// Interval is the time interval expressed in "sleep" format. e.g. 3s, 1.5m, 0.5h, etc.
	// +kubebuilder:validation:Pattern:="^\\d+(\\.[0-9]{0,2})?(s|m|h|d)?$"
	Interval string `json:"interval,omitempty"`
	// PrintStatus represents whether to print status messages with current rate and the limits to information logs.
	PrintStatus *bool `json:"printStatus,omitempty"`
}

// Name is the name of the filter plugin.
func (*Throttle) Name() string {
	return "throttle"
}

// Params represents the config options for the filter plugin.
func (k *Throttle) Params(_ plugins.SecretLoader) (*params.KVs, error) {
	kvs := params.NewKVs()
	if k.Rate != nil {
		kvs.Insert("Rate", fmt.Sprint(*k.Rate))
	}
	if k.Window != nil {
		kvs.Insert("Window", fmt.Sprint(*k.Window))
	}
	if k.Interval != "" {
		kvs.Insert("Interval", k.Interval)
	}
	if k.PrintStatus != nil {
		kvs.Insert("Print_Status", fmt.Sprint(*k.PrintStatus))
	}
	return kvs, nil
}