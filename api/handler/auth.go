package handler

import (
	"log"
	"net/http"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/alexbrazier/go-url/api/handler/auth"
	"github.com/labstack/echo"
)

func azureEnabled() bool {
	appConfig := config.GetConfig()
	return appConfig.Auth.SessionToken != "" && appConfig.Auth.ADClientID != "" &&
		appConfig.Auth.ADTenantID != "" && appConfig.Auth.ADClientSecret != ""
}

func oktaEnabled() bool {
	appConfig := config.GetConfig()
	return appConfig.Auth.OktaClientID != "" && appConfig.Auth.OktaClientSecret != "" &&
		appConfig.Auth.OktaIssuer != ""
}

// AuthInit initialize authentication
func (h *Handler) AuthInit(e *echo.Echo) {
	authClient := &auth.AuthClient{}

	if azureEnabled() {
		authClient.AzureAuthInit(e)
	} else if oktaEnabled() {
		authClient.OktaAuthInit(e)
	} else {
		log.Fatal("auth is enabled but you haven't provided azure or okta auth config")
	}
}

func (h *Handler) auth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authClient := &auth.AuthClient{}

		if azureEnabled() {
			return authClient.AzureAuth(next, c)
		}

		if oktaEnabled() {
			return authClient.OktaAuth(next, c)
		}

		return &echo.HTTPError{Code: http.StatusForbidden, Message: "Invalid auth config"}
	}
}
