# Admin Dashboard Generator Prompt

Use this prompt when starting a new project or adding an admin panel to an existing one.

---

## Prompt

```
Build a full admin dashboard with CRUD APIs for a Next.js (App Router) project using the following stack and patterns. Follow these conventions exactly.

### Stack
- Next.js 16+ (App Router, React 19, Server Components)
- Drizzle ORM + SQLite (Turso for production, local.db for dev)
- Tailwind CSS 4+
- Cloudinary for image uploads
- TypeScript throughout

### Database Setup
1. Create `src/db/schema.ts` with Drizzle defineTable/defineColumn for each content type (e.g., posts, categories, media, settings).
2. Create `src/db/index.ts` that initializes the Turso client from `TURSO_DATABASE_URL` env var (fallback to `file:local.db`) and exports `db` and `schema`.
3. Create `src/db/seed.ts` that is idempotent (clears all tables before inserting default data). Run via `npx tsx src/db/seed.ts`.
4. Create `drizzle.config.ts` at project root pointing to `src/db/schema.ts` and using `turso` driver.

### API Routes (`src/app/api/`)
For each content type, create `src/app/api/{resource}/route.ts` with:

- **GET** — Public, no auth. Fetch all records ordered by `order` field.
- **POST** — Protected. Create a new record. Return the created record.
- **PUT** — Protected. Accept `{ id, ...fields }` in body. Validate ID exists, return 404 if not. Update and return `{ ok: true }`.
- **DELETE** — Protected. Accept `?id=` query param. Validate ID exists, return 404 if not. Return `{ ok: true }`.

**Auth pattern** — Create `src/lib/auth.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";

export function requireAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
```

**Validation pattern** — Every POST/PUT must validate required fields BEFORE any DB query. Return `{ error: "message" }` with 400 for missing fields. Never pass undefined to `eq()`.

**Error responses**:
- 400: `{ error: "Field 'name' is required" }` (validation)
- 401: `{ error: "Unauthorized" }` (missing/bad token)
- 404: `{ error: "Not found" }` (entity doesn't exist)

**Auth endpoint** — Create `src/app/api/auth/route.ts`:
```ts
POST with { password } in body. Compare against process.env.ADMIN_PASSWORD. Return { ok: true } or 401.
```

**Upload endpoint** — Create `src/app/api/upload/route.ts`:
```ts
POST with multipart/form-data. Validate: file exists, Content-Type is image/*, file < 10MB.
Upload to Cloudinary. Return { url, publicId }.
Protected with requireAuth.
```

### Admin Frontend (`src/app/admin/`)

**Layout** — `src/app/admin/layout.tsx`:
- Dark sidebar navigation with links to each section
- Check localStorage for `admin_auth` token on mount
- Redirect to `/admin/login` if not authenticated
- Show a logout button

**Login page** — `src/app/admin/login/page.tsx`:
- Simple password form
- POST to `/api/auth` with password
- Store returned token in `localStorage.setItem("admin_auth", token)`
- Redirect to `/admin` on success

**Each CRUD page** (e.g., `src/app/admin/posts/page.tsx`):
- Fetch data via GET (include `x-admin-token` from localStorage)
- Show data in a table or card grid
- Edit mode: inline editing or modal with form fields
- Delete button with confirmation
- Create button with form/modal
- Toast notifications for success/error (create `src/components/Toast.tsx`)

**Fetch helper** — Create `src/lib/adminFetch.ts`:
```ts
export async function adminFetch(url: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_auth") : "";
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token || "",
      ...options.headers,
    },
  });
}
```

All admin write operations (POST, PUT, DELETE) MUST use `adminFetch` instead of plain `fetch`.

### Layout & Route Structure
```
src/app/
  layout.tsx          — Root layout (fonts, metadata)
  (public)/
    layout.tsx        — Public layout (navbar, footer)
    page.tsx          — Homepage (Server Component, queries DB)
    ...other pages
  admin/
    layout.tsx        — Admin layout (sidebar, auth check)
    login/page.tsx    — Login page
    page.tsx          — Dashboard overview
    {resource}/
      page.tsx        — CRUD page for each resource
  api/
    auth/route.ts     — Auth endpoint
    {resource}/
      route.ts        — GET/POST/PUT/DELETE
    upload/route.ts   — File upload
```

### Key Rules
1. GET endpoints are public. POST/PUT/DELETE require `x-admin-token` header.
2. Always validate input BEFORE database queries.
3. All pages that write data must use the `adminFetch` helper.
4. The `eq()` filter must never receive undefined — check values first.
5. Seed script must be idempotent (safe to run multiple times).
6. Delete 404 must check existence before attempting delete.
7. No unused imports, no TypeScript errors. Run `npm run lint` and `npx next build` to verify.
8. Add `local.db` and `.env*.local` to `.gitignore`.

### Environment Variables Required
```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_PASSWORD=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Admin UI Style
- Clean, minimal design
- Use the project's existing design tokens (colors, fonts)
- Tables with zebra striping or card grids
- Forms with proper labels and validation feedback
- Responsive (works on mobile)
- Dark sidebar, light content area
```

---

## Quick Start

1. Copy this prompt into your AI assistant at the start of a new project
2. Tell it your content types (e.g., "posts, categories, media")
3. It will generate the full admin panel with auth, APIs, and UI
4. Run `npx drizzle-kit push` then `npx tsx src/db/seed.ts` to populate DB
5. Set env vars, deploy, done
