# Design System
## JobSpark
**Version:** 1.1

> This file is the single source of truth for all visual decisions.
> Claude Code must follow these tokens exactly when building new components.
> Do not override component styling with generic Tailwind defaults.
> Do not use inline styles anywhere — all styling must use Tailwind utility classes or CSS classes defined in globals.css.
> Dark mode is a required feature, not optional. Every component must support both light and dark variants.

---

## 1. Font

**Family:** Inter (Google Fonts)
**Import in `app/layout.tsx`:**
```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
```

| Token | Size | Weight | Line Height | Letter Spacing | Used For |
|---|---|---|---|---|---|
| `text-display` | 48px | 700 | 56px | -0.02em | Hero headline |
| `text-headline-lg` | 32px | 600 | 40px | -0.01em | Page titles |
| `text-headline-md` | 24px | 600 | 32px | — | Section titles, nav brand |
| `text-headline-sm` | 20px | 600 | 28px | — | Job card titles |
| `text-body-lg` | 18px | 400 | 28px | — | Hero subtext |
| `text-body-md` | 16px | 400 | 24px | — | Body text, inputs |
| `text-body-sm` | 14px | 400 | 20px | — | Meta info, dates, captions |
| `text-label-md` | 14px | 500 | 20px | 0.01em | Nav links, buttons |
| `text-label-sm` | 12px | 600 | 16px | 0.02em | Badges, tags, chips |

**Mobile headline override:**
`text-headline-lg-mobile` → 24px / 600 / 32px (applied at `md:` breakpoint and below)

---

## 2. Colour Palette

### Light Mode

| Token | Hex | Tailwind Class | Used For |
|---|---|---|---|
| `primary` | `#000000` | `text-primary` / `bg-primary` | Headings, logo, primary text |
| `secondary` | `#006a61` | `text-secondary` / `bg-secondary` | Brand teal — buttons, active states |
| `background` | `#f8f9ff` | `bg-background` | Page background |
| `surface` | `#f8f9ff` | `bg-surface` | Default surface |
| `surface-container-lowest` | `#ffffff` | `bg-surface-container-lowest` | Cards, modals, search bar |
| `surface-container-low` | `#eff4ff` | `bg-surface-container-low` | Hero section, sidebar |
| `surface-container` | `#e5eeff` | `bg-surface-container` | Hover states, selected items |
| `surface-container-high` | `#dce9ff` | `bg-surface-container-high` | Elevated surfaces |
| `surface-container-highest` | `#d3e4fe` | `bg-surface-container-highest` | Match medium badge bg |
| `on-surface` | `#0b1c30` | `text-on-surface` | Primary body text |
| `on-surface-variant` | `#45464d` | `text-on-surface-variant` | Secondary / muted text |
| `outline` | `#76777d` | `text-outline` / `border-outline` | Icon default colour, borders |
| `outline-variant` | `#c6c6cd` | `border-outline-variant` | Card borders, dividers |
| `secondary-container` | `#86f2e4` | `bg-secondary-container` | High match badge bg |
| `on-secondary-container` | `#006f66` | `text-on-secondary-container` | High match badge text |
| `on-secondary` | `#ffffff` | `text-on-secondary` | Text on secondary buttons |
| `on-secondary-fixed` | `#00201d` | `bg-on-secondary-fixed` | Button hover bg |
| `tertiary-container` | `#07006c` | `text-tertiary-container` | Medium match accent, indigo |
| `on-tertiary-container` | `#7073ff` | `text-on-tertiary-container` | Medium match text |
| `error` | `#ba1a1a` | `text-error` / `bg-error` | Error states |

### Dark Mode

Dark mode is enabled via the `class` strategy (`darkMode: 'class'`). The `dark` class is toggled on the `<html>` element. Every component must define `dark:` variants for every colour class.

