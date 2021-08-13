package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetGroupRoutes(router *gin.RouterGroup) {
	groupGroup := router.Group("/group")
	groupGroup.POST("/create", middleware.CheckSessionToken, controllers.CreateGroup)
}
