package model

import (
	"github.com/Babylonpartners/go-url/api/db"
	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"
	"github.com/labstack/gommon/log"
)

// URL model
type URL struct {
	Key     string   `json:"key" bson:"key"`
	URL     string   `json:"url" bson:"url"`
	Alias   []string `json:"alias" bson:"alias"`
	Views   int      `json:"views" bson:"views"`
	AddedBy string   `json:"added_by" bson:"added_by"`
}

// getTable gets the current table for the model
func getTable() *mgo.Collection {
	const tableName = "urls"
	return db.GetDB().C(tableName)
}

// Update sets the new url and alias fields in the db
func (u *URL) Update() error {
	selector := bson.M{"key": u.Key}
	update := bson.M{"$set": bson.M{
		"url":   u.URL,
		"alias": u.Alias,
	}}
	return getTable().Update(selector, update)
}

// Save adds a new url to the db
func (u *URL) Save() error {
	return getTable().Insert(u)
}

// IncrementViewCount increments the view count of all the keys passed in
func (u *URL) IncrementViewCount(keys []string) error {
	_, err := getTable().UpdateAll(bson.M{"key": bson.M{"$in": keys}}, bson.M{"$inc": bson.M{"views": 1}})
	if err != nil {
		log.Error("Error while updating view count")
	}
	return err
}

// GetUrlsFromKeys returns all the db records that match the keys
func (u *URL) GetUrlsFromKeys(keys []string) ([]*URL, error) {
	urls := []*URL{}
	err := getTable().Find(bson.M{"key": bson.M{"$in": keys}}).All(&urls)

	return urls, err
}

// Search returns all the db records that match the keys
func (u *URL) Search(query string, limit int) ([]*URL, error) {
	urls := []*URL{}
	err := getTable().Find(bson.M{"key": bson.M{"$regex": query}}).Limit(limit).All(&urls)

	return urls, err
}

// GetMostPopular gets the urls sorted by views
func (u *URL) GetMostPopular(limit int) ([]*URL, error) {
	urls := []*URL{}
	err := getTable().Find(bson.M{}).Sort("-views").Limit(limit).All(&urls)

	return urls, err
}
