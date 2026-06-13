package exercises

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

var slugPattern = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

func ValidateCatalog(catalog []Exercise) error {
	var errs []error
	if err := ValidateCategories(Categories); err != nil {
		errs = append(errs, err)
	}
	ids, slugs := map[string]struct{}{}, map[string]struct{}{}
	for i, exercise := range catalog {
		if err := Validate(exercise); err != nil {
			errs = append(errs, fmt.Errorf("exercise %d: %w", i, err))
		}
		if _, exists := ids[exercise.ID]; exercise.ID != "" && exists {
			errs = append(errs, fmt.Errorf("duplicate exercise id %q", exercise.ID))
		}
		if _, exists := slugs[exercise.Slug]; exercise.Slug != "" && exists {
			errs = append(errs, fmt.Errorf("duplicate exercise slug %q", exercise.Slug))
		}
		ids[exercise.ID], slugs[exercise.Slug] = struct{}{}, struct{}{}
	}
	return errors.Join(errs...)
}

func Validate(exercise Exercise) error {
	var errs []error
	if strings.TrimSpace(exercise.ID) == "" {
		errs = append(errs, errors.New("id is required"))
	}
	if !slugPattern.MatchString(exercise.Slug) {
		errs = append(errs, errors.New("slug must use lowercase words separated by hyphens"))
	}
	if strings.TrimSpace(exercise.Title) == "" {
		errs = append(errs, errors.New("title is required"))
	}
	if strings.TrimSpace(exercise.Summary) == "" {
		errs = append(errs, errors.New("summary is required"))
	}
	if strings.TrimSpace(exercise.Description) == "" {
		errs = append(errs, errors.New("description is required"))
	}
	if len(exercise.CategoryIDs) == 0 {
		errs = append(errs, errors.New("at least one category is required"))
	}
	for _, categoryID := range exercise.CategoryIDs {
		if _, ok := CategoryByID(categoryID); !ok {
			errs = append(errs, fmt.Errorf("unknown category %q", categoryID))
		}
	}
	if len(exercise.IntensityRange) == 0 {
		errs = append(errs, errors.New("intensity range is required"))
	}
	for _, intensity := range exercise.IntensityRange {
		if !validIntensity(intensity) {
			errs = append(errs, fmt.Errorf("invalid intensity %q", intensity))
		}
	}
	if exercise.TimeMinutes <= 0 {
		errs = append(errs, errors.New("time minutes must be greater than zero"))
	}
	if !validEnergy(exercise.EnergyRequired) {
		errs = append(errs, fmt.Errorf("invalid energy requirement %q", exercise.EnergyRequired))
	}
	if !validWriting(exercise.WritingLevel) {
		errs = append(errs, fmt.Errorf("invalid writing level %q", exercise.WritingLevel))
	}
	if len(exercise.Steps) == 0 {
		errs = append(errs, errors.New("at least one step is required"))
	}
	stepIDs := map[string]struct{}{}
	for i, step := range exercise.Steps {
		if strings.TrimSpace(step.ID) == "" {
			errs = append(errs, fmt.Errorf("step %d: id is required", i))
		}
		if _, exists := stepIDs[step.ID]; step.ID != "" && exists {
			errs = append(errs, fmt.Errorf("duplicate step id %q", step.ID))
		}
		stepIDs[step.ID] = struct{}{}
		if strings.TrimSpace(step.Title) == "" {
			errs = append(errs, fmt.Errorf("step %d: title is required", i))
		}
		if strings.TrimSpace(step.Instruction) == "" {
			errs = append(errs, fmt.Errorf("step %d: instruction is required", i))
		}
		if !validInputType(step.InputType) {
			errs = append(errs, fmt.Errorf("step %d: invalid input type %q", i, step.InputType))
		}
	}
	if len(exercise.SourceNotes) == 0 {
		errs = append(errs, errors.New("source notes are required for content review"))
	}
	if !validLicenseStatus(exercise.LicenseStatus) {
		errs = append(errs, fmt.Errorf("invalid license status %q", exercise.LicenseStatus))
	}
	return errors.Join(errs...)
}
func validIntensity(value IntensityLevel) bool {
	return value == IntensityLow || value == IntensityMedium || value == IntensityHigh
}
func validEnergy(value EnergyLevel) bool {
	return value == EnergyLow || value == EnergyMedium || value == EnergyHigh
}
func validWriting(value WritingLevel) bool {
	return value == WritingMinimal || value == WritingModerate || value == WritingDetailed
}
func validInputType(value ExerciseInputType) bool {
	switch value {
	case InputReflection, InputShortText, InputLongText, InputChoice, InputScale, InputChecklist, InputNone:
		return true
	}
	return false
}
func validLicenseStatus(value LicenseStatus) bool {
	return value == LicenseOriginalDraft || value == LicenseOriginalReviewed || value == LicenseReviewRequired
}
