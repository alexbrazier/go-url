package config

import (
	"log"

	"github.com/kelseyhightower/envconfig"
)

// Specification definition in env
type Specification struct {
	Debug                  bool
	JSONLogs               bool     `envconfig:"JSON_LOGS"`
	Port                   int      `default:"1323"`
	EnableAuth             bool     `envconfig:"ENABLE_AUTH"`
	ADTenantID             string   `envconfig:"AD_TENANT_ID"`
	ADClientID             string   `envconfig:"AD_CLIENT_ID"`
	ADClientSecret         string   `envconfig:"AD_CLIENT_SECRET"`
	SessionToken           string   `envconfig:"SESSION_TOKEN"`
	PostgresAddr           string   `envconfig:"POSTGRES_ADDR" default:"localhost:5432"`
	PostgresDatabase       string   `envconfig:"POSTGRES_DATABASE" default:"go"`
	PostgresUser           string   `envconfig:"POSTGRES_USER" default:"postgres"`
	PostgresPass           string   `envconfig:"POSTGRES_PASS" default:"password"`
	Hosts                  []string `required:"true"`
	BlockedHosts           []string `envconfig:"BLOCKED_HOSTS"`
	AppURI                 string   `envconfig:"APP_URI" required:"true"`
	SlackToken             string   `envconfig:"SLACK_TOKEN"`
	SlackSigningSecret     string   `envconfig:"SLACK_SIGNING_SECRET"`
	SlackTeamID            string   `envconfig:"SLACK_TEAM_ID"`
	AllowedIPs             []string `envconfig:"ALLOWED_IPS"`
	AllowForwardedFor      bool     `envconfig:"ALLOW_FORWARDED_FOR"`
	ForwardedForTrustLevel int      `envconfig:"FORWARDED_FOR_TRUST_LEVEL" default:"1"`
}

// Auth config
type Auth struct {
	Enabled                bool
	ADTenantID             string
	ADClientID             string
	ADClientSecret         string
	SessionToken           string
	AllowedIPs             []string
	AllowForwardedFor      bool
	ForwardedForTrustLevel int
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
	TeamID        string
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

func validateConfig(c Config) {
	if c.Auth.ForwardedForTrustLevel < 1 {
		log.Fatal("FORWARDED_FOR_TRUST_LEVEL must be greater than 0")
	}
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
		Enabled:                spec.EnableAuth,
		ADTenantID:             spec.ADTenantID,
		ADClientID:             spec.ADClientID,
		ADClientSecret:         spec.ADClientSecret,
		SessionToken:           spec.SessionToken,
		AllowedIPs:             spec.AllowedIPs,
		AllowForwardedFor:      spec.AllowForwardedFor,
		ForwardedForTrustLevel: spec.ForwardedForTrustLevel,
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
		TeamID:        spec.SlackTeamID,
	}

	config.BlockedHosts = append(spec.BlockedHosts, spec.Hosts...)

	validateConfig(config)
}

// GetConfig returns the config
func GetConfig() Config {
	return config
}
