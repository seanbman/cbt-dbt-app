package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/seanbman/cbt-dbt-app/internal/exercises"
	"github.com/seanbman/cbt-dbt-app/internal/server"
)

func main() {
	if err := exercises.ValidateCatalog(exercises.Catalog); err != nil {
		log.Fatalf("invalid exercise catalog: %v", err)
	}

	e := echo.New()
	server.RegisterRoutes(e)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("starting server on :%s", port)
	if err := e.Start(":" + port); err != nil {
		log.Fatal(err)
	}
}
