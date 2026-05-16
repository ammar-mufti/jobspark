# Phase 1 — Job Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully working remote job search page backed by the Remotive API, with Supabase caching, dark mode, and the exact design system from DESIGN_SYSTEM.md — no auth required.

**Architecture:** Next.js 14 App Router with TypeScript strict mode. All Supabase access on the search path goes through a backend API route (`/api/jobs/search`) using the service client — the browser never touches Supabase directly. The cache layer sits inside that route: check `cached_jobs` first, call Remotive on miss, strip HTML, truncate to 1,500 chars, store, return.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS + @tailwindcss/forms, Supabase JS v2, Inter (Google Fonts), Material Symbols Outlined

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `package.json` | Create | Dependencies |
| `next.config.js` | Create | Next.js config |
| `tsconfig.json` | Create | TypeScript strict config |
| `tailwind.config.js` | Create | All design tokens from DESIGN_SYSTEM.md |
| `postcss.config.js` | Create | Tailwind PostCSS |
| `.gitignore` | Create | Exclude `.env.local`, `node_modules`, `.next` |
| `.env.local.example` | Create | Variable names, no values |
| `app/globals.css` | Create | Tailwind directives + custom CSS from DESIGN_SYSTEM.md |
| `app/layout.tsx` | Create | Root layout: Inter font, Material Symbols, flash-prevention script |
| `app/page.tsx` | Create | Home — hero + search bar + sidebar + job grid + pagination |
| `app/loading.tsx` | Create | Root loading skeleton |
| `components/Navigation.tsx` | Create | Fixed nav bar with dark mode toggle |
| `components/Footer.tsx` | Create | Footer with JobSpark branding |
| `components/JobCard.tsx` | Create | Single job card with all fields |
| `components/SearchBar.tsx` | Create | Controlled search + location inputs |
| `components/SearchFilters.tsx` | Create | Sidebar checkboxes: job type, date posted |
| `components/JobCardSkeleton.tsx` | Create | Loading placeholder card |
| `lib/config.ts` | Create | Central env var access — one place, typed |
| `lib/supabase.ts` | Create | Anon client (browser) + service client (server only) |
| `lib/theme.ts` | Create | Dark mode toggle + localStorage persistence |
| `lib/cache.ts` | Create | Cache read/write, HTML strip, truncate |
| `lib/remotive.ts` | Create | Remotive API fetch + response mapper |
| `app/api/jobs/search/route.ts` | Create | Search API: validate → cache → Remotive → store → respond |
| `supabase/migrations/001_cached_jobs.sql` | Create | Table schema + RLS policies |
| `vercel.json` | Create | Cron stub (Phase 3 ready) |

---

## Task 1: Project scaffold — Next.js 14 + TypeScript + Tailwind

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `.gitignore`
- Create: `.env.local.example`

- [ ] **Step 1: Initialise the Next.js project**

Run from `C:\Users\Ammar\projects\jobspark`:

```powershell
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --yes
```

Expected output ends with: `Success! Created jobspark`

- [ ] **Step 2: Install additional dependencies**

```powershell
npm install @supabase/supabase-js@2
npm install --save-dev @tailwindcss/forms
```

Expected: both install without errors.

- [ ] **Step 3: Verify `.gitignore` excludes secrets**

Open `.gitignore` and confirm these lines exist. If not, add them:

```
.env.local
.env*.local
```

- [ ] **Step 4: Create `.env.local.example`**

Create `C:\Users\Ammar\projects\jobspark\.env.local.example`:

