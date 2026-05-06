# Customization Guide — Serious Business

How to customize the website after launch.

## Quick Updates

### Change Copy

All site copy is in component files. Edit these files to update text:

#### Home Page

**Hero Section** (`components/Hero.tsx`)
```tsx
<h1 className="...">Digital transformation for businesses that actually need it.</h1>
<p className="...">We help mid-sized businesses...</p>
```

**About Section** (`components/About.tsx`)
```tsx
// Change headline
<h2 className="...">WHO WE ARE</h2>

// Change paragraphs
<p className="...">Serious Business is the practice of Todd Ames...</p>
```

**Services** (`components/Services.tsx`)
```tsx
const services = [
  {
    headline: 'OPERATIONS AUTOMATION',
    descriptor: 'Connecting your systems...',
  },
  // Edit each service block
];
```

#### Contact Page

**Left Column** (`pages/contact.tsx`)
```tsx
<h1 className="...">Let's Talk.</h1>
<p className="...">SeriousBot will ask you a few questions...</p>
```

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  'sb-black': '#000000',  // Change primary black
  'sb-white': '#FFFFFF',  // Change primary white
  'sb-gray': '#888888',   // Change secondary gray
},
```

Then update class names in components (e.g., `bg-sb-black` → `bg-sb-white`).

### Change Fonts

#### Update Font Imports

Edit `styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=[NEW_FONT]&display=swap');
```

#### Update Tailwind Config

Edit `tailwind.config.js`:

```js
fontFamily: {
  'exo': ['[NEW_HEADLINE_FONT]', 'sans-serif'],
  'mono': ['[NEW_BODY_FONT]', 'monospace'],
},
```

#### Update Components

Replace `font-exo` with new headline font, `font-mono` with new body font.

### Change Logo

Replace logo files in `/public/`:

1. Export Todd's logo as `SB_logo_full_lockup.jpg` (or convert to SVG)
2. Export monogram as `SB_icon.jpg`
3. Export favicon as `SB_favicon.jpg`
4. Replace files in `/public/`

Or update the Logo component (`components/Logo.tsx`):

```tsx
export default function Logo({ variant = 'icon', color = 'white' }: LogoProps) {
  if (variant === 'lockup') {
    return <img src="/[YOUR_LOGO].jpg" alt="Serious Business" />;
  }
  return <div>[SB]</div>;
}
```

---

## SeriousBot Customization

### Change Opening Message

Edit `/pages/api/chat.ts`:

```ts
const openingMessage =
  "Hi there. I'm SeriousBot. What problem are you working on right now?";
```

### Change System Prompt

Edit the `SYSTEM_PROMPT` in `/pages/api/chat.ts`:

```ts
const SYSTEM_PROMPT = `You are SeriousBot, a professional intake agent...
Your goal is to understand what the visitor is working on...
// Customize your instructions here
`;
```

Example: Add company name, change tone, update questions:

```ts
const SYSTEM_PROMPT = `You are AcmeBot, intake agent for Acme Corp's consulting practice.
You are warm, curious, and professional.
Ask about:
1. Their main business challenge
2. Current tools and team size
3. Timeline and budget
4. Best contact method
`;
```

### Change Model

Edit `/pages/api/chat.ts`:

```ts
const response = await client.messages.create({
  model: 'claude-opus-4-1-20250805', // Change to different Claude model
  max_tokens: 150,
  temperature: 0.7,
  // ...
});
```

Available models:
- `claude-opus-4-1-20250805` (most capable, slower/more expensive)
- `claude-3-5-sonnet-20241022` (balanced)
- `claude-haiku-4-5-20251001` (fastest, cheapest)

### Change Closing Message

In `/pages/api/chat.ts`, find:

```ts
const isComplete =
  conversationHistory.exchangeCount >= 5 &&
  (assistantMessage.includes('I'll pass this to Todd') ||
   assistantMessage.includes("He'll reach out within"));
```

Update the check or change the bot's closing prompt in `SYSTEM_PROMPT`.

### Change Email Template

Edit `/pages/api/notify.ts`:

```ts
// Email to Todd
await resend.emails.send({
  from: 'SeriousBot <bot@seriousbusiness.ai>',
  to: toddEmail,
  subject: `New SeriousBot Conversation — ${conversationId}`,
  html: `
    <!-- Update HTML template here -->
  `,
});

// Auto-reply to user
await resend.emails.send({
  from: 'SeriousBot <bot@seriousbusiness.ai>',
  to: userEmail,
  subject: 'Thanks for chatting with SeriousBot',
  html: `
    <!-- Update auto-reply template here -->
  `,
});
```

---

## Layout Changes

### Add a New Section to Home Page

1. Create new component in `/components/` (e.g., `NewSection.tsx`)
2. Import it in `pages/index.tsx`
3. Add it to the JSX:

```tsx
import NewSection from '../components/NewSection';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <NewSection />  {/* Add here */}
      <Services />
      <Footer />
    </>
  );
}
```

### Change Service Blocks

Edit `/components/Services.tsx`:

```ts
const services = [
  {
    headline: 'NEW SERVICE 1',
    descriptor: 'Description of new service...',
  },
  {
    headline: 'NEW SERVICE 2',
    descriptor: 'Description of new service...',
  },
  // Add more or remove existing
];
```

### Change 2-Column Layout

In responsive components, change grid breakpoint:

```tsx
// Current (2 columns at md breakpoint)
<div className="grid grid-cols-1 md:grid-cols-2 gap-16">

// Change to 3 columns
<div className="grid grid-cols-1 md:grid-cols-3 gap-16">

