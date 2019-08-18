package handler

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/labstack/echo"
)

func ipAllowed(allowedIPs []string, ip string) bool {
	for _, allowedIP := range allowedIPs {
		if ip == allowedIP {
			return true
		}
	}
	return false
}

func ipWhitelisted(forwardedFor, remoteAddr string) bool {
	appConfig := config.GetConfig()
	allowedIPs := appConfig.Auth.AllowedIPs

	if len(allowedIPs) == 0 {
		return false
	}

	if appConfig.Auth.AllowForwardedFor {
		forwardedFor := forwardedFor
		fmt.Println(forwardedFor)
		if forwardedFor != "" {
			// Only the last ip in the X-Forwarded-For can be trusted
			ips := strings.Split(forwardedFor, ",")
			ip := strings.TrimSpace(ips[len(ips)-1])
			if ipAllowed(allowedIPs, ip) {
				return true
			}
		}
	}

	remoteIP := strings.Split(remoteAddr, ":")[0]

	if ipAllowed(allowedIPs, remoteIP) {
		return true
	}
	return false
}

func whitelistedRoute(e echo.Context) bool {
	whitelist := []string{"/health", "/callback", "/api/slack"}
	for _, item := range whitelist {
		if item == e.Request().URL.Path {
			return true
		}
	}
	return false
}

// IPRestrict middleware will allow whitelisted ips through and handle auth
func (h *Handler) IPRestrict(next echo.HandlerFunc) echo.HandlerFunc {
	return func(e echo.Context) error {
		appConfig := config.GetConfig()
		allowedIps := appConfig.Auth.AllowedIPs
		forwardedFor := e.Request().Header.Get("X-Forwarded-For")

		if whitelistedRoute(e) || ipWhitelisted(forwardedFor, e.Request().RemoteAddr) {
			return next(e)
		}

		if appConfig.Auth.Enabled {
			return h.auth(next)(e)
		}
		if len(allowedIps) == 0 {
			return next(e)
		}

		return &echo.HTTPError{Code: http.StatusForbidden, Message: "Forbidden"}

	}
}
