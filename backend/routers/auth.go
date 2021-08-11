package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetAuthRoutes(router *gin.RouterGroup) {
	authGroup := router.Group("/auth")
	authGroup.POST("/signup", controllers.SignUp)
	authGroup.POST("/login", controllers.LogIn)
	authGroup.POST("/logout", middleware.CheckSessionToken, controllers.LogOut)
}
