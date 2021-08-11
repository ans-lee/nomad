package middleware

import (
	"context"
	"net/http"

	"github.com/anslee/nomad/db"
	SessionModel "github.com/anslee/nomad/models/session"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
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

	token := c.Request.Header[authHeader][0]
	filter := bson.D{{Key: "token", Value: token}}
	err := db.GetCollection(SessionModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized.",
		})

		return
	}

	c.Set("user", user.User)

	c.Next()
}
