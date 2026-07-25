# LeadDesk Mini

> Built for the **Digital Heroes Training Task (Task B)**.

- **Landing page**: [https://leaddesk-mini-phi.vercel.app](https://leaddesk-mini-phi.vercel.app)
- **Login page**: [https://leaddesk-mini-phi.vercel.app/login](https://leaddesk-mini-phi.vercel.app/login)
- **Admin dashboard**: [https://leaddesk-mini-phi.vercel.app/admin](https://leaddesk-mini-phi.vercel.app/admin)
- **Loom walkthrough**: _[Insert Loom URL when recorded]_

---

## Overview

LeadDesk Mini is a full-stack lead-capture product. Visitors submit project enquiries through a public landing page. Authorized administrators sign in via Supabase Auth to manage and track leads on a protected dashboard.

---

## Features

- ✅ **Public Lead Capture Form**: Name, email, budget range, and message.
- ✅ **Dual-layer Validation**: React Hook Form + Zod on the client; Zod validation on all API endpoints.
- ✅ **Real PostgreSQL Database**: Hosted on Supabase.
- ✅ **Supabase Auth & SSR Cookie Sessions**: Email/password authentication built with `@supabase/ssr`.
- ✅ **Protected Admin Routes & APIs**: `/admin`, `GET /api/leads`, and `PATCH /api/leads/:id` are protected server-side with `auth.getUser()` and restricted to `ADMIN_EMAIL`.
- ✅ **Public Lead Submission**: `POST /api/leads` remains public for visitors.
- ✅ **Admin Dashboard UI/UX**:
  - Metric cards for Total, New, Contacted, and Closed leads
  - Debounced search (name/email) & status filter
  - Status updates (`New`, `Contacted`, `Closed`) persisting in PostgreSQL
  - Loading skeletons, empty states, and inline status update feedback
  - Desktop table & responsive mobile lead cards
  - Logout functionality

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Authentication | Supabase Auth + `@supabase/ssr` |
| Form Handling | React Hook Form + `@hookform/resolvers` |
| Validation | Zod (shared browser and server schemas) |
| Database | Supabase PostgreSQL |
| Database Client | `@supabase/supabase-js` |
| Hosting | Vercel |

---

## Data Model

| Field | Type | Rules / Default | Description |
|---|---|---|---|
| `id` | UUID | Primary key | Unique lead identifier |
| `name` | Varchar(80) | Required | Visitor full name |
| `email` | Varchar(254) | Required, valid email | Contact email address |
| `budget_range` | Varchar(30) | Required | Project budget selection |
| `message` | Varchar(1000) | Required | Enquiry message (10–1000 chars) |
| `status` | Enum (`new`, `contacted`, `closed`) | Default `'new'` | Lead progress state |
| `created_at` | Timestamptz | Default `now()` | Submission timestamp |
| `updated_at` | Timestamptz | Default `now()` | Modification timestamp |

---

## Authentication & Security Architecture

- **SSR Session Management**: `@supabase/ssr` creates server-side cookie sessions managed via `src/proxy.ts`.
- **Route Interception**: Unauthenticated visits to `/admin` are automatically redirected to `/login?next=/admin`.
- **API Guard**: `requireAdmin()` helper calls `auth.getUser()` on the server and checks the authenticated user's email against `ADMIN_EMAIL`. Returns `401 Unauthorized` if unauthenticated and `403 Forbidden` if unauthorized.
- **Public Endpoint**: `POST /api/leads` remains unauthenticated so visitors can send enquiries freely.
- **Service Role Secret**: `SUPABASE_SERVICE_ROLE_KEY` is kept server-only and never exposed to the client or committed to Git.

---

## Local Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/Sarwang-Mangal/leaddesk-mini.git
   cd leaddesk-mini
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment setup**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and admin email in `.env.local`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ADMIN_EMAIL=your-admin-email@example.com
   ```

4. **Database Table Creation**: Run the SQL schema in your Supabase SQL Editor:
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

5. **Run local server**:
   ```bash
   npm run dev
   ```

---

## Production & Credential Security Note

Admin test credentials are created specifically for evaluation and shared privately with the evaluator. No passwords, secret keys, or credentials are stored in the codebase or public repository.
