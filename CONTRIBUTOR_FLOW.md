# Architecture: Custom Admin & Community Contributions

You want a setup where:
1.  **Admin (You)**: Have a secure, private "Superuser" login to manage everything.
2.  **Community**: Can visit a public page to submit content, which you approve.

## 1. The Superuser Admin Panel
**Clarification**: The "Invite Only" setting in Netlify Identity *does exactly what you want*.
*   **Public Site**: Accessible to everyone.
*   **Admin Panel (`/admin`)**: Locked. **Only you** (with your email/password) can enter.
*   **Security**: It uses "JSON Web Tokens". This is the standard secure "ID/Pass" system.

Since you prefer not to use GitHub/Netlify UI, we can technically build a **Custom Firebase Admin**, but that requires building a full backend (API, Database, Auth) which is overkill for a static site.
**Recommendation**: Stick to the Decap CMS + "Invite Only" Identity. It gives you the "Private Admin / Public Site" separation out of the box.

## 2. The Community Contribution Page
We will build a new page: **`/contribute`**.

### Features
*   **No Login Required**: Accessible to anyone.
*   **Simple Form**: Fields for Title, Category, Description, and Steps.
*   **"Submit" Action**:
    *   Since we don't have a backend server, we can't "save to database" directly.
    *   **Option A (GitHub Issue)**: Clicking Submit formats their guide into Markdown and opens a pre-filled GitHub Issue. You can then copy-paste it into your Admin panel.
    *   **Option B (Email)**: Opens their email client with the JSON attached, sending it to you.
    *   **Option C (Pull Request)**: Requires them to login with GitHub (which you wanted to avoid).

### Proposed UI: `/contribute`
A beautiful "Guide Creator" interface.
1.  **Metadata Section**: Title, Difficulty, Time.
2.  **Editor**: A text area or simple step-builder.
3.  **Preview**: Real-time preview of how the card looks.
4.  **Submit Button**: "Send to Admin".

## 3. The Approval Workflow
1.  User submits guide via `/contribute`.
2.  You receive the content (via GitHub Issue/Email).
3.  You log in to `/admin`.
4.  You click "New Guide" and paste their content.
5.  You click "Publish".

This keeps your repository secure (no stranger has write access) while allowing community submissions.
