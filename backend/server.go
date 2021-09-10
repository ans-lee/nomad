package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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

	// Ping database to ensure the connection is stable
	err = db.GetDatabase().Client().Ping(context.Background(), readpref.Primary())
	if err != nil {
		log.Fatal("Could not connect to the database!", err)
		os.Exit(1)
	}

	// JSON validator setup
	setupValidator()

	// Gin setup
	router := gin.Default()
	router.NoRoute(setup404)
	api := router.Group("/api")
	setupRoutes(api)

	server := &http.Server{
		Addr:    ":5000",
		Handler: router,
	}

	go func() {
		if err = server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatal("listen: ", err)
		}
	}()

	// Listen for signals
	quit := make(chan os.Signal)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down the server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server force shutdown: ", err)
	}

	// Disconnect MongoDB
	err = db.GetDatabase().Client().Disconnect(context.Background())
	if err != nil {
		log.Fatal("Could not disconnect MongoDB client: ", err)
	}

	log.Println("Disconnected MongoDB client")
	log.Println("Server has been shutdown")
}

func setupRoutes(router *gin.RouterGroup) {
	routers.SetPingRoutes(router)
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
