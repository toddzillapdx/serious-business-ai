# Testing Guide — Serious Business

Comprehensive testing procedures for development and production.

## Environment Setup

```bash
# Install dependencies
npm install

# Create .env.local with test keys
cp .env.local.example .env.local
# Fill in ANTHROPIC_API_KEY and RESEND_API_KEY

# Start dev server
npm run dev
```

Server runs at `http://localhost:3000`.

---

## 1. Visual & Typography Tests

### 1.1 Home Page (`/`)

#### Hero Section
- [ ] Full viewport height (100vh)
- [ ] Black background (#000000)
- [ ] White text (#FFFFFF)
- [ ] Logo ([SB] monogram) top left
- [ ] Headline: "Digital transformation for businesses that actually need it."
  - Font: Exo 2, weight 900, all caps
  - Letter spacing: tight (-1 to -2px)
  - Color: white
- [ ] Subhead: "We help mid-sized businesses..."
  - Font: IBM Plex Mono, weight 400
  - Color: light gray
- [ ] CTA button: "Let's Talk →"
  - Background: white
  - Text: black
  - No border radius
  - Letter spacing: wide
- [ ] Button hover state: opacity change

#### About Section
- [ ] White background (#FFFFFF)
- [ ] Black text (#000000)
- [ ] Headline: "WHO WE ARE"
  - Font: Exo 2, weight 900, all caps
  - Letter spacing: tight
- [ ] Two paragraphs of body copy
  - Font: IBM Plex Mono, weight 400
  - Font size: 15px
  - Line height: 1.7
- [ ] Right column: grid pattern (ruled lines)
  - 20px grid
  - Black lines
  - Square aspect ratio

#### Services Section
- [ ] Black background (#000000)
- [ ] White text (#FFFFFF)
- [ ] 2×2 grid (desktop), single column (mobile)
- [ ] Four service blocks:
  1. OPERATIONS AUTOMATION
  2. DATA VISIBILITY
  3. CONSUMER & CITIZEN EXPERIENCE
  4. AI AUGMENTATION
- [ ] Each block has:
  - Bold Exo 2 headline
  - IBM Plex Mono descriptor
  - Thin horizontal rule (#FFFFFF) below
- [ ] Proper spacing between blocks

#### Footer
- [ ] Black background (#000000)
- [ ] White text (#FFFFFF)
- [ ] Three-column layout (desktop), single column (mobile)
  - Left: [SB] monogram
  - Center: SERIOUSBUSINESS.AI (letter-spaced)
  - Right: "Let's Talk →" (links to /contact)
- [ ] Horizontal rule above footer
- [ ] No social links, no copyright notice

### 1.2 Contact Page (`/contact`)

#### Left Column
- [ ] Headline: "Let's Talk."
  - Font: Exo 2, weight 900
  - Font size: large
  - Left-aligned
- [ ] Subhead: "SeriousBot will ask you..."
  - Font: IBM Plex Mono, weight 400
  - Color: gray (#888888)
- [ ] Three bullet points:
  - "— No sales pitch."
  - "— No commitment."
  - "— Just a real conversation."

#### Right Column (Chat Interface)
- [ ] Black border (1.5px)
- [ ] No border radius
- [ ] Header bar:
  - Black background
  - Left: [SB] monogram
  - Center: SERIOUSBOT (letter-spaced IBM Plex Mono)
  - Right: green pulse dot + "ONLINE"
- [ ] Chat messages:
  - Bot: black background, white text
  - User: white background, black border, black text
  - Font: IBM Plex Mono
- [ ] Input field:
  - Black border, no border radius
  - IBM Plex Mono font
- [ ] Send button:
  - Black fill, white arrow (→)
  - No border radius
- [ ] Typing indicator: blinking dots (no bouncing bubbles)

---

## 2. Chat Flow Tests

### 2.1 Initialization Test

```
Expected behavior:
- Page loads, chat initializes
- First message: "Hi there. I'm SeriousBot. What problem are you working on right now?"
```

### 2.2 5-Exchange Conversation Test

**Flow:**

1. **User**: "We need to automate our billing process."
   - **Expected**: SeriousBot asks follow-up question (1-3 sentences)
   
2. **SeriousBot**: "Got it. How many people are currently on your team handling billing?"
   - **User**: "About 5 people."
   
3. **SeriousBot**: "And what's your current tech stack? What systems are you using now?"
   - **User**: "We use SAP for ERP and manual spreadsheets for reporting."
   
4. **SeriousBot**: "Interesting. What's your timeline for implementing this? Are we talking weeks, months, or next year?"
   - **User**: "We'd like to get this done in the next 3-4 months."
   
5. **SeriousBot**: "And do you have a rough budget range in mind?"
   - **User**: "We're thinking somewhere between $50k-$100k."
   
6. **SeriousBot**: "Got it. I'll pass this to Todd. He'll reach out within one business day."

**Expected on completion:**
- [ ] Chat closes (input field disabled)
- [ ] Signoff message displays:
  ```
  Todd will be in touch within one business day.
  ————————————————
  SERIOUS BUSINESS
  ————————————————
  SERIOUSBUSINESS.AI
  ```
- [ ] Email sent to Todd with full transcript

### 2.3 Message Validation Test

- [ ] Empty message cannot be sent (send button disabled)
- [ ] Long messages wrap correctly
- [ ] Special characters (quotes, emojis) render safely
- [ ] Typing indicator shows while waiting for response

### 2.4 Error Handling Test

- [ ] Network error: graceful fallback message
- [ ] API error (missing key): error message in chat
- [ ] Timeout (>10s): user can retry or refresh

---

## 3. Email Notification Tests

### 3.1 Todd's Notification Email

**After conversation completes, check:**

1. [ ] Email received at `TODD_EMAIL`
2. [ ] Subject: "New SeriousBot Conversation — {conversationId}"
3. [ ] Email contains:
   - Conversation ID
   - Full transcript (user and bot messages)
   - Formatting is readable (monospace font)
   - Professional tone
4. [ ] Email is not in spam folder
5. [ ] Email sender: `SeriousBot <bot@seriousbusiness.ai>`

**Example transcript in email:**
```
Visitor: We need to automate our billing process.
SeriousBot: Got it. How many people are currently on your team handling billing?
Visitor: About 5 people.
...
```

### 3.2 Auto-Reply Email (if user provides email)

**If user provides email in chat:**

1. [ ] User receives auto-reply within 1 minute
2. [ ] Subject: "Thanks for chatting with SeriousBot"
3. [ ] Body includes:
   - "Thanks for chatting with SeriousBot."
   - "Todd will be in touch within one business day."
   - "SERIOUS BUSINESS" footer
   - "SERIOUSBUSINESS.AI" branding

---

## 4. Responsive Design Tests

Test at these breakpoints using Chrome DevTools:

### 4.1 Mobile (375px — iPhone SE)

- [ ] Hero section: text centered, no overflow
- [ ] About section: single column, text below grid
- [ ] Services: single column, full width blocks
- [ ] Footer: single column, centered
- [ ] Contact page: left column above chat, chat full width
- [ ] Chat interface: fits within viewport without horizontal scroll

### 4.2 Tablet (768px — iPad)

- [ ] Services: 2×2 grid
- [ ] Contact page: two-column layout starts to work
- [ ] Chat interface: proper sizing

### 4.3 Desktop (1920px)

- [ ] All sections: proper multi-column layouts
- [ ] Spacing: 8px grid alignment
- [ ] Typography: fonts and sizes correct
- [ ] Chat interface: right-aligned, proper proportions

---

## 5. Performance Tests

### 5.1 Load Time

```bash
npm run build
npm start
# Then test locally or use:
# https://pagespeed.web.dev/
```

- [ ] Home page: <2s (target)
- [ ] Contact page: <2s
- [ ] Lighthouse score: >90

### 5.2 Bundle Size

```bash
npm run build
```

Check `.next/static/` folder:
- [ ] Total bundle <500KB (gzipped)
- [ ] No duplicate dependencies

### 5.3 Network Performance

Chrome DevTools → Network tab:

- [ ] Google Fonts (Exo 2, IBM Plex Mono) load <1s
- [ ] No large unoptimized images
- [ ] No console errors or warnings

---

## 6. Browser Compatibility Tests

Test on:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

Expected: No visual breaks, all functionality works.

---

## 7. Accessibility Tests

- [ ] Color contrast: text readable against backgrounds (WCAG AA)
- [ ] Font sizes: minimum 12px for body text
- [ ] Links: underlined or clearly distinct
- [ ] Form inputs: labeled and accessible
- [ ] Chat interface: keyboard navigable (Tab to send button)

---

## 8. API Tests

### 8.1 Chat Endpoint

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "", "isInitial": true}'
```

**Expected response:**
```json
{
  "reply": "Hi there. I'm SeriousBot. What problem are you working on right now?",
  "conversationId": "uuid-string",
  "isComplete": false
}
```

### 8.2 Chat with Conversation

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "We need to automate billing.", "conversationId": "uuid-string"}'
```

**Expected:**
- `reply`: Claude's response
- `conversationId`: same UUID
- `isComplete`: false (unless 5+ exchanges)

### 8.3 Notify Endpoint

```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "transcript": "User: Hello\nBot: Hi there..."
  }'
```

**Expected response:**
```json
{
  "success": true,
  "conversationId": "test-123"
}
```

---

## 9. Production Testing Checklist

Before launching to production:

- [ ] All tests above pass locally
- [ ] Environment variables set in Vercel
- [ ] Domain configured (DNS pointing to Vercel)
- [ ] SSL certificate auto-provisioned
- [ ] First production chat flow tested end-to-end
- [ ] Email notification verified (Todd receives)
- [ ] Mobile responsive on real device (not just DevTools)
- [ ] Lighthouse score >90
- [ ] No console errors
- [ ] Spam folder checked for emails

---

## 10. Ongoing Monitoring

After launch:

- [ ] Daily: Check Todd's email for conversations
- [ ] Weekly: Verify Vercel analytics (load times, errors)
- [ ] Monthly: Review Resend dashboard (email delivery rate)
- [ ] As needed: Monitor Vercel function logs for errors

---

## Test Report Template

```
Date: YYYY-MM-DD
Tester: [Name]
Environment: [Local / Staging / Production]

VISUAL & TYPOGRAPHY: ✅ / ❌
- Hero section: ✅
- About section: ✅
- Services section: ✅
- Footer: ✅
- Contact page: ✅
- Chat interface: ✅

CHAT FLOW: ✅ / ❌
- Initialization: ✅
- 5-exchange flow: ✅
- Conversation close: ✅
- Error handling: ✅

EMAIL NOTIFICATIONS: ✅ / ❌
- Todd's email: ✅
- Auto-reply: ✅

RESPONSIVE DESIGN: ✅ / ❌
- Mobile (375px): ✅
- Tablet (768px): ✅
- Desktop (1920px): ✅

PERFORMANCE: ✅ / ❌
- Load time <2s: ✅
- Lighthouse >90: ✅

NOTES:
[Any issues or observations]

SIGN-OFF: Ready for production ✅
```

---

**Testing complete. Ship with confidence.** 🖤
