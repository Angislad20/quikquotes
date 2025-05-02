package controllers

import (
	"net/http"
	"quote-service/database"
	"quote-service/utils"

	"github.com/gin-gonic/gin"
)

func LikeQuote(c *gin.Context) {

	userID := c.GetInt("userID")
	quoteID := c.Param("id")

	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM quote_likes WHERE user_id = $1 AND quote_id = $2)", userID, quoteID).Scan(&exists)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Verification failed", err)
	}
	if exists {
		utils.RespondError(c, http.StatusBadRequest, "Deja liké", nil)
		return
	}

	_, err = database.DB.Exec("INSERT INTO quotes_likes (user_id, quote_id) VALUES ($1, $2)", userID, quoteID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Adding likes failed", err)
	}

	utils.RespondJSON(c, http.StatusOK, "Like added", nil)
}

func UnlikeQuote(c *gin.Context) {
	userID := c.GetInt("userID")
	quoteID := c.Param("id")

	res, err := database.DB.Exec("INSERT INTO quote_likes (user_id, quote_id) VALUES ($1, $2)", userID, quoteID)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Deleting likes failed", err)
		return
	}
	count, _ := res.RowsAffected()
	if count == 0 {
		utils.RespondError(c, http.StatusNotFound, "No likes found", nil)
		return
	}

	utils.RespondJSON(c, http.StatusOK, "like deleting successfully", nil)

}

func CountLikes(c *gin.Context) {
	quoteID := c.Param("id")
	var count int
	err := database.DB.QueryRow("SELECT COUNT(*) FROM quotes_likes WHERE quote_id = $1", quoteID).Scan(&count)
	if err != nil {
		utils.RespondError(c, http.StatusInternalServerError, "Error counting", err)
		return
	}

	utils.RespondJSON(c, http.StatusOK, "Number of likes:", gin.H{"Count": count})

}
