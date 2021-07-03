package handler

import (
	"regexp"

	"github.com/alexbrazier/go-url/api/model"
)

// Handler ...
type Handler struct{}

var urlModel = &model.URL{}

// ValidateKey validates a key against the required format
func ValidateKey(key string) bool {
	r, _ := regexp.Compile("^[\\w-]+$")
	return r.MatchString(key)
}

// ValidateKeyPath validates a key with optional parameters
func ValidateKeyPath(key string) bool {
	r, _ := regexp.Compile("^[\\w-\\/]+$")
	return r.MatchString(key)
}