| Purpose | Dark Token | Hex | Tailwind Dark Class |
|---|---|---|---|
| Page background | `inverse-surface` | `#213145` | `dark:bg-inverse-surface` |
| Card / modal bg | `primary-container` | `#131b2e` | `dark:bg-primary-container` |
| Surface container | `surface-container` (dark) | `#1c2a40` | `dark:bg-surface-container` |
| Nav background | `inverse-surface` | `#213145` | `dark:bg-inverse-surface` |
| Primary text | `inverse-on-surface` | `#eaf1ff` | `dark:text-inverse-on-surface` |
| Secondary text | `surface-variant` | `#d3e4fe` | `dark:text-surface-variant` |
| Brand teal | `secondary-fixed-dim` | `#6bd8cb` | `dark:text-secondary-fixed-dim` |
| Button bg | `secondary-fixed-dim` | `#6bd8cb` | `dark:bg-secondary-fixed-dim` |
| Button text | `on-secondary-fixed` | `#00201d` | `dark:text-on-secondary-fixed` |
| High match badge bg | `on-secondary-fixed-variant` | `#005049` | `dark:bg-on-secondary-fixed-variant` |
| High match badge text | `secondary-fixed` | `#89f5e7` | `dark:text-secondary-fixed` |
| Medium match badge bg | `surface-container` | `#1c2a40` | `dark:bg-surface-container` |
| Medium match text | `on-tertiary-container` | `#7073ff` | `dark:text-on-tertiary-container` |
| Card borders | `outline` | `#76777d` | `dark:border-outline` |
| Logo / headings | `inverse-primary` | `#bec6e0` | `dark:text-inverse-primary` |

### Dark Mode Toggle — Implementation

```tsx
// lib/theme.ts
export function toggleDarkMode() {
  const html = document.documentElement
  if (html.classList.contains('dark')) {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  } else {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }
}
```

```tsx
// app/layout.tsx — add before </head> to prevent flash of wrong theme
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  })();
` }} />
```

---

## 3. Border Radius

| Token | Value | Tailwind Class | Used For |
|---|---|---|---|
| `DEFAULT` | 4px | `rounded` | Checkboxes, small inputs, selects |
| `lg` | 8px | `rounded-lg` | Buttons, tags, badges, chips |
| `xl` | 12px | `rounded-xl` | Cards, modals, search bar, panels |
| `full` | 9999px | `rounded-full` | Match pills, avatar, active pagination |

---

## 4. Spacing System

All spacing is a multiple of the 8px base unit.

| Token | Value | Tailwind Class | Used For |
|---|---|---|---|
| `base` | 8px | `p-base` / `m-base` | Base unit |
| `stack-sm` | 12px | `gap-stack-sm` | Tight stacks inside cards |
| `stack-md` | 24px | `gap-stack-md` | Between card sections |
| `stack-lg` | 48px | `gap-stack-lg` | Between page sections |
| `gutter` | 24px | `gap-gutter` | Grid column gap |
| `margin-mobile` | 16px | `px-margin-mobile` | Page horizontal padding on mobile |
| `margin-desktop` | 40px | `px-margin-desktop` | Page horizontal padding on desktop |
| `container-max` | 1280px | `max-w-container-max` | Max content width |

---

## 5. Elevation & Shadow

| Context | Light Mode Class | Dark Mode Class |
|---|---|---|
| Nav bar | `shadow-sm` | `dark:shadow-none dark:border-b dark:border-outline` |
| Cards default | `border border-outline-variant/30` | `dark:border-outline/30` |
| Cards hover | `hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)]` | `dark:hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)]` |
| Search bar | `shadow-sm border border-outline-variant/50` | `dark:shadow-none dark:border dark:border-outline` |
| Sidebar | `shadow-sm` | `dark:shadow-none` |

---

## 6. Icon Library

**Library:** Material Symbols Outlined
**Import in `app/layout.tsx`:**
```html
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
  rel="stylesheet"
/>
```

**Usage — always via className, never with style attribute:**
```tsx
// Outline state (default)
<span className="material-symbols-outlined">bookmark_border</span>

