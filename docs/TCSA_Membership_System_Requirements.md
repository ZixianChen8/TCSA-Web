<!-- Agent note: implementation map is ../AGENTS.md. Do not reuse the existing Member model or /joinus page. -->

# TCSA 官网会员系统开发需求书

**Membership System Product Requirements Document**

| Field | Value |
| --- | --- |
| Website | tcsaofficial.com |
| Client | TCSA |
| First cohort | 40–60 members |
| Future scale | 100–300 members |
| Version | V1.0 |
| Document date | 17 July 2026 |

> This document is for internal review by designated parties. Without TCSA authorization, do not externally commit to partnerships, benefits, or features not yet formally confirmed.

---

## Table of Contents

1. [Project Background](#1-project-background)
2. [Project Goals](#2-project-goals)
3. [User Roles](#3-user-roles)
4. [Website Page Requirements](#4-website-page-requirements)
5. [Membership Application Form](#5-membership-application-form)
6. [Member ID](#6-member-id)
7. [Member Status](#7-member-status)
8. [Payment](#8-payment)
9. [Email](#9-email)
10. [Event Registration](#10-event-registration)
11. [Check-in and No-show](#11-check-in-and-no-show)
12. [Admin Backend](#12-admin-backend)
13. [Permission Requirements](#13-permission-requirements)
14. [Privacy and Security](#14-privacy-and-security)
15. [Mobile Requirements](#15-mobile-requirements)
16. [Phase 1 Scope](#16-phase-1-scope)
17. [Out of Phase 1 Scope](#17-out-of-phase-1-scope)
18. [Testing Requirements](#18-testing-requirements)
19. [Acceptance Criteria](#19-acceptance-criteria)
20. [Developer Feedback Checklist](#20-developer-feedback-checklist)
21. [Source Code and Account Ownership](#21-source-code-and-account-ownership)
22. [Suggested Development Phases](#22-suggested-development-phases)
23. [Core Principles](#23-core-principles)

---

## 1. Project Background

TCSA plans to launch an annual membership program for the 2026–2027 academic year. Members receive early registration for some events, priority applications, member discounts, and member-only activities.

To reduce manual registration errors and unify membership applications, payment confirmation, identity verification, and event registration, the plan is to add a membership system to the existing website at **tcsaofficial.com**.

**Target flow:** View benefits → Submit application → Complete payment → Activate membership → Register for events → Backend management

Phase 1 does **not** require a complex social platform or standalone app. Priority is stable workflows, data security, and maintainability across leadership transitions.

---

## 2. Project Goals

1. Display membership program, pricing, benefits, and policies on the website.
2. Support online membership applications from students.
3. Support membership fee payment or payment record confirmation.
4. Automatically or semi-automatically generate unique member IDs.
5. Build a unified member database and status management.
6. Support member identity verification during event registration.
7. Support member-priority registration, public registration, and waitlists.
8. Support admin view, filter, edit, and export of member records.
9. Support recording event attendance, cancellations, and no-shows.
10. Reserve future capability for member login, digital membership cards, and automation.

---

## 3. User Roles

### 3.1 General Visitor

- View membership intro, pricing, benefits, policies, and FAQ.
- Submit membership application and enter payment flow.
- Cannot view other members' data or the admin backend.

### 3.2 Registered Member

Phase 1 does **not** require password login. Members can verify identity for event registration using uOttawa email and member ID.

- Register for member-priority or member-only events.
- View public member events.
- Submit profile change requests or member ID lookup requests.

### 3.3 Membership Coordinator

- View membership applications, roster, and payment status.
- Create or verify member IDs.
- Modify member status, search, and export members.
- Manage event registrations, attendance, and no-show records.
- Send or resend confirmation emails.

**Restrictions:** Cannot independently approve refunds, modify received amounts, or delete complete payment records.

### 3.4 Finance Admin (VP Finance)

- View and verify payment records.
- Mark payments as successful, refunded, or exceptional.
- Export financial records and record refund dates and amounts.

### 3.5 Event Lead

- View application data only for events they are responsible for.
- Review final participant lists.
- Record check-ins and submit attendance results to the membership coordinator.

### 3.6 Website Super Admin

- Manage pages, admin permissions, and system configuration.
- View system logs and fix data errors.
- Manage database, email, payments, backup, and recovery.

---

## 4. Website Page Requirements

### 4.1 Membership Home

**Suggested path:** `tcsaofficial.com/membership`

- Membership program overview
- Core member benefits
- Membership pricing and validity period
- Join membership button
- Member events entry
- FAQ and policy links
- Contact information

**Primary buttons:** Become a Member, View Member Benefits, Member Events, Membership FAQ

### 4.2 Member Benefits

- Early registration for some events
- Priority application for Office Tour and similar events
- Member-only career development events
- Member pricing for some paid events
- Priority waitlist notifications
- Priority application for volunteer and internal projects
- Formally confirmed partnership benefits

**Required disclaimer:** *Membership provides priority access but does not guarantee admission to capacity-limited or application-based events.*

### 4.3 Join Membership

**Suggested path:** `tcsaofficial.com/membership/join`

- Membership application form
- Membership type and amount
- Validity period
- Refund policy summary
- Privacy notice
- Membership terms agreement checkbox
- Payment entry

### 4.4 Member Events

**Suggested path:** `tcsaofficial.com/membership/events`

- Event name, date, time, location, and details
- Event category and total capacity
- Member-priority and public registration start times
- Deadline
- Whether screening or deposit is required
- Registration button and full/waitlist status

| Event Status | Description |
| --- | --- |
| Coming Soon | Event published but registration not yet open |
| Member Registration Open | Only Active members can register |
| General Registration Open | Eligible general students can register |
| Waitlist Only | At capacity; waitlist only |
| Registration Closed | Registration closed |
| Completed / Cancelled | Event ended or cancelled |

### 4.5 Membership FAQ

1. Does membership guarantee Office Tour participation?
2. Can non-members still attend TCSA events?
3. How long is membership valid?
4. Can membership be transferred?
5. How do I request a refund?
6. How do I update personal information?
7. What if I forget my member ID?
8. What if I cannot attend after registering?
9. What is a no-show?
10. How do I contact the membership coordinator?

### 4.6 Membership Policies

- Membership Terms
- Refund Policy
- No-show Policy
- Privacy Notice
- Code of Conduct
- Data Sharing Consent

---

## 5. Membership Application Form

| Field Type | Fields |
| --- | --- |
| **Required** | Legal Name, Preferred Name, uOttawa Email, Program, Year of Study, Expected Graduation Year, Membership Type, Interested Industries, notification consent, membership terms and privacy policy agreement |
| **Optional** | Personal Email, WeChat ID, LinkedIn Profile, preferred event types |
| **Must NOT collect** | Full student number, passport, ID card, SIN, bank account, full payment card number, or other unrelated sensitive data |

Payment card information must be handled by a compliant payment platform and must **not** enter TCSA's own database.

---

## 6. Member ID

**Suggested format:** `TCSA-26-0001`

- IDs must be unique.
- IDs should not be modified after generation (in principle).
- Original ID records are retained after refund or cancellation.
- Cancelled IDs must not be reassigned.
- Support searching members by ID or email.

---

## 7. Member Status

| Status | Description |
| --- | --- |
| Pending | Application submitted; payment not yet confirmed |
| Active | Payment confirmed; membership benefits valid |
| Payment Review | Payment anomaly; manual verification required |
| Suspended | Some benefits paused during validity period |
| Expired | Membership validity period ended |
| Refunded | Membership fee refunded |
| Cancelled | Application cancelled or membership terminated |

Every status change must log: previous status, new status, change time, admin operator, and reason.

---

## 8. Payment

### 8.1 Basic Requirements

- Display correct price and link application to payment record.
- On successful payment: update status and save date, amount, and transaction ID.
- Support refund marking, failed retry, and duplicate payment detection.
- Prices must be admin-configurable (not hardcoded permanently).

| Membership Type | Initial Price |
| --- | --- |
| Early Bird Membership | CAD $20 |
| Regular Membership | CAD $25 |
| Winter Membership | CAD $15 |

### 8.2 Payment Solution Evaluation

Developers should explain supported options, integration difficulty, transaction fees, refund capability, and organizational account ownership. Options to evaluate: Stripe, Square, PayPal, Eventbrite, or semi-automated e-transfer with manual confirmation. Final platform chosen by TCSA after compliance review.

### 8.3 Phase 1 Fallback Flow

1. Student submits application on website.
2. Page displays payment instructions.
3. Student completes external payment.
4. VP Finance confirms receipt in backend.
5. System activates membership.
6. System sends membership confirmation email.

---

## 9. Email

| Email | Trigger and Main Content |
| --- | --- |
| Application received | Auto-send after submission; current status and next steps |
| Membership activation | After payment confirmation; includes ID, type, validity, benefits, policy links |
| Payment anomaly | Payment failed, amount mismatch, or unable to verify |
| Refund confirmation | After refund completed |
| Expiry reminder | Before membership expires |
| Admin resend | Admin can manually resend activation confirmation |

Use TCSA official domain email as sender; do not use personal board member email.

---

## 10. Event Registration

### 10.1 Event Creation Fields

- Event name and description
- Date, start/end time, location
- Total capacity, member slots, public slots, staff slots
- Member and public registration start times
- Deadline
- Waitlist, manual review, payment/deposit, and cancellation settings

### 10.2 Member Identity Verification

For member registration, student enters uOttawa email and member ID. System verifies:

- Email matches ID
- Status is Active
- Event date is within membership validity
- No registration restrictions
- Not already registered

### 10.3 Registration Status

| Status | Description |
| --- | --- |
| Submitted | Application submitted |
| Under Review | Awaiting manual review |
| Confirmed | Participation confirmed |
| Waitlisted | On waitlist |
| Declined | Not accepted |
| Cancelled | Cancelled |
| Attended | Attended |
| No-show | Absent without notice |

### 10.4 Member Priority Rules

- During priority period, only Active members can register.
- At public registration time, general registration opens automatically.
- Member and public slots can be set separately.
- When full, automatically enter waitlist or close registration.
- Admin can manually adjust capacity and final list.

### 10.5 Manual Screening

Some Office Tours cannot be first-come-first-served. Admin must view application responses and manually set Confirmed, Waitlisted, or Declined. Member status does **not** automatically guarantee admission.

---

## 11. Check-in and No-show

### 11.1 Phase 1 Check-in

Phase 1 may use admin backend checkboxes or list check-in. QR check-in is optional and quoted separately.

### 11.2 Attendance Status

- Attended
- Cancelled on Time
- Late Cancellation
- No-show
- Excused Absence

### 11.3 No-show Management

- Display cumulative no-show count and related events.
- Record date, outcome, suspension start/end dates, and internal notes.
- Support setting member status to Suspended.
- System does **not** auto-penalize; authorized staff must confirm.

---

## 12. Admin Backend

### 12.1 Dashboard

- Total members, Active, Pending, Payment Review counts
- New members this month and expiring soon
- Recent events
- Pending refunds and payments to confirm

### 12.2 Members

- Search/filter by name, email, ID, status, type, major, year
- View details, modify status, event history, no-shows
- Export CSV or Excel
- Resend confirmation email

### 12.3 Payments

- View and filter payment records
- Mark success, refund, anomaly
- Record refund reason
- Export financial records

### 12.4 Events

- Create, edit, close events
- Adjust capacity
- View applicants and modify status
- Export participant list
- Record check-in

### 12.5 Administrators

- Add, deactivate, delete admins
- Assign permissions
- View recent logins
- Deactivate access immediately when someone leaves

---

## 13. Permission Requirements

| Function | Membership Coordinator | VP Finance | Event Lead | Super Admin |
| --- | --- | --- | --- | --- |
| View basic member info | Yes | Yes | Related events only | Yes |
| Modify member status | Yes | Payment-related | No | Yes |
| View payment records | Status only | Yes | No | Yes |
| Approve refunds | No | Yes | No | Yes |
| Create events | Yes | No | Yes | Yes |
| View event applications | Yes | No | Yes | Yes |
| Modify final list | Assist | No | Yes | Yes |
| Record check-in | Yes | No | Yes | Yes |
| Modify admin permissions | No | No | No | Yes |
| Export full database | With authorization | Finance portion | Related events only | Yes |

---

## 14. Privacy and Security

1. HTTPS site-wide.
2. Admin backend requires login.
3. Passwords must not be stored in plain text.
4. Two-factor authentication recommended.
5. Do not store full card data.
6. Frontend must not expose database or API keys.
7. General users cannot access member roster.
8. Log critical admin actions.
9. Regular member database backups.
10. Deactivate admin accounts immediately when someone leaves.
11. Restrict access to exported member files.
12. Error pages must not expose sensitive server information.

If using third-party database, email, or payment services, document: service name, free tier, estimated cost, data region, account ownership, and handover process for leadership transitions.

---

## 15. Mobile Requirements

Membership home, application form, payment, event registration, policies, and confirmation pages must be mobile-friendly. Test especially in Safari and WeChat in-app browser.

- Forms must not overflow screen
- Buttons easy to tap
- Clear typography
- No horizontal scrolling
- Correct return to site after payment
- Clear, actionable error messages

---

## 16. Phase 1 Scope

### 16.1 Must Complete

- Membership home, Benefits, Join, FAQ, and Policies pages
- Membership application form and database
- Member ID and status management
- Payment status records and activation flow
- Membership confirmation email
- Member Events page
- Member identity verification
- Member-priority registration and waitlist
- Admin backend
- CSV or Excel export
- Mobile adaptation
- Basic role permissions

### 16.2 Optional (Quote Separately)

- Full member login accounts
- Digital membership card
- Apple Wallet or Google Wallet
- QR check-in
- Automatic refunds
- Automatic waitlist fill
- Automatic event reminders
- Member personal dashboard
- Renewal system
- Event ticketing
- Multi-language
- WeChat notifications
- Analytics dashboard

---

## 17. Out of Phase 1 Scope

- Standalone mobile app
- Member DMs or social forum
- Points/rewards shop
- Multi-tier VIP membership
- Automatic internship recommendations
- Employer recruiting system
- Complex CRM
- School student number database integration
- Automatic eligibility for company screening

---

## 18. Testing Requirements

Developers must provide a test environment. Do not use live payment or real member data for first-time testing on production.

| Test Category | Minimum Coverage |
| --- | --- |
| Application & membership | Normal application, duplicate email, duplicate ID, profile changes |
| Payment | Success, failure, wrong amount, duplicate payment, refund |
| Event registration | Wrong ID, non-member, expired/suspended member, full capacity, waitlist, cancellation |
| Email | Normal send, send failure, admin resend |
| Permissions & data | Different admin roles, export, backup and restore |
| Devices | Desktop, mobile, Safari, WeChat in-app browser |

Recommend 10–15 test accounts completing the full flow: apply → pay → activate → event register → check-in → refund → no-show.

---

## 19. Acceptance Criteria

| Module | Acceptance Requirements |
| --- | --- |
| Pages | Pages accessible; mobile and desktop display correctly; links work; policies and prices updatable |
| Membership application | Required field validation; duplicate application detection; applications appear in backend |
| Payment | Payment or manual confirmation works; records linked to application; no full card storage |
| Member management | Unique IDs; search, status change, export; status changes logged |
| Event registration | Active members can register in priority period; non-members restricted; capacity, waitlist, manual list manageable |
| Email | Application, activation, refund emails send; accurate content; admin can resend |
| Security | Backend login and permissions work; visitors cannot access database; backup and account deactivation supported |

---

## 20. Developer Feedback Checklist

1. Current website frontend technology; whether backend and database exist.
2. Current hosting platform and domain/server admin ownership.
3. Recommended database, payment, and email solutions.
4. What can be implemented in phase 1 and limitations.
5. Features requiring paid third-party services, monthly fees, and transaction fees.
6. Phase 1 development quote and optional feature quotes.
7. Expected maintenance and incident response approach.
8. Source code, account, and technical documentation delivery.
9. Data backup and recovery plan.
10. Test environment, launch process, and future expansion recommendations.

### Developer Response Section (to be filled)

| Item | Developer Response |
| --- | --- |
| Recommended technical approach | |
| Phase 1 quote | |
| Optional feature quotes | |
| Third-party service costs | |
| Expected delivery phases | |
| Maintenance plan | |
| Main risks or open questions | |

---

## 21. Source Code and Account Ownership

At delivery, TCSA must own or control:

- Website source code and repository
- Domain and hosting platform admin access
- Database admin access
- Payment and email platform organizational accounts
- Third-party service accounts
- Deployment docs, database docs, and admin operation manual

Core systems must not remain bound to developer or single-term board member personal accounts long-term.

---

## 22. Suggested Development Phases

| Phase | Deliverables |
| --- | --- |
| **Phase 1: Technical confirmation** | Review existing stack, backend, database, hosting, payment, email; submit plan and quote |
| **Phase 2: Pages & database** | Membership pages, application form, member database, backend, IDs and status |
| **Phase 3: Payment & email** | Payment or manual confirmation, activation email, refund records, email templates |
| **Phase 4: Event registration** | Member Events, identity verification, priority registration, capacity, waitlist, check-in |
| **Phase 5: Test & launch** | Internal testing, fixes, admin training, backup, production deployment |

---

## 23. Core Principles

**Stable workflows, data security, simple operation, easy handover.**

At 40–60 members in phase 1, a system that reliably handles application, payment confirmation, member verification, event registration, and backend management is more suitable for TCSA than a complex but hard-to-maintain membership platform.

---

## Source

Converted from: `TCSA_Website_Membership_System_Development_Requirements.pdf` (V1.0, 17 July 2026)