```bash
# .env.local.example — copy to .env.local and fill in values

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

- [ ] **Step 5: Verify the dev server starts**

```powershell
npm run dev
```

Expected: `ready started server on 0.0.0.0:3000`. Press Ctrl+C to stop.

- [ ] **Step 6: Commit**

```powershell
git init
git add package.json next.config.js tsconfig.json postcss.config.js .gitignore .env.local.example
git commit -m "chore: scaffold Next.js 14 with TypeScript and Tailwind"
```

---

## Task 2: Tailwind config with design tokens

**Files:**
- Modify: `tailwind.config.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.js` with full design token config**

Replace the entire contents of `tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary':                    '#000000',
        'secondary':                  '#006a61',
        'background':                 '#f8f9ff',
        'surface':                    '#f8f9ff',
        'surface-dim':                '#cbdbf5',
        'surface-bright':             '#f8f9ff',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#eff4ff',
        'surface-container':          '#e5eeff',
        'surface-container-high':     '#dce9ff',
        'surface-container-highest':  '#d3e4fe',
        'surface-variant':            '#d3e4fe',
        'on-surface':                 '#0b1c30',
        'on-surface-variant':         '#45464d',
        'outline':                    '#76777d',
        'outline-variant':            '#c6c6cd',
        'secondary-container':        '#86f2e4',
        'secondary-fixed':            '#89f5e7',
        'secondary-fixed-dim':        '#6bd8cb',
        'on-secondary':               '#ffffff',
        'on-secondary-container':     '#006f66',
        'on-secondary-fixed':         '#00201d',
        'on-secondary-fixed-variant': '#005049',
        'tertiary-container':         '#07006c',
        'tertiary-fixed':             '#e1e0ff',
        'tertiary-fixed-dim':         '#c0c1ff',
        'on-tertiary':                '#ffffff',
        'on-tertiary-container':      '#7073ff',
        'on-tertiary-fixed':          '#07006c',
        'on-tertiary-fixed-variant':  '#2f2ebe',
        'primary-container':          '#131b2e',
        'primary-fixed':              '#dae2fd',
        'primary-fixed-dim':          '#bec6e0',
        'on-primary':                 '#ffffff',
        'on-primary-container':       '#7c839b',
        'on-primary-fixed':           '#131b2e',
        'on-primary-fixed-variant':   '#3f465c',
        'inverse-primary':            '#bec6e0',
        'inverse-surface':            '#213145',
        'inverse-on-surface':         '#eaf1ff',
        'error':                      '#ba1a1a',
        'error-container':            '#ffdad6',
        'on-error':                   '#ffffff',
        'on-error-container':         '#93000a',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg':      '0.5rem',
        'xl':      '0.75rem',
        'full':    '9999px',
      },
      spacing: {
        'base':           '8px',
        'stack-sm':       '12px',
        'stack-md':       '24px',
        'stack-lg':       '48px',
        'gutter':         '24px',
        'margin-mobile':  '16px',
        'margin-desktop': '40px',
        'container-max':  '1280px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display':            ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg':        ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md':        ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm':        ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':            ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md':            ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm':            ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':           ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm':           ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '600' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

- [ ] **Step 2: Replace `app/globals.css` with design system CSS**

Replace the entire contents of `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Material Symbols fill states — never use style attribute */
.icon-filled {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}

.icon-outline {
  font-variation-settings: 'FILL' 0, 'wght' 400;
}

/* Smooth theme transition — prevents jarring colour switch */
html {
  transition: background-color 0.2s ease, color 0.2s ease;
}

@layer base {
  body {
    @apply bg-background dark:bg-inverse-surface text-on-surface dark:text-inverse-on-surface;
  }

  input[type='checkbox'] {
    @apply rounded border-outline text-secondary focus:ring-secondary/50;
  }

  select {
    @apply bg-surface-container-lowest dark:bg-surface-container
           border-outline-variant dark:border-outline
           text-primary dark:text-inverse-primary
           rounded focus:ring-secondary/50 focus:border-secondary;
  }
}
```

- [ ] **Step 3: Commit**

```powershell
git add tailwind.config.js app/globals.css
git commit -m "style: configure design tokens and globals from DESIGN_SYSTEM.md"
```

---

## Task 3: Root layout with fonts, icons, and dark mode flash prevention

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx`**

Replace the entire contents with:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JobSpark — Remote Job Search',
  description: 'Find and track remote jobs with AI-powered matching.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&d)){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/layout.tsx
git commit -m "feat: root layout with Inter font, Material Symbols, dark mode flash prevention"
```

---

## Task 4: Central config + Supabase clients

**Files:**
- Create: `lib/config.ts`
- Create: `lib/supabase.ts`

- [ ] **Step 1: Create `lib/config.ts`**

```typescript
// All environment variable access goes through here — never scatter process.env calls.

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const config = {
  supabase: {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    // serviceKey is accessed separately in server-only contexts
  },
  app: {
    url: requireEnv('NEXT_PUBLIC_APP_URL'),
  },
} as const

// Server-only — call only inside API routes or server components
export function getServiceKey(): string {
  return requireEnv('SUPABASE_SERVICE_KEY')
}

export function getCronSecret(): string {
  return requireEnv('CRON_SECRET')
}
```

- [ ] **Step 2: Create `lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'
import { config, getServiceKey } from './config'

// Anon client — safe for browser use. RLS enforced.
export function createAnonClient() {
  return createClient(config.supabase.url, config.supabase.anonKey)
}

// Service client — bypasses RLS. NEVER import in client components.
// Only call from API routes (server-side).
export function createServiceClient() {
  return createClient(config.supabase.url, getServiceKey(), {
    auth: { persistSession: false },
  })
}
```

- [ ] **Step 3: Commit**

```powershell
git add lib/config.ts lib/supabase.ts
git commit -m "feat: central config and Supabase client factories"
```

---

## Task 5: Database migration — cached_jobs with RLS

**Files:**
- Create: `supabase/migrations/001_cached_jobs.sql`

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/001_cached_jobs.sql`:

```sql
-- cached_jobs: stores job listings fetched from Remotive API
-- Cache expires after 1 hour (checked in application layer)
-- Entries older than 24 hours purged by daily cron

CREATE TABLE IF NOT EXISTS cached_jobs (
  id                 TEXT PRIMARY KEY,
  title              TEXT NOT NULL,
  company_name       TEXT NOT NULL,
  company_logo       TEXT,
  category           TEXT,
  job_type           TEXT,
  publication_date   TIMESTAMPTZ,
  location           TEXT,
  salary             TEXT,
  description_text   TEXT,  -- max 1,500 chars, HTML stripped
  url                TEXT NOT NULL,
  tags               TEXT[],
  fetched_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS immediately — before any data is inserted
ALTER TABLE cached_jobs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read cached jobs
CREATE POLICY "authenticated users can read cached jobs"
  ON cached_jobs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only the service role (backend) can write
-- (No explicit INSERT/UPDATE policy needed — service role bypasses RLS)

-- Index for fast fetched_at lookups (cache expiry checks)
CREATE INDEX IF NOT EXISTS cached_jobs_fetched_at_idx ON cached_jobs (fetched_at);
```

- [ ] **Step 2: Run the migration in Supabase**

Open the Supabase dashboard → SQL Editor → paste the contents of `001_cached_jobs.sql` → click Run.

Expected: "Success. No rows returned."

Verify in Table Editor: `cached_jobs` table exists with a green shield icon (RLS active).

- [ ] **Step 3: Commit**

```powershell
git add supabase/migrations/001_cached_jobs.sql
git commit -m "feat: cached_jobs table with RLS — authenticated read, service write"
```

---

## Task 6: Dark mode toggle utility

**Files:**
- Create: `lib/theme.ts`

- [ ] **Step 1: Create `lib/theme.ts`**

```typescript
export function toggleDarkMode(): void {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}

export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/theme.ts
git commit -m "feat: dark mode toggle with localStorage persistence"
```

---

## Task 7: Cache layer — read, write, HTML strip, truncate

**Files:**
- Create: `lib/cache.ts`

- [ ] **Step 1: Create `lib/cache.ts`**

```typescript
import { createServiceClient } from './supabase'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

export interface CachedJob {
  id: string
  title: string
  company_name: string
  company_logo: string | null
  category: string | null
  job_type: string | null
  publication_date: string | null
  location: string | null
  salary: string | null
  description_text: string | null
  url: string
  tags: string[]
  fetched_at: string
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd()
}

export async function getCachedJobs(
  query: string,
  location: string
): Promise<CachedJob[] | null> {
  const supabase = createServiceClient()
  const cutoff = new Date(Date.now() - CACHE_TTL_MS).toISOString()

  const { data, error } = await supabase
    .from('cached_jobs')
    .select('*')
    .gte('fetched_at', cutoff)
    .ilike('title', `%${query}%`)
    .order('publication_date', { ascending: false })
    .limit(50)

  if (error) {
    console.error('[cache] read error:', error.message)
    return null
  }

  if (!data || data.length === 0) return null

  if (location) {
    const loc = location.toLowerCase()
    return (data as CachedJob[]).filter(
      (j) => !j.location || j.location.toLowerCase().includes(loc)
    )
  }

  return data as CachedJob[]
}

export async function storeCachedJobs(jobs: CachedJob[]): Promise<void> {
  if (jobs.length === 0) return
  const supabase = createServiceClient()

  const { error } = await supabase
    .from('cached_jobs')
    .upsert(jobs, { onConflict: 'id' })

  if (error) {
    console.error('[cache] write error:', error.message)
  }
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/cache.ts
git commit -m "feat: cache layer with HTML stripping and 1,500-char truncation"
```

---

## Task 8: Remotive API client + response mapper

**Files:**
- Create: `lib/remotive.ts`

- [ ] **Step 1: Create `lib/remotive.ts`**

```typescript
import { CachedJob, stripHtml, truncate } from './cache'

const REMOTIVE_API = 'https://remotive.com/api/remote-jobs'
const DESCRIPTION_MAX = 1500

interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo: string
  category: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
  tags: string[]
}

interface RemotiveResponse {
  jobs: RemotiveJob[]
}

export async function fetchRemotiveJobs(
  search: string,
  limit: number = 50
): Promise<CachedJob[]> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  params.set('limit', String(limit))

  const res = await fetch(`${REMOTIVE_API}?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 }, // never cache at the Next.js layer — we manage cache ourselves
  })

  if (!res.ok) {
    throw new Error(`Remotive API error: ${res.status} ${res.statusText}`)
  }

  const data: RemotiveResponse = await res.json()

  return data.jobs.map((job): CachedJob => ({
    id: String(job.id),
    title: job.title,
    company_name: job.company_name,
    company_logo: job.company_logo || null,
    category: job.category || null,
    job_type: job.job_type || null,
    publication_date: job.publication_date || null,
    location: job.candidate_required_location || null,
    salary: job.salary || null,
    description_text: truncate(stripHtml(job.description || ''), DESCRIPTION_MAX),
    url: job.url,
    tags: job.tags || [],
    fetched_at: new Date().toISOString(),
  }))
}
```

- [ ] **Step 2: Commit**

```powershell
git add lib/remotive.ts
git commit -m "feat: Remotive API client with HTML stripping and field mapping"
```

---

## Task 9: Job search API route

**Files:**
- Create: `app/api/jobs/search/route.ts`

- [ ] **Step 1: Create the directory and route file**

Create `app/api/jobs/search/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCachedJobs, storeCachedJobs } from '@/lib/cache'
import { fetchRemotiveJobs } from '@/lib/remotive'

export const runtime = 'nodejs'

function sanitise(value: string): string {
  return value.replace(/[<>"'%;()&+]/g, '').slice(0, 100).trim()
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawQuery = searchParams.get('q') ?? ''
    const rawLocation = searchParams.get('location') ?? ''
    const rawJobType = searchParams.get('job_type') ?? ''

    const query = sanitise(rawQuery)
    const location = sanitise(rawLocation)
    const jobType = sanitise(rawJobType)

    // 1. Check cache first
    const cached = await getCachedJobs(query, location)
    if (cached && cached.length > 0) {
      const filtered = jobType
        ? cached.filter((j) => j.job_type?.toLowerCase() === jobType.toLowerCase())
        : cached
      return NextResponse.json({ jobs: filtered, source: 'cache' })
    }

    // 2. Cache miss — call Remotive
    const jobs = await fetchRemotiveJobs(query || 'software')

    // 3. Store for future requests (fire and forget — don't block response)
    storeCachedJobs(jobs).catch((err) =>
      console.error('[search] cache write failed:', err)
    )

    // 4. Apply filters and return
    let results = jobs
    if (location) {
      const loc = location.toLowerCase()
      results = results.filter(
        (j) => !j.location || j.location.toLowerCase().includes(loc)
      )
    }
    if (jobType) {
      results = results.filter(
        (j) => j.job_type?.toLowerCase() === jobType.toLowerCase()
      )
    }

    return NextResponse.json({ jobs: results, source: 'api' })
  } catch (err) {
    console.error('[search] unhandled error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch jobs. Please try again.' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 2: Test the API route manually**

Start the dev server (`npm run dev`) then open:

```
http://localhost:3000/api/jobs/search?q=react&location=remote
```

Expected: JSON response `{ jobs: [...], source: "api" }` with an array of job objects.

Second request to the same URL:

Expected: `source: "cache"` in the response (if Supabase is connected) or `source: "api"` again (if Supabase not yet connected — that's fine for now).

- [ ] **Step 3: Commit**

```powershell
git add app/api/jobs/search/route.ts
git commit -m "feat: job search API route with cache-first strategy and input sanitisation"
```

---

## Task 10: Navigation component

**Files:**
- Create: `components/Navigation.tsx`

- [ ] **Step 1: Create `components/Navigation.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toggleDarkMode } from '@/lib/theme'

interface NavigationProps {
  activePage?: 'jobs' | 'tracker' | 'resumes'
  showSearchBar?: boolean
}

export default function Navigation({
  activePage = 'jobs',
  showSearchBar = false,
}: NavigationProps) {
  const [isDark, setIsDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function handleToggleDark() {
    toggleDarkMode()
    setIsDark((prev) => !prev)
  }

  const linkBase =
    'transition-colors text-label-md'
  const activeLink =
    'text-secondary dark:text-secondary-fixed-dim font-bold border-b-2 border-secondary dark:border-secondary-fixed-dim pb-1'
  const inactiveLink =
    'text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim'

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 bg-surface dark:bg-inverse-surface shadow-sm dark:shadow-none dark:border-b dark:border-outline">
      {/* Logo */}
      <Link
        href="/"
        className="text-headline-md font-bold text-primary dark:text-inverse-primary"
      >
        JobSpark
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6">
        <Link href="/" className={`${linkBase} ${activePage === 'jobs' ? activeLink : inactiveLink}`}>
          Jobs
        </Link>
        <Link href="/tracker" className={`${linkBase} ${activePage === 'tracker' ? activeLink : inactiveLink}`}>
          Tracker
        </Link>
        <Link href="/resume" className={`${linkBase} ${activePage === 'resumes' ? activeLink : inactiveLink}`}>
          My Resumes
        </Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Inline search bar — shown on inner pages */}
        {showSearchBar && (
          <div className="hidden md:flex items-center gap-2 bg-surface-container dark:bg-surface-container px-3 py-2 rounded-lg border border-outline-variant dark:border-outline">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-sm text-on-surface dark:text-inverse-on-surface placeholder:text-on-surface-variant w-40 outline-none"
              placeholder="Search jobs..."
              type="text"
            />
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={handleToggleDark}
          className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container"
          aria-label="Toggle dark mode"
        >
          <span className={`material-symbols-outlined ${isDark ? 'hidden' : 'block'}`}>dark_mode</span>
          <span className={`material-symbols-outlined ${isDark ? 'block' : 'hidden'}`}>light_mode</span>
        </button>

        {/* Notifications */}
        <button className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        {/* Avatar placeholder — replaced with real avatar in Phase 2 */}
        <div className="w-8 h-8 rounded-full bg-surface-container dark:bg-surface-container border border-outline-variant flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-on-surface-variant p-2"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 w-full bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline flex flex-col gap-1 px-4 py-4 md:hidden">
          <Link href="/" className={`${linkBase} py-2 ${activePage === 'jobs' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            Jobs
          </Link>
          <Link href="/tracker" className={`${linkBase} py-2 ${activePage === 'tracker' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            Tracker
          </Link>
          <Link href="/resume" className={`${linkBase} py-2 ${activePage === 'resumes' ? 'text-secondary dark:text-secondary-fixed-dim font-bold' : inactiveLink}`}>
            My Resumes
          </Link>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/Navigation.tsx
git commit -m "feat: Navigation component with dark mode toggle and mobile menu"
```

---

## Task 11: Footer component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-surface-container-low dark:bg-primary-container border-t border-outline-variant dark:border-outline mt-16">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Wordmark */}
          <span className="text-headline-sm font-bold text-primary dark:text-inverse-primary">
            JobSpark
          </span>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {['About Us', 'Support', 'Privacy Policy', 'Terms of Service', 'Careers'].map(
              (label) => (
                <Link
                  key={label}
                  href="#"
                  className="text-body-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors"
                >
                  {label}
                </Link>
              )
            )}
          </div>

          {/* Copyright */}
          <p className="text-body-sm text-on-surface-variant dark:text-surface-variant text-center md:text-right">
            © 2025 JobSpark. All rights reserved.
            <br />
            Precision in every step.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/Footer.tsx
git commit -m "feat: Footer component with JobSpark branding and links"
```

---

## Task 12: JobCard component

**Files:**
- Create: `components/JobCard.tsx`

- [ ] **Step 1: Create `components/JobCard.tsx`**

```tsx
import type { CachedJob } from '@/lib/cache'

interface JobCardProps {
  job: CachedJob
  matchScore?: number
}

function MatchBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <div className="flex items-center gap-1 bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-[16px]">check_circle</span>
        <span className="text-label-sm">{score}% Match</span>
      </div>
    )
  }
  if (score >= 50) {
    return (
      <div className="flex items-center gap-1 bg-surface-container-highest dark:bg-surface-container text-tertiary-container dark:text-on-tertiary-container px-3 py-1 rounded-full">
        <span className="material-symbols-outlined text-[16px]">trending_up</span>
        <span className="text-label-sm">{score}% Match</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 bg-surface-container dark:bg-surface-container text-on-surface-variant dark:text-surface-variant px-3 py-1 rounded-full">
      <span className="material-symbols-outlined text-[16px]">remove</span>
      <span className="text-label-sm">{score}% Match</span>
    </div>
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Unknown date'
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  if (days < 60) return '1 month ago'
  return `${Math.floor(days / 30)} months ago`
}

export default function JobCard({ job, matchScore }: JobCardProps) {
  const accentClass =
    matchScore !== undefined
      ? matchScore >= 80
        ? 'bg-secondary dark:bg-secondary-fixed-dim'
        : matchScore >= 50
        ? 'bg-tertiary-container dark:bg-on-tertiary-container'
        : null
      : null

  return (
    <div className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/30 dark:border-outline/30 hover:border-secondary dark:hover:border-secondary-fixed-dim hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)] dark:hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      {/* Top accent line */}
      {accentClass && (
        <div className={`absolute top-0 left-0 w-full h-1 ${accentClass}`} />
      )}

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Company logo */}
        <div className="w-12 h-12 rounded-lg border border-outline-variant/20 dark:border-outline/20 flex items-center justify-center bg-surface dark:bg-surface-container overflow-hidden flex-shrink-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={`${job.company_name} logo`}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
              business
            </span>
          )}
        </div>

        {/* Match badge */}
        {matchScore !== undefined && <MatchBadge score={matchScore} />}

        {/* Bookmark — Phase 2: implement with auth */}
        <button
          className="text-on-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors p-1 ml-auto"
          aria-label="Bookmark job"
          disabled
        >
          <span className="material-symbols-outlined">bookmark_border</span>
        </button>
      </div>

      {/* Job title */}
      <h3 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-1 line-clamp-2">
        {job.title}
      </h3>

      {/* Company */}
      <p className="text-body-sm text-on-surface-variant dark:text-surface-variant mb-3">
        {job.company_name}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.job_type && (
          <span className="px-2 py-1 bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-variant rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.job_type}
          </span>
        )}
        {job.location && (
          <span className="px-2 py-1 bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="px-2 py-1 bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-variant rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
            {job.salary}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-1 text-body-sm text-on-surface-variant dark:text-surface-variant mt-auto">
        <span className="material-symbols-outlined text-[14px]">schedule</span>
        <span>{formatDate(job.publication_date)}</span>
      </div>

      {/* Apply button */}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-4 py-2 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2"
      >
        Apply Now
        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/JobCard.tsx
git commit -m "feat: JobCard component with match badge, tags, and apply button"
```

---

## Task 13: JobCardSkeleton component

**Files:**
- Create: `components/JobCardSkeleton.tsx`

- [ ] **Step 1: Create `components/JobCardSkeleton.tsx`**

```tsx
export default function JobCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/30 dark:border-outline/30 flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-surface-container-high flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 bg-surface-container dark:bg-surface-container-high rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface-container dark:bg-surface-container-high rounded w-1/2" />
        </div>
      </div>
      {/* Title */}
      <div className="h-5 bg-surface-container dark:bg-surface-container-high rounded w-full mb-2" />
      <div className="h-5 bg-surface-container dark:bg-surface-container-high rounded w-2/3 mb-4" />
      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-surface-container dark:bg-surface-container-high rounded-lg" />
        <div className="h-6 w-20 bg-surface-container dark:bg-surface-container-high rounded-lg" />
      </div>
      {/* Button */}
      <div className="h-9 bg-surface-container dark:bg-surface-container-high rounded-lg mt-auto" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/JobCardSkeleton.tsx
git commit -m "feat: JobCardSkeleton loading placeholder"
```

---

## Task 14: SearchBar component

**Files:**
- Create: `components/SearchBar.tsx`

- [ ] **Step 1: Create `components/SearchBar.tsx`**

```tsx
'use client'

interface SearchBarProps {
  query: string
  location: string
  onQueryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
}

export default function SearchBar({
  query,
  location,
  onQueryChange,
  onLocationChange,
  onSearch,
}: SearchBarProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-0 bg-surface-container-lowest dark:bg-surface-container rounded-xl shadow-sm dark:shadow-none border border-outline-variant/50 dark:border-outline overflow-hidden"
    >
      {/* Job title input */}
      <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 dark:border-outline/30 py-3 md:py-0">
        <span className="material-symbols-outlined text-on-surface-variant mr-3 flex-shrink-0">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0 outline-none"
          placeholder="Job title, keywords, or company"
        />
      </div>

      {/* Location input */}
      <div className="flex-1 flex items-center px-4 py-3 md:py-0">
        <span className="material-symbols-outlined text-on-surface-variant mr-3 flex-shrink-0">location_on</span>
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0 outline-none"
          placeholder="City, state, or remote"
        />
      </div>

      {/* Search button */}
      <button
        type="submit"
        className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-8 py-4 md:py-3 hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        Search
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/SearchBar.tsx
git commit -m "feat: SearchBar component with controlled inputs"
```

---

## Task 15: SearchFilters component

**Files:**
- Create: `components/SearchFilters.tsx`

- [ ] **Step 1: Create `components/SearchFilters.tsx`**

```tsx
'use client'

interface Filters {
  jobType: string[]
  datePosted: string
}

interface SearchFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}

const JOB_TYPES = ['full_time', 'part_time', 'contract', 'freelance', 'internship']
const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

const DATE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
]

export default function SearchFilters({ filters, onChange, onClear }: SearchFiltersProps) {
  function toggleJobType(type: string) {
    const current = filters.jobType
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    onChange({ ...filters, jobType: updated })
  }

  function setDatePosted(value: string) {
    onChange({ ...filters, datePosted: value })
  }

  return (
    <aside className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/50 dark:border-outline/30 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-headline-sm text-primary dark:text-inverse-primary">Filters</h2>
        <button
          onClick={onClear}
          className="text-label-sm text-secondary dark:text-secondary-fixed-dim hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Job type */}
      <div className="py-4 border-t border-outline-variant/30 dark:border-outline/30">
        <h3 className="text-label-md text-primary dark:text-inverse-primary mb-3">Job Type</h3>
        <div className="flex flex-col gap-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.jobType.includes(type)}
                onChange={() => toggleJobType(type)}
                className="rounded border-outline text-secondary focus:ring-secondary/50"
              />
              <span className="text-body-md text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
                {JOB_TYPE_LABELS[type]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date posted */}
      <div className="py-4 border-t border-outline-variant/30 dark:border-outline/30">
        <h3 className="text-label-md text-primary dark:text-inverse-primary mb-3">Date Posted</h3>
        <div className="flex flex-col gap-2">
          {DATE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="datePosted"
                value={opt.value}
                checked={filters.datePosted === opt.value}
                onChange={() => setDatePosted(opt.value)}
                className="border-outline text-secondary focus:ring-secondary/50"
              />
              <span className="text-body-md text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add components/SearchFilters.tsx
git commit -m "feat: SearchFilters sidebar with job type and date posted filters"
```

---

## Task 16: Home page — hero + search + grid + pagination

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx`**

Replace the entire contents with:

```tsx
'use client'

import { useState, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import SearchFilters from '@/components/SearchFilters'
import JobCard from '@/components/JobCard'
import JobCardSkeleton from '@/components/JobCardSkeleton'
import type { CachedJob } from '@/lib/cache'

interface Filters {
  jobType: string[]
  datePosted: string
}

const JOBS_PER_PAGE = 12

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [filters, setFilters] = useState<Filters>({ jobType: [], datePosted: '' })
  const [jobs, setJobs] = useState<CachedJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)

  const filteredJobs = jobs.filter((job) => {
    if (filters.jobType.length > 0) {
      const jt = (job.job_type ?? '').toLowerCase().replace(/[- ]/g, '_')
      if (!filters.jobType.some((t) => jt.includes(t))) return false
    }
    if (filters.datePosted) {
      if (!job.publication_date) return false
      const days = parseInt(filters.datePosted, 10)
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      if (new Date(job.publication_date).getTime() < cutoff) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))
  const currentJobs = filteredJobs.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSearched(true)
    setPage(1)

    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (location) params.set('location', location)

      const res = await fetch(`/api/jobs/search?${params.toString()}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setJobs(data.jobs ?? [])
    } catch (err) {
      setError('Unable to load jobs right now. Please try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }, [query, location])

  function handleClearFilters() {
    setFilters({ jobType: [], datePosted: '' })
    setPage(1)
  }

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activePage="jobs" />

      {/* Hero */}
      <section className="bg-surface-container-low dark:bg-surface-container pt-28 pb-12 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-headline-lg md:text-display text-primary dark:text-inverse-primary mb-3 font-bold">
            Find your next remote job
          </h1>
          <p className="text-body-lg text-on-surface-variant dark:text-surface-variant mb-8 max-w-2xl">
            Search thousands of remote positions and get AI-powered match scores based on your resume.
          </p>
          <SearchBar
            query={query}
            location={location}
            onQueryChange={setQuery}
            onLocationChange={setLocation}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-8">
        {!searched ? (
          /* Pre-search empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline mb-4">work</span>
            <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
              Start your job search
            </h2>
            <p className="text-body-md text-on-surface-variant dark:text-surface-variant max-w-sm">
              Search by job title, keywords, or company name above to see remote opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-gutter">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <SearchFilters
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </aside>

            {/* Results */}
            <div>
              {/* Loading state */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="material-symbols-outlined text-[48px] text-error mb-4">error_outline</span>
                  <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
                    Something went wrong
                  </h2>
                  <p className="text-body-md text-on-surface-variant dark:text-surface-variant mb-6">
                    {error}
                  </p>
                  <button
                    onClick={handleSearch}
                    className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-6 py-2 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Empty results */}
              {!loading && !error && filteredJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="material-symbols-outlined text-[48px] text-outline mb-4">search_off</span>
                  <h2 className="text-headline-sm text-on-surface dark:text-inverse-on-surface mb-2">
                    No results found
                  </h2>
                  <p className="text-body-md text-on-surface-variant dark:text-surface-variant max-w-sm">
                    Try different keywords or remove some filters.
                  </p>
                </div>
              )}

              {/* Results count */}
              {!loading && !error && filteredJobs.length > 0 && (
                <>
                  <p className="text-body-sm text-on-surface-variant dark:text-surface-variant mb-4">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {currentJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 border border-outline-variant dark:border-outline rounded-lg hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-on-surface-variant dark:text-surface-variant disabled:opacity-40"
                        aria-label="Previous page"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                          acc.push(p)
                          return acc
                        }, [])
                        .map((p, idx) =>
                          p === '...' ? (
                            <span key={`ellipsis-${idx}`} className="text-on-surface-variant px-2">
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setPage(p as number)}
                              className={
                                page === p
                                  ? 'w-10 h-10 flex items-center justify-center rounded-lg bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md'
                                  : 'w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant dark:border-outline text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-label-md'
                              }
                            >
                              {p}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 border border-outline-variant dark:border-outline rounded-lg hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-on-surface-variant dark:text-surface-variant disabled:opacity-40"
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add app/page.tsx
git commit -m "feat: home page with hero, search bar, filter sidebar, job grid, pagination, and all states"
```

---

## Task 17: Vercel config stub

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/queue",
      "schedule": "* * * * *"
    }
  ]
}
```

- [ ] **Step 2: Commit**

```powershell
git add vercel.json
git commit -m "chore: vercel.json with cron stub ready for Phase 3"
```

---

## Task 18: End-to-end verification

- [ ] **Step 1: Start the dev server**

```powershell
npm run dev
```

Expected: no TypeScript errors, server starts on port 3000.

- [ ] **Step 2: Verify the home page loads**

Open `http://localhost:3000`. Expected:
- Navigation bar visible with "JobSpark" wordmark
- Dark mode toggle icon visible
- Hero section with headline and search bar
- Pre-search empty state ("Start your job search")

- [ ] **Step 3: Perform a search**

Type "React" in the search box, click Search. Expected:
- Loading skeletons appear
- Job cards render with title, company, tags, and Apply button
- Results count shows (e.g., "24 jobs found")

- [ ] **Step 4: Test dark mode**

Click the dark mode toggle icon. Expected:
- Page switches to dark colour scheme instantly
- Refresh the page — dark mode persists (no flash of light mode)

- [ ] **Step 5: Test pagination**

If more than 12 results appear, pagination buttons are visible and clicking them changes the visible cards.

- [ ] **Step 6: Run TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 7: Run build**

```powershell
npm run build
```

Expected: build completes successfully, no errors.

- [ ] **Step 8: Final commit**

```powershell
git add -A
git commit -m "chore: Phase 1 complete — verified locally"
```

---

## Self-Review Notes

**Spec coverage check:**
- Job search page with hero, search bar, sidebar, cards, pagination — Task 16 ✓
- Supabase cache layer (read, write, HTML strip, truncate 1,500 chars) — Tasks 5, 7 ✓
- Remotive API client with field mapping — Task 8 ✓
- Search API route (validate, cache-first, error handling) — Task 9 ✓
- Navigation with dark mode toggle and JobSpark wordmark — Task 10 ✓
- Footer with JobSpark branding — Task 11 ✓
- Dark mode flash prevention script in layout — Task 3 ✓
- RLS enabled immediately on `cached_jobs` creation — Task 5 ✓
- Service key only in server-side code (lib/supabase.ts + API route) — Tasks 4, 9 ✓
- Central env var config — Task 4 ✓
- TypeScript strict mode — tsconfig set in Task 1 ✓
- Empty state, error state, loading skeleton — Task 16 ✓
- Bookmark button as visual-only placeholder (Phase 2) — Task 12 ✓
- `.gitignore` excludes `.env.local` — Task 1 ✓
- `.env.local.example` with all variable names — Task 1 ✓

**Type consistency check:**
- `CachedJob` defined in `lib/cache.ts`, imported in `lib/remotive.ts`, `components/JobCard.tsx`, and `app/page.tsx` — consistent ✓
- `Filters` interface defined inline in both `SearchFilters.tsx` and `page.tsx` — same shape ✓
- `createServiceClient()` called in `lib/cache.ts` — defined in `lib/supabase.ts` ✓
- `fetchRemotiveJobs` returns `CachedJob[]` — matches what `storeCachedJobs` expects ✓

**No placeholders detected.**
