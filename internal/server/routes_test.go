package server

import (
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
)

func request(t *testing.T, e *echo.Echo, method, path string) *httptest.ResponseRecorder {
	t.Helper()
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, nil)
	e.ServeHTTP(recorder, req)
	return recorder
}

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
		{"/exercises/thought-check", "Thought check"},
		{"/saved", "Saved worksheets"},
		{"/about", "About this toolbox"},
		{"/help", "9-8-8"},
	}

	for _, test := range tests {
		t.Run(test.path, func(t *testing.T) {
			recorder := request(t, e, http.MethodGet, test.path)
			if recorder.Code != http.StatusOK {
				t.Fatalf("GET %s returned %d", test.path, recorder.Code)
			}
			if !strings.Contains(recorder.Body.String(), test.want) {
				t.Fatalf("GET %s response does not contain %q", test.path, test.want)
			}
		})
	}
}

func TestExerciseFiltersAffectRenderedCatalog(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)

	recorder := request(t, e, http.MethodGet, "/exercises?category=grounding")
	if recorder.Code != http.StatusOK {
		t.Fatalf("GET filtered exercises returned %d", recorder.Code)
	}
	body := recorder.Body.String()
	if !strings.Contains(body, "Five-senses grounding") || strings.Contains(body, "Thought check") {
		t.Fatalf("filtered exercise response did not contain the expected catalog subset: %s", body)
	}

	recorder = request(t, e, http.MethodGet, "/exercises?q=rumination")
	if !strings.Contains(recorder.Body.String(), "What is in my control") {
		t.Fatalf("search response did not contain helpful-for match: %s", recorder.Body.String())
	}
}

func TestUnknownExerciseRendersCalmNotFoundPage(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)
	recorder := request(t, e, http.MethodGet, "/exercises/not-a-real-exercise")
	if recorder.Code != http.StatusNotFound {
		t.Fatalf("GET unknown exercise returned %d, want 404", recorder.Code)
	}
	if body := recorder.Body.String(); !strings.Contains(body, "That exercise was not found") || !strings.Contains(body, "Back to exercise library") {
		t.Fatalf("unknown exercise response was not the calm templ page: %s", body)
	}
}

func TestHelpKeepsImmediateSupportVisible(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)
	body := request(t, e, http.MethodGet, "/help").Body.String()
	for _, expected := range []string{"9-1-1", "9-8-8"} {
		if !strings.Contains(body, expected) {
			t.Fatalf("help response does not contain %q", expected)
		}
	}
}

func TestStaticAssetsStillServe(t *testing.T) {
	originalDir, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	if err := os.Chdir("../.."); err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(originalDir)

	e := echo.New()
	RegisterRoutes(e)
	for _, path := range []string{"/static/css/app.css", "/manifest.webmanifest", "/service-worker.js"} {
		if recorder := request(t, e, http.MethodGet, path); recorder.Code != http.StatusOK {
			t.Fatalf("GET %s returned %d", path, recorder.Code)
		}
	}
}

func TestSensitiveServerRoutesDoNotExist(t *testing.T) {
	e := echo.New()
	RegisterRoutes(e)

	for _, path := range []string{"/login", "/api/worksheet-answers", "/api/check-in", "/api/check-in-answers"} {
		recorder := request(t, e, http.MethodPost, path)
		if recorder.Code != http.StatusNotFound {
			t.Fatalf("POST %s returned %d, want 404", path, recorder.Code)
		}
	}
}
