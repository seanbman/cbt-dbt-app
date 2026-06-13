package exercises

const originalSourceNote = "Original app content informed by broadly established self-reflection and coping-skill concepts. Review for wording and attribution before publication."

func step(id, title, instruction, prompt string, input ExerciseInputType) ExerciseStep {
	return ExerciseStep{ID: id, Title: title, Instruction: instruction, Prompt: prompt, InputType: input}
}

func exercise(id, title, summary, description string, categories, tags, helpful, avoid []string, minutes int, energy EnergyLevel, writing WritingLevel, steps []ExerciseStep) Exercise {
	return Exercise{ID: id, Slug: id, Title: title, Summary: summary, Description: description, CategoryIDs: categories, Tags: tags, IntensityRange: []IntensityLevel{IntensityLow, IntensityMedium}, TimeMinutes: minutes, EnergyRequired: energy, WritingLevel: writing, HelpfulFor: helpful, AvoidWhen: avoid, Steps: steps, Printable: true, SourceNotes: []string{originalSourceNote}, LicenseStatus: LicenseOriginalDraft}
}

var Catalog = []Exercise{
	nextManageableStep,
	pauseAndDescribeFacts,
	thoughtCheck,
	evidenceForAndAgainst,
	whatIsInMyControl,
	urgeWaveObservation,
	delayAndDecide,
	valuesCompass,
	haltCheckIn,
	oppositeActionPlanning,
	fiveSensesGrounding,
	selfCompassionReset,
}
