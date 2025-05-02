package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RespondJSON(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, gin.H{
		"status":  http.StatusText(status),
		"message": message,
		"data":    data,
	})
}

func RespondError(c *gin.Context, status int, message string, err error) {
	c.JSON(status, gin.H{
		"status":  http.StatusText(status),
		"message": message,
		"errors":  err,
	})
}
