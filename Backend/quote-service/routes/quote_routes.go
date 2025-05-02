package routes

import (
	"os"
	"quote-service/controllers"
	"quote-service/middlewares"

	"github.com/gin-gonic/gin"
)

func SetupQuoteRoutes(r *gin.Engine) {
	secret := os.Getenv("JWT_SECRET")

	r.GET("/quotes/:id/likes", controllers.CountLikes)
	r.POST("quotes/:id/like", middlewares.AuthMiddleware(secret), controllers.LikeQuote)
	r.DELETE("/quotes/:id/like", middlewares.AuthMiddleware(secret), controllers.UnlikeQuote)
}
