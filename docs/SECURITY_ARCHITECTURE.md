# Security Architecture
## JobSpark — Remote Job Search App
**Version:** 1.0

---

## Core Principle

Security is not a feature added at the end. It is the foundation everything else sits on. Every table, every API route, every file upload is secured from the moment it is created.

---

## 1. Supabase Data Storage Security

### Database — User Data
- All user data (bookmarks, application history, queue entries) lives in Supabase PostgreSQL
- Every row is owned by a specific `user_id` matching `auth.users`
- Row Level Security (RLS) enforced on every table — database refuses unauthorised access at the lowest possible level, not just at the application layer
- Even if there is a bug in application code, the database will not return another user's data

### File Storage — Resumes
- Resumes stored in a **private Supabase Storage bucket** — no public URLs
- Files are only accessible by the authenticated owner
- Storage policy mirrors RLS: `user_id = auth.uid()`
- All files encrypted at rest by Supabase automatically
- File type validation: PDF only
- File size limit: 5MB maximum — validated on both frontend and backend

---

## 2. Authentication

Supabase Auth handles the entire authentication system. The following is provided at zero cost:

| Feature | Detail |
|---|---|
| Email + password sign-up | With email verification required |
| Google OAuth | Sign in with Google only — ~10 minutes to configure in Supabase dashboard. No LinkedIn OAuth. |
| Password reset | Via email link |
| Session tokens (JWT) | Signed digital pass proving user identity |
| Token expiry + refresh | Sessions expire safely without abrupt logout |
| Brute force protection | Too many failed attempts triggers automatic lockout |

### Token Handling
- JWTs are handled entirely by Supabase — never manually constructed
- Tokens stored in secure HTTP-only cookies (not localStorage)
- Token refresh happens automatically in the background

---

## 3. Row Level Security (RLS)

### What Is RLS?
RLS is a database-level access control system. Think of it like a hotel key system — each guest can only open their own room door even if they try others. Every query is automatically filtered to return only the requesting user's data, regardless of what the application code asks for.

### Rules
- RLS is **disabled by default** in Supabase — it must be manually enabled on every table
- RLS must be enabled **immediately** when each table is created, before any real data is inserted
- No table goes into production without an RLS policy

### RLS Policies Per Table

```sql
-- bookmarks: users can only see and modify their own bookmarks
CREATE POLICY "users manage own bookmarks"
  ON bookmarks FOR ALL
  USING (user_id = auth.uid());

-- applications: users can only see and modify their own applications
CREATE POLICY "users manage own applications"
  ON applications FOR ALL
  USING (user_id = auth.uid());

-- matching_queue: users can only see their own match requests
CREATE POLICY "users manage own queue entries"
  ON matching_queue FOR ALL
  USING (user_id = auth.uid());

-- resumes: users can only access their own resume metadata
CREATE POLICY "users manage own resumes"
  ON resumes FOR ALL
  USING (user_id = auth.uid());

-- cached_jobs: readable by all authenticated users, writable only by backend (service key)
CREATE POLICY "authenticated users can read cached jobs"
  ON cached_jobs FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## 4. Cloudflare Network-Level Protection

Cloudflare sits between users and Vercel, stopping threats before they reach the application:

| Protection | What It Does |
|---|---|
| DDoS protection | Absorbs flood attacks automatically — unlimited on free tier |
| SSL termination | All traffic encrypted (HTTPS). Padlock handled by Cloudflare — no setup needed |
| Rate limiting | Limits requests per IP per minute — stops bots and brute force |
| Bot protection | Detects and challenges obvious bot traffic before it touches the server |
| IP reputation filtering | Known malicious IPs blocked using Cloudflare's global threat database |

### Rate Limiting Rule (Free Tier — 1 Rule)
Apply the single free rate limiting rule to the most vulnerable endpoint:

```
Rule: /api/jobs/match
Limit: 10 requests per minute per IP
Action: Block for 1 minute
```

This protects the Groq API quota from being burned by repeated requests.

---

## 5. API Key Security

### Two Supabase Keys — Use Correctly

| Key | Prefix | Used In | Risk If Exposed |
|---|---|---|---|
| Anon key | `NEXT_PUBLIC_` | Frontend (browser-safe) | Low — RLS prevents data access |
| Service key | No prefix | Backend only (never browser) | Critical — bypasses ALL RLS |

**The service key must never appear in any frontend file or any file committed to GitHub.**

### Environment Variable Rules
- All secrets stored in `.env.local` on local machine
- `.env.local` listed in `.gitignore` — never committed to GitHub
- Same variables added manually in Vercel dashboard (Project Settings → Environment Variables)
- Variables with `NEXT_PUBLIC_` prefix are safe for the browser
- All other variables are backend-only

---

## 6. Input Validation & File Security

### Text Inputs
- All search queries sanitised before database insertion — no raw SQL
- Supabase's parameterised queries prevent SQL injection by default
- Maximum field lengths enforced on both frontend and backend

### File Uploads
- File type: PDF only — validated by MIME type check, not just file extension
- File size: 5MB maximum — enforced before upload begins
- Files stored in Supabase Storage with a generated UUID filename — never the original filename
- Virus scanning: not available on free tier — mitigated by serving files only back to the owner (never publicly)

---

## 7. Top 5 Security Mistakes to Avoid

### 1. Secrets in Code — Critical
**Mistake:** Writing API keys directly in code files that get pushed to GitHub.  
**Fix:** All secrets in `.env.local`. Add `.env.local` to `.gitignore` before the first commit. Add variables to Vercel dashboard separately.

### 2. Forgetting to Enable RLS — Critical
**Mistake:** Creating Supabase tables without enabling RLS. Any authenticated user can read all other users' data.  
**Fix:** Enable RLS immediately on table creation. No exceptions. Verify in Supabase dashboard — green shield icon confirms RLS is active.

### 3. Trusting User Input Without Validation — Critical
**Mistake:** Accepting any file type or any text without checking it first.  
**Fix:** Validate file type (PDF only), file size (5MB max), and sanitise all text inputs on both frontend and backend.

### 4. Using Service Key on Frontend — Critical
**Mistake:** Using `SUPABASE_SERVICE_KEY` in a frontend file (with `NEXT_PUBLIC_` prefix or in a client component).  
**Fix:** Service key is backend-only. It lives only in server-side API routes. Never in any file the browser can read.

### 5. No Rate Limiting on API Routes — Important
**Mistake:** Leaving AI matching and search endpoints open to unlimited requests, burning through free tier quota.  
**Fix:** Cloudflare rate limiting rule on `/api/jobs/match`. Basic request counting in the queue processor to throttle Groq calls.

---

## 8. GDPR & Privacy Basics

### Current Scope
The app is initially for personal use only. Full GDPR compliance (privacy policy, consent forms, right to deletion flow) is not required until the app is opened to other users.

### Good Habits to Keep Regardless
- Collect only the data actually needed (no unnecessary fields)
- Resume text used only for AI matching — never stored permanently, never shared
- User data never sent to third parties beyond what is documented
- When multi-user launch is planned, add: privacy policy page, consent checkbox on signup, and account deletion flow that removes all associated data

---

## 9. Security Checklist Before Launch

- [ ] RLS enabled on every Supabase table
- [ ] `.env.local` added to `.gitignore` before first commit
- [ ] Service key confirmed absent from all frontend files
- [ ] Resume bucket set to private in Supabase Storage
- [ ] Cloudflare rate limiting rule active on `/api/jobs/match`
- [ ] File upload validation (PDF only, 5MB max) confirmed working
- [ ] Supabase Auth email verification enabled
- [ ] All environment variables set in Vercel dashboard
