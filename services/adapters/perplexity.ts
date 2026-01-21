import { AIProvider } from "../aiClient";
import { Message } from "../../types";
import { buildPrompt } from "../../prompts/football";

const API_KEY = process.env.PERPLEXITY_API_KEY || '';
const API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

/**
 * Perplexity provider adapter.
 * Handles all Perplexity-specific API calls and configuration.
 */
class PerplexityProvider implements AIProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  async generateResponse(currentMessage: string, history: Message[]): Promise<string> {
    if (!this.apiKey) {
      return "Error: Perplexity API Key is missing. Please check your environment configuration.";
    }

    try {
      // Build context from recent history
      const context = history.slice(-10).map(msg => 
        `${msg.sender.username}: ${msg.text}`
      ).join('\n');

      // Use the football prompt builder
      const systemPrompt = buildPrompt(currentMessage, context, true);

      // Prepare messages for Perplexity API (expects role/content format)
      const messages = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        {
          role: "user" as const,
          content: currentMessage,
        },
      ];

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar-pro',
          messages: messages,
          max_tokens: 100, // Keep responses concise
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Perplexity API Error:", error);
        return "Sorry, I'm having trouble connecting right now.";
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      return content || "I'm speechless!";
    } catch (error) {
      console.error("Perplexity API Error:", error);
      return "Sorry, I'm having trouble connecting to my brain right now.";
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

export const perplexityProvider = new PerplexityProvider();
