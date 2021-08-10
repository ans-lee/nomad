package controllers

import (
    "context"
    "fmt"
    "net/http"

    "github.com/anslee/nomad/db"
    UserModel "github.com/anslee/nomad/models/user"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "golang.org/x/crypto/bcrypt"
    "gopkg.in/validator.v2"
)

func SignUp(c *gin.Context) {
    var newUser UserModel.User
    if c.ShouldBindJSON(&newUser) != nil || validator.Validate(newUser) != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Fields are not in the correct format.",
        })
        return
    }

    if userExists(newUser.Email) {
        c.JSON(http.StatusConflict, gin.H{
            "error": "A user with this email already exists.",
        })
        return
    }

    hashedPassword := generatePasswordHash(newUser.Password)
    if hashedPassword == "" {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Something went wrong! Please try again.",
        })
        return
    }

    newUser.Password = hashedPassword

    _, err := db.GetCollection(UserModel.COLLECTION_NAME).InsertOne(context.Background(), newUser)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "error": "Something went wrong! Please try again.",
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": fmt.Sprintf("Created a new user!"),
    })
}

func LogIn(c *gin.Context) {
    var data UserModel.LogIn
    if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Fields are not in the correct format.",
        })
        return
    }

    var user UserModel.User
    filter := bson.D{{Key: "email", Value: data.Email}}
    err := db.GetCollection(UserModel.COLLECTION_NAME).FindOne(context.Background(), filter).Decode(&user)

    if err != nil || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.Password)) != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Either password or email is incorrect.",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message": fmt.Sprintf("Successfully logged in!"),
    })
}

func generatePasswordHash(password string) string {
    hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    if err != nil {
        return ""
    }
    return string(hashPassword)
}

func userExists(email string) bool {
    var user UserModel.User
    filter := bson.D{{Key: "email", Value: email}}
    return db.GetCollection(UserModel.COLLECTION_NAME).FindOne(context.Background(), filter).Decode(&user) == nil
}
