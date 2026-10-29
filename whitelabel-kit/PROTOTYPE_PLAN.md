# Prototype Plan: Thesis-Branded Intake Chat on Cloud Run

## Goal
A Thesis-branded chat on a Cloud Run URL. A visitor has a real conversation, confirms their details, and the lead arrives by email. Purpose: prove the concept. Not production.

## Scope
**In:** one `thesis` client config, Thesis branding (from Figma), Dockerfile, Cloud Run deploy, lead email, end-to-end test.
**Out (deliberately):** database, Airtable, queues/retries, admin UI, multi-client provisioning, Secret Manager, rate-limit infrastructure.

## Steps
1. **Branding.** Pull colors, fonts, logo, and tone from the Figma files. Map to `branding.*` in the config (primaryColor, accentColor, backgroundColor, logoUrl). Export logo to `public/`.
2. **Config.** Copy `config/clients/_template.ts` to `config/clients/thesis.ts`. Set names, operator, greeting, prompt (see Prompt Notes), `notificationEmail` from an env var (`THESIS_LEAD_EMAIL`). Register `thesis` in BOTH maps in `config/clients/index.ts`.
3. **Container.** Add `output: 'standalone'` to `next.config.js`. Add a multi-stage Dockerfile (node:20-alpine; build, then copy `.next/standalone`, `.next/static`, `public`; `PORT=8080`).
4. **Deploy.** `gcloud run deploy` from source or an image. Env vars: `ANTHROPIC_API_KEY`, `RESEND_API_KEY` (or Thesis's approved provider), `EMAIL_FROM` (verified domain), `THESIS_LEAD_EMAIL`. Set max instances 2-3. Prefer an unlisted or IAP-protected URL.
5. **Test.** Run 3+ full conversations to the email. Verify the confirm screen, edited details, email content, and mobile layout. Retest after ANY prompt edit (the closing line must contain one of `closingPhrases`).
6. **Demo notes.** Record what worked, what failed, and the quality of lead summaries.

## Prompt Notes (system prompt for the Thesis bot)
Thesis is a digital creative agency; visitors are likely prospective brand partners. Collect, one question at a time, 1-3 sentences each:
1. What they want to build or solve (project type: campaign, site, content, experience)
2. Their brand/company and role
3. Timeline and budget range (skippable)
4. Full name and email (required)
Rules: concise, warm, on-brand voice; no pricing or commitments; route everything to the named operator; do not close until name AND email are collected; close with the exact line that matches `closingPhrases`.

## Known prototype shortcuts
- Secrets as env vars; email-only (a failed send loses the lead); no rate limiting beyond max-instances and a low Anthropic spend cap; closing detection by phrase match.

## Next (MVP, after the prototype proves out)
Firestore for config and leads, structured completion signal (tool call), Cloud Tasks email retries, Cloud Armor and budgets, per-client provisioning script, then Airtable setup interface.

---

## Handoff prompt (paste into the Thesis Claude account)

> I'm building a prototype of a Thesis-branded AI intake chat on Google Cloud Run. The attached `whitelabel-kit/` is a working Next.js 14 project (see its README.md and PROTOTYPE_PLAN.md). Read both first.
>
> Do this, in order, and stop to confirm with me before deploying:
> 1. Read the Figma files I link below and extract Thesis's brand: colors, typography, logo, and voice. Map them to the `branding` fields in the config and tell me what you chose.
> 2. Create `config/clients/thesis.ts` from `_template.ts` for new-business inquiries from prospective brand partners, and register it in both maps in `config/clients/index.ts`. Write the system prompt following the Prompt Notes in PROTOTYPE_PLAN.md. Read the lead recipient from `THESIS_LEAD_EMAIL`.
> 3. Add `output: 'standalone'` and a Dockerfile suitable for Cloud Run (port 8080). Verify `npm run build` passes and the container runs locally.
> 4. Give me the exact `gcloud run deploy` command and the env vars needed (`ANTHROPIC_API_KEY`, email provider key, `EMAIL_FROM`, `THESIS_LEAD_EMAIL`), with max instances 2-3. Do not put secrets in files or commits.
> 5. Run a scripted test conversation against the local server and confirm the bot reaches its closing line and the confirm step appears.
>
> Constraints: this is a prototype, so do not add a database, Airtable, queues, or an admin UI. Keep changes minimal and tell me anything in the kit that looks wrong for Thesis's environment.
>
> Figma: <paste links>
> Lead recipient: <email> | Sending domain: <domain> | GCP project/region: <project / region>
