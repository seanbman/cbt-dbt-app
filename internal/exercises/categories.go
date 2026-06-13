package exercises

import (
	"errors"
	"fmt"
	"strings"
)

type Category struct{ ID, Name, Description string }

var Categories = []Category{
	{ID: "cbt-based", Name: "CBT-based", Description: "Reflect on thoughts, interpretations, and practical next steps."},
	{ID: "dbt-informed", Name: "DBT-informed", Description: "Practice mindful pauses and emotional-regulation skills."},
	{ID: "recovery-focused", Name: "Recovery-focused", Description: "Support deliberate choices around urges, routines, and support."},
	{ID: "grounding", Name: "Grounding", Description: "Reconnect with the present moment through concrete observations."},
	{ID: "emotional-regulation", Name: "Emotional regulation", Description: "Slow down and choose a steady response to strong emotions."},
	{ID: "thought-reflection", Name: "Thought reflection", Description: "Examine a thought with curiosity rather than treating it as a fact."},
	{ID: "urge-management", Name: "Urge management", Description: "Create space between an urge and a decision."},
	{ID: "values", Name: "Values", Description: "Reconnect a small action to what matters most."},
	{ID: "planning", Name: "Planning", Description: "Turn a difficult moment into one manageable next step."},
	{ID: "self-compassion", Name: "Self-compassion", Description: "Respond to yourself with honesty, patience, and care."},
}

func ValidateCategories(categories []Category) error {
	var errs []error
	seen := map[string]struct{}{}
	for i, category := range categories {
		if strings.TrimSpace(category.ID) == "" {
			errs = append(errs, fmt.Errorf("category %d: id is required", i))
		}
		if strings.TrimSpace(category.Name) == "" {
			errs = append(errs, fmt.Errorf("category %d: name is required", i))
		}
		if strings.TrimSpace(category.Description) == "" {
			errs = append(errs, fmt.Errorf("category %d: description is required", i))
		}
		if _, ok := seen[category.ID]; category.ID != "" && ok {
			errs = append(errs, fmt.Errorf("duplicate category id %q", category.ID))
		}
		seen[category.ID] = struct{}{}
	}
	return errors.Join(errs...)
}

func CategoryByID(id string) (Category, bool) {
	for _, category := range Categories {
		if category.ID == id {
			return category, true
		}
	}
	return Category{}, false
}

func CategoryName(id string) string {
	if category, ok := CategoryByID(id); ok {
		return category.Name
	}
	return id
}
