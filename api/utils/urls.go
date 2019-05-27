package utils

import (
	"errors"
	"net/url"
	"strings"
)

// ValidateURL will check that a URL is valid
func ValidateURL(URL string) (*url.URL, error) {
	// Basic built in URL validation
	parsedURL, err := url.ParseRequestURI(URL)
	if err != nil {
		return nil, err
	}

	// Extra checks for things that make it through the built in check
	if !strings.HasPrefix(URL, "https://") && !strings.HasPrefix(URL, "http://") {
		return nil, errors.New("URL must start with https:// or http://")
	}

	if URL == "https://" || URL == "http://" {
		return nil, errors.New("you didn't provide a URL")
	}
	return parsedURL, nil
}

// SameHost checks if the URL is the same hostname as the one provided
func SameHost(host, URL string) (bool, error) {
	testURL, err := url.ParseRequestURI(URL)
	if err != nil {
		return false, err
	}
	isSame := host == testURL.Host
	return isSame, nil
}
