package auth

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"golang.org/x/oauth2"
)

var oauthConfig *oauth2.Config

// User struct
type User struct {
	Email       string `json:"mail"`
	DisplayName string `json:"displayName"`
	GivenName   string `json:"givenName"`
	Surname     string `json:"surname"`
}

func sessionState(session *sessions.Session) string {
	return base64.StdEncoding.EncodeToString(sha256.New().Sum([]byte(session.ID)))
}

func getRedirectUrl(c echo.Context) string {
	appConfig := config.GetConfig()
	uri := appConfig.AppURI
	return fmt.Sprintf("%s/callback", uri)
}

// AzureAuthInit initialize authentication
func (h *AuthClient) AzureAuthInit(e *echo.Echo) {
	gob.Register(&User{})
	gob.Register(&oauth2.Token{})

	e.GET("/callback", h.callbackHandler)
}

func (h *AuthClient) AzureAuth(next echo.HandlerFunc, c echo.Context) error {
	appConfig := config.GetConfig()
	session, _ := store.Get(c.Request(), "session")

	if session.Values["azure_user"] != nil {
		return next(c)
	}

	session.Values["redirect"] = c.Request().URL.Path
	h.saveSessionStore(c)
	fmt.Println("Redirecting to auth")

	endpointURL := fmt.Sprintf("https://login.microsoftonline.com/%s/oauth2/v2.0", appConfig.Auth.ADTenantID)
	oauthConfig = &oauth2.Config{
		ClientID:     appConfig.Auth.ADClientID,
		ClientSecret: "", // no client secret
		RedirectURL:  getRedirectUrl(c),

		Endpoint: oauth2.Endpoint{
			AuthURL:  fmt.Sprintf("%s/authorize", endpointURL),
			TokenURL: fmt.Sprintf("%s/token", endpointURL),
		},

		Scopes: []string{"User.Read"},
	}
	authURL := oauthConfig.AuthCodeURL(sessionState(session), oauth2.AccessTypeOnline)
	return c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (h *AuthClient) callbackHandler(c echo.Context) error {
	appConfig := config.GetConfig()
	session, _ := store.Get(c.Request(), "session")
	if c.FormValue("state") != sessionState(session) {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid callback state"}
	}
	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("client_id", appConfig.Auth.ADClientID)
	form.Set("code", c.FormValue("code"))
	form.Set("redirect_uri", getRedirectUrl(c))
	form.Set("client_secret", appConfig.Auth.ADClientSecret)

	tokenReq, err := http.NewRequest(http.MethodPost, oauthConfig.Endpoint.TokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return fmt.Errorf("error creating token request: %v", err)
	}
	tokenReq.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(tokenReq)
	if err != nil {
		return fmt.Errorf("error performing token request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("token response was %s", resp.Status)
	}

	var token oauth2.Token
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return fmt.Errorf("error decoding JSON response: %v", err)
	}

	user, err := getUserDetails(token.AccessToken)
	if err != nil {
		return fmt.Errorf("error getting user details: %v", err)
	}

	session.Values["azure_token"] = &token
	session.Values["azure_user"] = &user
	h.saveSessionStore(c)
	return c.Redirect(http.StatusTemporaryRedirect, h.getOriginalURL(c))
}

func getUserDetails(token string) (*User, error) {
	req, err := http.NewRequest("GET", "https://graph.microsoft.com/v1.0/me", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Add("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error performing token request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error response code %d", resp.StatusCode)
	}

	var user User
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return nil, fmt.Errorf("error decoding JSON response: %v", err)
	}

	return &user, nil
}
