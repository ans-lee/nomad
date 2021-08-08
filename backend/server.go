package main

import (
    "github.com/anslee/nomad/routers"
    "github.com/gin-gonic/gin"
)

func main() {
    router := gin.Default()
    api := router.Group("/api")
    setupRoutes(api)
    router.Run()
}

func setupRoutes(router *gin.RouterGroup) {
    routers.SetPongRoutes(router)
}
