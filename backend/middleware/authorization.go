package middleware

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/anslee/nomad/db"
	SessionModel "github.com/anslee/nomad/models/session"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const authHeader = "Authorization"

func CheckSessionToken(c *gin.Context) {
	var user SessionModel.Session

	headerArr := c.Request.Header[authHeader]
	if len(headerArr) != 1 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized.",
		})

		return
	}

	timeNow := primitive.NewDateTimeFromTime(time.Now().UTC())
	token := c.Request.Header[authHeader][0]
	filter := bson.M{"token": token, "expiry": bson.M{"$gt": timeNow}}

	err := db.GetCollection(SessionModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized.",
		})

		return
	}

	filter = bson.M{"token": token}
	update := bson.M{
		"$set": bson.M{"expiry": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 1, 0).UTC())},
	}

	_, err = db.GetCollection(SessionModel.CollectionName).
		UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal("User token expiry did not refresh!")
	}

	c.Set("user", user.User)

	c.Next()
}