// Filled / active state
<span className="material-symbols-outlined icon-filled">bookmark</span>
```

**Icons used in the app:**

| Icon Name | Used For | State |
|---|---|---|
| `search` | Search input prefix | Outline |
| `location_on` | Location input prefix | Outline |
| `bookmark_border` | Unsaved job | Outline |
| `bookmark` | Saved job | Filled (`icon-filled`) |
| `notifications` | Alerts button in nav | Outline |
| `check_circle` | High match indicator | Outline |
| `trending_up` | Medium match indicator | Outline |
| `remove` | Low match indicator | Outline |
| `chevron_left` | Pagination previous | Outline |
| `chevron_right` | Pagination next | Outline |
| `dark_mode` | Toggle to dark (moon icon) | Outline |
| `light_mode` | Toggle to light (sun icon) | Outline |
| `upload_file` | Resume upload | Outline |
| `delete` | Remove bookmark / application | Outline |

---

## 7. Component Patterns

All class names are Tailwind utility classes. No style attributes permitted anywhere.

### Job Card

```tsx
<div className="
  bg-surface-container-lowest dark:bg-primary-container
  rounded-xl p-6
  border border-outline-variant/30 dark:border-outline/30
  hover:border-secondary dark:hover:border-secondary-fixed-dim
  hover:shadow-[0px_10px_30px_rgba(15,23,42,0.1)]
  dark:hover:shadow-[0px_10px_30px_rgba(0,0,0,0.4)]
  transition-all duration-300
  flex flex-col h-full group relative overflow-hidden
">
  {/* Top accent line — high match */}
  <div className="absolute top-0 left-0 w-full h-1 bg-secondary dark:bg-secondary-fixed-dim" />
  {/* Top accent line — medium match */}
  <div className="absolute top-0 left-0 w-full h-1 bg-tertiary-container dark:bg-on-tertiary-container" />
</div>
```

### Match Score Badge

```tsx
{/* High match — score >= 80 */}
<div className="flex items-center gap-1 bg-secondary-container dark:bg-on-secondary-fixed-variant text-on-secondary-container dark:text-secondary-fixed px-3 py-1 rounded-full">
  <span className="material-symbols-outlined text-[16px]">check_circle</span>
  <span className="text-label-sm">{score}% Match</span>
</div>

{/* Medium match — score 50–79 */}
<div className="flex items-center gap-1 bg-surface-container-highest dark:bg-surface-container text-tertiary-container dark:text-on-tertiary-container px-3 py-1 rounded-full">
  <span className="material-symbols-outlined text-[16px]">trending_up</span>
  <span className="text-label-sm">{score}% Match</span>
</div>

{/* Low match — score < 50 */}
<div className="flex items-center gap-1 bg-surface-container dark:bg-surface-container text-on-surface-variant dark:text-surface-variant px-3 py-1 rounded-full">
  <span className="material-symbols-outlined text-[16px]">remove</span>
  <span className="text-label-sm">{score}% Match</span>
</div>
```

### Tags / Badges

```tsx
{/* Default tag */}
<span className="px-2 py-1 bg-surface dark:bg-surface-container text-on-surface-variant dark:text-surface-variant rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
  Full-time
</span>

{/* Remote tag */}
<span className="px-2 py-1 bg-surface-container dark:bg-surface-container-high text-primary dark:text-inverse-primary rounded-lg text-label-sm border border-outline-variant/20 dark:border-outline/20">
  Remote
</span>
```

### Primary Button

```tsx
<button className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-8 py-3 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors duration-200 flex items-center justify-center gap-2">
  Search
