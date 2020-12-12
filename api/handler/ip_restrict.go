package handler

import (
	"net/http"
	"strings"

	"net"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/labstack/echo"
)

func ipAllowed(allowedIPs, ips []string) bool {
	for _, allowedIP := range allowedIPs {
		_, ipNet, err := net.ParseCIDR(allowedIP)
		isCIDR := err == nil
		for _, ip := range ips {
			trimmedIp := strings.TrimSpace(ip)
			if trimmedIp == allowedIP || (isCIDR && ipNet.Contains(net.ParseIP(trimmedIp))) {
				return true
			}
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

	if appConfig.Auth.AllowForwardedFor && forwardedFor != "" {
		ips := strings.Split(forwardedFor, ",")
		pos := len(ips) - appConfig.Auth.ForwardedForTrustLevel
		if pos < 0 {
			pos = 0
		}
		trustedIps := ips[pos:]
		if ipAllowed(allowedIPs, trustedIps) {
			return true
		}
	}

	remoteIP := strings.Split(remoteAddr, ":")[0]

	if ipAllowed(allowedIPs, []string{remoteIP}) {
		return true
	}
	return false
}

func whitelistedRoute(e echo.Context) bool {
	whitelist := []string{"/health", "/callback", "/okta/callback", "/api/slack"}
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
