# System Design
## JobSpark — Remote Job Search App
**Version:** 1.0

---

## 1. Architecture Overview — The Restaurant Analogy

Think of the app as a restaurant with three layers:

| Layer | Restaurant Equivalent | Our Technology |
|---|---|---|
| Frontend | The dining room — what the customer sees and touches | Next.js + Tailwind CSS |
| Backend | The kitchen — hidden logic, processes requests, calls suppliers | Next.js API Routes |
| Database | The pantry — long-term storage of all data | Supabase (PostgreSQL) |

The customer (user) never touches the pantry directly. All requests go through the kitchen first.

---

## 2. Tech Stack

### Frontend + Backend — Next.js
- Runs both the visible app (pages, UI, search) and invisible logic (API calls, auth checks) in one codebase
- Beginner-friendly, massive community support
- Deploys to Vercel in one click via GitHub
- Built-in API routes eliminate the need for a separate backend server

### Styling — Tailwind CSS
- Utility-first CSS framework — style elements directly with short class names
- Produces tiny output files — ideal for free-tier bandwidth limits
- Consistent design system across all components

### Hosting — Vercel
- Built by the same team as Next.js — perfect compatibility
- Auto-deploys on every GitHub push — no manual server management
- Free SSL, global CDN, serverless functions, and 1 cron job included

### Database + Auth + Storage — Supabase
- PostgreSQL database (industry standard — skills and data transfer cleanly on upgrade)
- Built-in authentication (email/password + Google OAuth)
- File storage for resume uploads (private bucket, encrypted at rest)
- Row Level Security (RLS) enforced at database level

### Security + CDN — Cloudflare
- Sits in front of Vercel as a security layer
- Free DDoS protection, SSL termination, rate limiting, bot filtering
- Global CDN caches static assets for fast load times worldwide

### Version Control + CI/CD — GitHub
- All code stored with full history
- Every push to main branch triggers automatic Vercel deployment
- Free private repositories

### AI Matching — Groq
- Fast LLM inference using Llama 3 model
- Free tier: 14,400 requests/day, 30 requests/minute
- Nearly identical API structure to OpenAI — easy to switch models later
- No credit card required to start

### Email Alerts — Resend
- 100 emails/day free
- Built for Next.js — integrates in minutes
- Verified domain sending for deliverability

---

## 3. System Architecture Diagram

```
┌─────────────────────────────────────────┐
│              User's Browser             │
│         (types, clicks, searches)       │
└─────────────────┬───────────────────────┘
                  │ HTTPS request
                  ▼
┌─────────────────────────────────────────┐
│               Cloudflare                │
│   DDoS shield · SSL · CDN · Rate limit  │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Vercel — Next.js App            │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │   Frontend   │  │    Backend       │ │
│  │  Pages, UI   │  │  API routes,     │ │
│  │  components  │  │  logic, queue    │ │
│  └──────────────┘  └──────────────────┘ │
└──────────┬──────────────────┬───────────┘
           │                  │
           ▼                  ▼
┌──────────────────┐  ┌───────────────────┐
│    Supabase      │  │   Job APIs (free) │
│  Database · Auth │  │  Remotive         │
│  Resume storage  │  │  Arbeitnow        │
│  Queue table     │  │  (cached 1 hour)  │
│  RLS on all data │  └───────────────────┘
└──────────────────┘

GitHub ──(auto-deploy)──► Vercel
```

---

## 4. Data Flow — Job Search Request

1. User types "React developer remote" and hits search
2. Frontend sends request to Next.js API route (`/api/jobs/search`)
3. Backend checks `cached_jobs` table in Supabase
4. If cache is fresh (< 1 hour old) → return cached results immediately
5. If cache is stale or empty → call Remotive API → strip HTML from descriptions → store in cache → return results
6. Backend checks which jobs the user has already bookmarked
7. Frontend renders job cards with bookmark state highlighted

---

## 5. Job Data Fields

Fields fetched from Remotive API and how each is used:

| Field | Stored | Used For |
|---|---|---|
| `id` | Yes | Primary key, deduplication, bookmarking |
| `title` | Yes | Job card display, AI matching prompt |
| `company_name` | Yes | Job card display, tracker board |
| `company_logo` | Yes | Job card avatar |
| `category` | Yes | Filter by category |
| `job_type` | Yes | Badge on card, filter option |
| `publication_date` | Yes | "Posted X days ago", date filter |
| `candidate_required_location` | Yes | Location badge, location filter |
| `salary` | Yes | Shown when available, "Not specified" when blank |
| `description` | Truncated (1,500 chars, plain text) | AI matching only — HTML stripped before storage |
| `url` | Yes | Apply button link |
| `tags` | Yes | AI matching context, future skill filtering |

### cached_jobs Table Schema
```
id                    TEXT PRIMARY KEY
title                 TEXT
company_name          TEXT
company_logo          TEXT
category              TEXT
job_type              TEXT
publication_date      TIMESTAMP
location              TEXT
salary                TEXT
description_text      TEXT  (max 1,500 chars, HTML stripped)
url                   TEXT
tags                  TEXT[]
fetched_at            TIMESTAMP  (used for cache expiry)
```

---

## 6. Caching Strategy

- Job search results are cached in the `cached_jobs` Supabase table
- Cache expiry: 1 hour per search result set
- Daily purge: entries older than 24 hours are deleted by the cron job
- Purpose: protects free API rate limits, speeds up repeat searches
- Cache is checked before every API call — API only called on cache miss

---

## 7. Resume Matching Queue

Because Groq has a 30 requests/minute rate limit, AI matching uses a queue system:

```
User clicks "Match my resume"
        ↓
Row inserted into matching_queue table (status: pending)
        ↓
User sees "Calculating your match..." spinner
        ↓
Vercel cron job (runs every minute) picks up pending rows
        ↓
Calls Groq API with resume text + job description
        ↓
Writes match score back to matching_queue (status: complete)
        ↓
Frontend polls every 3 seconds → displays score when complete
```

### matching_queue Table Schema
```
id              UUID PRIMARY KEY
user_id         UUID (references auth.users)
job_id          TEXT
status          TEXT  (pending / processing / complete / failed)
match_score     INTEGER  (0–100)
match_reasons   TEXT[]
created_at      TIMESTAMP
completed_at    TIMESTAMP
```

---

## 8. Supabase Database Tables

| Table | Purpose |
|---|---|
| `cached_jobs` | Cached job listings from external APIs |
| `bookmarks` | User's saved jobs (user_id + job_id) |
| `applications` | Application tracker entries with status |
| `matching_queue` | Queue for AI resume matching requests |
| `resumes` | Metadata for uploaded resume files |

All tables have Row Level Security (RLS) enabled from creation.

---

## 9. Scalability Plan

The stack is designed so each service upgrades independently — no rebuilds required:

| Service | Free Tier | Paid Upgrade | Code Changes Needed |
|---|---|---|---|
| Supabase | 500 MB DB, 1 GB storage | Pro $25/mo — 8 GB DB, 100 GB storage | None — flip a switch |
| Vercel | 100 GB bandwidth | Pro $20/mo — 1 TB bandwidth | None |
| Groq | 14,400 req/day | Pay per token | Remove queue throttling |
| Cloudflare | 1 rate limit rule | Pro $20/mo — advanced WAF | None |

### Design Decisions That Protect Scalability
- PostgreSQL (Supabase) is the industry standard — data migrates cleanly to any provider
- Next.js API routes can be extracted to separate microservices later without rewriting logic
- Queue system design is provider-agnostic — can swap Supabase queue for Upstash with minimal changes
- All secrets in environment variables — switching providers requires only variable updates
