import { Message } from "../types";

/**
 * Provider-agnostic AI client interface.
 * Abstracts away provider-specific implementation details.
 */
export interface AIProvider {
  generateResponse(currentMessage: string, history: Message[], channel: string): Promise<string>;
}

/**
 * Central AI client that delegates to the active provider.
 * Supports multiple providers (Gemini, Perplexity, etc.) via adapters.
 */
class AIClient {
  private provider: AIProvider | null = null;

  /**
   * Initialize the client with a specific provider adapter.
   */
  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  /**
   * Generate an AI response using the active provider.
   * @param currentMessage The user's message
   * @param history Chat history for context
   * @param channel The channel ID (used for channel-specific prompts)
   */
  async generateResponse(currentMessage: string, history: Message[], channel: string): Promise<string> {
    if (!this.provider) {
      return "Error: No AI provider configured. Please check your environment setup.";
    }
    return this.provider.generateResponse(currentMessage, history, channel);
  }
}

export const aiClient = new AIClient();
