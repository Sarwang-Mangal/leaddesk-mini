# LeadDesk Mini

Live site: https://leaddesk-mini-phi.vercel.app
Admin dashboard: https://leaddesk-mini-phi.vercel.app/admin

---

## Overview

LeadDesk Mini is a full-stack lead-capture product. Visitors submit an enquiry through a public landing page; admins manage and track those leads through a private dashboard.

---

## Features

- ✅ Validated public lead form (name, email, budget range, message)
- ✅ Client-side validation via React Hook Form + Zod
- ✅ Server-side validation on every API route
- ✅ Persistent PostgreSQL storage via Supabase
- ✅ Admin lead dashboard — loads real data, newest first
- ✅ Search by name or email (debounced)
- ✅ Status filter (New / Contacted / Closed)
- ✅ Lead status updates persist after page refresh
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Loading, empty, and error states throughout

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Forms | React Hook Form + `@hookform/resolvers` |
| Validation | Zod (shared schema — browser and server) |
| Database | Supabase PostgreSQL |
| Database client | `@supabase/supabase-js` |
| Hosting | Vercel |

---

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/leaddesk-mini.git
   cd leaddesk-mini
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Create the database table** — open the Supabase SQL Editor and run:
   ```sql
   create type lead_status as enum ('new', 'contacted', 'closed');

   create table public.leads (
     id uuid primary key default gen_random_uuid(),
     name varchar(80) not null,
     email varchar(254) not null,
     budget_range varchar(30) not null,
     message varchar(1000) not null,
     status lead_status not null default 'new',
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );

   create index leads_created_at_idx on public.leads (created_at desc);
   create index leads_status_idx on public.leads (status);
   create index leads_email_idx on public.leads (email);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## API

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/leads` | Create a new lead (201) |
| `GET` | `/api/leads?q=&status=` | List/search leads |
| `PATCH` | `/api/leads/:id` | Update lead status |

---

## Architecture

```
Visitor → Landing page (/) → React Hook Form + Zod (client)
  → POST /api/leads → Zod (server) → Supabase PostgreSQL
  → GET /api/leads → Admin dashboard (/admin)
  → PATCH /api/leads/:id → Persistent status update
```

The Supabase service-role key is held exclusively in server-side environment variables. It is never exposed to the browser.

---

## Production Note

The assessment version leaves `/admin` accessible without authentication for easy reviewer access. A production version would protect lead data with Supabase Auth and role-based access control.
