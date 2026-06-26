export const categories = [
  { id: 'cbt-based', name: 'CBT-based', description: 'Reflect on thoughts, interpretations, and practical next steps.' },
  { id: 'dbt-informed', name: 'DBT-informed', description: 'Practice mindful pauses and emotional-regulation skills.' },
  { id: 'recovery-focused', name: 'Recovery-focused', description: 'Support deliberate choices around urges, routines, and support.' },
  { id: 'grounding', name: 'Grounding', description: 'Reconnect with the present moment through concrete observations.' },
  { id: 'emotional-regulation', name: 'Emotional regulation', description: 'Slow down and choose a steady response to strong emotions.' },
  { id: 'thought-reflection', name: 'Thought reflection', description: 'Examine a thought with curiosity rather than treating it as a fact.' },
  { id: 'urge-management', name: 'Urge management', description: 'Create space between an urge and a decision.' },
  { id: 'values', name: 'Values', description: 'Reconnect a small action to what matters most.' },
  { id: 'planning', name: 'Planning', description: 'Turn a difficult moment into one manageable next step.' },
  { id: 'self-compassion', name: 'Self-compassion', description: 'Respond to yourself with honesty, patience, and care.' },
];

const originalSourceNote = 'Original app content informed by broadly established self-reflection and coping-skill concepts. Review for wording and attribution before publication.';

const step = (id, title, instruction, prompt, inputType) => ({ id, title, instruction, prompt, inputType });

const exercise = ({
  id,
  title,
  summary,
  description,
  categoryIds,
  tags,
  helpfulFor,
  avoidWhen,
  timeMinutes,
  energyRequired,
  writingLevel,
  steps,
}) => ({
  id,
  slug: id,
  title,
  summary,
  description,
  categoryIds,
  tags,
  helpfulFor,
  avoidWhen,
  timeMinutes,
  energyRequired,
  writingLevel,
  intensityRange: ['low', 'medium'],
  printable: true,
  sourceNotes: [originalSourceNote],
  licenseStatus: 'original-draft',
  steps,
});

