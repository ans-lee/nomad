package main

import (
    "context"
    "log"
    "os"

    "github.com/anslee/nomad/db"
    "github.com/anslee/nomad/routers"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo/readpref"
)

func main() {
    // Load .env
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file!")
        os.Exit(1)
    }

    // Connect to MongoDB
    db.ConnectDb()
    err = db.GetDatabase().Client().Ping(context.Background(), readpref.Primary())
    if err != nil {
        log.Fatal("Could not connect to the database!", err)
        os.Exit(1)
    }

    // Gin setup
    router := gin.Default()
    api := router.Group("/api")
    setupRoutes(api)
    router.Run()
}

func setupRoutes(router *gin.RouterGroup) {
    routers.SetPongRoutes(router)
    routers.SetAuthRoutes(router)
}
