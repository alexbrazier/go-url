package slackbot

import (
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/alexbrazier/go-url/api/model"
	"github.com/alexbrazier/slack"
	cache "github.com/patrickmn/go-cache"
)

var urlModel = &model.URL{}

// SlackBot .
type SlackBot struct {
	Cache  *cache.Cache
	Client *slack.Client
	RTM    *slack.RTM
}

func (s *SlackBot) getKeyFromText(text string) string {
	r, _ := regexp.Compile("\\bgo ([\\w-\\/]+)\\b")

	matches := r.FindStringSubmatch(text)

	if len(matches) != 2 {
		return ""
	}

	return matches[1]
}

func (s *SlackBot) deleteMessage(channel, timestamp string) {
	cachedTimestamp, found := s.Cache.Get(timestamp)
	if !found {
		fmt.Println("Not deleting as no longer in cache")
		return
	}
	s.RTM.DeleteMessage(channel, cachedTimestamp.(string))
}

// Init initialises slackbot
func (s *SlackBot) Init() {
	appConfig := config.GetConfig()
	fmt.Println("Starting slackbot")
	s.Cache = cache.New(60*time.Minute, 30*time.Minute)
	s.Client = slack.New(appConfig.Slack.Token)
	if config.GetConfig().Debug {
		s.Client.SetDebug(true)
	}

	s.RTM = s.Client.NewRTM()
	go s.RTM.ManageConnection()

	for msg := range s.RTM.IncomingEvents {
		switch ev := msg.Data.(type) {
		case *slack.MessageEvent:
			// Stop the bots from taking over
			if ev.SubType == "bot_message" {
				break
			}

			key := s.getKeyFromText(ev.Text)
			edited := false
			if ev.SubType == "message_changed" {
				key = s.getKeyFromText(ev.SubMessage.Text)
				oldKey := s.getKeyFromText(ev.PreviousMessage.Text)
				// key hasn't changed
				if oldKey == key {
					break
				}
				if oldKey != "" && key == "" {
					s.deleteMessage(ev.Channel, ev.PreviousMessage.Timestamp)
					break
				}
				// Edit message if previous one exists
				if oldKey != "" {
					urls, err := urlModel.GetUrlsFromKeys([]string{oldKey})
					if err != nil {
						fmt.Printf("An error occurred while finding old key %v", err)
						break
					}
					if len(urls) > 0 {
						edited = true
					}
				}
			}

			if ev.SubType == "message_deleted" {
				s.deleteMessage(ev.Channel, ev.PreviousMessage.Timestamp)
				break
			}

			if key == "" {
				break
			}

			urls, err := urlModel.GetUrlsFromKeys([]string{key})
			if err != nil {
				fmt.Printf("An error occurred while finding key %v", err)
				break
			}
			if len(urls) == 0 {
				if ev.PreviousMessage != nil {
					s.deleteMessage(ev.Channel, ev.PreviousMessage.Timestamp)
				}
				break
			}
			url := urls[0]
			appURI := appConfig.AppURI

			extraText := url.URL
			if url.URL == "" {
				aliasUrls, err := urlModel.GetUrlsFromKeys(url.Alias)
				if err != nil {
					fmt.Println("Error while processing slackbot aliases")
					break
				}
				urlStrings := make([]string, len(aliasUrls))
				for i, url := range aliasUrls {
					urlStrings[i] = url.URL
				}
				extraText = strings.Join(urlStrings, "\n")
			}

			attachments := []slack.Attachment{
				{
					Footer: extraText,
				},
			}

			message := slack.PostMessageParameters{
				Attachments:     attachments,
				ThreadTimestamp: ev.ThreadTimestamp,
			}
			if message.ThreadTimestamp == "" && ev.PreviousMessage != nil {
				message.ThreadTimestamp = ev.PreviousMessage.ThreadTimestamp
			}
			messageText := fmt.Sprintf("%s/%s", appURI, key)

			if edited {
				cachedTimestamp, found := s.Cache.Get(ev.PreviousMessage.Timestamp)
				if !found {
					fmt.Println("Not posting as no longer in cache")
					break
				}
				_, _, _, err := s.Client.SendMessage(ev.Channel, slack.MsgOptionUpdate(cachedTimestamp.(string)), slack.MsgOptionText(messageText, true), slack.MsgOptionPostMessageParameters(message))
				if err != nil {
					fmt.Println(err)
				}
			} else {
				fmt.Println("Posting new message")
				_, timestamp, err := s.RTM.PostMessage(ev.Channel, messageText, message)
				if err != nil {
					fmt.Println(err)
					break
				}
				s.Cache.Set(ev.Timestamp, timestamp, cache.DefaultExpiration)
				if ev.PreviousMessage != nil {
					s.Cache.Set(ev.PreviousMessage.Timestamp, timestamp, cache.DefaultExpiration)
				}
			}

		case *slack.RTMError:
			fmt.Printf("Slackbot Error: %s\n", ev.Error())

		case *slack.InvalidAuthEvent:
			fmt.Println("Invalid slack credentials")
			break

		default:
			// Do nothing
		}
	}
}
