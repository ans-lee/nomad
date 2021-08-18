package controllers

import (
	"context"
	"net/http"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	UserModel "github.com/anslee/nomad/models/user"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetUser(c *gin.Context) {
	var user UserModel.User

	userID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": userID}

	err := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidUserIDMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}

func GetUserMyself(c *gin.Context) {
	var user UserModel.User

	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	filter := bson.M{"_id": userID}

	err := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidUserIDMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}
