package exercises

import "testing"

func slugs(exercises []Exercise) map[string]bool {
	result := map[string]bool{}
	for _, exercise := range exercises {
		result[exercise.Slug] = true
	}
	return result
}

func TestCatalogServiceFindBySlug(t *testing.T) {
	service := DefaultCatalogService()
	if exercise, ok := service.FindBySlug("thought-check"); !ok || exercise.Title != "Thought check" {
		t.Fatalf("FindBySlug() = %#v, %v", exercise, ok)
	}
	if _, ok := service.FindBySlug("not-real"); ok {
		t.Fatal("FindBySlug() unexpectedly found unknown slug")
	}
}

func TestCatalogFilters(t *testing.T) {
	service := DefaultCatalogService()
	tests := []struct {
		name   string
		filter Filter
		want   string
	}{
		{"title search", Filter{Query: "Thought check"}, "thought-check"},
		{"tag search", Filter{Query: "craving"}, "urge-wave-observation"},
		{"helpful-for search", Filter{Query: "rumination"}, "what-is-in-my-control"},
		{"category", Filter{Category: "grounding"}, "five-senses-grounding"},
		{"energy", Filter{Energy: EnergyHigh}, "evidence-for-and-against"},
		{"maximum time", Filter{MaxTime: 5}, "delay-and-decide"},
		{"writing", Filter{Writing: WritingDetailed}, "evidence-for-and-against"},
		{"printable", Filter{PrintableOnly: true}, "values-compass"},
		{"combined", Filter{Category: "recovery-focused", Energy: EnergyLow, MaxTime: 5, Writing: WritingMinimal, PrintableOnly: true}, "halt-check-in"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if !slugs(service.Filter(test.filter))[test.want] {
				t.Fatalf("Filter(%#v) did not include %q", test.filter, test.want)
			}
		})
	}
}

func TestCatalogFilterNoResults(t *testing.T) {
	if got := DefaultCatalogService().Filter(Filter{Query: "not-present-anywhere"}); len(got) != 0 {
		t.Fatalf("Filter() returned %d results, want 0", len(got))
	}
}

func TestParseFilter(t *testing.T) {
	filter := ParseFilter(map[string][]string{
		"q":         {" grounding "},
		"category":  {"grounding"},
		"energy":    {"low"},
		"maxTime":   {"10"},
		"writing":   {"minimal"},
		"printable": {"true"},
	})
	if filter.Query != "grounding" || filter.Category != "grounding" || filter.Energy != EnergyLow || filter.MaxTime != 10 || filter.Writing != WritingMinimal || !filter.PrintableOnly {
		t.Fatalf("ParseFilter() = %#v", filter)
	}
}
