package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetEventRoutes(router *gin.RouterGroup) {
	eventGroup := router.Group("/event")
	eventGroup.POST(
		"/create",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.CreateEvent,
	)
	eventGroup.PUT(
		"/:id",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.EditEvent,
	)
	eventGroup.GET("/:id", middleware.CheckSessionToken, controllers.GetEvent)
	eventGroup.GET("/all", middleware.CheckSessionToken, controllers.GetAllEvents)
	eventGroup.GET("/locations", middleware.CheckSessionToken, controllers.GetEventCoords)
	eventGroup.GET("/suggestions", middleware.CheckSessionToken, controllers.GetLocationSuggestions)
}
