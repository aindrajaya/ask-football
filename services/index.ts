import { aiClient } from './aiClient';
import { geminiProvider } from './adapters/gemini';
import { perplexityProvider } from './adapters/perplexity';

/**
 * Initialize the AI client with the first available provider.
 * Priority: Perplexity > Gemini
 * 
 * This function is called at app startup to configure the active provider.
 */
export function initializeAIClient(): string {
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  if (perplexityKey) {
    aiClient.setProvider(perplexityProvider);
    console.log('✓ Using Perplexity AI as the active provider');
    return 'perplexity';
  } else if (geminiKey) {
    aiClient.setProvider(geminiProvider);
    console.log('✓ Using Gemini as the active provider');
    return 'gemini';
  } else {
    console.warn('⚠ No AI provider configured. Please set PERPLEXITY_API_KEY or GEMINI_API_KEY in .env.local');
    return 'none';
  }
}

/**
 * Export the initialized client for use in components.
 */
export { aiClient };
