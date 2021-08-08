package controllers

import (
    "context"
    "net/http"

    "github.com/anslee/nomad/db"
    "github.com/anslee/nomad/models/user"
    "github.com/gin-gonic/gin"
)

func Pong(c *gin.Context) {
    newUser := user.User{Name: "Anson", Age: 21, City: "Home"}
    db.GetCollection(user.COLLECTION_NAME).InsertOne(context.Background(), newUser)
    c.JSON(http.StatusOK, gin.H{
        "message": "pong!",
    })
}
