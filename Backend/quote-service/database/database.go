package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {

	var err error
	connStr := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
		os.Getenv("PG_USER"),
		os.Getenv("PG_PASSWORD"),
		os.Getenv("PG_HOST"),
		os.Getenv("PG_DB"),
	)
	DB, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("❌ Database connection error :", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("❌ DB ping failed...", err)
	}
	log.Println("connection to postgresql DB established successfully")
}
