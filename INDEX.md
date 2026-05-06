# 📑 Serious Business — Documentation Index

Quick navigation for all project documentation and guides.

---

## 🚀 **Getting Started**

**New to the project?** Start here.

1. **[README.md](./README.md)** — Overview, setup, build, deploy
   - Project structure
   - Install dependencies
   - Run locally (`npm run dev`)
   - Build for production
   - FAQ & troubleshooting

2. **[SHIP.md](./SHIP.md)** — Project status & checklist
   - What's built (features, pages)
   - Tech stack
   - Design language verification
   - Final checklist before launch
   - Known limitations & future work

---

## 🛠️ **Development**

**Working on the code?** These guides cover implementation details.

1. **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** — How to update the site
   - Change copy (hero, about, services)
   - Change colors, fonts, logo
   - SeriousBot customization (prompts, model, messages)
   - API routes & backend changes
   - Environment variables
   - Version control workflow
   - Common customization examples

2. **Local Development**
   - Run `npm run dev` (see README.md)
   - Edit components in `/components/`
   - Edit pages in `/pages/`
   - Styles in `/styles/globals.css` + Tailwind utilities

---

## 📋 **Testing**

**Before launch or after changes?** Use these procedures.

1. **[TESTING.md](./TESTING.md)** — Complete testing guide
   - Visual & typography tests (Hero, About, Services, Footer)
   - Chat flow tests (5+ exchanges)
   - Email notification tests
   - Responsive design tests (375px, 768px, 1920px)
   - Performance tests (<2s load, Lighthouse >90)
   - Browser compatibility
   - Accessibility checks
   - API endpoint tests
   - Production testing checklist

---

## 🌐 **Deployment**

**Ready to launch?** Follow these steps.

1. **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Vercel deployment guide
   - Pre-deployment checklist
   - Environment setup
   - Build & test locally
   - Vercel project setup
   - Domain configuration (Cloudflare DNS)
   - Production testing
   - Monitoring & maintenance
   - Rollback procedures
   - Common issues & fixes
   - Post-launch checklist

2. **Quick Deploy**
   ```bash
   vercel deploy --prod
   ```

---

## 📁 **Project Structure**

```
seriousbusiness-ai/
├── 📄 INDEX.md                 ← You are here
├── 📄 README.md                → Setup & overview
├── 📄 SHIP.md                  → Status & checklist
├── 📄 DEPLOYMENT.md            → Launch to Vercel
├── 📄 TESTING.md               → Testing procedures
├── 📄 CUSTOMIZATION.md         → Update the site
├── 📄 VERIFY.sh                → Script to verify structure
│
├── 📁 pages/                   → Next.js routes
│   ├── index.tsx              → Home page (/)
│   ├── contact.tsx            → Contact (/contact)
│   ├── _app.tsx               → App wrapper
│   ├── _document.tsx          → HTML structure
│   └── api/
│       ├── chat.ts            → Claude chat endpoint
│       └── notify.ts          → Email notifications
│
├── 📁 components/              → React components
│   ├── Hero.tsx               → Hero section
│   ├── About.tsx              → About section
│   ├── Services.tsx           → Services grid
│   ├── ServiceBlock.tsx       → Service card
│   ├── ChatWindow.tsx         → SeriousBot interface
│   ├── Logo.tsx               → Logo component
│   └── Footer.tsx             → Footer section
│
├── 📁 styles/
│   └── globals.css            → Global styles + fonts
│
├── 📁 public/                  → Static assets
│   ├── SB_logo_full_lockup.jpg
│   ├── SB_icon.jpg
│   ├── SB_favicon.jpg
│   └── SB_wordmark.jpg
│
├── 📄 package.json             → Dependencies
├── 📄 tailwind.config.js       → Tailwind config
├── 📄 next.config.js           → Next.js config
├── 📄 tsconfig.json            → TypeScript config
├── 📄 postcss.config.js        → PostCSS config
├── 📄 .env.local.example       → Environment template
└── 📄 .gitignore
```

---

## 🎯 **Common Tasks**

### I want to...

#### Launch to production
→ Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

#### Update copy (hero, about, services)
→ See "Change Copy" in [CUSTOMIZATION.md](./CUSTOMIZATION.md)

#### Change the design (colors, fonts)
→ See "Change Colors" and "Change Fonts" in [CUSTOMIZATION.md](./CUSTOMIZATION.md)

