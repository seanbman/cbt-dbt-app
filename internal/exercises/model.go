package exercises

type IntensityLevel string

type EnergyLevel string

type WritingLevel string

type ExerciseInputType string

type LicenseStatus string

const (
	IntensityLow    IntensityLevel = "low"
	IntensityMedium IntensityLevel = "medium"
	IntensityHigh   IntensityLevel = "high"

	EnergyLow    EnergyLevel = "low"
	EnergyMedium EnergyLevel = "medium"
	EnergyHigh   EnergyLevel = "high"

	WritingMinimal  WritingLevel = "minimal"
	WritingModerate WritingLevel = "moderate"
	WritingDetailed WritingLevel = "detailed"

	InputReflection ExerciseInputType = "reflection"
	InputShortText  ExerciseInputType = "short_text"
	InputLongText   ExerciseInputType = "long_text"
	InputChoice     ExerciseInputType = "choice"
	InputScale      ExerciseInputType = "scale"
	InputChecklist  ExerciseInputType = "checklist"
	InputNone       ExerciseInputType = "none"

	LicenseOriginalDraft    LicenseStatus = "original_draft"
	LicenseOriginalReviewed LicenseStatus = "original_reviewed"
	LicenseReviewRequired   LicenseStatus = "review_required"
)

type Exercise struct {
	ID             string
	Slug           string
	Title          string
	Summary        string
	Description    string
	CategoryIDs    []string
	Tags           []string
	IntensityRange []IntensityLevel
	TimeMinutes    int
	EnergyRequired EnergyLevel
	WritingLevel   WritingLevel
	HelpfulFor     []string
	AvoidWhen      []string
	Steps          []ExerciseStep
	Printable      bool
	SourceNotes    []string
	LicenseStatus  LicenseStatus
}

type ExerciseStep struct {
	ID          string
	Title       string
	Instruction string
	Prompt      string
	InputType   ExerciseInputType
	Optional    bool
}