export const exercises = [
  exercise({
    id: 'next-manageable-step',
    title: 'Name the next manageable step',
    summary: 'Reduce a crowded problem to one realistic action.',
    description: 'Use this short planning exercise when everything feels tangled or too large to begin.',
    categoryIds: ['planning', 'cbt-based'],
    tags: ['overwhelm', 'momentum', 'small steps'],
    helpfulFor: ['feeling stuck', 'procrastination', 'overwhelm'],
    avoidWhen: ['immediate danger or crisis'],
    timeMinutes: 5,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('name-problem', 'Name the problem', 'Describe the situation in one sentence.', 'What feels most pressing?', 'short-text'),
      step('shrink-step', 'Shrink the step', 'Choose an action that could reasonably be started within ten minutes.', 'What is the smallest useful next step?', 'short-text'),
      step('start-point', 'Choose a start point', 'Name when and where you will begin.', 'What will make starting easier?', 'short-text'),
    ],
  }),
  exercise({
    id: 'pause-and-describe-facts',
    title: 'Pause and describe the facts',
    summary: 'Separate observable facts from interpretations.',
    description: 'A DBT-informed pause that helps you describe what happened without immediately adding blame, prediction, or judgment.',
    categoryIds: ['dbt-informed', 'emotional-regulation'],
    tags: ['pause', 'facts', 'mindfulness'],
    helpfulFor: ['strong emotions', 'conflict', 'reactivity'],
    avoidWhen: ['immediate danger', 'medical emergency'],
    timeMinutes: 8,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('slow-down', 'Slow down', 'Take a few breaths and notice your contact with the ground.', 'What do you notice in the room?', 'short-text'),
      step('facts', 'List the facts', 'Write only what a camera could record.', 'What actually happened?', 'long-text'),
      step('interpretation', 'Name the interpretation', 'Notice what your mind is adding to the facts.', 'What story or meaning showed up?', 'long-text'),
    ],
  }),
  exercise({
    id: 'thought-check',
    title: 'Thought check',
    summary: 'Look at one difficult thought with curiosity.',
    description: 'This CBT-based reflection helps you notice how a thought is affecting the moment and find a more balanced statement.',
    categoryIds: ['cbt-based', 'thought-reflection'],
    tags: ['thinking', 'reframe', 'perspective'],
    helpfulFor: ['worry', 'self-criticism', 'all-or-nothing thinking'],
    avoidWhen: ['immediate crisis', 'when writing increases distress'],
    timeMinutes: 10,
    energyRequired: 'medium',
    writingLevel: 'moderate',
    steps: [
      step('thought', 'Capture the thought', 'Write the thought as it is showing up.', 'What thought is weighing on you?', 'short-text'),
      step('effect', 'Notice the effect', 'Describe what the thought makes you feel or want to do.', 'How is this thought affecting you?', 'long-text'),
      step('balanced', 'Try a balanced view', 'Write a statement that is honest without being harsh or absolute.', 'What is a fairer way to say it?', 'long-text'),
    ],
  }),
  exercise({
    id: 'evidence-for-and-against',
    title: 'Evidence for and against',
    summary: 'Test a painful belief without arguing with yourself.',
    description: 'Use this CBT-based exercise to gather evidence, notice gaps, and build a grounded next thought.',
    categoryIds: ['cbt-based', 'thought-reflection'],
    tags: ['evidence', 'belief', 'balance'],
    helpfulFor: ['catastrophizing', 'self-doubt', 'mind reading'],
    avoidWhen: ['acute crisis', 'when analysis becomes rumination'],
    timeMinutes: 15,
    energyRequired: 'medium',
    writingLevel: 'moderate',
    steps: [
      step('belief', 'Name the belief', 'Write the belief in a clear sentence.', 'What belief are you checking?', 'short-text'),
      step('for', 'Evidence for', 'List facts that seem to support it.', 'What supports this belief?', 'long-text'),
      step('against', 'Evidence against', 'List facts that do not fit or that complicate it.', 'What evidence points another way?', 'long-text'),
      step('balanced', 'Balanced statement', 'Write a more complete statement.', 'What is a steadier statement?', 'long-text'),
    ],
  }),
  exercise({
    id: 'what-is-in-my-control',
    title: 'What is in my control',
    summary: 'Sort a stressful situation into influence and release.',
    description: 'Clarify what you can act on, what you can prepare for, and what may need to be released for now.',
    categoryIds: ['cbt-based', 'planning'],
    tags: ['control', 'stress', 'action'],
    helpfulFor: ['worry', 'overwhelm', 'uncertainty'],
    avoidWhen: ['immediate safety concern'],
    timeMinutes: 10,
    energyRequired: 'low',
    writingLevel: 'moderate',
    steps: [
      step('situation', 'Name the situation', 'Write the situation briefly.', 'What is happening?', 'short-text'),
      step('control', 'Inside control', 'List actions, words, boundaries, or supports you can choose.', 'What is inside your control?', 'long-text'),
      step('outside', 'Outside control', 'Name what is not yours to control.', 'What may need to be released for now?', 'long-text'),
      step('action', 'Choose one action', 'Pick one action from the inside-control list.', 'What will you do next?', 'short-text'),
    ],
  }),
  exercise({
    id: 'urge-wave-observation',
    title: 'Urge wave observation',
    summary: 'Observe an urge as a changing experience instead of an instruction.',
    description: 'Use this recovery-focused mindful pause to notice an urge rise, shift, and pass while choosing not to act immediately.',
    categoryIds: ['recovery-focused', 'urge-management', 'dbt-informed'],
    tags: ['urge', 'craving', 'mindfulness'],
    helpfulFor: ['cravings', 'impulsive choices', 'habit loops'],
    avoidWhen: ['medical emergency', 'risk of harm', 'when extra support is needed immediately'],
    timeMinutes: 10,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('rate', 'Rate the urge', 'Give the current urge a number from 0 to 10.', 'How strong is the urge right now?', 'scale'),
      step('observe', 'Observe sensations', 'Notice where the urge shows up in your body and how it changes over a few breaths.', 'What sensations do you notice?', 'long-text'),
      step('choose', 'Choose the next minute', 'Pick one safe action that gives the urge more time to change.', 'What will you do for the next minute?', 'short-text'),
    ],
  }),
  exercise({
    id: 'delay-and-decide',
    title: 'Delay and decide',
    summary: 'Create a short buffer before making an urge-driven choice.',
    description: 'A brief delay can make space for a decision that reflects your longer-term priorities.',
    categoryIds: ['recovery-focused', 'urge-management', 'planning'],
    tags: ['delay', 'choice', 'craving'],
    helpfulFor: ['impulsive decisions', 'cravings', 'heated messages'],
    avoidWhen: ['urgent safety needs', 'situations where delay would create danger'],
    timeMinutes: 5,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('delay', 'Choose a delay', 'Pick a realistic amount of time before deciding.', 'How long will you pause?', 'short-text'),
      step('buffer', 'Choose a buffer activity', 'Name one safe activity for the pause.', 'What will you do during the delay?', 'short-text'),
      step('review', 'Review the decision', 'After the delay, check the urge and decide again.', 'What choice fits your priorities now?', 'short-text'),
    ],
  }),
  exercise({
    id: 'values-compass',
    title: 'Values compass',
    summary: 'Reconnect one decision to the kind of person you want to be.',
    description: 'Use this reflection to choose a direction when several options compete for your attention.',
    categoryIds: ['values', 'recovery-focused'],
    tags: ['values', 'direction', 'priorities'],
    helpfulFor: ['decision-making', 'motivation', 'recovery planning'],
    avoidWhen: ['immediate crisis'],
    timeMinutes: 12,
    energyRequired: 'medium',
    writingLevel: 'moderate',
    steps: [
      step('value', 'Choose a value', 'Name one quality you want to move toward.', 'What matters in this situation?', 'short-text'),
      step('action', 'Match an action', 'Choose one action that expresses that value today.', 'What small action points in that direction?', 'long-text'),
      step('obstacle', 'Plan for friction', 'Name one likely obstacle and a practical response.', 'What may get in the way?', 'long-text'),
    ],
  }),
  exercise({
    id: 'halt-check-in',
    title: 'HALT check-in',
    summary: 'Check whether basic needs may be making the moment harder.',
    description: 'Pause to notice hunger, anger, loneliness, or tiredness and choose one supportive response.',
    categoryIds: ['recovery-focused', 'emotional-regulation'],
    tags: ['HALT', 'needs', 'check-in'],
    helpfulFor: ['irritability', 'cravings', 'low resilience'],
    avoidWhen: ['medical emergency', 'immediate danger'],
    timeMinutes: 5,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('scan', 'Scan the four areas', 'Notice whether you are hungry, angry, lonely, or tired.', 'Which areas need attention?', 'checklist'),
      step('priority', 'Choose one need', 'Pick the need that seems most useful to address first.', 'What needs care first?', 'short-text'),
      step('response', 'Choose a response', 'Name one realistic action or person you can contact.', 'What supportive step can you take?', 'short-text'),
    ],
  }),
  exercise({
    id: 'opposite-action-planning',
    title: 'Opposite-action planning',
    summary: 'Plan one steady action that moves against an unhelpful impulse.',
    description: 'When an emotion urges you toward something that may make the situation worse, plan a safe opposite action.',
    categoryIds: ['dbt-informed', 'emotional-regulation', 'planning'],
    tags: ['opposite action', 'emotion', 'plan'],
    helpfulFor: ['avoidance', 'withdrawal', 'anger urges'],
    avoidWhen: ['when the emotion is protecting you from real danger'],
    timeMinutes: 12,
    energyRequired: 'medium',
    writingLevel: 'moderate',
    steps: [
      step('emotion', 'Name the emotion', 'Identify the main emotion and what it is urging.', 'What emotion is strongest?', 'short-text'),
      step('check', 'Check the facts', 'Ask whether the urge fits the facts and your goals.', 'Does the urge help or hurt here?', 'long-text'),
      step('opposite', 'Plan the opposite action', 'Choose a safe action that moves toward your goal.', 'What opposite action will you try?', 'long-text'),
    ],
  }),
  exercise({
    id: 'five-senses-grounding',
    title: 'Five-senses grounding',
    summary: 'Use your senses to come back to the present moment.',
    description: 'A simple grounding practice for moments when your mind is racing or you feel disconnected.',
    categoryIds: ['grounding', 'dbt-informed'],
    tags: ['senses', 'present moment', 'grounding'],
    helpfulFor: ['racing thoughts', 'stress', 'dissociation'],
    avoidWhen: ['unsafe surroundings', 'medical emergency'],
    timeMinutes: 5,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('see', 'Notice what you see', 'Name five things you can see.', 'What do you see?', 'long-text'),
      step('feel', 'Notice touch', 'Name four things you can physically feel.', 'What can you feel?', 'long-text'),
      step('hear', 'Notice sound', 'Name three sounds, two smells, and one taste or breath sensation.', 'What else do you notice?', 'long-text'),
    ],
  }),
  exercise({
    id: 'self-compassion-reset',
    title: 'Self-compassion reset',
    summary: 'Respond to yourself with honesty and care.',
    description: 'Use this reset when shame or harsh self-talk is making it harder to take the next useful step.',
    categoryIds: ['self-compassion', 'emotional-regulation'],
    tags: ['self-talk', 'shame', 'care'],
    helpfulFor: ['shame', 'setbacks', 'self-criticism'],
    avoidWhen: ['immediate crisis', 'when you need outside support now'],
    timeMinutes: 8,
    energyRequired: 'low',
    writingLevel: 'minimal',
    steps: [
      step('name', 'Name the hard thing', 'Acknowledge what happened without attacking yourself.', 'What is hard right now?', 'short-text'),
      step('human', 'Remember common humanity', 'Remind yourself that struggle and imperfection are part of being human.', 'What would you say to a friend in this situation?', 'long-text'),
      step('care', 'Choose one caring step', 'Pick one action that supports repair or steadiness.', 'What caring step can you take?', 'short-text'),
    ],
  }),
];

