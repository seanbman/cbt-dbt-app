package server

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
)

func TestPageRoutesRender(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)

	tests := []struct {
		path string
		want string
	}{
		{"/", "Take one manageable next step"},
		{"/check-in", "Find an exercise"},
		{"/exercises", "Browse exercises"},
		{"/exercises/example-slug", "example-slug"},
		{"/saved", "Saved worksheets"},
		{"/about", "About this toolbox"},
		{"/help", "9-8-8"},
	}

	for _, test := range tests {
		t.Run(test.path, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			request := httptest.NewRequest(http.MethodGet, test.path, nil)
			e.ServeHTTP(recorder, request)
			if recorder.Code != http.StatusOK {
				t.Fatalf("GET %s returned %d", test.path, recorder.Code)
			}
			if !strings.Contains(recorder.Body.String(), test.want) {
				t.Fatalf("GET %s response does not contain %q", test.path, test.want)
			}
		})
	}
}

func TestSensitiveServerRoutesDoNotExist(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)

	for _, path := range []string{"/login", "/api/worksheet-answers", "/api/check-in"} {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(http.MethodPost, path, nil)
		e.ServeHTTP(recorder, request)
		if recorder.Code != http.StatusNotFound {
			t.Fatalf("POST %s returned %d, want 404", path, recorder.Code)
		}
	}
}
