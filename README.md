# AI Football Chat Room

A real-time, multi-channel chat application with AI-powered discussion about football/soccer. Built with React, Vite, and a provider-agnostic AI adapter that supports **Perplexity** (recommended) or **Google Gemini**.

## Features

- 🎯 **Three football-focused channels**: Match analysis, transfer talk, matchday chat
- 🤖 **Pluggable AI providers**: Switch between Perplexity and Gemini with environment variables
- 💬 **Real-time pub/sub chat**: BroadcastChannel API for instant message delivery
- ⚽ **Football expertise**: AI personas optimized for tactical analysis and fan discussion
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
└── index.ts             # Auto-detection & initialization
prompts/
└── football.ts          # AI personas: expert analyst, fan forum, default
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

- **match-analysis**: Tactical breakdowns, xG, lineups, key moments
- **transfer-talk**: Rumors, confirmed moves, transfer strategy
- **matchday-chat**: Live reactions, chants, play-by-play fan commentary

## AI Personas

The AI responds with one of three personas:

- **Expert Analyst**: Data-driven, tactical, focused on formations and player stats
- **Engaging Fan**: Enthusiastic, passionate, banter-focused, fun discussion
- **Default**: Balanced knowledge with casual conversation (currently active)

To change the persona, edit `prompts/football.ts` and rebuild.

## Troubleshooting

- **"No AI provider configured"**: Ensure `.env.local` has either `GEMINI_API_KEY` or `PERPLEXITY_API_KEY`
- **API errors in console**: Check that your API key is valid and has not expired
- **Messages not appearing**: Ensure you're in the same browser (BroadcastChannel API limitation)
- **CORS issues**: Both Perplexity and Gemini support cross-origin requests from modern browsers

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
