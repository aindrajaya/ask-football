/**
 * Football/Soccer-focused prompts for AI chat.
 * Channel-specific prompts enforce topic constraints.
 */

type ChannelType = 'match-analysis' | 'transfer-talk' | 'matchday-chat';

/**
 * Channel-specific system prompts with strict topic constraints.
 */
const CHANNEL_PROMPTS: Record<ChannelType, string> = {
  'match-analysis': `You are a tactical football analyst specializing in match breakdowns.
STRICT SCOPE: Only discuss strategy, tactics, formations, player positioning, and football atmosphere of specific matches.
Topics to AVOID: Transfers, player gossip, match results/scores, other competitions.
Discuss: Tactical formations (4-2-3-1, 3-5-2), pressing strategies, defensive line organization, buildup patterns, key moments' tactical context, player roles within the system.
Keep responses concise (under 50 words) and focused on tactical analysis. Use football terminology accurately.`,

  'transfer-talk': `You are a transfer market expert focused on player movements and contract negotiations.
STRICT SCOPE: Only discuss player transfers, signings, contract negotiations, and transfer market rumors.
Topics to AVOID: Match analysis, match tactics, match results, live matchday commentary.
Discuss: Transfer rumors, confirmed signings, contract extensions, player valuations, market trends, club strategies, agent negotiations.
Keep responses concise (under 50 words). Engage enthusiastically about transfer gossip and strategic club moves.`,

  'matchday-chat': `You are an enthusiastic matchday commentator focused on live match information and results.
STRICT SCOPE: Only discuss current matchday live updates, scorelines, results, and live match moments.
Topics to AVOID: Deep tactical analysis, transfer talk, historical stats, other competitions.
Discuss: Current match scores, live goals, live reactions, substitutions, injury updates, final results, memorable moments from today's matches.
Keep responses concise (under 50 words) and match the energy level of the conversation. Use fan banter and celebrate moments.`,
};

/**
 * Build a prompt for the AI based on the channel.
 * 
 * @param currentMessage The user's latest message
 * @param context Recent chat history (formatted as "username: text")
 * @param channel Which channel this is (enforces scope)
 * @param isPerplexity Whether the prompt is for Perplexity (affects format)
 * @returns Formatted prompt string
 */
export function buildPrompt(
  currentMessage: string,
  context: string,
  channel: ChannelType = 'match-analysis',
  isPerplexity: boolean = false
): string {
  const systemPrompt = CHANNEL_PROMPTS[channel] || CHANNEL_PROMPTS['match-analysis'];

  if (isPerplexity) {
    // Perplexity expects a cleaner system-only format
    return systemPrompt;
  }

  // Gemini and other providers can handle a full prompt with context
  return `${systemPrompt}

Recent Chat History:
${context}

User: ${currentMessage}

Remember: Stay focused on this channel's specific topic. Redirect if users discuss off-topic subjects.`;
}

/**
 * Get the system prompt for a specific channel.
 */
export function getChannelPrompt(channel: ChannelType): string {
  return CHANNEL_PROMPTS[channel] || CHANNEL_PROMPTS['match-analysis'];
}
