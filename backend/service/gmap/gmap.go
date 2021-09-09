package gmap

import (
	"log"
	"os"
	"sync"

	"googlemaps.github.io/maps"
)

var client *maps.Client
var dial sync.Once

func createClient() *maps.Client {
	var err error

	client, err = maps.NewClient(maps.WithAPIKey(os.Getenv("GMAP_API_KEY")))
	if err != nil {
		log.Fatal(err)
	}

	return client
}

func SetupClient() {
	dial.Do(func() {
		client = createClient()
		log.Println("Created Google Map Client!")
	})
}

func GetClient() *maps.Client {
	return client
}
