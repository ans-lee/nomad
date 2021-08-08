package routers

import (
    "github.com/anslee/nomad/controllers"
    "github.com/gin-gonic/gin"
)

func SetPongRoutes(router *gin.RouterGroup) {
    router.GET("/pong", controllers.Pong)
}
