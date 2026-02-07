# HP OMEN Docs v2 — Full Project Analysis

**Date:** 2026-02-07  
**Scope:** Security, Responsiveness, Code Quality, Architecture, Contribution Flow

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Security Audit](#2-security-audit)
3. [Responsiveness Audit](#3-responsiveness-audit)
4. [Code Quality & Architecture](#4-code-quality--architecture)
5. [Contribution Flow Analysis & Plan](#5-contribution-flow-analysis--plan)
6. [Master Priority List](#6-master-priority-list)

---

## 1. Project Overview

| Item | Detail |
|------|--------|
| **Stack** | React 18 + TypeScript + Vite 7 + Tailwind CSS 3 |
| **State** | Zustand 5 + Immer + Zundo (undo/redo) |
| **Animations** | Framer Motion + GSAP |
| **CMS** | Custom block-based JSON editor |
| **Storage** | IndexedDB (Dexie) for drafts, static JSON for published content |
| **Hosting** | Vercel (Edge Middleware for CSP) |
| **API** | Vercel Serverless Functions (save.js, verify.js) |
| **Dev Server** | Express.js local API on port 3001 |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React)              │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │  Pages   │  │Components│  │   Store   │  │   Hooks    │  │
│  │ Home     │  │ BentoGrid│  │ editorStore│ │useDraftList│  │
│  │ Docs     │  │ DocPage  │  │ (Zustand) │  │useGuideDraft│ │
│  │ Admin    │  │ Editor   │  │           │  │            │  │
│  │ Contrib  │  │ Layout   │  │           │  │            │  │
│  └─────────┘  └──────────┘  └───────────┘  └────────────┘  │
│       │                           │               │         │
│  ┌────┴───────────────────────────┴───────────────┴────┐    │
│  │               Services / Utils                      │    │
│  │ contentLoader.ts   draftDatabase.ts   adminApi.ts   │    │
│  │ markdown.ts        sessionManager.ts  errorHandling │    │
│  └──────────────────────────┬──────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
      ┌───────┴──────┐ ┌─────┴─────┐  ┌───────┴───────┐
      │  IndexedDB   │ │ Static    │  │ Vercel API    │
      │  (Dexie.js)  │ │ JSON in   │  │ api/save.js   │
      │  Drafts only │ │ /content/ │  │ api/verify.js │
      │  per-browser │ │ build-time│  │ GitHub API    │
      └──────────────┘ └───────────┘  └───────────────┘
```

---

## 2. Security Audit

### CRITICAL

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| 1 | **Timing-unsafe password comparison** — Uses `===` instead of `crypto.timingSafeEqual()` | `api/verify.js:46`, `api/save.js:51` | Attackers can statistically determine password one character at a time via response timing |
| 2 | **Dev server: zero auth + wildcard CORS** — `app.use(cors())` allows ANY website to hit `POST /api/save` | `server.js` | Any site open in dev browser can silently write files to `src/content/` |
| 3 | **`VITE_DEV_ADMIN_PASSWORD` leaked to client bundle** — All `VITE_` prefixed env vars are embedded in frontend JS | `src/utils/adminApi.ts:14` | If dev password matches production, production is compromised |

### HIGH

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| 4 | **DOMPurify allows `style` attribute** — Enables CSS-based data exfiltration and UI redression | `src/utils/markdown.ts:37` | Styled XSS via user-contributed guides rendered with `dangerouslySetInnerHTML` |
| 5 | **In-memory rate limiting on serverless** — `Map()` resets on every cold start | `api/save.js`, `api/verify.js` | Rate limiting is effectively non-functional in production |
| 6 | **No CSRF protection** — API accepts POST with password in body, no origin validation | `api/save.js`, `api/verify.js` | Malicious sites can forge requests if user has password |
| 7 | **Client-side-only session management** — Stored in `sessionStorage`, never validated server-side | `src/utils/sessionManager.ts` | Bypass admin login by injecting `sessionStorage` value |

### MEDIUM

| # | Issue | File(s) |
|---|-------|---------|
| 8 | Misleading path traversal regex (secondary check is correct) | `server.js:68-77` |
| 9 | Raw GitHub API errors forwarded to client | `api/save.js:87-88` |
| 10 | Server config errors reveal environment variable names | `api/save.js:55`, `api/verify.js:41` |
| 11 | Regex-based markdown parser → raw HTML before DOMPurify | `src/utils/markdown.ts:8-27` |
| 12 | TipTap `getHTML()` stored unsanitized | `RichTextBlock.tsx:58` |
| 13 | Image block accepts arbitrary URLs (SSRF / tracking pixels) | `ImageBlockEditor.tsx:44` |
| 14 | `VITE_` prefixed vars used server-side (repo name exposed to client) | `api/save.js:45-46` |

### LOW / INFORMATIONAL

| # | Issue |
|---|-------|
| 15 | No body size limit on API routes |
| 16 | Prototype pollution risk via `import.meta.glob` eager JSON loading |
| 17 | HTML entity bypass in search index text stripper |
| 18 | No security-focused ESLint plugins |
| 19 | Error reports in `localStorage` may contain PII/tokens |
| 20 | `unsafe-inline` for styles (Tailwind trade-off — accepted) |
| 21 | Security headers well-configured ✅ |
| 22 | CSP nonce middleware well-implemented ✅ |
| 23 | Error stack traces dev-gated correctly ✅ |

### Top 3 Security Fixes

```
1. crypto.timingSafeEqual() in api/verify.js and api/save.js
2. Restrict CORS to localhost:5173 + bind server.js to 127.0.0.1
3. Remove 'style' from DOMPurify ALLOWED_ATTR + implement distributed rate limiting
```

---

## 3. Responsiveness Audit

### Severity Matrix

| Component | Severity | Issues |
|-----------|----------|--------|
| `index.html` | ✅ Clean | Responsive loader with `clamp()` and `min()` |
| `Home.tsx` | ✅ Clean | Progressive text scaling, stacking buttons, responsive grid |
| `RootLayout.tsx` | ✅ Clean | — |
| `AnimatedLayout.tsx` | ✅ Clean | — |
| **`Breadcrumbs.tsx`** | ❌ **Critical** | No overflow handling, Home icon 16px touch target |
| **`DocsLayout.tsx`** | ⚠️ Multiple | Hamburger 32px (needs 44px), no tablet sidebar, safe-area-inset unused |
| **`BentoGrid.tsx`** | ⚠️ Medium | Fixed row heights clip content, no `sm:` col-span logic |
| **`TableOfContents.tsx`** | ⚠️ Medium | Expand button 24px (needs 44px), deep nesting overflows sidebar |
| `SpotlightCard.tsx` | ⚠️ Minor | Desktop-only spotlight effect, fixed padding |
| `DocPage.tsx` | ⚠️ Minor | `<a>` instead of `<Link>` (causes full page reload), small nav touch targets |
| `SearchModal.tsx` | ⚠️ Minor | Close button 36px, virtual keyboard may obscure results |
| `index.css` | ⚠️ Medium | Unused CSS vars, no responsive doc headings, `overflow-x: hidden` band-aid |

### Detailed Findings

#### Breadcrumbs — ❌ Critical
- **No overflow handling**: `flex items-center space-x-2` in a horizontal row with no `overflow-x-auto`, `flex-wrap`, or truncation. 4+ breadcrumb segments overflow the viewport on mobile.
- **Home icon is 16×16px** (`h-4 w-4`) with zero padding — WCAG 2.5.8 requires 44×44px minimum for touch targets.

**Fix:**
```tsx
// Add overflow-x-auto and min-width constraints
<nav className="flex items-center space-x-2 overflow-x-auto scrollbar-hide min-w-0">
// Increase Home icon touch target
<Link className="p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
```

#### DocsLayout Sidebar — ⚠️ Multiple Issues
- **Hamburger button**: `p-1.5` with `h-5 w-5` icon = ~32×32px total. Needs 44×44px.
- **No tablet breakpoint**: Sidebar uses `lg:` (1024px+). On 768–1023px (tablets), sidebar is hamburger-menu'd like phones. A `md:` collapsed sidebar would improve UX.
- **Sub-menu text**: `text-xs` (12px) on mobile — hard to read and tap.
- **Safe area insets**: CSS utility defined but never applied to the sidebar. Notched phones clip content.

#### BentoGrid — ⚠️ Fixed Row Heights
- `auto-rows-[12rem]` / `[14rem]` / `[18rem]` — if content exceeds this height, it's clipped without visible overflow.
- No `line-clamp-*` on titles or descriptions.
- `md:col-span-2/3` exists but no `sm:col-span-*` — at 640px, full-width items become single cells.

**Fix:** Replace `auto-rows-[Xrem]` with `auto-rows-auto` + `min-h-[12rem]`, add `line-clamp-2` to descriptions.

#### Documentation Content Headings — ⚠️ No Responsive Scaling
In `index.css`, `.documentation-content h1` is fixed at `text-4xl` (36px) with no breakpoint variants. On 320px phones, this dominates the viewport.

**Fix:** Use `clamp(1.5rem, 4vw, 2.25rem)` or Tailwind responsive classes.

---

## 4. Code Quality & Architecture

### Scorecard

| Category | Grade | Summary |
|----------|-------|---------|
| Architecture | **B+** | Good separation, but `features/` layer is hollow re-exports |
| State Management | **B+** | Zustand + Immer + Zundo is excellent; missing selectors |
| Type Safety | **B-** | Duplicate `GuideStep`, 10 `as any` casts, dead `ListBlock` |
| Performance | **B-** | Missing `React.memo` on `StepSection`, static data in components |
| Code Duplication | **C+** | Draft save logic repeated 3×, driver data hardcoded in component |
| Error Handling | **A-** | Centralized `parseError()` with categories — excellent |
| Test Coverage | **C** | Core hooks covered; validation, migration, renderers untested |
| Accessibility | **D+** | Almost no ARIA attributes outside Login.tsx; no focus traps |

### Critical Architecture Issues

#### 1. `features/` Phantom Layer
The entire `features/` directory is just re-exports pointing back to `src/store/`, `src/hooks/`, `src/pages/admin/editor/`:
```
features/editor/store/editorStore.ts → re-exports ../../store/editorStore
features/editor/hooks/useDraftList.ts → re-exports ../../hooks/useDraftList
features/editor/components/EditorToolbar.ts → re-exports ../../pages/admin/editor/EditorToolbar
```
This creates an illusion of module boundaries. Consumers bypass it and import directly.

**Recommendation:** Either move the actual code into `features/editor/` or delete the layer entirely.

#### 2. Duplicate `GuideStep` Definitions

| Field | `src/types/blocks.ts` | `src/types/docs.ts` |
|-------|----------------------|---------------------|
| `id` | Required `string` | Optional `string?` |
| `content` | Not present | Required `string` |
| `blocks` | Required `Block[]` | Optional `Block[]?` |
| Legacy fields | None | `codeBlock`, `infoBox`, `grid`, etc. |

Two incompatible shapes for the same entity. The compiler may pick the wrong one depending on import.

**Fix:** Merge into a single versioned type in `src/types/docs.ts` with optional legacy fields.

#### 3. Duplicate `EditorState` Interfaces
The Zustand store interface exists in both `src/store/editorStore.ts` and `src/features/editor/types/editor.ts` with **different method signatures** (e.g., `addBlock` arity differs).

#### 4. Missing Zustand Selectors
Every component subscribes to the full store — causes unnecessary re-renders on any state change. Should use granular selectors.

#### 5. Dead Code
- `ListBlock` type defined but never created, rendered, or validated
- `'divider'` block type has no dedicated interface
- JSON Schema objects in `schemas.ts` exported but never consumed
- `--sidebar-width` and `--header-height` CSS vars defined but never referenced

### Test Coverage Gaps

| Area | Tests? | Priority |
|------|--------|----------|
| Editor store | ✅ | — |
| Draft hooks | ✅ | — |
| Validation schemas | ❌ | **High** |
| Block migration | ❌ | **High** |
| PublicBlockRenderer | ❌ | **Medium** |
| Error handling | ❌ | **Medium** |
| Content loader | ❌ | **Low** |

### Accessibility Gaps

1. **No `aria-*` on interactive elements** — Only `Login.tsx` has proper ARIA
2. **DeleteConfirmModal** — No focus trap, no `role="dialog"`, no `aria-modal`
3. **StepSection** — Step numbers are visual only; no `aria-label="Step N: title"`
4. **External links** — `target="_blank"` with no "opens in new tab" announcement
5. **Delete button** in Contribute.tsx has `title` but no `aria-label`

---

## 5. Contribution Flow Analysis & Plan

### Current Flow (Broken)

```
CONTRIBUTOR (Public)                    ADMIN (Authenticated)
        │                                       │
  /contribute ───► /contribute/new        /admin ──► /admin/edit/:id
        │               │                       │          │
        │         GuideEditor                Dashboard    GuideEditor
        │         mode="public"               │          mode="admin"
        │               │                   Loads via     │
        │         Zustand Store              getAllDocs()  │
        │         (editorStore)                │          │
        │               │                 contentLoader   │
        │         Auto-save to               .ts          │
        │         IndexedDB (Dexie)            │          │
        │               │              import.meta.glob   │
        │         "Export Guide"         ../content/**     │
        │           (click)                .json          │
        │               │                     │          │
        │         Downloads a           Static JSON      "Save Changes"
        │         .JSON file            files baked         (click)
        │         to user's disk        into bundle          │
        │               │                                    │
        │          ██ DEAD END ██              ┌──────────────┘
        │          User must manually          │
        │          send JSON file      ┌───────┴───────┐
        │          via Discord/Email   │  DEV (local)  │  PROD (Vercel)
        │                              │  server.js    │  api/save.js
        │                              │  :3001        │  GitHub API
        │                              │  fs.writeFile │  PUT contents
        │                              │  to src/      │  to repo
        │                              │  content/     │  + git commit
        │                              └───────────────┘
```

### Core Problems

| # | Problem | Severity |
|---|---------|----------|
| P1 | **Dead-end export** — No submission pipeline, just file download | Critical |
| P2 | **No review queue** — Admin dashboard shows only existing content | Critical |
| P3 | **Static content at build time** — `import.meta.glob` bakes everything; new content needs rebuild | High |
| P4 | **Navigation decoupled from content** — Adding JSON to `content/` doesn't update sidebar or `guides.ts` | High |
| P5 | **Sidebar config is browser-local** — `localStorage` only, invisible to other users | Medium |
| P6 | **No draft sharing** — IndexedDB is per-browser, can't share WIP | Medium |
| P7 | **Legacy migration debt** — Old content uses `content` strings, new uses `blocks[]` | Low |

### Proposed Plan: Making Contributions Dynamic

#### Phase 1: Submission Pipeline (Replace JSON Download) — 1-2 days

**New endpoint `api/submit.js`:**
```javascript
// POST /api/submit
// Accepts guide JSON from public contributors
// Option A: Creates a GitHub Issue with [SUBMISSION] label + guide JSON attached
// Option B: Stores as a file on a `submissions` branch via GitHub Contents API
// Option C: Stores in a Supabase/Firebase table
// Rate-limited + honeypot for spam
// Returns submission ID
```

**Modify `GuideEditor.tsx` `handleSave()` for `isPublic`:**
```tsx
if (isPublic) {
    const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guide: cleanData(), author: authorName }),
    });
    const { submissionId } = await res.json();
    addToast('success', 'Guide Submitted!', `#${submissionId} pending review.`);
}
```

Keep "Download JSON" as a secondary action for power users.

#### Phase 2: Admin Review Queue — 3-5 days

**New endpoint `api/submissions.js`:**
```javascript
// GET  /api/submissions              → List pending submissions
// POST /api/submissions/:id/approve  → Move to content, update navigation, commit
// POST /api/submissions/:id/reject   → Add rejection reason
```

**New admin page `/admin/submissions`:**
- Card list of pending submissions
- Click-to-preview using existing `DocRenderer`
- Side-by-side diff viewer for edits to existing guides
- Approve → auto-generates JSON + updates route config + commits to repo
- Reject → logs reason, optionally notifies contributor

#### Phase 3: Auto-Generated Navigation — 1 day

Replace hardcoded `guides.ts` with navigation computed from content metadata:
```typescript
// Each content JSON already has category + title + slug
// Derive guides.ts automatically from content directory
function generateNavigation(contentFiles: GuideMetadata[]): NavigationConfig {
    return contentFiles.reduce((acc, guide) => {
        const cat = acc.find(c => c.category === guide.category)
            || (acc.push({ category: guide.category, items: [] }), acc.at(-1)!);
        cat.items.push({ title: guide.title, path: `/${guide.category}/${guide.slug}` });
        return acc;
    }, [] as NavigationConfig);
}
```

#### Phase 4: Runtime Content Loading — 1-2 weeks (Long-term)

Replace `import.meta.glob` with runtime fetch:
```typescript
// api/content.js serves content from GitHub or CDN
// App loads manifest on startup, lazy-loads guides on navigation
// Cache with service workers / stale-while-revalidate
export async function loadGuide(category: string, slug: string): Promise<GuideData> {
    const cached = sessionStorage.getItem(`guide:${category}/${slug}`);
    if (cached) return JSON.parse(cached);
    const res = await fetch(`/api/content/${category}/${slug}`);
    const data = await res.json();
    sessionStorage.setItem(`guide:${category}/${slug}`, JSON.stringify(data));
    return data;
}
```

#### Phase 5: Sidebar Config Persistence + Draft Sharing

- Store `sidebarConfig.json` in repo (committed via admin save flow)
- Draft sharing via shareable URL with compressed JSON payload
- Optional GitHub-backed draft storage for authenticated contributors

---

## 6. Master Priority List

### Immediate (P0) — Do Now

| # | Category | Action |
|---|----------|--------|
| 1 | Security | `crypto.timingSafeEqual()` in `api/verify.js` and `api/save.js` |
| 2 | Security | Restrict CORS to `http://localhost:5173`, bind server to `127.0.0.1` |
| 3 | Security | Remove `'style'` from DOMPurify `ALLOWED_ATTR` |
| 4 | Security | Implement distributed rate limiting (Upstash Redis) |
| 5 | Responsive | Fix Breadcrumbs: add `overflow-x-auto`, increase touch targets to 44px |
| 6 | Responsive | Fix DocsLayout hamburger touch target (32px → 44px) |
| 7 | Architecture | Merge duplicate `GuideStep` type definitions |
| 8 | Contribution | Build `api/submit.js` endpoint + modify editor's public save |

### Short-term (P1) — Next Sprint

| # | Category | Action |
|---|----------|--------|
| 9 | Security | Server-side session tokens (replace client-only sessionStorage) |
| 10 | Security | CSRF protection (Origin header validation) |
| 11 | Responsive | Fix BentoGrid: `auto-rows-auto min-h-[12rem]` + text clamping |
| 12 | Responsive | Fix TableOfContents expand button (24px → 44px) |
| 13 | Responsive | Responsive doc content headings with `clamp()` |
| 14 | Architecture | Remove or populate `features/` re-export layer |
| 15 | Architecture | Add Zustand selectors to prevent re-renders |
| 16 | Quality | Tests for validation schemas + block migration |
| 17 | Contribution | Admin submissions review queue |
| 18 | Contribution | Auto-generate navigation from content metadata |

### Medium-term (P2) — Backlog

| # | Category | Action |
|---|----------|--------|
| 19 | Security | Sanitize TipTap output before storing |
| 20 | Security | Validate image URLs (HTTPS-only allowlist) |
| 21 | Responsive | Tablet (`md:`) sidebar breakpoint |
| 22 | Responsive | Safe-area-insets on sidebar for notched phones |
| 23 | Architecture | Remove dead code (ListBlock, unused CSS vars, schema objects) |
| 24 | Accessibility | ARIA on modals, buttons, links; focus traps |
| 25 | Accessibility | `aria-label` on step sections, external link announcements |
| 26 | Quality | Extract static data from DriversAndSoftware.tsx |
| 27 | Quality | ESLint security plugins |
| 28 | Contribution | Runtime content loading (replace `import.meta.glob`) |
| 29 | Contribution | Sidebar config persistence to repo |
| 30 | Contribution | Draft sharing via shareable links |

---

*Generated by in-depth project analysis. Each finding includes file locations and specific remediation steps.*
