# TCSA-Web — Agent Guide

Read this before changing code. Product requirements live in `docs/`; this file is the map of the running site.

## What this repo is

Public marketing site for Telfer Chinese Student Association at **tcsaofficial.com**.

- **Frontend:** React 18 + Vite 6 + React Router 7. Styles are CSS Modules (primary), MUI v6 (selective), styled-components (logo only).
- **Backend:** Django 5 + DRF. Single app: `backend/api`. PostgreSQL + AWS S3. Django admin is the CMS.
- **APIs:** Almost all `GET` and `AllowAny`. The only write endpoint is `POST /api/events/<id>/register/`.
- **Email:** Client-side EmailJS. Django has no mail backend.
- **Auth:** No member login. No JWT. Admin is Django `/admin/` only.

This is **not** a membership platform yet. See [docs/TCSA_Membership_System_Requirements.md](docs/TCSA_Membership_System_Requirements.md).

## Directory map

```
frontend/src/pages/       Public routes (one folder per page)
frontend/src/components/  Shared UI
frontend/src/App.jsx      Route table
backend/api/models.py    All domain models
backend/api/views.py     DRF views
backend/api/urls.py      /api/ routes
backend/api/admin.py     Django admin CMS
backend/backend/         Django project settings
docs/                     Specs for agents (start at docs/README.md)
queries/                  One-off SQL; not runtime
```

Do not invent `src/theme/`, extra Django apps, or a `Member` reuse without reading [Naming collisions](#naming-collisions-do-not-overload).

## Commands

```bash
# Frontend — http://localhost:5173  (proxies /api → :8000)
cd frontend && npm install && npm run dev

# Backend — http://localhost:8000
cd backend && python -m venv ../venv && source ../venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Admin
python manage.py createsuperuser
```

Env files are not committed. Copy `frontend/.env.example` and `backend/.env.example`.

## Public routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | `pages/PageHome/Home.jsx` | |
| `/events` | `pages/PageEvents/PageEvents.jsx` | Public calendar |
| `events/:id` | `pages/PageEventDetails/PageEventDetails.jsx` | Relative path; anonymous RSVP |
| `/joinus` | `pages/PageJoinus/PageJoinus.jsx` | **Exec recruitment**, EmailJS only |
| `/alumni` `/services` `/resources` `/designs` `/partnerships` `/privacy-policy` | matching `pages/` | |

No `/membership*` routes yet.

## Naming collisions (do not overload)

| Existing name | Actual meaning | Membership PRD meaning |
| --- | --- | --- |
| `Member` | Exec org-chart row (`/api/members/`) | Paying student member |
| `/joinus` | Exec job applications via EmailJS | `/membership/join` apply form |
| `Registration` | Anonymous event RSVP | Member-gated signup + ID check |

For paid membership, introduce **new** names (`ClubMember`, `MembershipApplication`, etc.). Do not extend `Member` or replace `/joinus`.

## Frontend conventions

- Colocate page CSS as `*.module.css`. Vite CSS modules use `camelCase` locals.
- New pages: `frontend/src/pages/PageName/PageName.jsx` + register in `App.jsx`.
- Add nav links in `components/Navbar/Navbar.jsx` and `components/Footer/Footer.jsx`. Prefer React Router `<Link>` over `<a href>` for in-app routes.
- Call APIs with axios via `/api/...` (Vite proxy in dev).
- Do not put secrets in frontend code. EmailJS keys stay in `VITE_*` env vars.
- Verify UI in the browser after layout/routing/state changes.

## Backend conventions

- Models, serializers, views, urls, admin all live in `backend/api/`.
- New persistent data → model + migration + admin registration.
- Public list endpoints follow existing `*ListAPIView` pattern.
- Do not store student numbers, SIN, passport, or full card numbers.
- Do not put API keys or DB credentials in source. Use env vars.
- `Member` admin has org-hierarchy validation — leave it unless the task is the exec org chart.

## Membership work

If the task is membership, applications, member IDs, payments, member events, waitlist, no-show, or admin roles:

1. Read [docs/TCSA_Membership_System_Requirements.md](docs/TCSA_Membership_System_Requirements.md).
2. Phase 1 is apply → pay/confirm → activate → register → admin. No password login, no app, no QR unless asked.
3. Keep public `/events` RSVP working. Member events are a new lane.
4. Prefer Django admin for the first ops console unless a custom admin UI is explicitly requested.

## Do not

- Commit `.env`, credentials, or `backend/backup.sql`.
- Broadly refactor unrelated pages to “clean up” while implementing a feature.
- Treat EmailJS as an audit trail for activation, refunds, or payments.
- Bind new services to a personal (non-TCSA) account.