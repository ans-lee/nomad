package routers

import (
	"github.com/anslee/nomad/controllers"
	"github.com/anslee/nomad/middleware"
	"github.com/gin-gonic/gin"
)

func SetPingRoutes(router *gin.RouterGroup) {
	pongGroup := router.Group("/ping")
	pongGroup.GET("/", controllers.Ping)
	pongGroup.GET(
		"/auth",
		middleware.CheckSessionToken,
		middleware.AuthRequired,
		controllers.Ping,
	)
}
