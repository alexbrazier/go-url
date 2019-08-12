package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

// Specification definition in env
type Specification struct {
	Debug              bool
	JSONLogs           bool     `envconfig:"JSON_LOGS"`
	Port               int      `default:"1323"`
	EnableAuth         bool     `envconfig:"ENABLE_AUTH"`
	ADTenantID         string   `envconfig:"AD_TENANT_ID"`
	ADClientID         string   `envconfig:"AD_CLIENT_ID"`
	ADClientSecret     string   `envconfig:"AD_CLIENT_SECRET"`
	SessionToken       string   `envconfig:"SESSION_TOKEN"`
	PostgresAddr       string   `envconfig:"POSTGRES_ADDR" default:"localhost:5432"`
	PostgresDatabase   string   `envconfig:"POSTGRES_DATABASE" default:"go"`
	PostgresUser       string   `envconfig:"POSTGRES_USER" default:"postgres"`
	PostgresPass       string   `envconfig:"POSTGRES_PASS" default:"password"`
	Hosts              []string `required:"true"`
	BlockedHosts       []string `envconfig:"BLOCKED_HOSTS"`
	AppURI             string   `envconfig:"APP_URI" required:"true"`
	SlackToken         string   `envconfig:"SLACK_TOKEN"`
	SlackSigningSecret string   `envconfig:"SLACK_SIGNING_SECRET"`
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

// Slack config
type Slack struct {
	Token         string
	SigningSecret string
}

// Config definition
type Config struct {
	Debug        bool
	JSONLogs     bool
	Port         int
	Auth         Auth
	Database     Database
	AppURI       string
	BlockedHosts []string
	Slack        Slack
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
	config.AppURI = spec.AppURI

	config.Slack = Slack{
		Token:         spec.SlackToken,
		SigningSecret: spec.SlackSigningSecret,
	}

	config.BlockedHosts = append(spec.BlockedHosts, spec.Hosts...)
}

// GetConfig returns the config
func GetConfig() Config {
	return config
}
