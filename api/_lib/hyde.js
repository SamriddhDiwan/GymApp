import { callGemini, generateEmbedding } from "./gemini.js";
import supabase from "../_utils/db.js";

const HYDE_SYSTEM_PROMPT = `You are a query rewriter for a fitness app's vector search.
Given the user's message, generate a short hypothetical document (1-2 sentences) describing 
what physical injuries, pain, or limitations the user might have that are relevant to this query.
If the message has nothing to do with injuries, pain, physical limitations, or exercise safety, 
respond with exactly: NONE`;

export async function retrieveConstraints(userMessage, userId) {
  // Rewrite user prompt into a hypothetical constraint document
  const hydeDoc = await rewriteQuery(userMessage);
  if (!hydeDoc) return [];

  // Embed the hypothetical document
  const embedding = await generateEmbedding(hydeDoc);

  // Vector search against user's stored constraints
  const constraints = await searchConstraints(embedding, userId);
  return constraints;
}

async function rewriteQuery(userMessage) {
  const contents = [
    { role: 'user', parts: [{ text: userMessage }] },
  ];
  const data = await callGemini(contents, HYDE_SYSTEM_PROMPT);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text || text === 'NONE') return null;
  return text;
}

async function searchConstraints(embedding, userId, topK = 3, threshold = 0.3) {
  const { data, error } = await supabase.rpc('match_user_constraints', {
    query_embedding: embedding,
    match_user_id: userId,
    match_count: topK,
    match_threshold: threshold,
  });

  if (error) {
    console.error('Vector search error:', error);
    return [];
  }

  return data.map(row => row.content);
}