export const categoryById = new Map(categories.map((category) => [category.id, category]));

export function findExerciseBySlug(slug) {
  return exercises.find((exerciseItem) => exerciseItem.slug === slug) ?? null;
}

const normalize = (value) => String(value ?? '').trim().toLowerCase();

export function filterExercises(filter = {}) {
  const query = normalize(filter.query);
  const category = normalize(filter.category);
  const energy = normalize(filter.energy);
  const writing = normalize(filter.writing);
  const maxTime = Number.parseInt(filter.maxTime ?? '', 10);

  return exercises.filter((exerciseItem) => {
    if (category && !exerciseItem.categoryIds.includes(category)) return false;
    if (energy && exerciseItem.energyRequired !== energy) return false;
    if (writing && exerciseItem.writingLevel !== writing) return false;
    if (Number.isFinite(maxTime) && exerciseItem.timeMinutes > maxTime) return false;
    if (filter.printableOnly && !exerciseItem.printable) return false;

    if (!query) return true;

    const searchable = [
      exerciseItem.title,
      exerciseItem.summary,
      exerciseItem.description,
      ...exerciseItem.tags,
      ...exerciseItem.helpfulFor,
      ...exerciseItem.categoryIds.map((id) => categoryById.get(id)?.name ?? id),
    ].join(' ');

    return normalize(searchable).includes(query);
  });
}

export function validateCatalog() {
  const errors = [];
  const categoryIds = new Set(categories.map((category) => category.id));
  const seenSlugs = new Set();

  for (const category of categories) {
    if (!category.id || !category.name || !category.description) {
      errors.push(`category ${category.id || '<missing>'} is incomplete`);
    }
  }

  for (const exerciseItem of exercises) {
    if (!exerciseItem.id || !exerciseItem.slug || !exerciseItem.title || !exerciseItem.summary) {
      errors.push(`exercise ${exerciseItem.id || '<missing>'} is missing required display fields`);
    }
    if (seenSlugs.has(exerciseItem.slug)) {
      errors.push(`duplicate exercise slug ${exerciseItem.slug}`);
    }
    seenSlugs.add(exerciseItem.slug);
    for (const categoryId of exerciseItem.categoryIds) {
      if (!categoryIds.has(categoryId)) {
        errors.push(`${exerciseItem.slug} references unknown category ${categoryId}`);
      }
    }
    if (!Array.isArray(exerciseItem.steps) || exerciseItem.steps.length === 0) {
      errors.push(`${exerciseItem.slug} must include at least one step`);
    }
  }

  return errors;
}
