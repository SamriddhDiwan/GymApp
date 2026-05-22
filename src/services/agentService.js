// src/services/agentService.js
import apiService from './api';

class AgentService {
  constructor() {
    this.conversationHistory = [];
  }

  async sendMessage(message) {
    // Keep last 6 messages only — controls token size
    const recentHistory = this.conversationHistory.slice(-6);
    console.log(message);
    const data = await apiService.makeRequest('/agent', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationHistory: recentHistory,
      }),
    });
    //forward the UI call to the Modal
    if(data.type==='ui_tool'){
      return data;
    }
    // Save to local history for context
    this.conversationHistory.push(
      { role: 'user', content: message },
      { role: 'assistant', content: data.message }
    );
    return data; 
  }
  async resumeWithToolResult(originalMessage, toolName, toolResult) {
    // Now commit the original exchange to history with tool context
    this.conversationHistory.push(
        { role: 'user', content: originalMessage },
        // tool result as plain assistant message so LLM has context
        { role: 'assistant', content: `I opened ${toolName} for you.` }
    );

    // TODO Phase 2: proper /resume endpoint with full tool_call state
    // For now just let the user continue naturally
    return { message: toolResult.success ? "Done! Anything else?" : "Something went wrong." };
}
  clearHistory() {
    this.conversationHistory = [];
  }
}

export default new AgentService();