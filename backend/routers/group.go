package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetGroupRoutes(router *gin.RouterGroup) {
	groupGroup := router.Group("/group")
	groupGroup.POST(
		"/create",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.CreateGroup,
	)
	groupGroup.PUT(
		"/:id",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.EditGroup,
	)
	groupGroup.GET("/:id", middleware.CheckSessionToken, controllers.GetGroup)
}
