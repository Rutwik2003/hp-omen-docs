# HP OMEN Docs - Project Improvements Roadmap

> Last updated: February 3, 2026

## 📊 Current Project Assessment: 8.7/10 ⬆️

This document outlines identified issues, recommended improvements, and a prioritized roadmap for enhancing the HP OMEN Documentation project.

---

## Table of Contents

- [What's Working Well](#-whats-working-well)
- [Critical Issues](#-critical-issues)
- [Code Quality Issues](#-code-quality-issues)
- [Architecture Improvements](#-architecture-improvements)
- [Performance Optimizations](#-performance-optimizations)
- [Developer Experience](#-developer-experience)
- [Prioritized Roadmap](#-prioritized-roadmap)

---

## ✅ What's Working Well

### Tech Stack
- [x] React 18 + Vite + TypeScript - Modern, performant stack
- [x] Zustand + Zundo for state management with undo/redo
- [x] TipTap for rich text editing
- [x] Dexie (IndexedDB) for local draft persistence
- [x] Tailwind CSS for consistent styling
- [x] **NEW:** Vitest + React Testing Library for testing

### Architecture
- [x] Code splitting with lazy loading
- [x] Custom hooks pattern for reusable logic
- [x] Block-based content model for flexibility
- [x] Clear separation of concerns
- [x] **NEW:** Global ErrorBoundary for crash recovery

### User Experience
- [x] Gaming-themed loading screen
- [x] Auto-save drafts with offline support
- [x] Toast notifications with deduplication
- [x] Personality-filled error pages
- [x] SEO-friendly with react-helmet-async

### Developer Experience
- [x] **NEW:** Pre-commit hooks with Husky + lint-staged
- [x] **NEW:** Typed draft data with `GuideDraftData` interface

---

## ✅ Completed Issues (Phase 1)

### 1. ~~No Testing Infrastructure~~ ✅ COMPLETED
**Priority: HIGH** → **DONE**

```
Previous State: Zero test files
Current State: Vitest + RTL configured, 24 tests passing
```

**Completed:**
- [x] Set up Vitest for unit testing
- [x] Add React Testing Library for component tests
- [x] Create tests for critical hooks (`useGuideDraft`, `useDraftList`, `useToast`)
- [x] Set up test coverage reporting

### 2. ~~Excessive `any` Types~~ ✅ MOSTLY FIXED
**Priority: HIGH** → **DONE**

**Completed:**
- [x] Create `GuideDraftData` type in `types/docs.ts`
- [x] Fix `useGuideDraft.ts` - removed all `any` types
- [x] Fix `editorStore.ts` - created `createBlock()` helper with proper typing
- [x] Replaced recursive type guards to use proper block type checking

### 3. ~~Missing Error Boundaries~~ ✅ COMPLETED
**Priority: HIGH** → **DONE**

**Completed:**
- [x] Create global `ErrorBoundary` component in `src/components/ErrorBoundary.tsx`
- [x] Wrap entire app with error boundary in `App.tsx`
- [x] Add fallback UI for component errors
- [x] Error details shown in dev mode

### 4. ~~No Pre-commit Hooks~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Completed:**
- [x] Install Husky + lint-staged
- [x] Configure pre-commit hook to run lint + tests on staged files

---

## ✅ Completed Issues (Phase 2)

### 5. ~~Duplicate/Dead Code~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Removed files:**
- `src/components/Layout.tsx` - Removed (overlapped with DocsLayout)
- `src/pages/HomeNew.tsx` - Removed (unused migration file)
- `src/layouts/RootLayout.tsx` - Removed (duplicate)
- `src/layouts/DocsLayout.tsx` - Removed (duplicate)

### 6. ~~Oversized Components~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Completed:**
- [x] Extracted `EditorToolbar.tsx` from `GuideEditor.tsx` (420+ → 330 lines)
- [x] `GuideEditor.tsx` now imports toolbar as a separate component

### 7. ~~Inconsistent Code Patterns~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Completed:**
- [x] Added ESLint `ban-ts-comment` rule (requires description for any ts-ignore)
- [x] Added ESLint `sort-imports` rule for consistent import ordering
- [x] Removed all `@ts-ignore` comments - created proper types instead
- [x] Fixed switch case blocks with proper scoping

### 8. ~~Constants & Configuration~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Created:**
- `src/constants/drafts.ts` - Draft ID constants
- `src/constants/routes.ts` - Route path constants
- `src/constants/index.ts` - Barrel export

**Updated:**
- `GuideEditor.tsx` now uses `DRAFT_IDS.PUBLIC_NEW` and `DRAFT_IDS.ADMIN_NEW`

---

## ✅ Completed Issues (Phase 3)

### 9. ~~Modularize the Editor~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Created feature module at `src/features/editor/`:**
```
src/features/editor/
  index.ts              # Barrel export
  components/           # Re-exports to editor components
    blocks/             # Block editor components
  hooks/                # useGuideDraft, useDraftList
  store/                # editorStore re-export
  types/                # EditorState, DraftRecord types
  constants/            # DRAFT_IDS re-export
```

**Benefits:**
- Clean import paths: `import { useEditorStore } from '@/features/editor'`
- Self-contained module with types, hooks, and components
- Easy to maintain and test in isolation

### 10. ~~Unified Layout System~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Created composable layout system at `src/features/layouts/`:**
- `BaseLayout` - Root layout wrapper with background variants
- `MainContent` - Content area with max-width and padding options
- `PageHeader` - Consistent header with breadcrumbs and actions
- `ContentContainer` - Optional card-styled container

**Usage:**
```tsx
import { BaseLayout, MainContent, PageHeader } from '@/features/layouts';

<BaseLayout>
  <PageHeader title="My Page" breadcrumbs={[...]} />
  <MainContent maxWidth="lg">
    {children}
  </MainContent>
</BaseLayout>
```

### 11. ~~Content Validation Layer~~ ✅ COMPLETED
**Priority: MEDIUM** → **DONE**

**Created validation module at `src/features/validation/`:**
- `validateGuide()` - Validates complete guide documents
- `validateStep()` - Validates individual steps
- `validateBlock()` - Validates block structure
- Type-safe validation results with error paths

**Schema validation covers:**
- Required fields (title, description, category, steps)
- Block type validation (all 10 block types)
- Callout variant validation
- Heading level validation (1, 2, 3)
- Nested grid/column validation

---

## ✅ Completed Issues (Phase 4)

### 12. ~~Animation Library Cleanup~~ ✅ PARTIAL
**Priority: MEDIUM** → **DONE (partial)**

**Status:**
- Framer Motion - ✅ Kept (used widely)
- GSAP - ✅ Kept (used for Home page + SpotlightCard animations)
- anime.js - ✅ **Removed** (was not used anywhere)

**Bundle savings:** ~3KB (anime.js removed)

*Note: GSAP animations preserved as-is to maintain current visual behavior.*

### 13. ~~Code Splitting~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Implemented:**
- [x] SearchModal lazy loaded - only loads when user opens search
- [x] TipTap editor already lazy loaded via GuideEditor route
- [x] Home.js reduced from 101.57 KB → 98.37 KB

### 14. ~~Image Optimization~~ ✅ PARTIAL
**Priority: LOW** → **DONE (partial)**

**Implemented:**
- [x] Added native `loading="lazy"` to content images
- [ ] WebP/AVIF formats (future)
- [ ] Responsive srcsets (future)

---

## 🔮 Future Optimizations

### 15. ~~Virtualize Long Lists~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Created:** `src/components/common/VirtualList.tsx`
- Reusable `VirtualList` component using `@tanstack/react-virtual`
- Auto-detects when to virtualize (>20 items)
- Supports fixed and variable height items
- `useVirtualList` hook for advanced control
- Exported from `src/components/common/index.ts`

**Usage when needed:**
```tsx
import { VirtualList } from '../components/common';

<VirtualList
  items={drafts}
  estimateSize={80}
  maxHeight={400}
  renderItem={(draft) => <DraftCard draft={draft} />}
/>
```

### 16. Further Image Optimization
**Priority: LOW**

**Future Action Items:**
- [ ] Use modern formats (WebP/AVIF)
- [ ] Add responsive image srcsets
- [ ] Consider image CDN for user uploads

---

## 🛠️ Developer Experience

### 17. ~~Add Storybook~~ ❌ REMOVED
**Priority: LOW** → **SKIPPED**

*Removed - Storybook adds maintenance overhead without significant benefit for a single documentation site. Better suited for shared design systems or component libraries.*

### 18. ~~Add JSDoc Comments~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Documented files:**
- [x] `hooks/useGuideDraft.ts` - Full hook documentation with examples
- [x] `hooks/useDraftList.ts` - CRUD operations documented
- [x] `store/editorStore.ts` - All actions and helpers documented
- [x] `services/draftDatabase.ts` - Database class and methods
- [x] `types/blocks.ts` - All block interfaces documented
- [x] `types/docs.ts` - DocPage, GuideStep, GuideDraftData

### 19. ~~Improve Error Messages~~ ✅ COMPLETED
**Priority: LOW** → **DONE**

**Created:** `src/utils/errorHandling.ts`
- Centralized error parsing with `parseError()` function
- User-friendly messages for network, storage, auth, content errors
- Error categorization for conditional handling
- Recovery suggestions (actions users can take)
- Dev-only logging with `logError()`

**Updated files:**
- [x] `hooks/useGuideDraft.ts` - Storage errors show actionable messages
- [x] `hooks/useDraftList.ts` - Added error state, better error returns
- [x] `utils/adminApi.ts` - JSDoc + error handling

### 20. ~~Add Pre-commit Hooks~~ ✅ (Moved to Phase 1)
**Priority: MEDIUM**

**Setup with Husky + lint-staged:**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 19. Documentation
**Priority: LOW**

**Action Items:**
- [ ] Add JSDoc comments to complex functions
- [ ] Document the block system architecture
- [ ] Create CONTRIBUTING.md with code standards
- [ ] Add inline comments for non-obvious logic

---

## 📋 Prioritized Roadmap

### Phase 1: Stability ✅ COMPLETED
| Task | Status | Effort |
|------|--------|--------|
| Set up Vitest + RTL | ✅ Done | 4h |
| Add tests for hooks | ✅ Done (24 tests) | 8h |
| Fix critical `any` types | ✅ Done | 6h |
| Add global ErrorBoundary | ✅ Done | 2h |
| Add pre-commit hooks | ✅ Done | 1h |

### Phase 2: Code Quality ✅ COMPLETED
| Task | Status | Effort |
|------|--------|--------|
| Remove duplicate code | ✅ Done (4 files removed) | 4h |
| Split `GuideEditor.tsx` | ✅ Done (EditorToolbar.tsx) | 6h |
| Enable strict TypeScript | ✅ Already enabled | 0h |
| Fix inconsistent patterns | ✅ Done (ESLint rules) | 2h |
| Extract constants | ✅ Done (src/constants/) | 2h |

### Phase 3: Architecture ✅ COMPLETED
| Task | Status | Effort |
|------|--------|--------|
| Modularize editor | ✅ Done (src/features/editor/) | 6h |
| Unified layout system | ✅ Done (src/features/layouts/) | 4h |
| Content validation | ✅ Done (src/features/validation/) | 6h |

### Phase 4: Performance ✅ COMPLETED
| Task | Status | Effort |
|------|--------|--------|
| Remove unused anime.js | ✅ Done | 0.5h |
| Lazy load SearchModal | ✅ Done | 0.5h |
| Add image lazy loading | ✅ Done | 0.5h |
| Keep GSAP (preserves animations) | ✅ Kept as-is | 0h |

### Phase 5: DX & Polish ✅ COMPLETED
| Task | Status | Effort |
|------|--------|--------|
| ~~Set up Storybook~~ | ❌ Skipped (overkill for this project) | 0h |
| Add JSDoc comments | ✅ Done | 1h |
| Improve error messages | ✅ Done (errorHandling.ts) | 1h |
| Virtual scrolling | ✅ Done (VirtualList component) | 0.5h |

---

## 📈 Success Metrics

After implementing these improvements, aim for:

- [ ] **Test coverage:** >70% for hooks, >50% overall
- [ ] **TypeScript:** Zero `any` types, strict mode enabled
- [ ] **Bundle size:** Reduce by 15-20%
- [ ] **Lighthouse score:** >90 on all metrics
- [ ] **Build time:** <30 seconds
- [ ] **No console errors** in production

---

## 🔗 Related Files

- [README.md](./README.md) - Project overview
- [CONTRIBUTOR_FLOW.md](./CONTRIBUTOR_FLOW.md) - Contribution guidelines
- [GUIDE_ADMIN_SETUP.md](./GUIDE_ADMIN_SETUP.md) - Admin setup instructions

---

*This document should be updated as improvements are completed or new issues are identified.*
