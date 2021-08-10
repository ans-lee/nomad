package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/gin-gonic/gin"
)

func SetAuthRoutes(router *gin.RouterGroup) {
	authGroup := router.Group("/auth")
	authGroup.POST("/signup", controllers.SignUp)
	authGroup.POST("/login", controllers.LogIn)
}
