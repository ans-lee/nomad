package errors

import (
	"net/http"

	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/gin-gonic/gin"
)

func RaiseError(c *gin.Context, errStr string) {
	var status int

	if errStr == ResponseConstants.InternalServerErrorMessage {
		status = http.StatusInternalServerError
	}

	c.AbortWithStatusJSON(status, gin.H{
		"error": errStr,
	})
}
