# Serious Business — seriousbusiness.ai

## Stack
- Next.js
- Tailwind CSS
- Anthropic Claude API (claude-haiku-4-5-20251001)
- Resend (transactional email)
- Vercel (hosting)

## Branch Structure
- main → production → seriousbusiness.ai
- dev → preview → [vercel preview URL]

## Local Development
```bash
npm install
npm run dev
```
Site runs at localhost:3000

## Environment Variables
Required in .env.local:
```
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NOTIFICATION_EMAIL=todd@seriousbusiness.ai
```

## Routes
- `/` — Home / About / Services
- `/contact` — SeriousBot intake page
- `/api/chat` — Claude API route (server-side)
- `/api/notify` — Email notification route

## SeriousBot
- Conversation flow: `/pages/api/chat.ts`
- System prompt: Defined in `/pages/api/chat.ts`
- Model: claude-haiku-4-5-20251001
- Max tokens: 150
- Session cap: 5-7 exchanges
- Input limit: 500 characters

## Deployment
- Push to dev → Vercel preview auto-deploys
- Push to main → Vercel production auto-deploys
- No manual steps required
# Test rebuild
