import supabase from "../_utils/db.js";
import { generateEmbedding } from "./gemini.js";

// ─── Tool declarations (sent to Gemini) ───
export const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'create_new_workout_session',
        description: 'Create a new workout for user using the exercises from exercise list provided',
        parameters: {
          type: 'OBJECT',
          properties: {
            exercises: {
              type: 'ARRAY',
              items: { type: 'STRING', description: 'The exercise ID from the available exercises list' },
              description: 'List of exercise IDs to include in the workout session',
            },
          },
          required: ['exercises'],
        },
      },
      {
        name: "save_physical_constraint",
        description: "Saves a user's injury, pain, or physical limitation to their profile.",
        parameters: {
          type: "OBJECT",
          properties: {
            constraint_text: { type: "STRING", description: "The specific injury or pain mentioned." }
          },
          required: ["constraint_text"],
        },
      },
    ],
  },
];

// ─── Which tools are handled by the frontend ───
export const TOOL_META = {
  create_new_workout_session: { ui_tool: true },
};

// ─── Backend tool execution ───
export async function executeToolCall(name, args, userId) {
  switch (name) {
    case 'save_physical_constraint':
      return await saveUserConstraint(userId, args.constraint_text);
    default:
      return { success: false, error: `Unknown tool: ${name}` };
  }
}

async function saveUserConstraint(userId, constraintText) {
  const vectorData = await generateEmbedding(constraintText);

  const { error } = await supabase.rpc(
    'upsert_constraints',{
      p_user_id: userId,
      p_content: constraintText,
      p_embedding: vectorData,
      p_threshold:0.9
    }
  );

  if (error) throw error;
  return { success: true };
}
