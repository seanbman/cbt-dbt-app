package exercises

var urgeWaveObservation = exercise(
	"urge-wave-observation",
	"Urge wave observation",
	"Observe an urge as a changing experience instead of an instruction.",
	"Use this recovery-focused mindful pause to notice an urge rise, shift, and pass while choosing not to act immediately.",
	[]string{"recovery-focused", "urge-management", "dbt-informed"},
	[]string{"urge", "craving", "mindfulness"},
	[]string{"cravings", "impulsive choices", "habit loops"},
	[]string{"medical emergency", "risk of harm", "when extra support is needed immediately"},
	10, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("rate", "Rate the urge", "Give the current urge a number from 0 to 10.", "How strong is the urge right now?", InputScale),
		step("observe", "Observe sensations", "Notice where the urge shows up in your body and how it changes over a few breaths.", "What sensations do you notice?", InputLongText),
		step("choose", "Choose the next minute", "Pick one safe action that gives the urge more time to change.", "What will you do for the next minute?", InputShortText),
	},
)

var delayAndDecide = exercise(
	"delay-and-decide",
	"Delay and decide",
	"Create a short buffer before making an urge-driven choice.",
	"A brief delay can make space for a decision that reflects your longer-term priorities.",
	[]string{"recovery-focused", "urge-management", "planning"},
	[]string{"delay", "choice", "craving"},
	[]string{"impulsive decisions", "cravings", "heated messages"},
	[]string{"urgent safety needs", "situations where delay would create danger"},
	5, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("delay", "Choose a delay", "Pick a realistic amount of time before deciding.", "How long will you pause?", InputShortText),
		step("buffer", "Choose a buffer activity", "Name one safe activity for the pause.", "What will you do during the delay?", InputShortText),
		step("review", "Review the decision", "After the delay, check the urge and decide again.", "What choice fits your priorities now?", InputShortText),
	},
)

var valuesCompass = exercise(
	"values-compass",
	"Values compass",
	"Reconnect one decision to the kind of person you want to be.",
	"Use this reflection to choose a direction when several options compete for your attention.",
	[]string{"values", "recovery-focused"},
	[]string{"values", "direction", "priorities"},
	[]string{"decision-making", "motivation", "recovery planning"},
	[]string{"immediate crisis"},
	12, EnergyMedium, WritingModerate,
	[]ExerciseStep{
		step("value", "Choose a value", "Name one quality you want to move toward.", "What matters in this situation?", InputShortText),
		step("action", "Match an action", "Choose one action that expresses that value today.", "What small action points in that direction?", InputLongText),
		step("obstacle", "Plan for friction", "Name one likely obstacle and a practical response.", "What may get in the way?", InputLongText),
	},
)

var haltCheckIn = exercise(
	"halt-check-in",
	"HALT check-in",
	"Check whether basic needs may be making the moment harder.",
	"Pause to notice hunger, anger, loneliness, or tiredness and choose one supportive response.",
	[]string{"recovery-focused", "emotional-regulation"},
	[]string{"HALT", "needs", "check-in"},
	[]string{"irritability", "cravings", "low resilience"},
	[]string{"medical emergency", "immediate danger"},
	5, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("scan", "Scan the four areas", "Notice whether you are hungry, angry, lonely, or tired.", "Which areas need attention?", InputChecklist),
		step("priority", "Choose one need", "Pick the need that seems most useful to address first.", "What needs care first?", InputShortText),
		step("response", "Choose a response", "Name one realistic action or person you can contact.", "What supportive step can you take?", InputShortText),
	},
)
