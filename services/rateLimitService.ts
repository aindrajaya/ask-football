/**
 * Rate limiting service for chat messages.
 * Restricts each IP address to 3 messages per day.
 */

const RATE_LIMIT = 3; // Messages per day
const IP_CACHE_KEY = 'app_user_ip';
const MESSAGE_COUNT_PREFIX = 'chat_messages_';

interface RateLimitStatus {
  canChat: boolean;
  messagesRemaining: number;
  messagesUsed: number;
  resetTime: string;
}

/**
 * Get user's IP address from ipify API
 */
async function getUserIP(): Promise<string> {
  try {
    // Check cache first
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (cached) {
      return cached;
    }

    // Fetch from ipify API
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
    });
    const data = await response.json();
    const ip = data.ip;

    // Cache for 24 hours (session-based)
    localStorage.setItem(IP_CACHE_KEY, ip);
    return ip;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    // Fallback: use a random session ID
    return `session-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Get today's date key for localStorage
 */
function getTodayKey(): string {
  const today = new Date().toISOString().split('T')[0];
  return today;
}

/**
 * Get the storage key for message count
 */
function getMessageCountKey(ip: string): string {
  return `${MESSAGE_COUNT_PREFIX}${ip}_${getTodayKey()}`;
}

/**
 * Get the reset time (midnight UTC next day)
 */
function getResetTime(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toLocaleString();
}

/**
 * Check if user can send a message
 */
export async function checkRateLimit(): Promise<RateLimitStatus> {
  try {
    const ip = await getUserIP();
    const key = getMessageCountKey(ip);
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);
    const messagesRemaining = Math.max(0, RATE_LIMIT - currentCount);
    const canChat = currentCount < RATE_LIMIT;

    return {
      canChat,
      messagesRemaining,
      messagesUsed: currentCount,
      resetTime: getResetTime(),
    };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Allow chat if rate limit check fails
    return {
      canChat: true,
      messagesRemaining: RATE_LIMIT,
      messagesUsed: 0,
      resetTime: getResetTime(),
    };
  }
}

/**
 * Increment message count for current IP
 */
export async function recordMessage(): Promise<void> {
  try {
    const ip = await getUserIP();
    const key = getMessageCountKey(ip);
    const currentCount = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (currentCount + 1).toString());
  } catch (error) {
    console.error('Failed to record message:', error);
  }
}

/**
 * Get current rate limit status
 */
export async function getRateLimitStatus(): Promise<RateLimitStatus> {
  return checkRateLimit();
}

/**
 * Reset rate limit (for testing/admin purposes)
 */
export async function resetRateLimit(): Promise<void> {
  try {
    const ip = await getUserIP();
    const key = getMessageCountKey(ip);
    localStorage.removeItem(key);
    console.log(`Rate limit reset for IP: ${ip}`);
  } catch (error) {
    console.error('Failed to reset rate limit:', error);
  }
}