</button>
```

### Navigation Bar

```tsx
<nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop h-16 bg-surface dark:bg-inverse-surface shadow-sm dark:shadow-none dark:border-b dark:border-outline">

  {/* Logo — always JobSpark, never CareerMomentum */}
  <a className="text-headline-md font-bold text-primary dark:text-inverse-primary">JobSpark</a>

  {/* Nav links */}
  <div className="hidden md:flex items-center gap-6">
    {/* Active link */}
    <a className="text-secondary dark:text-secondary-fixed-dim font-bold border-b-2 border-secondary dark:border-secondary-fixed-dim pb-1 text-label-md">Jobs</a>
    {/* Inactive link */}
    <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors text-label-md">Tracker</a>
    <a className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors text-label-md">My Resumes</a>
  </div>

  {/* Right side actions */}
  <div className="flex items-center gap-3">
    {/* Inline search bar — shown on inner pages (job detail, tracker, dashboard) */}
    <div className="hidden md:flex items-center gap-2 bg-surface-container dark:bg-surface-container px-3 py-2 rounded-lg border border-outline-variant dark:border-outline">
      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
      <input className="bg-transparent border-none focus:ring-0 text-body-sm text-on-surface dark:text-inverse-on-surface placeholder:text-on-surface-variant w-40" placeholder="Search jobs..." type="text" />
    </div>

    {/* Dark mode toggle */}
    <button className="text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed-dim transition-colors p-2 rounded-full hover:bg-surface-container dark:hover:bg-surface-container" aria-label="Toggle dark mode">
      <span className="material-symbols-outlined dark:hidden">dark_mode</span>
      <span className="material-symbols-outlined hidden dark:block">light_mode</span>
    </button>

    {/* Notifications */}
    <button className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full relative">
      <span className="material-symbols-outlined">notifications</span>
    </button>

    {/* Avatar */}
    <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer">
      <img className="w-full h-full object-cover" alt="User avatar" src={avatarUrl} />
    </div>
  </div>
</nav>
```

### Search Bar

```tsx
<form className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest dark:bg-surface-container p-2 rounded-xl shadow-sm dark:shadow-none border border-outline-variant/50 dark:border-outline">

  <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-outline-variant/30 dark:border-outline/30 pb-3 md:pb-0">
    <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
    <input className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0" placeholder="Job title, keywords, or company" type="text" />
  </div>

  <div className="flex-1 flex items-center px-4 pb-3 md:pb-0">
    <span className="material-symbols-outlined text-on-surface-variant mr-3">location_on</span>
    <input className="w-full bg-transparent border-none focus:ring-0 text-body-md text-primary dark:text-inverse-primary placeholder:text-on-surface-variant p-0" placeholder="City, state, or remote" type="text" />
  </div>

  <button className="bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md px-8 py-3 rounded-lg hover:bg-on-secondary-fixed dark:hover:bg-secondary transition-colors flex items-center justify-center gap-2" type="submit">
    Search
  </button>

</form>
```

### Sidebar Filter Panel

```tsx
<aside className="bg-surface-container-lowest dark:bg-primary-container rounded-xl p-6 border border-outline-variant/50 dark:border-outline/30 shadow-sm dark:shadow-none">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-headline-sm text-primary dark:text-inverse-primary">Filters</h2>
    <button className="text-label-sm text-secondary dark:text-secondary-fixed-dim hover:underline">Clear all</button>
  </div>
  {/* Filter group */}
  <div className="py-4 border-t border-outline-variant/30 dark:border-outline/30">
    <h3 className="text-label-md text-primary dark:text-inverse-primary mb-3">Job Type</h3>
    <label className="flex items-center gap-3 cursor-pointer group">
      <input className="rounded border-outline text-secondary focus:ring-secondary/50" type="checkbox" />
      <span className="text-body-md text-on-surface dark:text-inverse-on-surface group-hover:text-primary dark:group-hover:text-inverse-primary transition-colors">Full-time</span>
    </label>
  </div>
</aside>
```

### Company Logo Container

```tsx
<div className="w-12 h-12 rounded-lg border border-outline-variant/20 dark:border-outline/20 flex items-center justify-center bg-surface dark:bg-surface-container overflow-hidden">
  <img className="w-8 h-8 object-contain" src={logo} alt={`${company} logo`} />
</div>
```

### Pagination

```tsx
{/* Active page */}
<button className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary dark:bg-secondary-fixed-dim text-on-secondary dark:text-on-secondary-fixed text-label-md">1</button>

{/* Inactive page */}
<button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant dark:border-outline text-on-surface-variant dark:text-surface-variant hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-label-md">2</button>

