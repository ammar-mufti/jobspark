# Pre-Code Checklist
## JobSpark — Remote Job Search App
**Version:** 1.0

---

## Account Setup — In This Exact Order

### Step 1 — GitHub (github.com)
- [ ] Create GitHub account
- [ ] Create new **private** repository named `jobspark`
- [ ] Do not add any files yet — leave the repo empty
- [ ] Note: Vercel will connect to this repo in Step 3

### Step 2 — Supabase (supabase.com)
- [ ] Create Supabase account
- [ ] Create new project named `jobspark`
- [ ] Choose the region geographically closest to you
- [ ] Wait for project to fully initialise (~2 minutes)
- [ ] Go to Project Settings → API
- [ ] Save the following immediately (shown only once for service key):
  - Project URL: `https://xxxx.supabase.co`
  - Anon (public) key
  - Service role key (**backend only — never expose to browser**)

### Step 3 — Vercel (vercel.com)
- [ ] Sign up using your GitHub account (links them automatically)
- [ ] Import the `jobspark` repository
- [ ] Vercel will attempt a build — it will fail (no code yet) — this is expected
- [ ] Confirm the connection is working in the Vercel dashboard

### Step 4 — Cloudflare (cloudflare.com)
> **Deferred until custom domain is purchased.** Cloudflare rate limiting only works when your domain's DNS is managed by Cloudflare. Since we are using `jobspark-six.vercel.app` (Vercel's domain), Cloudflare cannot proxy it. For personal single-user use, Vercel's built-in DDoS protection is sufficient. When a custom domain is purchased, add it to Cloudflare and set up the rate limiting rule on `/api/jobs/match` at that point.

- [ ] **Skip for now — come back when custom domain is purchased**
- [ ] When ready: Create Cloudflare account → add custom domain → point nameservers to Cloudflare → add CNAME to Vercel → set rate limiting rule on `/api/jobs/match`

### Step 5 — Groq (console.groq.com)
- [ ] Create Groq account (no credit card required)
- [ ] Go to API Keys → Create new key
- [ ] **Save the key immediately** — Groq only displays it once
- [ ] Test the key with a simple API call (optional but recommended)

### Step 6 — Resend (resend.com)
> **Domain decision:** Using Resend's free shared domain (`onboarding@resend.dev`) for now. No domain verification needed. When a custom domain is purchased later, update the `from` address in `lib/email.ts` — no other code changes required.

- [ ] Create Resend account (sign up with GitHub — one click)
- [ ] Go to API Keys → Create API Key
- [ ] Name it `jobspark`, permission: Sending access, domain: All domains
- [ ] Copy the key immediately — shown only once
- [ ] Save to `.env.local` and Vercel dashboard

### Step 7 — UptimeRobot (uptimerobot.com)
> **Do this AFTER Phase 1 is built and deployed — not now.** There is nothing to monitor until the app is live. Come back to this step once you see a successful production deployment in Vercel.

- [ ] Create UptimeRobot account (uptimerobot.com — free)
- [ ] Go to Add New Monitor
- [ ] Fill in: Monitor Type: HTTP(s) · Friendly Name: JobSpark · URL: `https://jobspark-six.vercel.app` · Interval: every 5 minutes
- [ ] Click Create Monitor
- [ ] Confirm email alerts are enabled for downtime

---

## Key Decisions — Already Made

| Decision | Answer |
|---|---|
| App name | JobSpark |
| Primary job API | Remotive (free, no key, remote-focused) |
| Fallback job API | Arbeitnow |
| AI model | Groq — Llama 3 |
| Email service | Resend |
| Cache duration | 1 hour per search result |
| Cache purge | Daily — entries older than 24 hours |
| Resume file type | PDF only |
| Resume size limit | 5 MB maximum |
| Description storage | 1,500 characters max, plain text (HTML stripped) |
| Domain | `jobspark-six.vercel.app` (free Vercel subdomain — upgrade to custom domain later) |

---

## Environment Variables

Create a file called `.env.local` in the root of your project. Add `.env.local` to `.gitignore` **before** making your first commit.

