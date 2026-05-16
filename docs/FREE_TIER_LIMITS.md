# Free Tier Limits & Scaling Strategy
## JobSpark — Remote Job Search App
**Version:** 1.0

---

## Vercel — Free (Hobby) Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| Bandwidth | 100 GB / month | Very low for personal use | Safe |
| Serverless function calls | 100,000 / day | Each search = 1 call | Safe |
| Function execution time | 10 seconds max per call | Groq responds well under 10s | Safe |
| Cron jobs | 1 free | We need exactly 1 (queue processor) | Safe |
| Deployments | Unlimited | Every GitHub push triggers one | Safe |
| Custom domain | 1 free | 1 domain needed | Safe |

---

## Supabase — Free Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| Database size | 500 MB | Job cache is largest consumer — truncation keeps this low | Watch |
| File storage | 1 GB | 1 resume PDF ≈ 200KB. 1 GB = ~5,000 resumes | Safe |
| Monthly active users | 50,000 | Personal use — 1 user | Safe |
| Egress (data out) | 2 GB / month | Low for personal use | Safe |
| Inactivity pause | Pauses after 7 days | Use weekly or set UptimeRobot ping | Watch |
| Edge functions | 500,000 / month | More than sufficient | Safe |

### Most Likely Limit to Hit First
The 500 MB database size — driven by the `cached_jobs` table. Mitigation:
- Truncate descriptions to 1,500 characters maximum
- Each cached job entry = under 5 KB
- 500 MB holds ~100,000 cached job entries at that rate
- Daily purge removes entries older than 24 hours
- At any one time, cache holds only the last 24 hours of job data

---

## Cloudflare — Free Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| CDN requests | Unlimited | All static assets cached | Safe |
| DDoS protection | Unlimited | Always on, automatic | Safe |
| SSL certificates | Free, automatic | 1 domain covered | Safe |
| Workers (serverless) | 100,000 req / day | Not used in initial build | Safe |
| Rate limiting rules | 1 free rule | 1 rule on `/api/jobs/match` | Safe |

---

## GitHub — Free Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| Repositories | Unlimited | 1 private repo needed | Safe |
| Actions minutes (CI/CD) | 2,000 min / month | Each deploy ≈ 2 min = 1,000 deploys headroom | Safe |
| Collaborators | Unlimited (public repos) | Private repo, solo use — free | Safe |

---

## Groq — Free Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| Requests per day | 14,400 | 1 match per job view — very low solo usage | Safe |
| Requests per minute | 30 | Queue system prevents spikes | Watch |
| Tokens per minute | 6,000 | 1 resume + job desc ≈ 800 tokens. Queue manages this. | Watch |

---

## Remotive API — Free (No Key Required)

| Limit | Detail |
|---|---|
| Rate limit | Not publicly documented — be conservative |
| Mitigation | 1-hour cache in Supabase means API is rarely called |
| Fallback | Arbeitnow API as secondary source |

---

## Resend — Free Tier

| Limit | Free Allowance | Our Usage | Risk |
|---|---|---|---|
| Emails per day | 100 | Personal use — 1 alert email per day | Safe |
| Emails per month | 3,000 | Well within limit | Safe |

---

## Upgrade Paths

### When and What to Pay For

| Service | Trigger to Upgrade | Paid Plan | Monthly Cost | Code Changes |
|---|---|---|---|---|
| Supabase | Database approaching 400 MB | Pro | $25 | None — flip a switch |
| Vercel | Bandwidth approaching 80 GB/month | Pro | $20 | None |
| Groq | Hitting 30 req/min limit frequently | Pay per token | ~$0.01 per 1M tokens | Remove queue throttling |
| Cloudflare | Need more than 1 rate limit rule | Pro | $20 | None |
| Resend | Sending to multiple users | Pro | $20 (50k emails/mo) | None |

### Architecture Decisions That Protect Scalability
- PostgreSQL (Supabase) is the industry standard — data migrates cleanly to any provider
- All secrets in environment variables — switching providers requires only variable updates
- Queue design is provider-agnostic — can swap Supabase queue table for Upstash with minimal changes
- Next.js API routes can become separate microservices later without rewriting business logic
- Caching layer is abstracted — can move from Supabase cache to Redis with one file change

---

## What to Monitor From Day One

### Supabase Dashboard — Check Weekly
- Database size (alert yourself at 400 MB — 80% of 500 MB limit)
- Storage used (alert at 800 MB)
- Number of rows in `cached_jobs` table (alert at 10,000 rows)

### Groq Console — Check During Active Use
- Daily request count vs 14,400 limit
- Tokens per minute during peak use

### Vercel Dashboard — Check Monthly
- Bandwidth consumed vs 100 GB limit
- Function invocations vs 100,000/day limit

### UptimeRobot — Automatic
- Pings app URL every 5 minutes
- Sends email alert if app goes down
- Keeps Supabase awake (prevents inactivity pause)

---

## The Supabase Inactivity Pause — Important

On the free tier, Supabase automatically pauses your database after 7 days of no activity. When paused, the next visitor gets a connection error until you manually unpause from the Supabase dashboard.

**Fix:** Set up UptimeRobot (free) to ping your app URL once every 24 hours. This counts as activity and keeps Supabase running permanently.
