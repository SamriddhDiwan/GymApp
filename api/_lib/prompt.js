const AVAILABLE_EXERCISES = {
  chestpress: "Chest Press",
  pushups: "Push Ups",
  benchpress: "Bench Press",
  dumbbellfly: "Dumbbell Fly",
  inclinepress: "Incline Dumbbell Press",
  deadlift: "Deadlift",
  squats: "Squats",
  lunges: "Lunges",
  plank: "Plank",
  bicepcurl: "Bicep Curl",
  tricepdips: "Tricep Dips",
  pullups: "Pull Ups",
  latpulldown: "Lat Pulldown",
  shoulderpress: "Shoulder Press",
  lateralraise: "Lateral Raise",
  legpress: "Leg Press",
  calfraises: "Calf Raises",
  russiantwists: "Russian Twists",
  bicyclecrunch: "Bicycle Crunch",
  glutebridges: "Glute Bridges",
};

export function buildSystemPrompt(constraints = []) {
  const exerciseList = Object.entries(AVAILABLE_EXERCISES)
    .map(([id, name]) => `${id}: ${name}`)
    .join('\n');

  let constraintBlock = '';
  if (constraints.length) {
    constraintBlock = `\nUSER PHYSICAL CONSTRAINTS (avoid exercises that aggravate these):
${constraints.map(c => `- ${c}`).join('\n')}
`;
  }

  return `You are AX, an AI fitness coach built into a workout tracking app.

AVAILABLE EXERCISES:
${exerciseList}
${constraintBlock}
INSTRUCTIONS:
- Be concise — this is a mobile chat UI, keep replies under 100 words
- Be encouraging but honest
- Reply in plain text, no markdown formatting
- When suggesting exercises, only recommend from the available exercises listed above
- Two types are tools are provided,UI tools that can control the frontend of the users app and second that runs on backend
- When passing multiple tools to be called in one go, pass UI tools alone and only at the end of flow
`;
}
