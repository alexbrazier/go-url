package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

// Specification definition in env
type Specification struct {
	Debug          bool
	JSONLogs       bool     `envconfig:"JSON_LOGS"`
	Port           int      `default:"1323"`
	EnableAuth     bool     `envconfig:"ENABLE_AUTH"`
	ADTenantID     string   `envconfig:"AD_TENANT_ID"`
	ADClientID     string   `envconfig:"AD_CLIENT_ID"`
	ADClientSecret string   `envconfig:"AD_CLIENT_SECRET"`
	SessionToken   string   `envconfig:"SESSION_TOKEN"`
	MongoAddresses []string `envconfig:"MONGO_ADDRESSES" default:"localhost"`
	MongoDatabase  string   `envconfig:"MONGO_DATABASE" default:"go"`
	MongoUser      string   `envconfig:"MONGO_USER"`
	MongoPass      string   `envconfig:"MONGO_PASS"`
}

// Auth config
type Auth struct {
	Enabled        bool
	ADTenantID     string
	ADClientID     string
	ADClientSecret string
	SessionToken   string
}

// Database config
type Database struct {
	Addresses []string
	Database  string
	User      string
	Pass      string
}

// Config definition
type Config struct {
	Debug    bool
	JSONLogs bool
	Port     int
	Auth     Auth
	Database Database
}

var config = Config{}

// Init loads the config from the env and sets defaults
func Init() {
	var spec Specification

	err := envconfig.Process("", &spec)
	if err != nil {
		log.Fatal(err.Error())
	}
	config.Debug = spec.Debug
	config.Port = spec.Port
	config.JSONLogs = spec.JSONLogs
	config.Auth = Auth{
		Enabled:        spec.EnableAuth,
		ADTenantID:     spec.ADTenantID,
		ADClientID:     spec.ADClientID,
		ADClientSecret: spec.ADClientSecret,
		SessionToken:   spec.SessionToken,
	}
	config.Database = Database{
		Addresses: spec.MongoAddresses,
		Database:  spec.MongoDatabase,
		User:      spec.MongoUser,
		Pass:      spec.MongoPass,
	}
}

// GetConfig returns the config
func GetConfig() Config {
	return config
}
