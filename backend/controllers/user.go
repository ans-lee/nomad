package controllers

import (
    "context"
    "fmt"
    "net/http"

    "github.com/anslee/nomad/db"
    UserModel "github.com/anslee/nomad/models/user"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
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

    if findUser(newUser.Email) {
        c.JSON(http.StatusConflict, gin.H{
            "error": "A user with this email already exists.",
        })
        return
    }

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

func findUser(email string) bool {
    var user UserModel.User
    filter := bson.D{{Key: "email", Value: email}}
    return db.GetCollection(UserModel.COLLECTION_NAME).FindOne(context.Background(), filter).Decode(&user) == nil
}
