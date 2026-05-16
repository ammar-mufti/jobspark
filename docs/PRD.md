# Product Requirements Document (PRD)
## JobSpark — Remote Job Search App
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025

---

## 1. App Overview & Problem Statement

### The Problem
Remote job hunting is fragmented and exhausting. Job seekers visit multiple job boards, manually copy-paste their resume for each application, forget which jobs they applied to, and miss new listings because there is no smart alerting system. There is no single, smart, free tool that brings search, matching, saving, and tracking together in one place.

### The Solution
A focused web app that aggregates remote job listings, uses AI to match them to the user's uploaded resume, lets users save favourites, track applications, and receive alerts — all in one clean interface.

### Who It Is For (Initial Version)
Personal use. The architecture is designed to support multiple users later without rebuilding.

---

## 2. Target Users & Pain Points

### Primary User — Active Remote Job Seeker
- Ages 22–45, applying to 5–20 jobs per week
- Pain points:
  - Losing track of which jobs they applied to
  - Generic search results that don't match their skills
  - Missing new postings on busy days
  - No unified place to track application progress

### Secondary User — Passive Job Browser
- Currently employed but casually exploring opportunities
- Pain points:
  - Doesn't want to upload a resume to every platform
  - Wants smart alerts without constant manual checking

---

## 3. Core Features

### Must-Have (MVP and Phase 2)

| Feature | Description |
|---|---|
| Smart job search | Filter by role, location (remote/timezone), date posted |
| Save & bookmark jobs | Persist bookmarks across sessions and devices |
| Application tracker | Move jobs through: Saved → Applied → Interview → Offer / Rejected |
| User authentication | Email/password sign-up (full name + email + password) and Google OAuth sign-in only (no LinkedIn). Separate login and sign-up pages. |

### Nice-to-Have (Phase 3)

| Feature | Description |
|---|---|
| Resume upload + AI matching | Upload PDF resume, receive match score per job listing |
| Email alerts | Daily alerts when new jobs match saved search criteria |

### Out of Scope

- Hosting job applications directly (we link to original postings only)
- Employer-side accounts or job posting functionality
- In-app messaging or recruiter contact
- Native mobile app (responsive web is in scope)
- Paid job board integrations (LinkedIn, Indeed Premium)
- Resume builder or editing tools

---

## 4. User Stories

### Search
- As a job seeker, I want to search remote jobs by role and location so that I only see listings relevant to me.
- As a job seeker, I want to filter results by date posted so that I can focus on the freshest opportunities.

### Saving
- As a job seeker, I want to bookmark a job so that I can come back to it later without losing it.
- As a job seeker, I want to see all my saved jobs in one place so that I can compare them easily.

### Tracking
- As a job seeker, I want to move a job from "applied" to "interview" so that I can track my progress in one place.
- As a job seeker, I want to see at a glance how many applications are in each stage so that I know where I stand.

### AI Matching
- As a job seeker, I want to upload my resume so that the app can show me jobs I am a strong match for.
- As a job seeker, I want to see which of my skills match a job's requirements so that I can prioritise applications.

### Alerts
- As a job seeker, I want to receive an email when a new job matching my criteria is posted so that I don't have to check the app every day.

### Privacy & Security
- As a job seeker, I want my resume and application history to be private so that only I can see them.
- As a job seeker, I want to delete my account and all my data so that nothing is retained after I leave.

---

## 5. Success Metrics

| Metric | Target |
|---|---|
| Weekly active sessions | 5+ per week (personal use) |
| Jobs bookmarked per week | 5+ |
| Applications tracked | 3+ active at any time |
| Email alert open rate | >30% |
| Resume upload completed | Yes |
| Search to job click rate | >15% |

---

## 6. Assumptions & Constraints

### Free Tier Constraints

| Service | Key Constraint |
|---|---|
| Vercel | 100 GB bandwidth/month, 100k serverless function calls/day, 1 cron job |
| Supabase | 500 MB database, 1 GB file storage, pauses after 7 days inactivity |
| Cloudflare | 1 free rate limiting rule, 100k Worker requests/day |
| GitHub | 2,000 Actions minutes/month |
| Groq | 14,400 requests/day, 30 requests/minute, 6,000 tokens/minute |
| Remotive API | Free, no key required, rate limits apply — mitigated by caching |
| Resend | 100 emails/day free |

### Technical Assumptions
- Job listings are fetched from free APIs (Remotive, Arbeitnow) and cached for 1 hour
- Resume matching runs on-demand via a queue, not in real time
- Job descriptions are stored truncated (1,500 characters max) to preserve database space
- Only PDF resumes are accepted, max 5MB

---

## 7. Out of Scope

The following will NOT be built in any phase:

- Hosting the job application form (users are directed to the original posting)
- Employer accounts or job posting
- In-app messaging
- Native iOS or Android app
- Premium job board API integrations
- Resume creation or editing tools
- Payment processing or subscriptions
