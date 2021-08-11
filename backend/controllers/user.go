package controllers

import (
	"context"
	"crypto/rand"
	"math/big"
	"net/http"
	"time"

	"github.com/anslee/nomad/db"
	SessionModel "github.com/anslee/nomad/models/session"
	UserModel "github.com/anslee/nomad/models/user"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/validator.v2"
)

const hashCost = 14
const tokenChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-"
const tokenLength = 100

func SignUp(c *gin.Context) {
	var data UserModel.SignUpSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are not in the correct format.",
		})

		return
	}

	if userExists(data.Email) {
		c.JSON(http.StatusConflict, gin.H{
			"error": "A user with this email already exists.",
		})

		return
	}

	hashedPassword := generatePasswordHash(data.Password)
	if hashedPassword == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	newUser := UserModel.User{
		Email:     data.Email,
		Password:  hashedPassword,
		FirstName: data.FirstName,
		LastName:  data.LastName,
	}

	_, err := db.GetCollection(UserModel.CollectionName).
		InsertOne(context.Background(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Created a new user!",
	})
}

func LogIn(c *gin.Context) {
	var data UserModel.LogInSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are not in the correct format.",
		})

		return
	}

	var user UserModel.User

	filter := bson.D{{Key: "email", Value: data.Email}}
	err := db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user)

	if err != nil || !comparePasswordHash(data.Password, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Either password or email is incorrect.",
		})

		return
	}

	token := createSessionToken(tokenLength)
	session := SessionModel.Session{
		Token:  token,
		Expiry: primitive.NewDateTimeFromTime(time.Now().UTC()),
		User:   user.ID,
	}

	_, err = db.GetCollection(SessionModel.CollectionName).
		InsertOne(context.Background(), session)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

func generatePasswordHash(password string) string {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), hashCost)
	if err != nil {
		return ""
	}

	return string(hashPassword)
}

func comparePasswordHash(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func createSessionToken(length int) string {
	result := make([]byte, length)

	for i := 0; i < length; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(tokenChars))))
		if err != nil {
			return ""
		}

		result[i] = tokenChars[num.Int64()]
	}

	return string(result)
}

func userExists(email string) bool {
	var user UserModel.User

	filter := bson.D{{Key: "email", Value: email}}

	return db.GetCollection(UserModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&user) == nil
}
