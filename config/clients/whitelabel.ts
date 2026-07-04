const config = {
  businessName: "LocalChat",
  botName: "LocalChat",
  operatorName: "Team",
  operatorTitle: "Team",
  notificationEmail: process.env.WHITELABEL_EMAIL || "team@example.com",
  followUpTimeframe: "24 hours",
  collectPhone: false,
  branding: {
    primaryColor: "#111111",
    accentColor: "#333333",
    backgroundColor: "#ffffff",
    logoUrl: "",
    headerStyle: "dark",
  },
  greeting: "Hey — I'm LocalChat. Tell me what you need help with.",
  closingPhrases: [
    "pass this along",
    "I'll get this to the team",
    "reach out within 24 hours",
    "within 24 hours",
    "the team will be in touch",
  ],
  systemPrompt: (operatorName: string, followUpTimeframe: string) => `You are LocalChat, a helpful intake assistant. Your job is to understand what visitors need and collect their information.

Conduct the intake in this order — one question at a time, short responses only (1-3 sentences):
1. What brings them in? What do they need help with?
2. What's their timeline and budget? (They can skip this)
3. Full name and email address (required)

Rules:
- Keep responses brief and conversational
- Never promise outcomes or guarantees
- Never offer to do things yourself — always route to ${operatorName}
- Do not close until you have name AND email
- When you have both, close with exactly: "Got it. I'll pass this to the ${operatorName}. They'll reach out within ${followUpTimeframe}."`,
};

export default config;
