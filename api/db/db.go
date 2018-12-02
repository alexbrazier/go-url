package db

import (
	"github.com/alexbrazier/go-url/api/config"
	"github.com/globalsign/mgo"
	"github.com/labstack/gommon/log"
)

var database *mgo.Database

// Init sets up DB connection
func Init() {
	c := config.GetConfig()

	dialInfo := &mgo.DialInfo{
		Addrs:    c.Database.Addresses,
		Database: c.Database.Database,
		Username: c.Database.User,
		Password: c.Database.Pass,
	}

	session, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		log.Fatal(err)
	}

	database = session.DB("")
	setupTables()
}

// GetDB will return the active database connection
func GetDB() *mgo.Database {
	return database
}

// setupTables creates the required tables and sets up indexes
func setupTables() {
	if err := database.C("urls").EnsureIndex(mgo.Index{
		Key:    []string{"key"},
		Unique: true,
	}); err != nil {
		log.Fatal(err)
	}
}
