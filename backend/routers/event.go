package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetEventRoutes(router *gin.RouterGroup) {
	eventGroup := router.Group("/event")
	eventGroup.POST("/create", middleware.CheckSessionToken, controllers.CreateEvent)
}
