package model

import (
	"fmt"

	"github.com/Babylonpartners/go-url/api/db"
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
	fmt.Println("hello")
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
	err := db.GetDB().Model(&urls).WhereIn("key in (?)", pg.In(keys)).Select()
	return urls, err
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
