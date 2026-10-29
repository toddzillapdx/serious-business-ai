# White-Label Intake Kit

A drop-in AI chat intake. A visitor chats with a Claude-powered bot, confirms their name/email, and the operator gets a formatted lead email with summary and full transcript. One codebase serves any number of clients; each client is one config file.

Extracted from the Serious Business site (Off The Hook Seafood, Ottoman Empire, and Serious Business all run on this pattern).

## How it works

```
Visitor -> /chat?client=<id>  -> pages/chat.tsx (loads that client's config, renders branded chat)
                                   |  POST /api/chat  { clientId, messages }
                                   v
                              pages/api/chat.ts
                                   |  Claude replies one question at a time using the client's systemPrompt
                                   |  Bot says its closing line -> API extracts name/email/summary
                                   v
                              "Confirm your details" screen (visitor can edit)
                                   |  POST /api/chat { confirm: true, ... }
                                   v
                              Lead email via Resend -> client's notificationEmail
```

The chat is "complete" when the bot's reply contains one of the client's `closingPhrases`. That is the single coupling to be careful with (see Gotchas).

## What's in the kit

| Path | Purpose |
|---|---|
| `pages/chat.tsx` | The branded chat UI, confirm/edit step, mobile layout. Reads `?client=` |
| `pages/api/chat.ts` | Claude conversation, lead extraction, lead email, optional rate limiting |
| `config/clients/_template.ts` | Annotated starting point for a new client |
| `config/clients/example.ts` | A working sample client |
| `config/clients/index.ts` | Client registry (two maps) |
| `pages/index.tsx`, `_app.tsx`, `styles/globals.css` | Minimal shell, font, base styles |
| `.env.example` | Every environment variable |

## Run it locally

```bash
cd whitelabel-kit        # or wherever you copy it
npm install
cp .env.example .env.local   # fill in ANTHROPIC_API_KEY, RESEND_API_KEY, EMAIL_FROM
npm run dev
# open http://localhost:3000/chat?client=example
```

Resend's sandbox sender (`onboarding@resend.dev`) only delivers to the email on your Resend account, which is enough for testing.

## Add a client (about 5 minutes)

1. `cp config/clients/_template.ts config/clients/acme.ts`
2. Edit it: names, operator, branding colors, greeting, system prompt, `notificationEmail`.
3. Register it in `config/clients/index.ts`: one line in `CLIENT_CONFIGS`, one in `CLIENT_LOADERS`.
4. Put the logo in `public/` and set `branding.logoUrl` (e.g. `"/acme-logo.png"`).
5. Visit `/chat?client=acme` and run a full test conversation through to the email.

### Config fields

| Field | Notes |
|---|---|
| `businessName`, `botName` | Page title, header, email header |
| `operatorName`, `followUpTimeframe` | Injected into the system prompt and the confirmation screen |
| `notificationEmail` | String or array. Use an env var so you don't commit addresses |
| `collectPhone` | Adds a phone field to the confirm step. Also ask for it in the prompt |
| `branding.*` | `primaryColor`, `accentColor`, `backgroundColor`, `logoUrl`, `faviconUrl` |
| `greeting` | First bot message |
| `closingPhrases` | Strings that mark the intake as finished. Must appear in the bot's closing line |
| `systemPrompt(operatorName, followUpTimeframe)` | The whole conversation design |

## Deploy (Vercel)

1. Import the repo (set Root Directory to `whitelabel-kit` if it lives in a subfolder).
2. Add the env vars from `.env.example` for Production and Preview.
3. In Resend, verify the sending domain, then set `EMAIL_FROM` to an address on it.
4. Embed on a client's site with a link or iframe to `https://<your-app>/chat?client=<id>`.

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Claude API |
| `RESEND_API_KEY` | yes | Lead email |
| `EMAIL_FROM` | yes in prod | Sender on a Resend-verified domain |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | no | Per-IP rate limiting. Skipped if unset |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-haiku-4-5-20251001` |
| client email vars | per client | Whatever your configs reference, e.g. `EXAMPLE_LEAD_EMAIL` |

## Gotchas

- **Closing phrase mismatch is the #1 failure.** If the bot's closing sentence doesn't contain one of `closingPhrases`, the confirm step never appears and no lead email is sent. After editing a prompt, always test a full conversation.
- **Two registries.** A new client must be added to both `CLIENT_CONFIGS` (server) and `CLIENT_LOADERS` (browser). Missing the first gives a 400 "Unknown client"; missing the second gives "Not found".
- **Replies are capped at 150 tokens** (`max_tokens` in `pages/api/chat.ts`) to keep the bot terse. Raise it if your prompt needs longer answers.
- **Transcript and user input are HTML-escaped** in the lead email. The conversation is attacker-controlled, so keep that.
- **Rate limits** are 100 messages/hour and 20 submissions/day per IP per client (constants at the top of `pages/api/chat.ts`). Tighten for production.
- **Lead emails fail loudly**: if Resend rejects the send, the visitor sees an error rather than a false "sent". Check Vercel logs for `[chat] Lead email failed`.
- The model can occasionally mis-extract the email from the transcript; that is why the visitor confirms and can edit before anything is sent.

## Differences from the original Serious Business code

Cleaned up for reuse: no hardcoded operator name or sender domain, the client registry replaces per-file imports, the whitelabel client is no longer missing from the API route, Redis is optional, lead-email HTML is escaped, and a failed email send is reported instead of swallowed. The legacy `/api/notify` route and single-bot `/contact` page were left out.

## Handoff checklist

- [ ] Own Anthropic and Resend accounts/keys (don't reuse another employer's or client's)
- [ ] Confirm you're allowed to reuse this code in your work repo
- [ ] Rewrite `_template.ts` prompt for the new use case and test end to end
- [ ] Verify the sending domain in Resend
- [ ] Decide data handling: transcripts contain personal info and go to email; add a privacy notice if needed
