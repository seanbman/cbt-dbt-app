package server

import (
	"github.com/labstack/echo/v4"
	"github.com/seanbman/cbt-dbt-app/internal/server/handlers"
)

func RegisterRoutes(e *echo.Echo) {
	e.Static("/static", "static")
	e.File("/manifest.webmanifest", "static/manifest.webmanifest")
	e.File("/service-worker.js", "static/service-worker.js")

	e.GET("/", handlers.Home)
	e.GET("/check-in", handlers.CheckIn)
	e.GET("/exercises", handlers.Exercises)
	e.GET("/exercises/:slug", handlers.ExerciseDetail)
	e.GET("/saved", handlers.Saved)
	e.GET("/about", handlers.About)
	e.GET("/help", handlers.Help)
}
