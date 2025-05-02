package main

import (
	"log"
	"os"
	"quote-service/database"
	"quote-service/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  No Files found, let's continue...")
	}

	database.Connect()

	r := gin.Default()
	routes.SetupQuoteRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("✅ Server Port running at %s", port)
	r.Run(":" + port)
}
