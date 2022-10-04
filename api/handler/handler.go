package handler

import (
	"regexp"

	"github.com/alexbrazier/go-url/api/model"
)

// Handler ...
type Handler struct{}

var (
	urlModel              = &model.URL{}
	validateKeyRegexp     = regexp.MustCompile("^[\\w-]+$")
	validateKeyPathRegexp = regexp.MustCompile("^[\\w-\\/]+$")
)

// ValidateKey validates a key against the required format
func ValidateKey(key string) bool {
	return validateKeyRegexp.MatchString(key)
}

// ValidateKeyPath validates a key with optional parameters
func ValidateKeyPath(key string) bool {
	return validateKeyPathRegexp.MatchString(key)
}
