package auth

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/labstack/echo"
	verifier "github.com/okta/okta-jwt-verifier-golang"
)

// var sessionStore = sessions.NewCookieStore([]byte("okta-session"))
var state = "main"

func getOktaRedirectUrl() string {
	appConfig := config.GetConfig()
	uri := appConfig.AppURI
	return fmt.Sprintf("%s/okta/callback", uri)
}

func generateNonce() (string, error) {
	nonceBytes := make([]byte, 32)
	_, err := rand.Read(nonceBytes)
	if err != nil {
		return "", fmt.Errorf("could not generate nonce")
	}

	return base64.URLEncoding.EncodeToString(nonceBytes), nil
}

func isOktaAuthenticated(r *http.Request) bool {
	session, err := store.Get(r, "session")

	if err != nil || session.Values["id_token"] == nil || session.Values["id_token"] == "" {
		return false
	}

	return true
}

// OktaAuthInit initialize authentication
func (h *AuthClient) OktaAuthInit(e *echo.Echo) {
	e.GET("/okta/callback", h.oktaCallbackHandler)
}

// OktaAuth ...
func (h *AuthClient) OktaAuth(next echo.HandlerFunc, c echo.Context) error {
	if isOktaAuthenticated(c.Request()) {
		return next(c)
	}

	session := h.getSessionStore(c)

	appConfig := config.GetConfig()
	nonce, _ := generateNonce()

	session.Values["redirect"] = c.Request().URL.Path
	session.Values["nonce"] = nonce

	if err := h.saveSessionStore(c); err != nil {
		return err
	}

	var redirectPath string

	q := c.Request().URL.Query()
	q.Add("client_id", appConfig.Auth.OktaClientID)
	q.Add("response_type", "code")
	q.Add("response_mode", "query")
	q.Add("scope", "openid profile email")
	q.Add("redirect_uri", getOktaRedirectUrl())
	q.Add("state", state)
	q.Add("nonce", nonce)

	redirectPath = appConfig.Auth.OktaIssuer + "/v1/authorize?" + q.Encode()

	return c.Redirect(http.StatusTemporaryRedirect, redirectPath)
}

func (h *AuthClient) oktaCallbackHandler(c echo.Context) error {
	code := c.QueryParam("code")

	if c.QueryParam("state") != state || code == "" {
		return &echo.HTTPError{Code: http.StatusBadRequest, Message: "invalid callback state"}
	}

	exchange := exchangeCode(code, c.Request())
	session := h.getSessionStore(c)
	nonce := session.Values["nonce"]

	if nonce == nil {
		return &echo.HTTPError{Code: http.StatusInternalServerError, Message: "Invalid nonce"}
	}

	_, verificationError := verifyToken(exchange.IDToken, nonce.(string))

	if verificationError != nil {
		fmt.Println(verificationError)
		return &echo.HTTPError{Code: http.StatusInternalServerError, Message: "Error"}
	}

	if verificationError == nil {
		session.Values["id_token"] = exchange.IDToken
		session.Values["access_token"] = exchange.AccessToken

		session.Save(c.Request(), c.Response())
	}

	return c.Redirect(http.StatusTemporaryRedirect, h.getOriginalURL(c))
}

func exchangeCode(code string, r *http.Request) Exchange {
	appConfig := config.GetConfig()

	authHeader := base64.StdEncoding.EncodeToString(
		[]byte(appConfig.Auth.OktaClientID + ":" + appConfig.Auth.OktaClientSecret))

	q := r.URL.Query()
	q.Add("grant_type", "authorization_code")
	q.Add("code", code)
	q.Add("redirect_uri", getOktaRedirectUrl())

	url := appConfig.Auth.OktaIssuer + "/v1/token?" + q.Encode()

	req, _ := http.NewRequest("POST", url, bytes.NewReader([]byte("")))
	h := req.Header
	h.Add("Authorization", "Basic "+authHeader)
	h.Add("Accept", "application/json")
	h.Add("Content-Type", "application/x-www-form-urlencoded")
	h.Add("Connection", "close")
	h.Add("Content-Length", "0")

	client := &http.Client{}
	resp, _ := client.Do(req)
	body, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()
	var exchange Exchange
	json.Unmarshal(body, &exchange)

	return exchange
}

func verifyToken(t, nonce string) (*verifier.Jwt, error) {
	appConfig := config.GetConfig()

	tv := map[string]string{}
	tv["nonce"] = nonce
	tv["aud"] = appConfig.Auth.OktaClientID
	jv := verifier.JwtVerifier{
		Issuer:           appConfig.Auth.OktaIssuer,
		ClaimsToValidate: tv,
	}

	result, err := jv.New().VerifyIdToken(t)

	if err != nil {
		return nil, fmt.Errorf("%s", err)
	}

	if result != nil {
		return result, nil
	}

	return nil, fmt.Errorf("token could not be verified: %s", "")
}

// Exchange ...
type Exchange struct {
	Error            string `json:"error,omitempty"`
	ErrorDescription string `json:"error_description,omitempty"`
	AccessToken      string `json:"access_token,omitempty"`
	TokenType        string `json:"token_type,omitempty"`
	ExpiresIn        int    `json:"expires_in,omitempty"`
	Scope            string `json:"scope,omitempty"`
	IDToken          string `json:"id_token,omitempty"`
}
