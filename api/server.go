package main

import (
	"fmt"

	"github.com/alexbrazier/go-url/api/app"
	"github.com/alexbrazier/go-url/api/config"
	"github.com/alexbrazier/go-url/api/db"
	"github.com/getsentry/sentry-go"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()
	config.Init()
	appConfig := config.GetConfig()

	if appConfig.SentryDSN != "" {
		if err := sentry.Init(sentry.ClientOptions{
			Dsn: appConfig.SentryDSN,
		}); err != nil {
			fmt.Printf("Sentry initialization failed: %v\n", err)
		}
	}

	e.Pre(middleware.RemoveTrailingSlash())
	logFormat := "${time_rfc3339}\t|${status}|\t${latency_human}| ${remote_ip} | ${method} | ${path} ${error}\n"
	if appConfig.JSONLogs {
		logFormat = ""
	}
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: logFormat,
	}))
	e.Use(middleware.Recover())

	// TODO after updating to echo v4
	// app.Use(sentryecho.New(sentryecho.Options{}))

	e.Debug = appConfig.Debug

	db.Init()
	app.Init(e)
	// Start server
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", appConfig.Port)))
}
