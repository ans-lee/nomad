package controllers

import (
	"context"
	"net/http"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	SessionModel "github.com/anslee/nomad/models/session"
	UserModel "github.com/anslee/nomad/models/user"
	"github.com/anslee/nomad/serializers"
	"github.com/anslee/nomad/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/validator.v2"
)

func SignUp(c *gin.Context) {
	var data serializers.SignUpSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
		})

		return
	}

	if userExists(data.Email) {
		c.JSON(http.StatusConflict, gin.H{
			"error": ResponseConstants.UserEmailExists,
		})

		return
	}

	hashedPassword := utils.GeneratePasswordHash(data.Password)
	if hashedPassword == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	newUser := UserModel.User{
		Email:     data.Email,
		Password:  hashedPassword,
		FirstName: data.FirstName,
		LastName:  data.LastName,
		CreatedOn: primitive.NewDateTimeFromTime(time.Now().UTC()),
	}

	_, err := db.GetCollection(UserModel.CollectionName).
		InsertOne(context.Background(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Created a new user!",
	})
}

func LogIn(c *gin.Context) {
	var data serializers.LogInSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
		})

		return
	}

	var user UserModel.User

	filter := bson.M{"email": data.Email}
	err := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)

	if err != nil || !utils.ComparePasswordHash(data.Password, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Either password or email is incorrect.",
		})

		return
	}

	token := utils.CreateSessionToken(AuthConstants.SessionTokenLength)
	session := SessionModel.Session{
		Token: token,
		Expiry: primitive.NewDateTimeFromTime(
			time.Now().AddDate(0, 0, AuthConstants.SessionTokenExpiryDays).UTC()),
		User: user.ID,
	}

	_, err = db.GetCollection(SessionModel.CollectionName).
		InsertOne(context.Background(), session)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func LogOut(c *gin.Context) {
	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	token := c.Request.Header[AuthConstants.AuthHeaderKey][0]
	filter := bson.M{"user": userID.(primitive.ObjectID), "token": token}

	_, err := db.GetCollection(SessionModel.CollectionName).
		DeleteOne(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Successfully logged out!",
	})
}

func userExists(email string) bool {
	var user UserModel.User

	filter := bson.M{"email": email}

	return db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user) == nil
}
