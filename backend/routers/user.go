package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetUserRoutes(router *gin.RouterGroup) {
	userGroup := router.Group("/user")
	userGroup.GET("/:id", middleware.CheckSessionToken, controllers.GetUser)
	userGroup.GET(
		"/me",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.GetUserMyself,
	)
	userGroup.PUT(
		"/me",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.UpdateUserMyself,
	)
}
