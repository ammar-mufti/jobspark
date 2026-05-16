# Development Phases
## JobSpark — Remote Job Search App
**Version:** 1.0

---

## Overview

The build is split into four phases. Each phase is independently useful and testable before the next begins. Features are ordered so each one builds on the last — no wasted work if scope changes.

```
Phase 1 → Working job search (live, real data)
Phase 2 → Personal accounts, saving, tracking
Phase 3 → AI matching, resume upload, email alerts
Phase 4 → Polish, caching optimisation, dashboard
```

---

## Phase 1 — MVP (Minimum Loveable Product)
**Duration:** 2–3 weeks  
**Goal:** A live, working app that searches real remote jobs

### What Gets Built
- GitHub repository created, Vercel connected, auto-deploy working
- Supabase project created with RLS enabled from day one
- Next.js app shell with Tailwind CSS
- Cloudflare DNS and SSL connected
- Job search page — calls Remotive API
- `cached_jobs` table in Supabase with 1-hour cache logic
- Filter by role, category, and date posted
- Filter by location / timezone requirement
- Job listing cards showing: title, company, logo, salary, location, date, job type
- Apply button linking to original job posting
- Empty state (no results found) handled gracefully
- Basic error handling (API unavailable, network error)

### Why This Order
You need a working, useful app before adding auth complexity. Seeing real job listings appear is the first meaningful milestone and provides motivation to continue.

### Free Tools Used
- Vercel (hosting + auto-deploy)
- GitHub (version control)
- Supabase (cached_jobs table)
- Remotive API (free, no key required)
- Arbeitnow API (fallback)
- Cloudflare (DNS + SSL)
- Tailwind CSS (styling)
- Stitch-exported components (job card, search bar, filters)

### What You Can Test
- Search "designer remote" → real job listings appear
- Filter by "last 7 days" → results update correctly
- Click a job card → opens original job posting in new tab
- App loads on a real URL (your Vercel deployment or custom domain)
- Search results return from cache on repeat searches (fast)

---

## Phase 2 — Core Features (Auth, Saving, Tracking)
**Duration:** 2–3 weeks  
**Goal:** The app becomes personal and persistent

### What Gets Built
- Supabase Auth — email/password sign-up and login
- Google OAuth login option
- Protected routes — redirect to login if not authenticated
- `bookmarks` table with RLS policy
- Bookmark / save any job listing (heart or bookmark icon on card)
- Saved jobs page — all bookmarked listings in one view
- Remove bookmark from saved jobs page
- `applications` table with RLS policy
- Application tracker board — Kanban-style columns
- Columns: Saved → Applied → Interview → Offer / Rejected
- Drag jobs between columns to update status
- Notes field per application (optional)
- User profile page — basic account info

### Why This Order
Auth must exist before saving (you need to know who owns the bookmark). Saving must exist before tracking (tracker extends the saved jobs concept). Each feature depends on the previous one.

### Free Tools Used
- Supabase Auth (email + Google OAuth — free)
- Supabase Database (bookmarks + applications tables)
- Stitch-exported components (tracker board, saved jobs page, auth pages)

### What You Can Test
- Create an account with email and password
- Log in with Google
- Bookmark 3 jobs, log out, log back in — bookmarks still there
- Move a job from "Applied" to "Interview" on the tracker board
- Confirm you cannot see another user's bookmarks (RLS working)

---

## Phase 3 — Smart Features (AI Matching + Alerts)
**Duration:** 2–3 weeks  
**Goal:** The app becomes intelligent

### What Gets Built
- `resumes` metadata table with RLS policy
- Resume upload page — drag and drop PDF upload
- File validation — PDF only, 5MB maximum
- Resume stored in private Supabase Storage bucket
- PDF text extraction using `pdf-parse` library
- `matching_queue` table with RLS policy
- Match score request flow — user triggers match on a job
- Queue processor — Vercel cron job running every minute
- Groq API integration — Llama 3 model
- Match score (0–100) displayed on job card
- Match reasons displayed ("You match: React, TypeScript, Remote")
- Matching spinner — "Calculating your match..." while pending
- Saved search criteria stored per user
- Email alert system using Resend
- Daily cron job checks for new jobs matching saved criteria
- Alert email sent with new matching job listings

### Why This Order
AI matching requires auth (Phase 2) to know whose resume to use, and requires storage to save the resume. Alerts require saved search criteria which requires auth. Everything builds on the prior phases.

### Free Tools Used
- Supabase Storage (resume files — private bucket)
- Groq API (Llama 3 — free tier, 14,400 req/day)
- pdf-parse (open source PDF text extraction)
- Resend (email alerts — 100 emails/day free, sends from `onboarding@resend.dev`)
- Vercel Cron (queue processor + alert sender — 1 job free)

### What You Can Test
- Upload your real PDF resume — confirm it uploads and is stored
- Open a job listing → trigger match → see score appear after a few seconds
- See matching skills highlighted ("You match 4 of 6 skills")
- Save a search query → receive an email the next day with new matching jobs
- Confirm resume is not accessible via a public URL (private bucket working)

---

## Phase 4 — Polish & Personal Launch
**Duration:** 1–2 weeks  
**Goal:** The app feels complete, reliable, and fast

### What Gets Built
- Full mobile responsive layout across all pages
- Loading skeleton states (placeholder cards while data loads)
- Improved error messages — user-friendly, not technical
- Empty states with helpful prompts ("No saved jobs yet — start searching")
- Search history — last 5 searches stored and shown as quick links
- Dashboard page — stats at a glance:
  - Total applications this week
  - Applications per stage
  - Top matching job today
  - Resume upload status
- Cache purge cron job — removes cached_jobs entries older than 24 hours
- Performance audit — Vercel Analytics review
- UptimeRobot monitor confirmed active

### Why This Order
Polish only makes sense once core functionality is proven. Caching optimisation belongs here because real usage data informs the right cache strategy. The dashboard is only meaningful once real application data exists.

### Free Tools Used
- Vercel Analytics (free — built in)
- UptimeRobot (free uptime monitoring)
- Supabase (dashboard stats queries)

### What You Can Test
- Use the app entirely on a mobile phone — all features accessible
- Disconnect from the internet briefly — confirm error messages are friendly
- Check the dashboard after a week of use — accurate stats displayed
- Confirm Supabase database size is under 400MB (80% of free limit)
- Confirm Groq usage is within daily limits

---

## Phase Summary

| Phase | Duration | Key Output | Depends On |
|---|---|---|---|
| 1 — MVP | 2–3 weeks | Live job search with caching | Nothing |
| 2 — Core | 2–3 weeks | Auth, bookmarks, tracker | Phase 1 |
| 3 — Smart | 2–3 weeks | AI matching, alerts | Phase 2 |
| 4 — Polish | 1–2 weeks | Mobile, dashboard, optimisation | Phase 3 |

**Total estimated time: 7–11 weeks**
