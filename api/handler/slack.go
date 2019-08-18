package handler

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/labstack/echo"
)

// SlackPayload received from slack
type SlackPayload struct {
	Token          string `form:"token"`
	TeamID         string `form:"team_id"`
	TeamDomain     string `form:"team_domain"`
	EnterpriseID   string `form:"enterprise_id"`
	EnterpriseName string `form:"enterprise_name"`
	ChannelID      string `form:"channel_id"`
	ChannelName    string `form:"channel_name"`
	UserID         string `form:"user_id"`
	UserName       string `form:"user_name"`
	Command        string `form:"command"`
	Text           string `form:"text"`
	ResponseURL    string `form:"response_url"`
	TriggerID      string `form:"trigger_id"`
}

type SlackAttachment struct {
	Title  string `json:"title"`
	Text   string `json:"text"`
	Author string `json:"author_text"`
	Footer string `json:"footer"`
}

type SlackResponse struct {
	ResponseType string            `json:"response_type"`
	Text         string            `json:"text"`
	Attachments  []SlackAttachment `json:"attachments"`
	Parse        string            `json:"parse"`
}

type SlackSecretsVerifier struct {
	rawBody       []byte
	slackSig      string
	timeStamp     string
	signingSecret string
}

func verifySignedSecret(v *SlackSecretsVerifier) bool {
	message := fmt.Sprintf("v0:%v:%v", v.timeStamp, string(v.rawBody))
	expectedMAC := v.slackSig

	mac := hmac.New(sha256.New, []byte(v.signingSecret))
	mac.Write([]byte(message))
	actualSignature := "v0=" + string(hex.EncodeToString(mac.Sum(nil)))

	if actualSignature == expectedMAC {
		return true
	}

	return false
}

// Optionally only allow requests from specified slack team
func verifySlackTeam(payload *SlackPayload) error {
	appConfig := config.GetConfig()
	teamID := appConfig.Slack.TeamID
	if teamID != "" && teamID != payload.TeamID {
		err := fmt.Sprintf("TeamID: %s does not match required TeamID: %s - Blocking", payload.TeamID, teamID)
		log.Printf(err)
		return errors.New(err)
	}
	return nil
}

// verify request has been signed by slack
func verifySlackRequest(r *http.Request) error {
	buf, err := ioutil.ReadAll(r.Body)
	body := ioutil.NopCloser(bytes.NewBuffer(buf))
	if err != nil {
		log.Printf("[ERROR] Failed to read request body: %s", err)
		return errors.New("Failed to read body")
	}
	r.Body = body
	appConfig := config.GetConfig()

	v := SlackSecretsVerifier{
		rawBody:       buf,
		slackSig:      r.Header["X-Slack-Signature"][0],
		timeStamp:     r.Header["X-Slack-Request-Timestamp"][0],
		signingSecret: appConfig.Slack.SigningSecret,
	}

	if !verifySignedSecret(&v) {
		log.Printf("Invalid signing secret")
		return errors.New("invalid signing secret")
	}
	return nil
}

// SlackCommand responds to slack go command
func (h *Handler) SlackCommand(c echo.Context) error {
	// Reading request breaks rest
	if err := verifySlackRequest(c.Request()); err != nil {
		return c.JSON(http.StatusUnauthorized, "Unauthorized")
	}
	response := new(SlackResponse)
	response.ResponseType = "ephemeral"
	//urlModel.Find()
	payload := new(SlackPayload)
	if err := c.Bind(payload); err != nil {
		response.Text = "An error occurred while processing your request"
		return c.JSON(http.StatusOK, response)
	}

	if err := verifySlackTeam(payload); err != nil {
		return c.JSON(http.StatusUnauthorized, "Unauthorized")
	}

	key := payload.Text
	if ValidateKey(key) == false {
		response.Text = "The URL key you provided is an invalid format. You can only provide one key at a time, e.g. `/go help`"
		return c.JSON(http.StatusOK, response)
	}
	appURI := config.GetConfig().AppURI
	url, err := urlModel.Find(key)
	if err != nil {
		response.Text = fmt.Sprintf("The URL key you provided was not found. Why not add it? %s/go/%s", appURI, key)
		return c.JSON(http.StatusOK, response)
	}
	response.Text = fmt.Sprintf("%s/%s", appURI, key)
	if url.URL == "" {
		aliasURLs := make([]string, len(url.Alias))
		for i, alias := range url.Alias {
			aliasURLs[i] = fmt.Sprintf("<%s/%s|%s>", appURI, alias, alias)
		}
		response.Attachments = []SlackAttachment{{
			Footer: fmt.Sprintf("Points to the alias `%s`", strings.Join(aliasURLs, "`, `")),
		}}
	} else {
		response.Attachments = []SlackAttachment{{
			Footer: url.URL,
		}}
	}
	return c.JSON(http.StatusOK, response)
}