```bash
# .env.local — NEVER commit this file to GitHub

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here

# Groq AI
GROQ_API_KEY=your-groq-api-key-here

# Resend Email
RESEND_API_KEY=your-resend-api-key-here

# App
NEXT_PUBLIC_APP_URL=https://jobspark-six.vercel.app
CRON_SECRET=invent-a-long-random-string-here
```

### Important Notes
- Variables with `NEXT_PUBLIC_` are safe for the browser
- Variables **without** `NEXT_PUBLIC_` are backend only — never in client components
- `SUPABASE_SERVICE_KEY` must never have `NEXT_PUBLIC_` prefix
- `GROQ_API_KEY` must never have `NEXT_PUBLIC_` prefix
- After setting up `.env.local`, add all the same variables to **Vercel dashboard → Project Settings → Environment Variables** — the live app cannot read your local file

---

## Project Folder Structure

Hand this structure to Claude Code as the starting scaffold:

```
jobspark/
├── .env.local                    ← secrets, never on GitHub
├── .gitignore                    ← must include .env.local
├── package.json
├── next.config.js
├── tsconfig.json
│
├── /docs                         ← all planning documents
│   ├── PRD.md
│   ├── SYSTEM_DESIGN.md
│   ├── SECURITY_ARCHITECTURE.md
│   ├── DEVELOPMENT_PHASES.md
│   ├── FREE_TIER_LIMITS.md
│   ├── PRE_CODE_CHECKLIST.md
│   ├── ARCHITECTURE_SUMMARY.md
│   └── DESIGN_SYSTEM.md          ← add after Stitch
│
├── /app                          ← Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx                  ← home / search page
│   ├── /saved
│   │   └── page.tsx
│   ├── /tracker
│   │   └── page.tsx
│   ├── /resume
│   │   └── page.tsx
│   ├── /dashboard
│   │   └── page.tsx
│   └── /api                      ← backend API routes
│       ├── /jobs
│       │   ├── search/route.ts
│       │   └── match/route.ts
│       ├── /bookmarks
│       │   └── route.ts
│       ├── /applications
│       │   └── route.ts
│       ├── /resume
│       │   └── route.ts
│       └── /cron
│           ├── queue/route.ts    ← queue processor
│           └── alerts/route.ts  ← email alert sender
│
├── /components                   ← Stitch UI components
│   ├── JobCard.tsx
│   ├── SearchBar.tsx
│   ├── SearchFilters.tsx
│   ├── TrackerBoard.tsx
│   ├── BookmarkButton.tsx
│   ├── ResumeUpload.tsx
│   ├── MatchScore.tsx
│   ├── Navigation.tsx
│   └── Dashboard.tsx
│
├── /lib                          ← shared helper functions
│   ├── supabase.ts               ← Supabase client (anon + service)
│   ├── groq.ts                   ← Groq API + match logic
│   ├── cache.ts                  ← cache check + write logic
│   ├── pdf.ts                    ← PDF text extraction
│   └── email.ts                  ← Resend email sending
│
└── /supabase                     ← database setup
    └── /migrations
        ├── 001_cached_jobs.sql
        ├── 002_bookmarks.sql
        ├── 003_applications.sql
        ├── 004_matching_queue.sql
        └── 005_resumes.sql
```

---

## You Are Ready to Start Coding When

- [ ] Supabase project running — URL confirmed accessible
- [ ] Groq API key saved
- [ ] Resend API key saved
- [ ] All keys added to `.env.local` on your laptop
- [ ] All keys added to Vercel dashboard (Project Settings → Environment Variables)
- [ ] Stitch UI designs complete — all components exported to `/components`
- [ ] All 8 planning documents in `/docs` folder
- [ ] `ARCHITECTURE_SUMMARY.md` ready to paste into Claude Code as first message

> **After Phase 1 is live:** Set up UptimeRobot monitor pointing to `https://jobspark-six.vercel.app`
> **When custom domain is purchased:** Set up Cloudflare account and rate limiting rule on `/api/jobs/match`

**Do not start coding until every item above is checked.**
