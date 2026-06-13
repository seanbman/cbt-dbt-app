package handlers

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/labstack/echo/v4"
	"github.com/seanbman/cbt-dbt-app/internal/views/pages"
)

func render(c echo.Context, status int, component templ.Component) error {
	c.Response().WriteHeader(status)
	return component.Render(c.Request().Context(), c.Response())
}

func Home(c echo.Context) error {
	return render(c, http.StatusOK, pages.Home())
}

func CheckIn(c echo.Context) error {
	return render(c, http.StatusOK, pages.CheckIn())
}

func Exercises(c echo.Context) error {
	return render(c, http.StatusOK, pages.Exercises())
}

func ExerciseDetail(c echo.Context) error {
	return render(c, http.StatusOK, pages.ExerciseDetail(c.Param("slug")))
}

func Saved(c echo.Context) error {
	return render(c, http.StatusOK, pages.Saved())
}

func About(c echo.Context) error {
	return render(c, http.StatusOK, pages.About())
}

func Help(c echo.Context) error {
	return render(c, http.StatusOK, pages.Help())
}
