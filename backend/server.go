package main

import (
	"context"
	"log"
	"net/http"
	"os"

	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	"github.com/anslee/nomad/routers"
	"github.com/anslee/nomad/service/gmap"
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

	// Setup Google Maps client
	gmap.SetupClient()

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

	// Use a handler for no route found
	router.NoRoute(setup404)

	// Start the server
	if err = router.Run(":5000"); err != nil {
		log.Fatal("Could not start gin-gonic server!", err)
		os.Exit(1)
	}
}

func setupRoutes(router *gin.RouterGroup) {
	// Disable Group routes for now
	// routers.SetGroupRoutes(router) // nolint:gocritic
	routers.SetPongRoutes(router)
	routers.SetUserRoutes(router)
	routers.SetAuthRoutes(router)
	routers.SetEventRoutes(router)
}

func setupValidator() {
	err := validator.SetValidationFunc(utils.ValidatorCategoryTag, utils.ValidateCategory)
	if err != nil {
		log.Fatal("Could not set additional validator functions!", err)
		os.Exit(1)
	}
}

func setup404(c *gin.Context) {
	c.JSON(http.StatusNotFound, gin.H{
		"error": ResponseConstants.NotFoundErrorMessage,
	})
}
