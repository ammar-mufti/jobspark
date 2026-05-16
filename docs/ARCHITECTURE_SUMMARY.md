# Architecture Summary
## JobSpark — One-Page Context for Claude Code
**Version:** 1.0

---

> Hand this document to Claude Code at the start of every session as context. It contains everything needed to build consistently with the established architecture, decisions, and constraints.

---

## What We Are Building

A personal remote job search web app with:
- Smart job search (role, location, date) powered by Remotive API
- Bookmark and save jobs
- Application tracker (Saved → Applied → Interview → Offer / Rejected)
- Resume upload with AI-based job matching via Groq
- Email alerts for new matching jobs via Resend
- Personal use only (single user, no multi-tenant features needed yet)

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend + Backend | Next.js (App Router) + TypeScript | Pages and API routes in one codebase |
| Styling | Tailwind CSS | Utility-first styling |
| Hosting | Vercel | Auto-deploys from GitHub on every push |
| Database | Supabase (PostgreSQL) | All persistent data |
| Auth | Supabase Auth | Email/password + Google OAuth |
| File Storage | Supabase Storage | Resume PDF files (private bucket) |
| Security | Cloudflare | Deferred until custom domain purchased. Vercel built-in protection is sufficient for personal use. |
| AI Matching | Groq API — Llama 3 | Resume to job description matching |
| Email | Resend | Daily job alert emails — sent from `onboarding@resend.dev` (shared domain). Update `from` in `lib/email.ts` when custom domain is purchased. |
| Version Control | GitHub | Code history + triggers Vercel deploy |

---

## Security Rules — Non-Negotiable

1. **RLS on every Supabase table** — enable immediately on creation, before inserting data
2. **SUPABASE_SERVICE_KEY** — backend API routes only, never in any client component
3. **NEXT_PUBLIC_ prefix** — only for anon key and app URL, never for service key or Groq key
4. **Resume bucket** — private, not public. Files accessible only by owner.
5. **File uploads** — PDF only, 5MB max, validated on both frontend and backend
6. **No secrets in code** — all in `.env.local` locally, Vercel dashboard in production

---

## Database Tables

All tables have RLS enabled. All user-owned tables use `user_id = auth.uid()` policy.

```
cached_jobs       Jobs fetched from Remotive API. Cache expires after 1 hour. Purged after 24h.
bookmarks         User's saved jobs. RLS: owner only.
applications      Tracker entries with status. RLS: owner only.
matching_queue    AI match requests. Status: pending/processing/complete/failed. RLS: owner only.
resumes           Resume file metadata. RLS: owner only.
```

---

## API Routes

```
GET  /api/jobs/search       Search jobs — checks cache first, calls Remotive on miss
POST /api/jobs/match        Add match request to queue
GET  /api/bookmarks         Get user's bookmarks
POST /api/bookmarks         Add bookmark
DELETE /api/bookmarks       Remove bookmark
GET  /api/applications      Get tracker entries
POST /api/applications      Add tracker entry
PATCH /api/applications     Update status
POST /api/resume            Upload resume (validate + store in Supabase Storage)
POST /api/cron/queue        Process matching_queue (called by Vercel cron every minute)
POST /api/cron/alerts       Send email alerts for new matching jobs (called daily)
```

---

## Caching Logic

```
User searches → check cached_jobs in Supabase
→ Cache fresh (< 1 hour)? Return immediately
→ Cache stale or empty? Call Remotive API → strip HTML → truncate description to 1,500 chars → store → return
→ Daily cron purges entries older than 24 hours
```

---

## AI Matching Queue Logic

```
User triggers match → insert row into matching_queue (status: pending)
→ Show "Calculating your match..." spinner
→ Cron runs every minute → picks up pending rows → calls Groq (Llama 3)
→ Prompt: resume text + job title + tags + description_text → returns score 0-100 + matching skills
→ Write result back → status: complete
→ Frontend polls every 3 seconds → displays score when complete
```

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL — browser safe
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase anon key — browser safe
SUPABASE_SERVICE_KEY              # Supabase service key — backend only
GROQ_API_KEY                      # Groq API key — backend only
RESEND_API_KEY                    # Resend email key — backend only
NEXT_PUBLIC_APP_URL               # https://jobspark-six.vercel.app — browser safe
CRON_SECRET                       # Secret to authenticate cron route calls — backend only
```

---

## Key Constraints to Respect

| Constraint | Detail |
|---|---|
| Vercel free tier | 1 cron job maximum. 10 second function timeout. |
| Supabase free tier | 500 MB database. Pauses after 7 days inactivity. |
| Groq free tier | 30 requests/minute. Use queue — never call directly on user action. |
| Remotive API | No official rate limit published — always use cache, never call on every request. |
| Description storage | Strip HTML. Store max 1,500 characters of plain text. |
| Resume storage | Private bucket. UUID filename. PDF only. 5MB max. |

---

## Folder Structure

```
/app              Next.js pages and API routes
/components       Stitch-designed UI components — do not overwrite styling
/lib              Shared helpers: supabase.ts, groq.ts, cache.ts, pdf.ts, email.ts
/supabase/migrations  SQL migration files — one per table
/docs             All planning documents
```

---

## Current Build Phase

**Phase 1 — MVP**  
Building: job search page, Remotive API integration, caching, job cards, filters  
Not yet building: auth, bookmarks, tracker, AI matching, alerts

See `/docs/DEVELOPMENT_PHASES.md` for full phase breakdown.

---

## Design System

UI components were designed in Stitch and exported to `/components`. Do not override component styling with generic Tailwind defaults. When building new components, follow the design tokens in `/docs/DESIGN_SYSTEM.md`.
