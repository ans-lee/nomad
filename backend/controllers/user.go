package controllers

import (
    "context"
    "fmt"
    "net/http"

    "github.com/anslee/nomad/db"
    UserModel "github.com/anslee/nomad/models/user"
    "github.com/gin-gonic/gin"
)

func SignUp(c *gin.Context) {
    var newUser UserModel.User
    if c.ShouldBindJSON(&newUser) != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "Fields are not in the correct format.",
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

    c.JSON(http.StatusOK, gin.H{
        "message": fmt.Sprintf("Created a new user: %s!", newUser.Username),
    })
}
