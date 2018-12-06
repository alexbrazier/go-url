package utils

import (
	"testing"
)

func TestSameHostname(t *testing.T) {
	tables := []struct {
		hostname string
		URL      string
		same     bool
	}{
		{"test.com", "https://test.com", true},                  // same URL
		{"test.com", "https://test.com/test", true},             // same URL with path
		{"test.com", "http://test.com", true},                   // http
		{"192.168.0.1", "https://192.168.0.1", true},            // same IP
		{"192.168.0.1", "http://192.168.0.1", true},             // IP http
		{"192.168.0.1", "https://192.168.0.1/test", true},       // same IP with path
		{"192.168.0.1:3000", "https://192.168.0.2:3000", false}, // different IP with port
		{"192.168.0.1", "https://192.168.0.2", false},           // different IP
		{"192.168.0.1", "https://192.168.0.1:3000", false},      // same IP with port
		{"192.168.0.1:3000", "https://192.168.0.1", false},      // same IP with port 2
		{"example.com", "https://test.com", false},              // different URL
		{"go.test.com", "https://go", false},                    // contains, but still different hostname
		{"go.test.com", "https://go/test", false},               // contains, but still different hostname with path
		{"go.test.com", "https://go.test.com.au", false},        // contains, but still different hostname
		{"go.test.com", "https://go.test.com.au/test", false},   // contains, but still different hostname with path
	}

	for _, table := range tables {
		same, err := SameHost(table.hostname, table.URL)
		if err != nil {
			t.Errorf("Expected %t, with hostname: %q and URL: %q, but got Error: %v", table.same, table.hostname, table.URL, err)
		}
		if same != table.same {
			t.Errorf("Expected %t, with hostname: %q and URL: %q, but got %t", table.same, table.hostname, table.URL, same)
		}
	}
}
