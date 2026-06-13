package exercises

var pauseAndDescribeFacts = exercise(
	"pause-and-describe-the-facts",
	"Pause and describe the facts",
	"Separate observable facts from the story your mind is adding.",
	"A brief mindful pause can make room for a steadier response before acting on assumptions.",
	[]string{"dbt-informed", "emotional-regulation"},
	[]string{"facts", "pause", "assumptions"},
	[]string{"conflict", "strong reactions", "uncertainty"},
	[]string{"situations requiring immediate safety action"},
	7, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("pause", "Pause", "Take one slower breath and delay your response for a moment.", "", InputNone),
		step("facts", "List the facts", "Write only what a camera or recording could confirm.", "What do you directly know?", InputLongText),
		step("story", "Notice the story", "Name interpretations separately from the facts.", "What are you assuming or predicting?", InputLongText),
	},
)

var oppositeActionPlanning = exercise(
	"opposite-action-planning",
	"Opposite-action planning",
	"Plan a small action that moves against an unhelpful emotional pull.",
	"This DBT-informed exercise is a planning preview for moments when an emotion is pushing you toward a response that may make things worse.",
	[]string{"dbt-informed", "emotional-regulation", "planning"},
	[]string{"opposite action", "emotion", "behavior"},
	[]string{"avoidance", "withdrawal", "unhelpful impulses"},
	[]string{"when the emotion is warning you of real danger", "immediate crisis"},
	12, EnergyMedium, WritingModerate,
	[]ExerciseStep{
		step("emotion", "Name the emotion", "Describe the emotion and the action it is pushing you toward.", "What does the emotion want you to do?", InputLongText),
		step("check", "Check the situation", "Ask whether acting on the urge would fit the facts and your priorities.", "Would following the urge help?", InputLongText),
		step("plan", "Plan a small opposite step", "Choose a safe, realistic action that moves in a more useful direction.", "What is one opposite step?", InputLongText),
	},
)

var fiveSensesGrounding = exercise(
	"five-senses-grounding",
	"Five-senses grounding",
	"Use your senses to reconnect with the room around you.",
	"This grounding practice directs attention toward concrete details in the present moment.",
	[]string{"grounding", "dbt-informed"},
	[]string{"senses", "present moment", "calm"},
	[]string{"racing thoughts", "feeling disconnected", "stress"},
	[]string{"environments where focusing inward or pausing is unsafe"},
	5, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("see", "Notice what you see", "Name five visible details around you.", "What do you notice visually?", InputLongText),
		step("feel", "Notice touch", "Name four physical sensations, such as your feet on the floor.", "What can you physically feel?", InputLongText),
		step("hear", "Notice sounds", "Name three sounds, then add two smells and one taste if available.", "What do your senses notice?", InputLongText),
	},
)

var selfCompassionReset = exercise(
	"self-compassion-reset",
	"Self-compassion reset",
	"Respond to a hard moment with the tone you would offer someone you care about.",
	"Use this short reflection to pair honesty with patience instead of adding self-attack to an already difficult moment.",
	[]string{"self-compassion", "emotional-regulation"},
	[]string{"kindness", "self-talk", "reset"},
	[]string{"shame", "setbacks", "harsh self-talk"},
	[]string{"immediate crisis", "when reflection increases distress"},
	8, EnergyLow, WritingModerate,
	[]ExerciseStep{
		step("moment", "Name the hard moment", "Describe what happened without insulting yourself.", "What is difficult right now?", InputLongText),
		step("friend", "Use a supportive tone", "Write what you might say to a friend facing the same situation.", "What would a fair and caring response sound like?", InputLongText),
		step("care", "Choose one caring action", "Pick a small action that supports your next hour.", "What is one caring next step?", InputShortText),
	},
)
