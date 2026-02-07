# Architecture: Custom Admin & Community Contributions

## Overview

This project uses a **custom-built admin panel** with a local Express API server for content management. There is no CMS dependency (no Decap/Netlify CMS). The site deploys on **Vercel**.

1. **Admin (You)**: Secure password-protected panel at `/admin` for full content management.
2. **Community**: Public `/contribute` page for drafting and submitting guide proposals.

---

## 1. The Superuser Admin Panel (`/admin`)

### Authentication
- Password-based login via `/admin/login`.
- The password is verified against the Express dev server (`POST /api/verify`) using HMAC-signed session tokens.
- Sessions are stored client-side via `sessionManager.ts` with timing-safe comparison on the server.

### Features
- **Dashboard** (`/admin/dashboard`): Lists all content files from `src/content/` with edit/create actions.
- **Guide Editor** (`/admin/editor/:id`): Block-based drag-and-drop editor powered by Zustand (`editorStore.ts`) + Immer + Zundo (undo/redo).
- **Sidebar Configurator** (`/admin/sidebar`): Configure the docs sidebar navigation order.
- **Block Types**: Text, code, image, callout, list, table, and more — defined in `src/types/blocks.ts`.
- **Auto-save**: Drafts are persisted to IndexedDB via Dexie (`src/services/draftDatabase.ts`).
- **Save to Disk**: `POST /api/save` writes JSON content files to `src/content/`.

### Local Dev Server
```bash
node server.js          # Starts Express API on http://localhost:3001
npm run dev             # Starts Vite dev server (separate terminal)
```
The Express server binds to `127.0.0.1` only — it is never exposed to the network.

---

## 2. The Community Contribution Page (`/contribute`)

### Features
- **No Login Required**: Accessible to anyone visiting the site.
- **Draft System**: Users create guide drafts stored in their browser's IndexedDB (via Dexie).
- **Draft Management**: List, edit, delete, and resume drafts with relative timestamps.
- **Submission**: Drafts are formatted as Markdown and opened as a pre-filled GitHub Issue for admin review.

### How It Works
1. User visits `/contribute` and clicks "New Draft".
2. They fill in title, category, difficulty, estimated time, and step content.
3. Progress auto-saves to IndexedDB — they can close the browser and return later.
4. When ready, they click "Submit" which opens a GitHub Issue with their guide content.
5. The admin reviews the issue and, if approved, recreates it via the admin editor.

---

## 3. The Approval Workflow

1. User submits a guide draft via `/contribute` → GitHub Issue is created.
2. Admin reviews the issue on GitHub.
3. Admin logs in to `/admin` and creates a new guide using the admin editor.
4. Admin copies/adapts the community content into the block editor.
5. Admin clicks "Save" → content is written to `src/content/` as a JSON file.
6. Changes are committed and deployed via Vercel.

This keeps the repository secure — no external user has write access to content files.
