// Copy this file to config/clients/<clientid>.ts, then register it in config/clients/index.ts.
// Everything a client needs to differ on lives here: identity, branding, flow, and prompt.

const config = {
  // Shown in the chat header, email header, and page title
  businessName: "Acme Co",
  botName: "Acme Assistant",

  // Who the visitor is told will follow up (used in the closing line and confirmation screen)
  operatorName: "Jordan",
  followUpTimeframe: "one business day",

  // Who receives the lead email. String or array of strings. Prefer env vars over hardcoding.
  notificationEmail: process.env.EXAMPLE_LEAD_EMAIL || "leads@example.com",

  // true adds a phone field to the confirm step; your prompt must also ask for it
  collectPhone: false,

  branding: {
    primaryColor: "#111111",     // header, buttons, email header
    accentColor: "#555555",      // email section bar
    backgroundColor: "#ffffff",  // page background
    logoUrl: "",                 // e.g. "/acme-logo.png" (file in /public). Empty = bot name text
    faviconUrl: "",              // optional, falls back to /favicon.ico
    headerStyle: "dark",
  },

  greeting: "Hi, I'm the Acme Assistant. What can I help you with today?",

  // The chat flips to the "confirm your details" step when the bot's reply contains ANY of these.
  // They MUST match the closing sentence in your systemPrompt, or the lead is never sent.
  closingPhrases: [
    "pass this to Jordan",
    "within one business day",
  ],

  systemPrompt: (operatorName: string, followUpTimeframe: string) => `You are the Acme Assistant, an intake assistant for Acme Co. Add 1-2 sentences of business context here so the bot sounds informed.

Conduct the intake in this order, one question at a time, 1-3 sentences per reply:
1. What do they need help with?
2. What is their timeline and budget? (They may skip this)
3. Full name and email address (required)

Rules:
- Keep replies brief and conversational
- Never promise outcomes, pricing, or guarantees
- Never offer to do the work yourself. Route everything to ${operatorName}
- Do not close until you have name AND email
- When you have both, close with exactly: "Got it. I'll pass this to ${operatorName}. They'll reach out within ${followUpTimeframe}."`,
};

export default config;
