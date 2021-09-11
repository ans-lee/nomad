package middleware

import (
	"context"
	"log"
	"net/http"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	"github.com/anslee/nomad/db"
	SessionModel "github.com/anslee/nomad/models/session"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CheckSessionToken(c *gin.Context) {
	var user SessionModel.Session

	headerArr := c.Request.Header[AuthConstants.AuthHeaderKey]
	if len(headerArr) != 1 {
		return
	}

	timeNow := primitive.NewDateTimeFromTime(time.Now().UTC())
	token := headerArr[0]
	filter := bson.M{"token": token, "expiry": bson.M{"$gt": timeNow}}

	err := db.GetCollection(SessionModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token.",
		})

		return
	}

	filter = bson.M{"token": token}
	update := bson.M{
		"$set": bson.M{"expiry": primitive.NewDateTimeFromTime(time.Now().AddDate(0, 0, 7).UTC())},
	}

	_, err = db.GetCollection(SessionModel.CollectionName).
		UpdateOne(context.Background(), filter, update)
	if err != nil {
		log.Fatal("User token expiry did not refresh!")
	}

	c.Set(AuthConstants.ContextAuthKey, user.User)

	c.Next()
}

func AuthRequired(c *gin.Context) {
	_, exists := c.Get(AuthConstants.ContextAuthKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized.",
		})
	}
}