// Change to 4 columns
<div className="grid grid-cols-1 md:grid-cols-4 gap-16">
```

---

## API & Backend Changes

### Add Custom API Route

Create new file `/pages/api/[name].ts`:

```ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Your logic here
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process' });
  }
}
```

### Switch Email Provider

Currently using **Resend**. To switch to **SendGrid** or **AWS SES**:

1. Install SDK: `npm install sendgrid` (or appropriate package)
2. Get API key from provider
3. Update `/pages/api/notify.ts` with new provider code
4. Add new environment variable to `.env.local`
5. Deploy

---

## Environment Variables

All configurable vars are in `.env.local`:

```bash
# AI Model Keys
ANTHROPIC_API_KEY=sk-ant-xxx        # Claude API key
RESEND_API_KEY=re_xxx               # Email API key

# Configuration
TODD_EMAIL=todd@company.com         # Who receives notifications
NEXT_PUBLIC_BASE_URL=https://...    # Your domain URL
```

### Add New Variable

1. Add to `.env.local`:
   ```
   MY_NEW_VAR=value
   ```

2. Reference in code:
   ```ts
   const myVar = process.env.MY_NEW_VAR;
   ```

3. For client-side access, prefix with `NEXT_PUBLIC_`:
   ```ts
   const myVar = process.env.NEXT_PUBLIC_MY_VAR;
   ```

---

## Styling

### Tailwind Utilities

All styling uses Tailwind CSS utilities. No component libraries, no custom CSS classes.

Common utilities:

```tsx
// Colors
className="bg-black text-white"

// Typography
className="font-exo font-black text-lg"
className="font-mono text-sm"

// Spacing
className="p-8 m-4"
className="mb-8 pt-16"

// Layout
className="grid grid-cols-1 md:grid-cols-2"
className="flex justify-between items-center"

// Responsive
className="hidden md:block"  // Hide on mobile, show on desktop
```

### Add Custom Tailwind Class

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      'custom-color': '#ABC123',
    },
    fontSize: {
      'custom': '20px',
    },
  },
},
```

Then use in components:

```tsx
className="text-custom-color text-custom"
```

---

## Deployment After Changes

### Development

```bash
npm run dev
```

Test locally at `http://localhost:3000`.

### Build & Deploy to Production

```bash
npm run build
vercel deploy --prod
```

Or use Vercel Git integration (auto-deploys on push).

### Quick Hotfix (Emergency)

```bash
# Make your change
git add .
git commit -m "Quick fix: [description]"
git push

# Vercel auto-deploys
# Or manually:
vercel deploy --prod
```

---

## Common Customization Examples

### 1. Change Theme Color

**From:** Black & white  
**To:** Navy & gold

`tailwind.config.js`:
```js
colors: {
  'sb-black': '#001F3F',    // Navy
  'sb-white': '#FFD700',    // Gold
},
```

Update component background classes accordingly.

### 2. Add Contact Form Instead of Chat

Replace `ChatWindow` in `pages/contact.tsx` with custom form:

```tsx
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send to API
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        className="border border-black p-4 mb-4"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {/* More fields... */}
      <button type="submit" className="bg-black text-white px-8 py-3">
        Send
      </button>
    </form>
  );
}
```

### 3. Add Multiple AI Models to Chat

Edit `/pages/api/chat.ts`:

```ts
const model = req.body.model || 'claude-haiku-4-5-20251001';

const response = await client.messages.create({
  model: model,
  // ...
});
```

Send `model` param from frontend:

```ts
fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage,
    model: 'claude-opus-4-1-20250805',
  }),
});
```

---

## Performance Optimization

### Image Optimization

Use Next.js Image component (auto-optimization):

```tsx
import Image from 'next/image';

<Image
  src="/logo.jpg"
  alt="Logo"
  width={100}
  height={100}
/>
```

### Font Loading

Currently using Google Fonts (already optimized). If adding more:

```css
@import url('https://fonts.googleapis.com/css2?family=Font+Name:wght@400;700&display=swap');
```

Use `display=swap` to prevent FOIT (Flash of Invisible Text).

### Bundle Size

Check build output:

```bash
npm run build
# Look for .next/static/ folder size
```

Target: <500KB gzipped.

---

## Troubleshooting

### Changes not showing

1. Clear `.next/` folder: `rm -rf .next/`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R (Chrome) or Cmd+Shift+R (Mac)

### Font not loading

1. Check Google Fonts URL in `styles/globals.css`
2. Check font name in `tailwind.config.js` matches import
3. Test in Incognito window (avoids cache)

### Email not sending

1. Check `RESEND_API_KEY` is valid
2. Verify sender email is approved in Resend Dashboard
3. Check spam folder (add to approved senders)
4. View logs: `vercel logs`

### Chat not responding

1. Check `ANTHROPIC_API_KEY` is valid
2. Verify Claude API quota
3. Check browser console for errors
4. Review Vercel function logs

---

## Version Control Workflow

```bash
# Make changes locally
git checkout -b feature/my-update

# Test thoroughly
npm run dev
# ... test in browser ...

# Build and verify production build
npm run build

# Commit changes
git add .
git commit -m "feat: update copy and branding"

# Push to GitHub
git push origin feature/my-update

# Create Pull Request (if using GitHub)
# Merge to main when ready

# Vercel auto-deploys to production
```

---

## Questions?

Refer to:
- `README.md` for setup
- `DEPLOYMENT.md` for deployment
- `TESTING.md` for testing procedures

---

**Keep shipping. 🖤**
