package controllers

import (
	"context"
	"net/http"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	UserModel "github.com/anslee/nomad/models/user"
	"github.com/anslee/nomad/serializers"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/validator.v2"
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
		"id":        user.ID.Hex(),
		"email":     user.Email,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
	})
}

func UpdateUserMyself(c *gin.Context) {
	var data serializers.UpdateUserSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
		})

		return
	}

	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	filter := bson.M{"_id": userID}

	result := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter)
	if result.Err() != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidUserIDMessage,
		})

		return
	}

	var existingUser UserModel.User

	emailFilter := bson.M{"email": data.Email}

	err := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), emailFilter).
		Decode(&existingUser)
	if err == nil && existingUser.ID != userID {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "A user with this email already exists.",
		})

		return
	}

	updateFields := bson.D{
		{Key: "email", Value: data.Email},
		{Key: "firstName", Value: data.FirstName},
		{Key: "lastName", Value: data.LastName},
	}

	_, _ = db.GetCollection(UserModel.CollectionName).
		UpdateOne(
			context.Background(),
			filter,
			bson.D{{Key: "$set", Value: updateFields}},
		)

	c.JSON(http.StatusOK, gin.H{
		"email": data.Email,
		"firstName": data.FirstName,
		"lastName": data.LastName,
	})
}
