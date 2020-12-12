package auth

import (
	"fmt"
	"log"
	"net/http"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
)

type AuthClient struct{}

var store sessions.Store

// AuthInit initialize authentication
func (h *AuthClient) AuthInit(e *echo.Echo) {
	appConfig := config.GetConfig()
	if appConfig.Auth.SessionToken == "" {
		log.Fatal("you must provide a session token when using auth")
	}
	var sessionStoreKeyPairs = [][]byte{
		[]byte(appConfig.Auth.SessionToken),
		nil,
	}
	// Create file system store with no size limit
	fsStore := sessions.NewFilesystemStore("", sessionStoreKeyPairs...)
	fsStore.MaxLength(0)

	fsStore.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   appConfig.Auth.MaxAge,
		HttpOnly: true,
		Secure:   appConfig.Auth.SecureCookies,
		SameSite: http.SameSiteLaxMode,
	}

	store = fsStore
}

func (h *AuthClient) getSessionStore(c echo.Context) *sessions.Session {
	session, _ := store.Get(c.Request(), "session")
	return session
}

func (h *AuthClient) saveSessionStore(c echo.Context) error {
	if err := sessions.Save(c.Request(), c.Response()); err != nil {
		return fmt.Errorf("error saving session: %v", err)
	}
	return nil
}

func (h *AuthClient) getOriginalURL(c echo.Context) string {
	session := h.getSessionStore(c)

	if redirectPath := session.Values["redirect"]; redirectPath != nil {
		if path, ok := redirectPath.(string); ok {
			return path
		}
	}

	return "/"
}
