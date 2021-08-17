package main

import (
	"context"
	"log"
	"os"

	"github.com/anslee/nomad/db"
	"github.com/anslee/nomad/routers"
	"github.com/anslee/nomad/utils"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"gopkg.in/validator.v2"
)

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file!")
		os.Exit(1)
	}

	// Connect to MongoDB
	db.ConnectDB()

	err = db.GetDatabase().Client().Ping(context.Background(), readpref.Primary())
	if err != nil {
		log.Fatal("Could not connect to the database!", err)
		os.Exit(1)
	}

	// JSON validator setup
	setupValidator()

	// Gin setup
	router := gin.Default()
	api := router.Group("/api")

	setupRoutes(api)

	if err = router.Run(); err != nil {
		log.Fatal("Could not start gin-gonic server!", err)
		os.Exit(1)
	}
}

func setupRoutes(router *gin.RouterGroup) {
	routers.SetPongRoutes(router)
	routers.SetUserRoutes(router)
	routers.SetAuthRoutes(router)
	routers.SetEventRoutes(router)
	routers.SetGroupRoutes(router)
}

func setupValidator() {
	err := validator.SetValidationFunc(utils.ValidatorCategoryTag, utils.ValidateCategory)
	if err != nil {
		log.Fatal("Could not set additional validator functions!", err)
		os.Exit(1)
	}
}
