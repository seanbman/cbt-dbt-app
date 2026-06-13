package handlers

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/labstack/echo/v4"
	"github.com/seanbman/cbt-dbt-app/internal/exercises"
	"github.com/seanbman/cbt-dbt-app/internal/views/pages"
)

func render(c echo.Context, status int, component templ.Component) error {
	c.Response().WriteHeader(status)
	return component.Render(c.Request().Context(), c.Response())
}

func Home(c echo.Context) error { return render(c, http.StatusOK, pages.Home()) }
func CheckIn(c echo.Context) error { return render(c, http.StatusOK, pages.CheckIn()) }
func Exercises(c echo.Context) error {
	filter := exercises.ParseFilter(c.QueryParams())
	catalog := exercises.DefaultCatalogService()
	return render(c, http.StatusOK, pages.Exercises(catalog.Filter(filter), exercises.SortedCategories(), filter))
}
func ExerciseDetail(c echo.Context) error {
	exercise, ok := exercises.DefaultCatalogService().FindBySlug(c.Param("slug"))
	if !ok {
		return render(c, http.StatusNotFound, pages.ExerciseNotFound())
	}
	return render(c, http.StatusOK, pages.ExerciseDetail(exercise))
}
func Saved(c echo.Context) error { return render(c, http.StatusOK, pages.Saved()) }
func About(c echo.Context) error { return render(c, http.StatusOK, pages.About()) }
func Help(c echo.Context) error { return render(c, http.StatusOK, pages.Help()) }