{/* Prev / Next */}
<button className="p-2 border border-outline-variant dark:border-outline rounded-lg hover:bg-surface-container dark:hover:bg-surface-container transition-colors text-on-surface-variant dark:text-surface-variant">
  <span className="material-symbols-outlined">chevron_left</span>
</button>
```

### Auth Page (Login / Sign Up)

```
Layout: Split screen — left pane (branding image) + right pane (form)
- Left pane: hidden on mobile (hidden lg:flex), w-1/2, full-height background image with gradient overlay
- Right pane: w-full lg:w-1/2, centered form card, bg-surface

Form card:
- bg-surface-container-lowest dark:bg-primary-container
- rounded-xl, border border-outline-variant dark:border-outline
- shadow-[0px_10px_30px_rgba(15,23,42,0.05)]
- max-w-[440px], padding: stack-md (mobile) / stack-lg (desktop)

OAuth button (Google only — NO LinkedIn):
- bg-surface-container-lowest border border-outline-variant rounded-lg
- hover:bg-surface-container transition-colors
- Icon: material-symbols-outlined 'login'
- Label: "Continue with Google"
- focus:ring-2 focus:ring-tertiary-container

Divider: "OR EMAIL" — label-sm, uppercase, outline-variant borders each side

Input fields:
- Icon prefix (material-symbols-outlined) inside relative container
- border border-outline-variant rounded-lg
- focus:border-tertiary-container focus:ring-2 focus:ring-tertiary-container/20

Submit button: full-width, primary button style (bg-secondary)

Mobile: show JobSpark logo + wordmark above form (hidden on lg)
Desktop: show branding text bottom-left of image pane
```

> **Branding rule — applies to every screen:**
> The app name is **JobSpark** everywhere — in nav, footer, page titles, auth screens, email templates, and all documents.
> **CareerMomentum must never appear** in any component, page, or file.

### Resume Upload Page (Document Center)

```
Page title: "Document Center" — headline-lg
Subtitle: body-md, on-surface-variant

Two-column layout on desktop (lg:grid-cols-2):
  Left: Upload card + progress + preview
  Right: Library list

Upload zone:
- Dashed border (border-dashed border-2 border-outline-variant)
- rounded-xl, p-8, text-center
- Icon: cloud_upload (material-symbols-outlined, secondary colour)
- Supported formats text: body-sm, on-surface-variant
- Browse Files button: primary button style

Upload progress row:
- File icon + filename + percentage + cancel (X) icon
- Progress bar: bg-secondary, rounded-full, h-1.5

Library list items:
- File icon + filename + metadata (size, date)
- Active file: bg-surface-container-low highlighted
- Actions: Preview | Delete links (label-sm, secondary colour)
- Import from Drive: ghost button, full width, dashed border

Document preview:
- Eye icon + "Document Preview" label
- Download button: ghost/outline style
- Preview iframe or image, rounded-xl, overflow-hidden
```

### Job Detail Page

```
Layout: Two-column on desktop (lg:grid-cols-[1fr_320px])
  Left: Job info + description
  Right: Match score panel + Company info (sticky)

Breadcrumb: arrow_back icon + "Back to Jobs" / category — body-sm, on-surface-variant

Job header card:
- Company logo: 56x56px, rounded-lg, border border-outline-variant/20
- Job title: headline-lg, on-surface
- Company + location: body-md, on-surface-variant, location_on icon
- Metadata row: salary icon + salary | work icon + job type | schedule icon + date posted
- Divider: border-t border-outline-variant/30
- Apply Now: primary button (bg-secondary, full width on mobile, auto on desktop)
- Save for Later: ghost/outline button (border border-outline-variant)
- Bookmark icon in header: outline default, secondary when saved

Job description sections:
- Section titles: headline-sm, on-surface, font-semibold
- Body text: body-md, on-surface
- Lists: body-md with bullet points, on-surface

Match score panel (right sidebar — sticky):
- Card: bg-surface-container-lowest, rounded-xl, border border-outline-variant/30
- "Your Match" label + "Strong Fit" badge (secondary-container bg, rounded-full)
- Circular progress ring: teal (secondary) stroke, percentage in center (headline-lg)
- Match breakdown rows:
  - check_circle icon (secondary) for matched items
  - info icon (outline-variant) for missing items
  - Label: label-md, on-surface
  - Detail: body-sm, on-surface-variant

