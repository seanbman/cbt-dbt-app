package exercises

import (
	"sort"
	"strconv"
	"strings"
)

type Filter struct {
	Query         string
	Category      string
	Energy        EnergyLevel
	MaxTime       int
	Writing       WritingLevel
	PrintableOnly bool
}

type CatalogService struct{ catalog []Exercise }

func NewCatalogService(catalog []Exercise) CatalogService { return CatalogService{catalog: catalog} }
func DefaultCatalogService() CatalogService               { return NewCatalogService(Catalog) }
func (service CatalogService) List() []Exercise           { return append([]Exercise(nil), service.catalog...) }
func (service CatalogService) FindBySlug(slug string) (Exercise, bool) {
	for _, exercise := range service.catalog {
		if exercise.Slug == slug {
			return exercise, true
		}
	}
	return Exercise{}, false
}
func (service CatalogService) Filter(filter Filter) []Exercise {
	var matches []Exercise
	for _, exercise := range service.catalog {
		if matchesFilter(exercise, filter) {
			matches = append(matches, exercise)
		}
	}
	return matches
}

func ParseFilter(values map[string][]string) Filter {
	filter := Filter{Query: first(values, "q"), Category: first(values, "category"), Energy: EnergyLevel(first(values, "energy")), Writing: WritingLevel(first(values, "writing"))}
	filter.PrintableOnly = strings.EqualFold(first(values, "printable"), "true")
	if maxTime, err := strconv.Atoi(first(values, "maxTime")); err == nil && maxTime > 0 {
		filter.MaxTime = maxTime
	}
	return filter
}
func (filter Filter) Active() bool {
	return filter.Query != "" || filter.Category != "" || filter.Energy != "" || filter.MaxTime > 0 || filter.Writing != "" || filter.PrintableOnly
}
func (filter Filter) MaxTimeValue() string {
	if filter.MaxTime == 0 {
		return ""
	}
	return strconv.Itoa(filter.MaxTime)
}

func CategoriesFor(exercise Exercise) []Category {
	categories := make([]Category, 0, len(exercise.CategoryIDs))
	for _, id := range exercise.CategoryIDs {
		if category, ok := CategoryByID(id); ok {
			categories = append(categories, category)
		}
	}
	return categories
}

func matchesFilter(exercise Exercise, filter Filter) bool {
	if filter.Category != "" && !contains(exercise.CategoryIDs, filter.Category) {
		return false
	}
	if filter.Energy != "" && exercise.EnergyRequired != filter.Energy {
		return false
	}
	if filter.MaxTime > 0 && exercise.TimeMinutes > filter.MaxTime {
		return false
	}
	if filter.Writing != "" && exercise.WritingLevel != filter.Writing {
		return false
	}
	if filter.PrintableOnly && !exercise.Printable {
		return false
	}
	terms := strings.Fields(normalize(filter.Query))
	if len(terms) == 0 {
		return true
	}
	haystack := searchableText(exercise)
	for _, term := range terms {
		if !strings.Contains(haystack, term) {
			return false
		}
	}
	return true
}

func searchableText(exercise Exercise) string {
	parts := []string{exercise.Title, exercise.Summary, exercise.Description}
	parts = append(parts, exercise.Tags...)
	parts = append(parts, exercise.HelpfulFor...)
	for _, id := range exercise.CategoryIDs {
		parts = append(parts, CategoryName(id))
	}
	return normalize(strings.Join(parts, " "))
}
func normalize(value string) string { return strings.ToLower(strings.TrimSpace(value)) }
func contains(values []string, wanted string) bool {
	for _, value := range values {
		if value == wanted {
			return true
		}
	}
	return false
}
func first(values map[string][]string, key string) string {
	if len(values[key]) == 0 {
		return ""
	}
	return strings.TrimSpace(values[key][0])
}

func SortedCategories() []Category {
	categories := append([]Category(nil), Categories...)
	sort.Slice(categories, func(i, j int) bool { return categories[i].Name < categories[j].Name })
	return categories
}
