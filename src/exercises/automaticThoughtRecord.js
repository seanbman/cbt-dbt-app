export const automaticThoughtRecord = {
  id: 'automatic-thought-record',
  slug: 'automatic-thought-record',
  title: 'Automatic Thought Record',
  summary: 'Flagship CBT worksheet for identifying moods, automatic thoughts, evidence, and a balanced alternative thought.',
  description: 'A structured CBT thought record that helps users slow down, name the situation, select multiple emotions, examine the automatic thought, and re-rate mood intensity after building a more balanced thought.',
  categoryIds: ['cbt-based', 'thought-reflection', 'emotional-regulation'],
  tags: ['automatic thoughts', 'thought record', 'CBT', 'emotion wheel', 'balanced thought'],
  helpfulFor: ['anxiety', 'shame', 'anger', 'depression spirals', 'self-criticism', 'conflict'],
  avoidWhen: ['immediate danger or crisis', 'when writing increases distress', 'when reality-testing becomes rumination'],
  timeMinutes: 20,
  energyRequired: 'medium',
  writingLevel: 'moderate',
  intensityRange: ['low', 'medium', 'high'],
  printable: true,
  sourceNotes: ['Original CBT-style worksheet content drafted for the app. Review wording before publication.'],
  licenseStatus: 'original-draft',
  steps: [
    { id: 'situation', title: 'Situation', instruction: 'Describe what happened in concrete terms.', prompt: 'Where were you, who was involved, and what happened?', inputType: 'long-text' },
    { id: 'moods', title: 'Moods and emotions', instruction: 'Use the emotion wheel as a reference and select every mood that fits.', prompt: 'What emotions showed up, and how intense were they?', inputType: 'emotion-wheel' },
    { id: 'automaticThought', title: 'Automatic thought', instruction: 'Capture the first thought, image, prediction, or meaning that showed up.', prompt: 'What went through your mind?', inputType: 'long-text' },
    { id: 'evidenceFor', title: 'Evidence for', instruction: 'List facts that seem to support the automatic thought.', prompt: 'What facts support this thought?', inputType: 'long-text' },
    { id: 'evidenceAgainst', title: 'Evidence against', instruction: 'List facts that do not fit the thought or point another way.', prompt: 'What facts do not support this thought?', inputType: 'long-text' },
    { id: 'balancedThought', title: 'Balanced alternative thought', instruction: 'Write a thought that is honest, complete, and less extreme.', prompt: 'What is a more balanced way to understand this?', inputType: 'long-text' },
    { id: 'rerate', title: 'Re-rate mood', instruction: 'Notice whether the intensity changed after the balanced thought.', prompt: 'How intense are the selected moods now?', inputType: 'mood-rerate' },
  ],
};

export const emotionWheelGroups = [
  {
    core: 'Sad',
    moods: ['Lonely', 'Grieving', 'Rejected', 'Hopeless', 'Disappointed', 'Empty', 'Ashamed', 'Guilty'],
  },
  {
    core: 'Angry',
    moods: ['Irritated', 'Frustrated', 'Resentful', 'Jealous', 'Betrayed', 'Disrespected', 'Defensive', 'Enraged'],
  },
  {
    core: 'Scared',
    moods: ['Anxious', 'Worried', 'Panicked', 'Insecure', 'Threatened', 'Overwhelmed', 'Vulnerable', 'Powerless'],
  },
  {
    core: 'Happy',
    moods: ['Calm', 'Hopeful', 'Proud', 'Connected', 'Grateful', 'Relieved', 'Confident', 'Content'],
  },
  {
    core: 'Disgusted',
    moods: ['Repulsed', 'Judgmental', 'Avoidant', 'Contemptuous', 'Uncomfortable', 'Distrustful'],
  },
  {
    core: 'Surprised',
    moods: ['Confused', 'Shocked', 'Curious', 'Amazed', 'Startled', 'Uncertain'],
  },
  {
    core: 'Numb',
    moods: ['Detached', 'Flat', 'Frozen', 'Distant', 'Checked out', 'Foggy'],
  },
];

export const emptyThoughtRecord = {
  situation: '',
  automaticThought: '',
  evidenceFor: '',
  evidenceAgainst: '',
  balancedThought: '',
  selectedMoods: {},
  reratedMoods: {},
  notes: '',
};