Company info card (below match panel):
- Company name: headline-sm
- Description: body-sm, on-surface-variant
- Metadata: group_work icon + employee count | business icon + industry
- "View Company Profile" link: label-md, secondary colour

Nav on job detail: includes inline search bar (not just icon)
```

### Dashboard Page

```
Layout: Full-width, no sidebar
Page greeting: "Welcome back, [Name]" — headline-lg
Subtitle: "Here is your career overview for this week." — body-md, on-surface-variant

Stats row — 3 cards (grid-cols-1 md:grid-cols-3):

  Applications This Week card:
  - Label: label-sm, uppercase, on-surface-variant
  - Icon: send (top right corner, secondary colour, bg-surface-container rounded-lg)
  - Big number: display or headline-lg, on-surface
  - Delta badge: "+3" with trending_up icon, secondary-container bg, rounded-full

  Active Interviews card:
  - Same structure as above
  - Icon: chat_bubble (or forum)
  - Next interview: body-sm, on-surface-variant

  Avg Match Score card:
  - Label: label-sm uppercase
  - Score: headline-lg, on-surface
  - Circular progress ring (teal, same as job detail)
  - "High fit potential" label: secondary colour, body-sm

Bottom section — two columns (lg:grid-cols-[1fr_360px]):

  Recent Activity card (left):
  - "Recent Activity" headline-sm + "View All" link (secondary, label-md)
  - Activity rows:
    - Status dot (filled circle — secondary=green for offer/interview, outline-variant=grey for submitted)
    - Activity label: label-md, on-surface
    - Sub-label: body-sm, on-surface-variant
    - Timestamp: body-sm, on-surface-variant, right-aligned

  Recommended Jobs card (right):
  - "Recommended Jobs" headline-sm
  - Job mini-cards:
    - Job title: headline-sm, on-surface
    - Company + location: body-sm, on-surface-variant
    - Match badge: rounded-full, secondary-container bg, label-sm
    - Apply button: primary button (bg-secondary, full width)
    - Bookmark button: icon-only, border border-outline-variant, rounded-lg
