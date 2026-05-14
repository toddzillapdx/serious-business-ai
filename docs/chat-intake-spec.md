# Chat Intake — Feature Specification

## Overview

A conversational intake widget embedded on a contact page. An AI agent (the "bot") conducts a structured interview with the visitor, collects contact details, and — after the visitor confirms their information — delivers a formatted lead notification to the operator. No forms. No funnels. One focused conversation.

---

## Goals

- Replace a static contact form with a low-friction, conversational experience
- Ensure every lead submission includes a name, email, and a useful problem summary
- Give the visitor a moment to verify their details before anything is sent
- Deliver a clean, actionable notification to the operator with full context

---

## Conversation Flow

The bot conducts the intake in a fixed sequence. One question at a time. Short responses only (1–3 sentences).

### Question Order

| Step | Bot collects | Example bot message |
|------|-------------|---------------------|
| 1 | Problem / use case | "Tell me what's not working — or what you're trying to build." |
| 2 | Current state | "What's your current setup — team size, tech stack, and the main blocker?" |
| 3 | Timeline & budget | "What's your timeline and budget looking like?" (soft ask — visitor may skip) |
| 4 | Full name | "What's your full name?" (direct, required) |
| 5 | Email address | "And your email?" (direct, required — phone not accepted) |

### Closing

Once the bot has the problem, name, and email, it closes with a fixed phrase:

> "Got it. I'll pass this to Todd. He'll reach out within one business day."

The bot must not close until it has both name and email. If the visitor tries to end early, the bot asks for the missing field before wrapping up.

### Bot Persona

- Name: SeriousBot
- Tone: direct, curious, efficient — no fluff, no apologies, no canned phrases
- Never offers to do things itself; always routes to the operator
- Does not repeat itself or paraphrase the visitor's answers back unnecessarily

---

## UI / UX

### Chat Window

- Fixed-height container (560px) embedded in the contact page
- Header bar: bot name, version label, green "Online" indicator
- Message area: scrollable, timestamps on each bubble, session start label
- Visitor messages: right-aligned, dark background
- Bot messages: left-aligned, white background with border
- Typing indicator: three animated dots while the bot is responding

### Input Area States

The bottom of the chat window has three distinct states:

**1. Active conversation**
Free-text input field + "Send →" button. Enter key submits.

**2. Confirmation panel** (shown after bot closes)
Displays captured NAME and EMAIL with two actions:
- **"Looks good →"** — submits to the operator
- **"Edit"** — switches to inline edit mode for both fields

If extraction failed or fields look invalid, edit mode is shown automatically so the visitor can fill them in.

**3. Edit mode** (within confirmation panel)
Two text inputs (name, email) with Save and Cancel buttons. Saving updates the displayed values; the visitor must then click "Looks good →" to submit.

**4. Sent state**
After confirmation, the input area is replaced with:
> "SENT — TODD WILL REACH OUT TO [EMAIL]"

---

## API

### `POST /api/chat`

Handles all chat interactions. Three modes, distinguished by request body shape.

#### Mode 1 — Regular message

```json
{
  "messages": [
    { "role": "bot", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

Full conversation history is passed on every turn. The API strips the initial bot greeting (which has no corresponding user message) before forwarding to the model, since the Anthropic API requires conversations to start with a user turn.

**Response:**
```json
{
  "message": "Bot reply text",
  "isComplete": false
}
```

When `isComplete` is `true`, the response also includes:
```json
{
  "message": "Got it. I'll pass this to Todd...",
  "isComplete": true,
  "capturedName": "Jane Smith",
  "capturedEmail": "jane@example.com",
  "transcript": "Visitor: ...\nSeriousBot: ...",
  "summary": "Jane is building an AI customer support tool..."
}
```

The email is **not sent** at this point. The frontend holds this data until the visitor confirms.

#### Mode 2 — Confirmation

```json
{
  "confirm": true,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "summary": "...",
  "transcript": "..."
}
```

Sends the lead notification email and increments the per-IP conversation rate limit.

**Response:**
```json
{ "confirmed": true }
```

#### Mode 3 — Initial greeting (optional)

```json
{ "isInitial": true }
```

Returns the opening message without calling the model. Useful for pre-fetching the greeting before the visitor types.

---

## Completion Detection

The API detects conversation end by scanning the bot's response for any of these phrases:

- `"pass this to Todd"`
- `"reach out within one business day"`
- `"pass your information to Todd"`
- `"pass this along to Todd"`
- `"get this to Todd"`
- `"I'll let Todd know"`
- `"within one business day"`

The system prompt instructs the model to use the exact closing phrase, so the primary trigger is reliable. The additional phrases are fallbacks in case the model varies its wording.

---

## Data Extraction

When the conversation completes, a second model call extracts structured fields from the full transcript:

| Field | Description |
|-------|-------------|
| `name` | Visitor's full name |
| `contact` | Email address |
| `summary` | 1–2 sentence summary of problem, timeline, and budget |

The bot's closing message is included in the transcript before extraction so the model has full context.

If extraction fails (API error, parse error), `isComplete: true` is still returned with blank fields. The frontend detects blank or fallback values (`"Unknown"`, `"Not provided"`) and automatically opens edit mode so the visitor can fill in their details before confirming.

---

## Lead Notification Email

Sent to the operator after the visitor clicks "Looks good →". Delivered via Resend from `bot@[domain]`.

**Subject:** `New Lead: [Name] — [Date]`

**Body structure:**
- Header block (dark background): "SERIOUSBOT INTAKE / New Lead"
- Structured table: NAME, CONTACT, SUMMARY
- Full transcript in monospace
- Conversation ID + ISO timestamp footer

---

## Rate Limiting

Implemented with Upstash Redis. Fails open (requests allowed) if Redis is unavailable.

| Limit | Scope | Window |
|-------|-------|--------|
| 10 messages | Per IP | 1 hour |
| 3 confirmed submissions | Per IP | 24 hours |

The message limit applies to all chat turns. The submission limit applies only when the visitor clicks "Looks good →" — not when the conversation completes.

If the message limit is hit, the API returns HTTP 429 with a user-facing message. If the submission limit is hit, the API returns `confirmed: false` with a soft message ("you've already submitted a few times today").

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router or Pages Router) |
| AI model | Claude Haiku (via Anthropic SDK) |
| Email | Resend |
| Rate limiting | Upstash Redis |
| Styling | Inline styles, IBM Plex Mono + Exo 2 fonts |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `RESEND_API_KEY` | Resend API key |
| `TODD_EMAIL` | Operator email address (defaults to `todd@seriousbusiness.ai`) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token |

---

## Design Principles

1. **No email sent without consent.** The visitor sees their name and email before anything is delivered to the operator. They can correct either field.
2. **Fail open on infrastructure errors.** Redis failures allow requests through. Extraction failures still return `isComplete: true`. The visitor is never stuck.
3. **Operator gets full context.** The notification email includes both a structured summary and the raw transcript. No information is lost.
4. **One question at a time.** The bot never asks multiple things in a single message, keeping the conversation focused and easy to respond to on mobile.
5. **Minimal UI, maximum signal.** No branding noise, no progress bars, no "powered by" footers. The design defers to the conversation.
