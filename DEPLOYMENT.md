# Deployment Guide — Serious Business

Complete step-by-step instructions for launching seriousbusiness.ai to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Chat flow tested locally (5+ exchanges)
- [ ] Email notifications tested
- [ ] Mobile responsive verified (375px, 768px, 1920px)
- [ ] Lighthouse score >90
- [ ] Copy and branding locked
- [ ] Domain registered and ready
- [ ] Vercel account connected

## Step 1: Prepare Environment

### 1a. Create `.env.local` with production keys

```bash
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
TODD_EMAIL=todd@seriousbusiness.ai
NEXT_PUBLIC_BASE_URL=https://seriousbusiness.ai
```

### 1b. Verify API keys are active

- **Anthropic**: Visit https://console.anthropic.com, verify API key is active
- **Resend**: Visit https://resend.com/dashboard, verify API key and check email sender is verified

## Step 2: Build & Test Locally

```bash
npm install
npm run build
npm run start
```

Visit `http://localhost:3000` and test:
- [ ] Home page loads sub-2s
- [ ] Hero, About, Services, Footer render correctly
- [ ] All typography (Exo 2 + IBM Plex Mono) loads
- [ ] Contact page loads chat interface
- [ ] SeriousBot initializes and accepts messages
- [ ] Chat flow works end-to-end (5+ exchanges)
- [ ] Conversation closes with signoff
- [ ] Responsive on mobile (use DevTools)

## Step 3: Vercel Setup

### 3a. Create Vercel project

```bash
npm install -g vercel
vercel login
vercel link
```

### 3b. Add environment variables to Vercel

```bash
vercel env add ANTHROPIC_API_KEY
vercel env add RESEND_API_KEY
vercel env add TODD_EMAIL
vercel env add NEXT_PUBLIC_BASE_URL https://seriousbusiness.ai
```

Or via Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable for **Production** environment
3. Redeploy to apply

### 3c. Deploy

```bash
vercel deploy --prod
```

Vercel will provide deployment URL and preview links.

## Step 4: Domain Configuration

### 4a. Point domain to Vercel

In Cloudflare (or your DNS provider):

1. Go to DNS settings
2. Add CNAME record:
   - Name: `seriousbusiness.ai` (or `www`)
   - Value: `cname.vercel.com`
3. Save

### 4b. Configure in Vercel Dashboard

1. Go to Project Settings → Domains
2. Add domain `seriousbusiness.ai`
3. Vercel auto-detects and validates DNS
4. SSL/HTTPS auto-provisioned (Let's Encrypt)

Wait 5-10 minutes for DNS propagation.

## Step 5: Production Testing

### 5a. Load time

```bash
# Install lighthouse
npm install -g lighthouse

# Test production domain
lighthouse https://seriousbusiness.ai --view
```

Target: **>90 Lighthouse score**, **<2s load time**.

### 5b. Chat flow

1. Visit `https://seriousbusiness.ai/contact`
2. Complete full SeriousBot conversation (5+ exchanges)
3. Verify conversation closes with signoff
4. **Important**: Check Todd's email for notification
5. Verify email contains full transcript

### 5c. Mobile responsiveness

1. Use Chrome DevTools: Ctrl+Shift+I → F12
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)

### 5d. API endpoints

```bash
# Test chat endpoint
curl -X POST https://seriousbusiness.ai/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "conversationId": "test-123"}'

# Should return: { reply: "...", conversationId: "...", isComplete: false }
```

## Step 6: Monitoring & Maintenance

### Monitor Vercel Dashboard

- Deployments: https://vercel.com/dashboard
- Logs: Edge Function logs, serverless function logs
- Analytics: Request volume, response times, errors

### Monitor Email Delivery

- Resend Dashboard: https://resend.com/dashboard
- Check for bounce rates, failures
- Verify Todd receives notifications for each conversation

### Set Up Alerts (Optional)

In Vercel Settings:
- Enable email notifications for deployments
- Monitor function errors

## Rollback

If something breaks:

```bash
# Revert to last working deployment
vercel rollback
```

Or re-deploy a known good commit:

```bash
git checkout <commit-hash>
vercel deploy --prod
```

## Common Issues & Fixes

### Chat endpoint returns 500

**Cause**: Missing `ANTHROPIC_API_KEY` or invalid key  
**Fix**: Verify key in Vercel Environment Variables

### Emails not sent

**Cause**: Invalid `RESEND_API_KEY` or sender not verified  
**Fix**: 
1. Check key in Resend Dashboard
2. Verify `bot@seriousbusiness.ai` is approved sender in Resend
3. Add Todd's email as verified recipient

### Domain not resolving

**Cause**: DNS not propagated  
**Fix**: Wait 5-15 minutes, check DNS records:

```bash
dig seriousbusiness.ai
nslookup seriousbusiness.ai
```

### Slow performance

**Cause**: Large bundle, unoptimized images, slow API calls  
**Fix**:
1. Run `npm run build` locally, check output size
2. Use Vercel Analytics to identify bottlenecks
3. Optimize API response times (Claude can be slow)

## Post-Launch

1. **Monitor first 24 hours**: Check email notifications, function logs
2. **Share domain**: Send Todd the live link
3. **Test from external network**: Verify from mobile/different networks
4. **Set up status page** (optional): Use statuspage.io
5. **Plan for updates**: Document deployment process for future changes

## Deployment Success Criteria

✅ Domain resolves to Vercel  
✅ Home page loads <2s  
✅ Hero/About/Services render correctly  
✅ Fonts (Exo 2 + IBM Plex Mono) load from Google Fonts  
✅ Chat initializes and accepts messages  
✅ Full conversation flow works (5+ exchanges)  
✅ Conversation closes with signoff message  
✅ Email notification sent to Todd (with transcript)  
✅ Mobile responsive (375px, 768px, 1920px)  
✅ Lighthouse score >90  
✅ No console errors  

---

**Deployment ready. Ship it.** 🖤
