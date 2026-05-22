import { addCorsHeaders } from "./_lib/cors.js";
import authServices from "./_utils/auth.js";
import { callGemini } from "./_lib/gemini.js";
import { TOOLS, TOOL_META, executeToolCall } from "./_lib/tools.js";
import { buildSystemPrompt } from "./_lib/prompt.js";
import { retrieveConstraints } from "./_lib/hyde.js";

const MAX_TOOL_LOOPS = 5;

export default async function handler(req, res) {
  if (addCorsHeaders(req, res)) return;
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    let userId;
    try {
      const user = await authServices.verifyToken(req);
      userId = user.userId;
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    //IMPORTANT: Change this logic later !!!
    const { message, conversationHistory = [] } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }
    //We can port the frontend logic to make the code easier here
    const contents = [
      ...conversationHistory.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const constraints = await retrieveConstraints(message, userId);
    const systemPrompt = buildSystemPrompt(constraints);
    let loopContents = [...contents];

    for (let i = 0; i < MAX_TOOL_LOOPS; i++) {
      const llmData = await callGemini(loopContents, systemPrompt, TOOLS);
      const candidate = llmData.candidates?.[0]?.content;
      const parts = candidate?.parts || [];

      const functionCalls = parts.filter(p => p.functionCall);
      const textPart = parts.find(p => p.text);

      if (!functionCalls.length) {
        const reply = textPart?.text;
        if (!reply) throw new Error('Empty response from Gemini');
        return res.status(200).json({ message: reply, actions: [] });
      }

      const toolResponseParts = [];
      for (const fc of functionCalls) {
        const { name, args } = fc.functionCall;

        // UI tool — return immediately to frontend
        if (TOOL_META[name]?.ui_tool) {
          return res.status(200).json({
            type: 'ui_tool',
            tool: name,
            arguments: args,
            message: textPart?.text || null,
          });
        }

        // Non-UI tool — execute and collect result
        const result = await executeToolCall(name, args, userId);
        toolResponseParts.push({
          functionResponse: { name, response: result },
        });
      }

      loopContents = [
        ...loopContents,
        candidate,
        { role: 'user', parts: toolResponseParts },
      ];
    }

    // Exhausted max loops — force a text reply
    const finalData = await callGemini(loopContents, systemPrompt);
    const finalReply = finalData.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
    if (!finalReply) throw new Error('Empty response from Gemini after max tool loops');
    return res.status(200).json({ message: finalReply, actions: [] });

  } catch (error) {
    console.error('Agent error:', error);
    return res.status(500).json({
      message: "I'm having trouble right now. Try again in a moment.",
      actions: [],
    });
  }
}
