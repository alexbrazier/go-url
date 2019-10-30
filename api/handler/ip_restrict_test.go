package handler

import "testing"

func TestIpAllowed(t *testing.T) {
	tables := []struct {
		allowedIps []string
		actualIps  []string
		allowed    bool
	}{
		{[]string{"10.1.1.1"}, []string{"10.1.1.1"}, true},             // same IP
		{[]string{"10.1.1.1"}, []string{"10.1.1.0"}, false},            // different IP
		{[]string{"10.1.1.1"}, []string{"10.1.1.0", "10.1.1.1"}, true}, // multiple IPs
		{[]string{"10.1.1.1", "10.1.1.2"}, []string{"10.1.1.2"}, true}, // multiple allowedIPs
		{[]string{"10.1.1.1/32"}, []string{"10.1.1.1"}, true},          // allowed CIDR
		{[]string{"10.1.1.1/32"}, []string{"10.1.1.0"}, false},         // disallowed CIDR
		{[]string{"10.1.1.1/28"}, []string{"10.1.1.0"}, true},          // first matching ip CIDR
		{[]string{"10.1.1.1/28"}, []string{"10.1.1.15"}, true},         // last matching ip CIDR
		{[]string{"10.1.1.1/28"}, []string{"10.1.1.16"}, false},        // first non matching matching ip CIDR
		{[]string{"10.1.1.1/28"}, []string{"10.1.0.255"}, false},       // last non matching matching ip CIDR
	}

	for _, table := range tables {
		allowed := ipAllowed(table.allowedIps, table.actualIps)
		if allowed != table.allowed {
			t.Errorf("Expected %t, with allowedIps: %q and actualIps: %q", table.allowed, table.allowedIps, table.actualIps)
		}
	}
}
