# AI Football Chat Room

A real-time, multi-channel chat application with AI-powered discussion about football/soccer. Built with React, Vite, and a provider-agnostic AI adapter that supports **Perplexity** (recommended) or **Google Gemini**.

## Features

- 🎯 **Three football-focused channels**: Match analysis, transfer talk, matchday chat
- 🤖 **Pluggable AI providers**: Switch between Perplexity and Gemini with environment variables
- 💬 **Real-time pub/sub chat**: BroadcastChannel API for instant message delivery
- ⚽ **Channel-specific AI constraints**: Each channel enforces topic-focused discussions
- 🚫 **IP-based rate limiting**: 3 messages per day per IP address with automatic daily reset
- 🎨 **Modern dark UI**: Responsive design with Tailwind CSS

## Prerequisites

- Node.js (recommended >= 16)
- npm (or pnpm/yarn)
- API key from **Perplexity** (recommended) or **Google Gemini**

## Configuration

Create a `.env.local` file in the project root with one of the following:

### Option 1: Use Perplexity AI (Recommended)

```bash
# .env.local
PERPLEXITY_API_KEY=your_perplexity_key_here
```

Get your API key: https://www.perplexity.ai/

### Option 2: Use Google Gemini

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key: https://ai.google.dev/

**Note**: The app auto-detects your provider. If both keys are set, Perplexity takes priority.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with your API key (see Configuration above)

3. Start the dev server:

```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

5. Start a chat in any channel. The AI bot will respond with football insights!

## Build & Preview

Build for production:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

## Project Architecture

```
services/
├── aiClient.ts          # Provider-agnostic AI client
├── adapters/
│   ├── gemini.ts        # Gemini API adapter
│   └── perplexity.ts    # Perplexity API adapter
├── index.ts             # Auto-detection & initialization
├── rateLimitService.ts  # IP-based rate limiting (3 msg/day)
└── pubSubService.ts     # BroadcastChannel pub/sub
prompts/
└── football.ts          # Channel-specific prompts with constraints
```

## Switching Providers

To switch from Gemini to Perplexity (or vice versa):

1. Update your `.env.local`:
   ```bash
   # Remove GEMINI_API_KEY, add PERPLEXITY_API_KEY
   PERPLEXITY_API_KEY=your_key
   ```

2. Restart the dev server:
   ```bash
   npm run dev
   ```

The app will auto-detect and use the new provider. No code changes needed.

## Channels

Each channel has dedicated topic constraints to keep discussions focused:

### 🎯 **match-analysis**
- **Scope**: Tactical breakdowns, formations, pressing strategies, player positioning
- **Discuss**: 4-2-3-1 formations, defensive organization, buildup patterns, tactical context
- **Avoid**: Transfer news, match scores, live commentary

### 💼 **transfer-talk**
- **Scope**: Player transfers, signings, contract negotiations, market trends
- **Discuss**: Transfer rumors, fee valuations, contract negotiations, club strategy
- **Avoid**: Match tactics, live scores, historical stats

### 🎯 **matchday-chat**
- **Scope**: Current matchday info, live updates, scores, and results
- **Discuss**: Live goals, substitutions, final results, memorable moments from today's matches
- **Avoid**: Deep tactical analysis, transfer news, historical data

The AI bot automatically enforces these constraints based on the active channel. This ensures focused, quality discussions in each space.

For detailed examples and customization, see [CHANNEL_CONSTRAINTS.md](CHANNEL_CONSTRAINTS.md).

## Rate Limiting

To manage API costs and prevent spam, the app enforces **3 messages per day per IP address**.

### How It Works
- **Detection**: Auto-detects your IP using the ipify API
- **Tracking**: Stores message count in browser localStorage
- **Reset**: Automatic daily reset at midnight UTC
- **Dashboard**: Real-time widget shows remaining messages

### What You'll See
- **Progress Bar**: Shows messages used (0/3 → 1/3 → 2/3 → 3/3)
- **Status Text**: "2 messages remaining today" or "Limit reached"
- **Reset Time**: Countdown to next daily reset
- **Alert**: When limit reached, shows exact reset time

### Testing/Reset
For testing purposes, you can reset your limit in the browser console:
```javascript
import { resetRateLimit } from './services/rateLimitService';
await resetRateLimit();
```

For complete technical documentation, see [RATE_LIMITING.md](RATE_LIMITING.md).

## Troubleshooting

- **"No AI provider configured"**: Ensure `.env.local` has either `GEMINI_API_KEY` or `PERPLEXITY_API_KEY`
- **API errors in console**: Check that your API key is valid and has not expired
- **Messages not appearing**: Ensure you're in the same browser (BroadcastChannel API limitation)
- **CORS issues**: Both Perplexity and Gemini support cross-origin requests from modern browsers
- **Rate limit shows "Loading..."**: Check internet connection (needs access to ipify.org)
- **Daily limit reached early**: Limit is shared across all tabs/devices on same IP address

## Deployment

1. Build the app:
   ```bash
   npm run build
   ```

2. Set environment variables in your hosting provider (Vercel, Netlify, etc.):
   - `PERPLEXITY_API_KEY` or `GEMINI_API_KEY` (whichever you use)

3. Deploy the `dist/` folder to any static host.

**⚠️ Security Note**: Never commit `.env.local` to version control. Always use provider dashboard or CI/CD secrets management for production keys.

## Learn More

- [Perplexity API Docs](https://www.perplexity.ai/)
- [Google Gemini API Docs](https://ai.google.dev/)
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
