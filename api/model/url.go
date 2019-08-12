package model

import (
	"fmt"
	"strings"

	"github.com/alexbrazier/go-url/api/db"
	"github.com/go-pg/pg"
	"github.com/labstack/gommon/log"
)

// URL model
type URL struct {
	Key   string   `json:"key" sql:",pk"`
	URL   string   `json:"url"`
	Alias []string `json:"alias"`
	Views int      `json:"views" sql:"default:0"`
}

// Find returns matching URL
func (u *URL) Find(key string) (*URL, error) {
	url := new(URL)
	err := db.GetDB().Model(url).Where("key = ?", key).First()
	if err == pg.ErrNoRows {
		return nil, nil
	}
	return url, err
}

// Update sets the new url and alias fields in the db
func (u *URL) Update() error {
	url := URL{
		Key:   u.Key,
		URL:   u.URL,
		Alias: u.Alias,
	}
	_, err := db.GetDB().Model(&url).Column("url", "alias").WherePK().Update()
	return err
}

// Save adds a new url to the db
func (u *URL) Save() error {
	err := db.GetDB().Insert(u)
	return err
}

// IncrementViewCount increments the view count of all the keys passed in
func (u *URL) IncrementViewCount(keys []string) error {
	_, err := db.GetDB().Model(&URL{}).WhereIn("key IN (?)", pg.In(keys)).Set("views = views + 1").Update()
	if err != nil {
		log.Error("Error while updating view count")
		log.Error(err)
	}
	return err
}

// GetUrlsFromKeys returns all the db records that match the keys
func (u *URL) GetUrlsFromKeys(keys []string) ([]*URL, error) {
	urls := []*URL{}
	params := make(map[string][]string)
	actualKeys := make([]string, len(keys))
	for _, key := range keys {
		split := strings.Split(key, "/")
		actualKey, remaining := strings.ToLower(split[0]), split[1:]
		params[actualKey] = remaining
		actualKeys = append(actualKeys, actualKey)
	}
	fmt.Println(actualKeys)
	fmt.Println(params)
	err := db.GetDB().Model(&urls).WhereIn("key in (?)", pg.In(actualKeys)).Select()
	if err != nil {
		return nil, err
	}
	for _, url := range urls {
		if len(params[url.Key]) == 0 {
			continue
		}
		if url.URL != "" {
			for i, param := range params[url.Key] {
				fmt.Println(url.URL)

				url.URL = strings.ReplaceAll(url.URL, fmt.Sprintf("{{$%d}}", i+1), param)
				fmt.Println(url.URL)
				fmt.Println(fmt.Sprintf("{{$%d}}", i+1))
			}
		} else {
			for i, alias := range url.Alias {
				url.Alias[i] = fmt.Sprintf("%s/%s", alias, strings.Join(params[url.Key], "/"))
			}
		}
	}
	return urls, nil
}

// Search returns all the db records that match the keys
func (u *URL) Search(query string, limit int) ([]*URL, error) {
	urls := []*URL{}
	err := db.GetDB().Model(&urls).Where("key LIKE ?", fmt.Sprintf("%%%s%%", query)).WhereOr("url LIKE ?", fmt.Sprintf("%%%s%%", query)).Limit(limit).Select()
	return urls, err
}

// GetMostPopular gets the urls sorted by views
func (u *URL) GetMostPopular(limit int) ([]*URL, error) {
	urls := []*URL{}
	err := db.GetDB().Model(&urls).Order("views DESC").Limit(limit).Select()
	return urls, err
}
