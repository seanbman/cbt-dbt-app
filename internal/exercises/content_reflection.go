package exercises

var nextManageableStep = exercise(
	"next-manageable-step",
	"Name the next manageable step",
	"Reduce a crowded problem to one realistic action.",
	"Use this short planning exercise when everything feels tangled or too large to begin.",
	[]string{"planning", "cbt-based"},
	[]string{"overwhelm", "momentum", "small steps"},
	[]string{"feeling stuck", "procrastination", "overwhelm"},
	[]string{"immediate danger or crisis"},
	5, EnergyLow, WritingMinimal,
	[]ExerciseStep{
		step("name-problem", "Name the problem", "Describe the situation in one sentence.", "What feels most pressing?", InputShortText),
		step("shrink-step", "Shrink the step", "Choose an action that could reasonably be started within ten minutes.", "What is the smallest useful next step?", InputShortText),
		step("start-point", "Choose a start point", "Name when and where you will begin.", "What will make starting easier?", InputShortText),
	},
)

var thoughtCheck = exercise(
	"thought-check",
	"Thought check",
	"Look at one difficult thought with curiosity.",
	"This CBT-based reflection helps you notice how a thought is affecting the moment and find a more balanced statement.",
	[]string{"cbt-based", "thought-reflection"},
	[]string{"thinking", "reframe", "perspective"},
	[]string{"worry", "self-criticism", "all-or-nothing thinking"},
	[]string{"immediate crisis", "when writing increases distress"},
	10, EnergyMedium, WritingModerate,
	[]ExerciseStep{
		step("thought", "Capture the thought", "Write the thought as it is showing up.", "What thought is weighing on you?", InputShortText),
		step("effect", "Notice the effect", "Describe what the thought makes you feel or want to do.", "How is this thought affecting you?", InputLongText),
		step("balanced", "Try a balanced view", "Write a statement that is honest without being harsh or absolute.", "What is a fairer way to say it?", InputLongText),
	},
)

var evidenceForAndAgainst = exercise(
	"evidence-for-and-against",
	"Evidence for and against",
	"Test a conclusion by looking at evidence on both sides.",
	"Use this longer reflection when a belief feels certain but may not tell the whole story.",
	[]string{"cbt-based", "thought-reflection"},
	[]string{"evidence", "beliefs", "balanced thinking"},
	[]string{"catastrophizing", "certainty", "negative predictions"},
	[]string{"immediate crisis", "when detailed writing feels overwhelming"},
	15, EnergyHigh, WritingDetailed,
	[]ExerciseStep{
		step("belief", "Name the belief", "Choose one specific belief to examine.", "What conclusion are you testing?", InputShortText),
		step("for", "Evidence that supports it", "List concrete facts that support the belief.", "What evidence points this way?", InputLongText),
		step("against", "Evidence that does not support it", "List facts, exceptions, or missing information.", "What evidence points another way?", InputLongText),
		step("view", "Write a balanced conclusion", "Create a more complete view that respects both lists.", "What is a balanced conclusion?", InputLongText),
	},
)

var whatIsInMyControl = exercise(
	"what-is-in-my-control",
	"What is in my control",
	"Sort concerns into what you can influence and what you cannot.",
	"This exercise helps redirect limited energy toward useful actions without pretending every outcome is controllable.",
	[]string{"planning", "cbt-based"},
	[]string{"control", "focus", "acceptance"},
	[]string{"rumination", "uncertainty", "over-responsibility"},
	[]string{"situations requiring emergency help"},
	8, EnergyLow, WritingModerate,
	[]ExerciseStep{
		step("concern", "Name the concern", "Describe what is taking up your attention.", "What are you worried about?", InputShortText),
		step("control", "Identify your influence", "List choices, actions, or requests that are yours to make.", "What can you influence today?", InputLongText),
		step("release", "Name what is not yours", "List outcomes or other people's choices that are outside your control.", "What may need to be released for now?", InputLongText),
	},
)
