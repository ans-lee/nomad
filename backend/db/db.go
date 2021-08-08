package db

import (
    "context"
    "log"
    "os"
    "sync"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type Datastore struct {
    db *mongo.Database
    client *mongo.Client
}

var client *mongo.Client
var dial sync.Once

func createClient() *mongo.Client {
    client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("DB_URI")))
    if err != nil {
        log.Fatal(err)
    }

    err = client.Connect(context.Background())
    if err != nil {
        log.Fatal(err)
    }

    return client
}

func ConnectDb() {
    dial.Do(func() {
        client = createClient()
        log.Println("Connected to MongoDB database!")
    })
}

func GetDatabase() *mongo.Database {
    return client.Database(os.Getenv("DB_NAME"))
}

func GetCollection(name string) *mongo.Collection {
    return client.Database(os.Getenv("DB_NAME")).Collection(name)
}
