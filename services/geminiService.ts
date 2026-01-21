import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
// In a real app, ensure this is handled securely (e.g., via backend proxy) 
// but for client-side demos with user-provided keys, this is acceptable.
let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateAIResponse = async (
  currentMessage: string, 
  history: Message[]
): Promise<string> => {
  if (!ai) {
    return "Error: API Key is missing. Please check your environment configuration.";
  }

  try {
    // Convert chat history to a simplified prompt format
    const context = history.slice(-10).map(msg => 
      `${msg.sender.username}: ${msg.text}`
    ).join('\n');

    const prompt = `
      You are a helpful, witty, and concise participant in a group chat.
      
      Recent Chat History:
      ${context}
      
      User: ${currentMessage}
      
      Respond naturally as a chat member. Keep it short (under 50 words).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "I'm speechless!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now.";
  }
};