#### Customize SeriousBot (opening message, tone, model)
→ See "SeriousBot Customization" in [CUSTOMIZATION.md](./CUSTOMIZATION.md)

#### Test before launch
→ Follow [TESTING.md](./TESTING.md)

#### Set up locally
→ Read [README.md](./README.md) → "Setup"

#### Know what's built
→ Check [SHIP.md](./SHIP.md)

#### Troubleshoot an issue
→ Check [README.md](./README.md) → "Troubleshooting" or [DEPLOYMENT.md](./DEPLOYMENT.md) → "Common Issues & Fixes"

#### Add a new feature
→ Read [CUSTOMIZATION.md](./CUSTOMIZATION.md) → "Layout Changes" or "API & Backend Changes"

---

## 🔑 **Key Concepts**

### Tech Stack
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS (utilities only)
- **AI**: Claude Haiku (claude-haiku-4-5-20251001)
- **Email**: Resend API
- **Hosting**: Vercel
- **Fonts**: Exo 2 (headlines) + IBM Plex Mono (body)

### Pages
- `/` — Home (Hero, About, Services, Footer)
- `/contact` — Contact with SeriousBot

### API Routes
- `/api/chat` — Claude conversation backend
- `/api/notify` — Email notification sender

### Design Principles
- ✅ Industrial, black & white, no gradients
- ✅ Typography locked (Exo 2 + IBM Plex Mono)
- ✅ Strict 8px grid
- ✅ No stock photos, no rounded corners
- ✅ Structural lines only (borders, rules)
- ✅ White space is intentional

---

## ⚙️ **Configuration**

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx      # Claude API key
RESEND_API_KEY=re_xxxxx             # Email API key
TODD_EMAIL=todd@seriousbusiness.ai  # Notification recipient
NEXT_PUBLIC_BASE_URL=https://...    # Your domain
```

See [README.md](./README.md) for setup instructions.

### Deployment

Domain: `seriousbusiness.ai` (Cloudflare DNS)  
Hosting: Vercel  
SSL: Auto-provisioned by Vercel  

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step.

---

## 📞 **Quick Help**

### Setup issues
→ [README.md](./README.md) → "Setup"

### Deployment help
→ [DEPLOYMENT.md](./DEPLOYMENT.md) → "Step 1-6"

### Chat not working
→ [TESTING.md](./TESTING.md) → "Chat Flow Tests" or [README.md](./README.md) → "Troubleshooting"

### Email not sending
→ [DEPLOYMENT.md](./DEPLOYMENT.md) → "Common Issues & Fixes" → "Emails not sent"

### Want to customize
→ [CUSTOMIZATION.md](./CUSTOMIZATION.md) → Find your task

### Testing before launch
→ [TESTING.md](./TESTING.md) → Follow the checklist

---

## ✅ **Verification**

Run this to verify the project structure:

```bash
bash VERIFY.sh
```

Should show ✅ for all files and folders.

---

## 📊 **Status**

| Component | Status |
|-----------|--------|
| Home page | ✅ Complete |
| Contact page | ✅ Complete |
| SeriousBot chat | ✅ Complete |
| Email notifications | ✅ Complete |
| Responsive design | ✅ Complete |
| Documentation | ✅ Complete |
| Ready to ship | ✅ YES |

---

## 🚀 **Next Steps**

1. **Read [SHIP.md](./SHIP.md)** for status & checklist
2. **Follow [DEPLOYMENT.md](./DEPLOYMENT.md)** to launch
3. **Use [TESTING.md](./TESTING.md)** before going live
4. **Reference [CUSTOMIZATION.md](./CUSTOMIZATION.md)** for updates

---

## 📝 **File Legend**

- **INDEX.md** — This file (navigation hub)
- **README.md** — Setup, overview, getting started
- **SHIP.md** — Project status, what's built, checklist
- **DEPLOYMENT.md** — Step-by-step Vercel launch
- **TESTING.md** — Complete testing procedures
- **CUSTOMIZATION.md** — How to update the site
- **VERIFY.sh** — Script to check project structure

---

**Everything you need is here. Pick a guide and get started.** 🖤

---

**Last updated**: 2026-05-04  
**Status**: Production-ready  
**Next action**: Deploy or customize based on your needs
