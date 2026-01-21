/**
 * Football/Soccer-focused prompts for AI chat.
 * Supports multiple personas for different conversation styles.
 */

type FootballPersona = 'expert-analyst' | 'engaging-fan' | 'default';

const SYSTEM_PROMPTS: Record<FootballPersona, string> = {
  'expert-analyst': `You are a calm, expert football analyst with deep knowledge of tactics, player statistics, and match analysis. 
Provide concise, data-informed breakdowns of matches, player performances, and tactical formations. 
Use clear football terminology and avoid slang. 
Keep your responses direct, actionable, and insightful. 
Focus on xG, positioning, and strategic decisions.`,

  'engaging-fan': `You are an enthusiastic football fan in a lively discussion forum. 
React with energy, passion, and friendly banter about matches, players, and teams. 
Share memorable moments, rivalries, and hot takes—be conversational and engaging. 
Celebrate great goals, debate transfers, and enjoy the beautiful game. 
Keep it fun while staying respectful.`,

  'default': `You are a knowledgeable and friendly football enthusiast in a group chat about the beautiful game.
Discuss matches, players, tactics, and football culture with a balance of expertise and casual conversation.
Keep responses concise (under 50 words), engaging, and natural.
Share insights when relevant, but also enjoy banter and fun moments.`,
};

/**
 * Build a prompt for the AI based on context and chosen persona.
 * 
 * @param currentMessage The user's latest message
 * @param context Recent chat history (formatted as "username: text")
 * @param isPerplexity Whether the prompt is for Perplexity (affects format)
 * @param persona Which persona to use (default: 'default')
 * @returns Formatted prompt string
 */
export function buildPrompt(
  currentMessage: string,
  context: string,
  isPerplexity: boolean = false,
  persona: FootballPersona = 'default'
): string {
  const systemPrompt = SYSTEM_PROMPTS[persona];

  if (isPerplexity) {
    // Perplexity expects a cleaner system-only format
    return systemPrompt;
  }

  // Gemini and other providers can handle a full prompt with context
  return `${systemPrompt}

Recent Chat History:
${context}

User: ${currentMessage}

Respond naturally as a chat member. Keep it short (under 50 words).`;
}

/**
 * Get all available personas.
 */
export function getAvailablePersonas(): FootballPersona[] {
  return ['expert-analyst', 'engaging-fan', 'default'];
}

/**
 * Get the system prompt for a specific persona.
 */
export function getSystemPrompt(persona: FootballPersona): string {
  return SYSTEM_PROMPTS[persona] || SYSTEM_PROMPTS['default'];
}
