import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "../aiClient";
import { Message } from "../../types";
import { buildPrompt } from "../../prompts/football";

const API_KEY = process.env.API_KEY || '';

/**
 * Gemini provider adapter.
 * Handles all Gemini-specific API calls and configuration.
 */
class GeminiProvider implements AIProvider {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    }
  }

  async generateResponse(currentMessage: string, history: Message[], channel: string): Promise<string> {
    if (!this.ai) {
      return "Error: Gemini API Key is missing. Please check your environment configuration.";
    }

    try {
      // Build context from recent history
      const context = history.slice(-10).map(msg => 
        `${msg.sender.username}: ${msg.text}`
      ).join('\n');

      // Use the football prompt builder with channel context
      const prompt = buildPrompt(currentMessage, context, channel as any, false);

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "I'm speechless!";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Sorry, I'm having trouble connecting to my brain right now.";
    }
  }

  isConfigured(): boolean {
    return !!this.ai;
  }
}

export const geminiProvider = new GeminiProvider();
