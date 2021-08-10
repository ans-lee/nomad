package controllers

import (
    "context"
    "net/http"

    "github.com/anslee/nomad/db"
    "github.com/anslee/nomad/models/user"
    "github.com/gin-gonic/gin"
)

func Pong(c *gin.Context) {
    newUser := user.User{
        Username: "alee",
        Password: "password123",
        Email: "alee@gmail.com",
        FirstName: "Anson",
        LastName: "Lee",
    }
    db.GetCollection(user.COLLECTION_NAME).InsertOne(context.Background(), newUser)
    c.JSON(http.StatusOK, gin.H{
        "message": "pong!",
    })
}