```

### Sign Up Page

```
Layout: Same split screen as Login — left pane (branding) + right pane (form)
- Left pane: dark bg (primary-container #131b2e), background image at 40% opacity
- Left pane content:
  - App name: display size, white, centered — always "JobSpark" NOT CareerMomentum
  - Tagline: body-lg, primary-fixed-dim, centered
  - Teal divider line: h-1 w-24 bg-secondary-fixed rounded-full
  - "ACCELERATE SUCCESS" label: label-md uppercase, secondary-fixed
  - Floating feature card (bottom left):
    - bg-white/10, rounded-xl, border border-white/10, p-6
    - trending_up icon in bg-secondary rounded-lg
    - "85% Match" headline-sm white + "AI-Driven Job Scouting" label-sm

Form (right pane):
- No card wrapper — form sits directly on bg-surface
- max-w-md, centered
- "Create Account" — headline-lg
- Subtitle referencing JobSpark: body-md, on-surface-variant

Fields (in order):
  1. Full Name — text input, no icon prefix
  2. Email Address — email input, no icon prefix
  3. Password — password input + visibility toggle button (visibility icon, right side)

Focus state on all inputs: focus:border-secondary focus:ring-1 focus:ring-secondary

CTA: "Create Account" — full-width primary button (bg-secondary), py-4, rounded-lg

Divider: "OR CONTINUE WITH" — same style as login divider

OAuth: Google ONLY — single full-width button (NOT two columns)
- NO LinkedIn button

Sign in link: "Already have an account? Sign In" — body-sm, link in secondary colour

Legal text:
- label-sm, on-surface-variant/60
- "By clicking Create Account, you agree to our Terms of Service and Privacy Policy"
- Underlined links, no colour change

Mobile: Show "JobSpark" wordmark + tagline above form, hide left pane
```

### Saved Jobs Page

```
Layout: Full-width, no sidebar
Page title: "Saved Jobs" — headline-lg
Subtitle: "You have X opportunities currently bookmarked for review." — body-md, on-surface-variant

Action bar (top right of title row):
- "Sort by:" label + dropdown (Recently Saved | Best Match | Date Posted)
- Dropdown: bg-surface-container-lowest, border border-outline-variant, rounded-lg

Job cards grid:
- grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- gap-gutter (24px)

Saved job card (different from search result card):
- bg-surface-container-lowest, rounded-xl, border border-outline-variant/30
- p-6, no top accent line (accent line is a search page pattern only)
- Company logo: 40x40px, rounded-lg, bg-surface-container, border border-outline-variant/20
- Match badge: top right, rounded-full pill
  - High (>=80%): bg-secondary-container, text-on-secondary-container, check_circle icon
  - Medium (50-79%): bg-surface-container-highest, text-tertiary-container, trending_up icon
  - Low (<50%): bg-surface-container, text-on-surface-variant, remove icon
- Job title: headline-sm, on-surface
- Company: body-sm, on-surface-variant, business_center icon prefix
- Location: body-sm, on-surface-variant, location_on icon prefix
- Salary: body-sm, on-surface-variant, payments icon prefix
- Action row (bottom):
  - Apply Now: primary button (bg-secondary), flex-1
  - Bookmark/unsave: icon-only button, bookmark icon (filled = saved),
    border border-outline-variant, rounded-lg, p-2

Nav on saved jobs page: includes inline search bar (same as tracker/dashboard nav)

Pagination: same pattern as job search page
```

---

```
Layout: Full-width Kanban board
Page title: "Application Tracker" — headline-lg
Subtitle: body-md, on-surface-variant

Action bar (top right):
- Filter button: ghost/outline style, filter_list icon
- Add Application button: primary button (bg-secondary), add icon prefix

Kanban columns (horizontal scroll on mobile):
Columns: SAVED | APPLIED | INTERVIEW | OFFER | REJECTED
- Column header: label-sm uppercase, on-surface-variant
- Count badge: label-sm, bg-surface-container, rounded-full, inline next to title

Tracker card:
- bg-surface-container-lowest, rounded-xl, border border-outline-variant/30
- p-4, mb-3
- Company logo: 40x40px, rounded-lg, bg-surface-container, border border-outline-variant/20
- Match badge: top right, rounded-full, secondary-container bg (high) or surface-container-highest (medium)
- Job title: headline-sm, on-surface
- Company + location: body-sm, on-surface-variant
- Metadata row: clock icon + "Added Xd ago" or send icon + "Applied Xw ago"
- Interview card variant: calendar icon + "Round 2: Technical • Tomorrow" — bg-secondary-container, rounded-lg, label-sm, secondary text

Active/highlighted column card (Interview stage):
- border-secondary (teal border instead of default)
- Slightly elevated shadow

Empty column state:
- Dashed border card, shopping_bag icon, "No offers yet" — on-surface-variant

Footer pattern (all pages):
- bg-surface-container-low, border-t border-outline-variant
- Left: "JobSpark" wordmark (headline-sm, bold) — NEVER CareerMomentum
- Center: About Us | Support | Privacy Policy | Terms of Service | Careers
- Right: "© 2024 JobSpark. All rights reserved. Precision in every step."
```

---

## 8. Layout Grid

```
Max content width:  1280px  (max-w-container-max)
Desktop grid:       12 columns
  Sidebar:          3 columns  (lg:col-span-3)
  Job results:      9 columns  (lg:col-span-9)
Job cards:          2-column on md+, 1-column on mobile  (grid-cols-1 md:grid-cols-2)
Column gap:         24px  (gap-gutter)
Page padding:       16px mobile / 40px desktop
Top padding:        pt-28  (accounts for fixed 64px nav height)
```

---

## 9. globals.css

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

---

## 10. Tailwind Config (`tailwind.config.js`)

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
