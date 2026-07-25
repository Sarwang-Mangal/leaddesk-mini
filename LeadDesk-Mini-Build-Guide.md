# LeadDesk Mini — Full-Stack Build Guide

> **Purpose:** Build and submit the Digital Heroes Training Task: a live lead-capture product with a public landing page and an admin dashboard.
>
> **Timebox:** 3–4 hours for the required version.
>
> **Submission deliverables:** a live landing-page URL, a live \`/admin\` URL, and a public GitHub repository.

---

## 1. What you are building

**LeadDesk Mini** is a small product for collecting enquiries and managing them as leads.

### Public user flow

1. A visitor opens the landing page.
2. They enter their name, email, budget range, and message.
3. The browser validates the input.
4. The backend validates the same input again.
5. The lead is saved to a real PostgreSQL database with status **New**.
6. The visitor sees a clear success or error message.

### Admin flow

1. An admin opens \`/admin\`.
2. The app loads all saved leads.
3. The admin searches by name or email.
4. The admin changes a lead status: **New**, **Contacted**, or **Closed**.
5. The change is saved to the database and remains after refresh.

### Required product flow

\`\`\`text
Visitor fills in form
        ↓
Client-side validation
        ↓
POST /api/leads
        ↓
Server-side validation
        ↓
Supabase PostgreSQL
        ↓
GET /api/leads → /admin dashboard
        ↓
PATCH /api/leads/:id → update status
\`\`\`

---

## 2. Success criteria

The project is assessed on:

| Area | Weight | What must work |
|---|---:|---|
| End-to-end completeness | 40% | A real lead can be submitted, saved, displayed, searched, and updated. |
| Data modelling and backend quality | 35% | A sensible schema, clean API routes, server validation, error handling, and persistent data. |
| UX and validation | 25% | Clear form feedback, useful errors, responsive layout, loading states, and polished dashboard. |

### Definition of done

- [ ] Public landing page is live.
- [ ] Lead form has name, email, budget range, and message.
- [ ] Client-side validation works.
- [ ] Server-side validation works.
- [ ] Submitted data is stored in a real database.
- [ ] \`/admin\` lists saved leads.
- [ ] Search by name/email works.
- [ ] Status can change between New, Contacted, and Closed.
- [ ] Status persists after refresh.
- [ ] Public GitHub repository is available.
- [ ] Footer visibly says **“Built for Digital Heroes Training Task”** and links to \`https://digitalheroesco.com\`.
- [ ] README explains setup, architecture, and live URLs.

---

## 3. Recommended tech stack

Use this exact stack unless you already have much stronger experience with another one.

| Layer | Tool | Why it is the efficient choice |
|---|---|---|
| Full-stack framework | Next.js with TypeScript and App Router | One repository for UI, API routes, and deployment. |
| UI styling | Tailwind CSS | Fast responsive styling with no separate CSS architecture. |
| Form handling | React Hook Form | Handles input state and submission cleanly. |
| Validation | Zod | Reuse the same rules in the browser and on the server. |
| Database | Supabase PostgreSQL | A real hosted PostgreSQL database with a dashboard and SQL editor. |
| Database client | \`@supabase/supabase-js\` | Direct, simple database access from server routes. |
| Hosting | Vercel | Best low-friction deployment for Next.js. |
| Version control | GitHub | Required public repository and professional project history. |

### Why this is better than a separate frontend and Express backend

For a short assessment, a separate React app and Express API add extra setup, two deployments, CORS concerns, and more ways to fail. Next.js gives you:

- The public page at \`/\`
- The admin page at \`/admin\`
- API endpoints at \`/api/leads\`
- One deployment on Vercel
- One GitHub repository

### Do not add these in the first version

- Prisma
- Redux/Zustand
- Docker
- A separate Express server
- Microservices
- Payment integrations
- Email sending
- Complex role-based authentication
- Analytics
- Pagination

They are not needed to meet the brief and will reduce the chance of finishing on time.

---

## 4. Architecture

\`\`\`mermaid
flowchart TD
    Visitor["Visitor"] --> Landing["Next.js landing page /"]
    Landing --> BrowserValidation["React Hook Form + Zod client validation"]
    BrowserValidation --> CreateAPI["POST /api/leads"]
    CreateAPI --> ServerValidation["Zod server validation"]
    ServerValidation --> Database[("Supabase PostgreSQL")]
    Database --> CreateAPI
    CreateAPI --> Landing

    Admin["Admin"] --> Dashboard["Next.js dashboard /admin"]
    Dashboard --> ReadAPI["GET /api/leads?q=&status="]
    ReadAPI --> Database
    Database --> ReadAPI
    ReadAPI --> Dashboard

    Dashboard --> UpdateAPI["PATCH /api/leads/:id"]
    UpdateAPI --> Database
    Database --> UpdateAPI
    UpdateAPI --> Dashboard
\`\`\`

### Security boundary

- The browser must **never** receive the Supabase service-role key.
- Database access happens only inside server-side API route handlers.
- \`.env.local\` contains secrets and must not be committed.
- The client validates for usability; the server validates for safety.
- React renders lead text safely by default; do not inject raw HTML.

### Authentication decision

The task requires an admin side but does **not** explicitly require login/authentication. Keep \`/admin\` accessible in the assessment version so reviewers can test it quickly.

In the README, include this honest note:

> The assessment version leaves the admin route open for easy review. A production version would use Supabase Auth and role-based access control to protect lead data.

Do not claim the open admin page is production-secure.

---

## 5. Project structure

\`\`\`text
leaddesk-mini/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Public landing page
│   │   ├── admin/
│   │   │   └── page.tsx                 # Admin dashboard page
│   │   └── api/
│   │       └── leads/
│   │           ├── route.ts             # GET list + POST create
│   │           └── [id]/
│   │               └── route.ts         # PATCH lead status
│   ├── components/
│   │   ├── LeadForm.tsx
│   │   ├── LeadTable.tsx
│   │   ├── LeadSearch.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── supabase-server.ts           # Server-only client
│   │   └── validation.ts                # Shared Zod schemas
│   └── types/
│       └── lead.ts                      # TypeScript types
├── public/
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── tailwind.config.ts
\`\`\`

---

## 6. Data model

Use a single table for the required version.

### Lead fields

| Field | Type | Rule | Reason |
|---|---|---|---|
| \`id\` | UUID | Primary key | Uniquely identifies a lead. |
| \`name\` | Text | Required, maximum 80 characters | Visitor name. |
| \`email\` | Text | Required, valid email, maximum 254 characters | Main contact method. |
| \`budget_range\` | Text | Required | User-selected project budget. |
| \`message\` | Text | Required, 10–1,000 characters | Lead enquiry details. |
| \`status\` | Enum | Defaults to \`new\` | Tracks lead progress. |
| \`created_at\` | Timestamp | Defaults to current time | Sort newest leads first. |
| \`updated_at\` | Timestamp | Defaults to current time | Tracks last modification. |

### Supabase SQL schema

Run this in the Supabase **SQL Editor**:

\`\`\`sql
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
\`\`\`

### Status display mapping

\`\`\`ts
new        → New
contacted  → Contacted
closed     → Closed
\`\`\`

Use lowercase values in the database and API; display title case in the user interface.

---

## 7. API contract

### A. Create a lead

\`\`\`text
POST /api/leads
\`\`\`

Request body:

\`\`\`json
{
  "name": "Aisha Khan",
  "email": "aisha@example.com",
  "budgetRange": "£1k–£5k",
  "message": "I need a website for my consultancy."
}
\`\`\`

Success response:

\`\`\`json
{
  "lead": {
    "id": "uuid",
    "name": "Aisha Khan",
    "email": "aisha@example.com",
    "budgetRange": "£1k–£5k",
    "message": "I need a website for my consultancy.",
    "status": "new",
    "createdAt": "2026-07-25T10:30:00.000Z"
  }
}
\`\`\`

Responses:

| Status | Meaning |
|---:|---|
| \`201\` | Lead created successfully |
| \`400\` | Invalid request body or failed validation |
| \`500\` | Database or unexpected server error |

### B. List/search leads

\`\`\`text
GET /api/leads
GET /api/leads?q=aisha
GET /api/leads?status=new
\`\`\`

Rules:

- Sort by \`created_at\` descending.
- If \`q\` exists, search name and email.
- If \`status\` exists, filter by a valid status.
- Return an empty array if no result is found; this is not an error.

### C. Update lead status

\`\`\`text
PATCH /api/leads/:id
\`\`\`

Request body:

\`\`\`json
{
  "status": "contacted"
}
\`\`\`

Responses:

| Status | Meaning |
|---:|---|
| \`200\` | Status updated |
| \`400\` | Invalid status or lead ID |
| \`404\` | Lead does not exist |
| \`500\` | Database or unexpected server error |

---

## 8. Validation rules

Create one shared Zod schema in \`src/lib/validation.ts\`.

| Field | Validation |
|---|---|
| Name | Required; trimmed; 2–80 characters |
| Email | Required; trimmed; valid email format; maximum 254 characters |
| Budget range | Required; must match one of the provided options |
| Message | Required; trimmed; 10–1,000 characters |
| Status | Must be \`new\`, \`contacted\`, or \`closed\` |

### Budget options

\`\`\`text
Under £1,000
£1,000–£5,000
£5,000–£10,000
£10,000+
\`\`\`

### Required client-side UX

- Show field-specific validation errors under the relevant input.
- Do not submit while the form is invalid or currently sending.
- Show a loading state: “Sending enquiry…”.
- Clear the form after successful submission.
- Show a friendly success message.
- If the server fails, retain entered data and show a useful error.

### Required server-side behavior

- Parse and validate every request body.
- Never insert unchecked client data.
- Return structured JSON errors.
- Log the actual internal error on the server only.
- Never show raw database errors to the visitor.

---

## 9. Page requirements

### Public landing page: \`/\`

#### Layout

1. Header with product name and an “Admin” link.
2. Hero heading, e.g. **“Turn enquiries into your next opportunity.”**
3. Short supporting description.
4. Lead form in a clear card.
5. Optional three short trust points:
   - Fast response
   - Clear budgets
   - Simple follow-up
6. Required Digital Heroes footer credit.

#### Visual direction

- Use a clean, business-like design.
- Use one primary accent colour only.
- Keep text readable and high contrast.
- Use a maximum content width around 1,100–1,200px.
- Make the form comfortable on mobile.
- Do not use a huge hero image or complicated animations.

### Admin page: \`/admin\`

#### Layout

1. Header with “Lead Dashboard” and link back to landing page.
2. Small overview card: total number of leads.
3. Search input.
4. Optional status filter.
5. Responsive table on desktop and stacked cards on small screens.

#### Table columns

| Column | Purpose |
|---|---|
| Name | Identify the lead |
| Email | Contact details |
| Budget | Quick qualification |
| Message | Lead context |
| Submitted | Show date/time |
| Status | Update lead progress |

#### UX states

| State | Expected UI |
|---|---|
| Loading | Skeleton rows or “Loading leads…” |
| No leads yet | “No leads yet. New enquiries will appear here.” |
| No search match | “No leads match your search.” |
| Update in progress | Disable only the affected status dropdown |
| API failure | Clear retryable error message |

---

## 10. Step-by-step build plan

## Phase 0 — Prepare the project (15–20 minutes)

1. Create a public GitHub repository named \`leaddesk-mini\`.
2. Create the application:

\`\`\`powershell
npx create-next-app@latest leaddesk-mini --typescript --tailwind --eslint --app --src-dir
cd leaddesk-mini
npm install @supabase/supabase-js zod react-hook-form @hookform/resolvers
\`\`\`

3. Start the development server:

\`\`\`powershell
npm run dev
\`\`\`

4. Create a Supabase project.
5. Open Supabase **SQL Editor** and run the schema from section 6.
6. Create a local \`.env.local\` file:

\`\`\`env
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
\`\`\`

7. Add the following \`.env.example\` file to Git:

\`\`\`env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
\`\`\`

8. Make the first commit:

\`\`\`text
chore: initialise LeadDesk Mini project
\`\`\`

### Checkpoint

- The app opens locally.
- The database table exists.
- No real secret appears in GitHub.

---

## Phase 1 — Build the first complete vertical slice (45–60 minutes)

Build the smallest possible end-to-end feature before polishing anything.

\`\`\`text
Form UI → client validation → POST endpoint → server validation → database insert → success message
\`\`\`

### Tasks

1. Build \`LeadForm.tsx\`.
2. Add the four required fields and budget dropdown.
3. Add React Hook Form and client-side Zod validation.
4. Create \`POST /api/leads\`.
5. Validate with the same Zod schema on the server.
6. Insert the validated lead into Supabase.
7. Connect form submission to the API.
8. Show success and error messages.

### Checkpoint

Submit a real test lead. Confirm it appears in Supabase Table Editor with status \`new\`.

---

## Phase 2 — Build the admin dashboard (45–60 minutes)

### Tasks

1. Create \`GET /api/leads\`.
2. Return leads newest first.
3. Create the \`/admin\` page and display all leads.
4. Create the search input.
5. Search name and email after a short debounce (about 250ms) or when the user presses Enter.
6. Create \`PATCH /api/leads/:id\`.
7. Add a status dropdown for each lead.
8. After a successful update, refresh only the affected lead or reload the list.

### Checkpoint

- Search for a submitted email.
- Change it from New to Contacted.
- Refresh the browser.
- Confirm the lead remains Contacted.

---

## Phase 3 — Polish and protect the quality (30–40 minutes)

### Tasks

- Add loading state during form submission.
- Add loading state for dashboard data.
- Add friendly empty states.
- Add responsive styles for 360px, tablet, and desktop widths.
- Add error handling to every API route.
- Ensure the main UI uses semantic HTML labels and buttons.
- Add the required footer credit and link.
- Check no secrets are included in source code.

### Responsive checks

| Width | Confirm |
|---:|---|
| 360px | Form fields are full width; dashboard does not overflow horizontally. |
| 768px | Layout is readable and controls wrap sensibly. |
| 1440px | Dashboard table and landing page have balanced spacing. |

---

## Phase 4 — Deploy and document (20–30 minutes)

1. Push the final code to the public GitHub repository.
2. Import the repository into Vercel.
3. Add \`SUPABASE_URL\` and \`SUPABASE_SERVICE_ROLE_KEY\` in Vercel project environment variables.
4. Deploy.
5. Test:
   - \`https://your-project.vercel.app/\`
   - \`https://your-project.vercel.app/admin\`
6. Add both live URLs to the README.
7. Make one final test submission on the deployed app.

---

## 11. Testing checklist

### Public form

- [ ] Empty submit displays required-field errors.
- [ ] Invalid email displays a clear email error.
- [ ] Budget must be selected.
- [ ] Short message is rejected.
- [ ] Valid form submits successfully.
- [ ] Duplicate submissions do not crash the app.
- [ ] Success message appears after save.
- [ ] Database contains the submitted lead with status \`new\`.

### Admin dashboard

- [ ] Dashboard loads without errors.
- [ ] New leads appear first.
- [ ] Search finds a lead by name.
- [ ] Search finds a lead by email.
- [ ] Search with no match shows an empty state.
- [ ] New changes to Contacted.
- [ ] Contacted changes to Closed.
- [ ] Updated status survives refresh.
- [ ] Long messages do not break the layout.

### Deployment and repository

- [ ] Public GitHub repository opens.
- [ ] No \`.env.local\` or key is committed.
- [ ] Live landing page works.
- [ ] Live \`/admin\` works.
- [ ] Footer credit/link exists.
- [ ] README includes setup and live links.

---

## 12. Git workflow

Make small, descriptive commits. Suggested sequence:

\`\`\`text
chore: initialise LeadDesk Mini project
feat: add Supabase leads schema and server client
feat: add validated lead capture form
feat: persist new leads through API route
feat: add admin lead dashboard and search
feat: add persistent lead status updates
style: polish responsive UI and feedback states
docs: add setup and deployment guide
\`\`\`

Avoid one giant final commit if possible.

---

## 13. README structure

Your public repository should contain:

\`\`\`md
# LeadDesk Mini

Live site: [URL](...)
Admin dashboard: [URL/admin](...)

## Overview
Short description of the lead-capture product.

## Features
- Validated public lead form
- PostgreSQL persistence
- Admin lead dashboard
- Search by name/email
- Lead status workflow

## Tech stack
Next.js, TypeScript, Tailwind CSS, Supabase PostgreSQL, Zod, React Hook Form, Vercel.

## Local setup
1. Clone repository
2. Install dependencies
3. Copy .env.example to .env.local
4. Add Supabase credentials
5. Run npm run dev

## Database
Include or link to the SQL schema.

## Production note
The assessment version keeps /admin accessible for review. A production version should protect lead data with authenticated, role-based access.
\`\`\`

---

## 14. Do and do not do

### Do

- Build the full submission-to-dashboard flow first.
- Use client-side **and** server-side validation.
- Store actual data in Supabase, not local storage or a hard-coded array.
- Show useful errors and loading feedback.
- Keep the code organised into components, API routes, shared validation, and database utilities.
- Use a clean responsive design.
- Test the deployed version, not only localhost.
- Commit often with clear messages.
- Keep secrets in environment variables.
- Include the required Digital Heroes footer credit and link.

### Do not

- Do not use only local storage, JSON files, or mock data as the database.
- Do not put Supabase keys in frontend components.
- Do not trust client validation alone.
- Do not use \`any\` everywhere; define Lead and Status types.
- Do not make the admin status change only visually; persist it to the database.
- Do not spend most of the time on animations, logos, or complex design.
- Do not add unrequested features before the required flow works.
- Do not commit \`.env.local\`, API keys, or database credentials.
- Do not claim the unauthenticated assessment dashboard is production-secure.
- Do not submit before testing the live landing page, live admin route, and public GitHub repo.

---

## 15. Antigravity IDE build prompt

Paste the following into Antigravity IDE if you want it to implement the project in the correct order:

\`\`\`text
Build a complete full-stack project called “LeadDesk Mini” using Next.js App Router, TypeScript, Tailwind CSS, React Hook Form, Zod, and Supabase PostgreSQL.

Requirements:
1. Create a responsive public landing page at / with a lead form containing name, email, budget range, and message.
2. Validate the form in the client using React Hook Form + Zod.
3. Create POST /api/leads. Revalidate all input using the same Zod schema on the server, then store the lead in Supabase PostgreSQL with default status "new".
4. Create an admin dashboard at /admin that loads real leads from GET /api/leads, newest first.
5. Add search by name and email.
6. Add a status control for new, contacted, and closed. Persist changes through PATCH /api/leads/:id.
7. Show proper loading, empty, success, and error states.
8. Use TypeScript types. Keep Supabase service credentials server-only through environment variables.
9. Do not add authentication, a separate Express backend, Prisma, Redux, Docker, or unrequested features.
10. Add a footer that visibly says “Built for Digital Heroes Training Task” and links to https://digitalheroesco.com.

Project structure:
- src/app/page.tsx
- src/app/admin/page.tsx
- src/app/api/leads/route.ts
- src/app/api/leads/[id]/route.ts
- src/components/LeadForm.tsx
- src/components/LeadTable.tsx
- src/lib/validation.ts
- src/lib/supabase-server.ts
- src/types/lead.ts

Use this database schema:
- leads(id UUID primary key, name varchar(80), email varchar(254), budget_range varchar(30), message varchar(1000), status enum new/contacted/closed default new, created_at timestamp, updated_at timestamp)

Implement the project in vertical slices:
1. Database client and shared validation
2. Working form → POST API → real database save
3. Admin GET/list/search
4. PATCH status update
5. Responsive polish and README

Before considering it complete, test invalid form input, valid submission, database persistence, dashboard search, status updates that remain after refresh, and the required footer link.
\`\`\`

---

## 16. Final submission checklist

\`\`\`text
Landing page URL:  https://____________________________
Admin URL:         https://____________________________/admin
GitHub repository: https://github.com/___________________
\`\`\`

Before submission, open all three links in an incognito/private browser window and complete one full lead submission flow.

