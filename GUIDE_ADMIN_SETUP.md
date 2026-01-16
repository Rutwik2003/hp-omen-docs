# Custom Admin Panel Setup

You are using a **Custom Built Admin Panel** (`/admin`) instead of a generic CMS. Content is stored in simple JSON files in `src/content`.

## 1. Local Development (Testing)

To use the admin panel locally, you need two things running:

1.  **The Frontend**: `npm run dev`
2.  **The Backend API**: `npm run api-server`

**Why the backend?**
Browsers cannot write to your hard drive for security reasons. The `api-server` is a tiny script (`server.js`) that listens for "Save" requests from the admin panel and updates the JSON files on your disk.

**How to test:**
1.  Run both commands in separate terminals.
2.  Go to `http://localhost:5173/admin`.
3.  Login with: `admin123`.
4.  Create/Edit a guide.
5.  Check your VS Code file explorer—you will see the `.json` file update instantly!

---

## 2. Production Deployment (Vercel)

When you deploy to Vercel, you cannot run `api-server`. Instead, the Admin Panel detects it is in "Production Mode" and switches to using the **GitHub API**.

### Setup Steps for Vercel:

1.  **Generate a GitHub Token**:
    *   Go to GitHub -> Settings -> Developer Settings -> Personal Access Tokens.
    *   Create a "Fine-grained token".
    *   Give it permission to **Read and Write** to your `hp-omen-website` repository (specifically "Contents").
    *   Copy the token (starts with `github_pat_...`).

2.  **Using the Admin Panel**:
    *   Go to `your-site.vercel.app/admin`.
    *   The Login screen will ask for a **Access Token** instead of a password.
    *   Paste your GitHub Token.
    *   Now, when you click "Save", the app will commit changes directly to your GitHub repo!

---

## 3. Configuration
*   **Repo Settings**: Open `src/utils/adminApi.ts` and update `REPO_OWNER` and `REPO_NAME` to match your actual GitHub details.
