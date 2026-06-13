package exercises

import (
	"strings"
	"testing"
)

func validExercise() Exercise {
	return Exercise{
		ID:             "thought-check",
		Slug:           "thought-check",
		Title:          "Thought check",
		Summary:        "Pause and examine a thought.",
		Description:    "A brief original reflection exercise.",
		CategoryIDs:    []string{"cbt-based"},
		Tags:           []string{"reflection"},
		IntensityRange: []IntensityLevel{IntensityLow, IntensityMedium},
		TimeMinutes:    10,
		EnergyRequired: EnergyLow,
		WritingLevel:   WritingModerate,
		HelpfulFor:     []string{"slowing down"},
		AvoidWhen:      []string{"immediate crisis"},
		Steps: []ExerciseStep{{
			ID:          "notice",
			Title:       "Notice the thought",
			Instruction: "Write the thought in your own words.",
			Prompt:      "What thought is showing up?",
			InputType:   InputLongText,
		}},
		Printable:     true,
		SourceNotes:   []string{"Original draft for validation tests only."},
		LicenseStatus: LicenseOriginalDraft,
	}
}

func TestValidateAcceptsCompleteExercise(t *testing.T) {
	if err := Validate(validExercise()); err != nil {
		t.Fatalf("Validate() returned unexpected error: %v", err)
	}
}

func TestValidateRejectsInvalidExercise(t *testing.T) {
	exercise := validExercise()
	exercise.Slug = "Not Valid"
	exercise.SourceNotes = nil
	exercise.Steps[0].InputType = "unsupported"

	err := Validate(exercise)
	if err == nil {
		t.Fatal("Validate() returned nil for invalid exercise")
	}
	for _, expected := range []string{"slug", "source notes", "invalid input type"} {
		if !strings.Contains(err.Error(), expected) {
			t.Fatalf("Validate() error %q does not contain %q", err, expected)
		}
	}
}

func TestValidateRejectsUnknownCategory(t *testing.T) {
	exercise := validExercise()
	exercise.CategoryIDs = []string{"not-a-real-category"}
	if err := Validate(exercise); err == nil || !strings.Contains(err.Error(), "unknown category") {
		t.Fatalf("Validate() error = %v, want unknown category error", err)
	}
}

func TestValidateCatalogRejectsDuplicates(t *testing.T) {
	exercise := validExercise()
	err := ValidateCatalog([]Exercise{exercise, exercise})
	if err == nil || !strings.Contains(err.Error(), "duplicate exercise") {
		t.Fatalf("ValidateCatalog() error = %v, want duplicate exercise error", err)
	}
}

func TestInitialCatalogIsValidAndUsefulSize(t *testing.T) {
	if err := ValidateCatalog(Catalog); err != nil {
		t.Fatalf("ValidateCatalog(Catalog) returned error: %v", err)
	}
	if len(Catalog) < 10 {
		t.Fatalf("len(Catalog) = %d, want at least 10", len(Catalog))
	}
}

func TestCategoryCatalogIsValid(t *testing.T) {
	if err := ValidateCategories(Categories); err != nil {
		t.Fatalf("ValidateCategories(Categories) returned error: %v", err)
	}
}
