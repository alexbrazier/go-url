package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

// Specification definition in env
type Specification struct {
	Debug            bool
	JSONLogs         bool   `envconfig:"JSON_LOGS"`
	Port             int    `default:"1323"`
	EnableAuth       bool   `envconfig:"ENABLE_AUTH"`
	ADTenantID       string `envconfig:"AD_TENANT_ID"`
	ADClientID       string `envconfig:"AD_CLIENT_ID"`
	ADClientSecret   string `envconfig:"AD_CLIENT_SECRET"`
	SessionToken     string `envconfig:"SESSION_TOKEN"`
	PostgresAddr     string `envconfig:"POSTGRES_ADDR" default:"localhost"`
	PostgresDatabase string `envconfig:"POSTGRES_DATABASE" default:"go"`
	PostgresUser     string `envconfig:"POSTGRES_USER"`
	PostgresPass     string `envconfig:"POSTGRES_PASS"`
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
	Addr     string
	Database string
	User     string
	Pass     string
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
		Addr:     spec.PostgresAddr,
		Database: spec.PostgresDatabase,
		User:     spec.PostgresUser,
		Pass:     spec.PostgresPass,
	}
}

// GetConfig returns the config
func GetConfig() Config {
	return config
}
