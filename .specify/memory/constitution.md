<!--
Sync Impact Report
==================
Version change: 1.3.0 → 1.4.0 (MINOR — Definition of Done section added)
Modified principles: none
Added sections:
  - Definition of Done (new section, consolidates all principles into a per-feature checklist)
Removed sections: none
Templates updated:
  ✅ .specify/memory/constitution.md — updated (this file)
  ✅ .specify/templates/spec-template.md — no changes required
  ✅ .specify/templates/tasks-template.md — no changes required
  ✅ .specify/templates/plan-template.md — no changes required
Reference:
  .specify/memory/explain.md — plain-language explanation of all security decisions
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): 2026-03-06 used as first-known date; confirm original
    project inception date if different and amend with a PATCH bump.
-->

# duckX Constitution

## Core Principles

### I. Brand & Design System Adherence (NON-NEGOTIABLE)

All UI components, pages, and visual elements MUST conform to the mpmX.ai Brand & Design
System defined in `mpmxai_styleguide.md`. That document is the single source of truth for
all duckX digital products.

Non-negotiable rules:

- MUST use semantic colour tokens — never hard-code hex or rgb values in components
- MUST use the Montserrat typeface exclusively, self-hosted via `@fontsource/montserrat`
- MUST follow the defined spacing scale (§5.1) and type scale (§4.2) from the style guide
- MUST use glassmorphism, glow, and animation utility classes from the design system,
  not ad hoc inline styles
- MUST apply the dark-theme palette; light-theme variants are not supported unless
  explicitly specified in a feature spec
- MUST use shadcn/ui as the base component library (`src/components/ui/`); custom
  components MUST be built on top of shadcn/ui primitives, not from scratch

Rationale: Brand consistency across every touchpoint is essential to mpmX.ai's positioning
as an enterprise-grade, trustworthy product. Ad-hoc styles erode the design system and
increase maintenance cost over time.

### II. Privacy by Design

Every feature MUST be GDPR-compliant and privacy-preserving by default.

Non-negotiable rules:

- MUST NOT introduce external font CDNs (e.g., Google Fonts, Typekit, Adobe Fonts)
- MUST NOT load third-party tracking or analytics scripts without explicit prior user consent
- MUST NOT expose user IP addresses to external services without user consent
- MUST self-host all assets that would otherwise be served from external CDNs
- Third-party embeds (e.g., HubSpot forms, analytics) MUST be gated behind cookie consent

Rationale: mpmX.ai serves enterprise customers with strict compliance requirements.
Privacy violations erode trust and carry legal risk in EU markets where German is a
primary locale.

### III. Accessibility (WCAG AA Required)

All user-facing interfaces MUST meet WCAG 2.1 Level AA accessibility standards.

Non-negotiable rules:

- MUST maintain colour contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large text
- MUST provide visible focus indicators (`--ring`, neon green, 2 px offset) on all
  interactive elements
- MUST support full keyboard navigation across all interactive components
- MUST use semantic HTML (`<section>`, `<nav>`, `<main>`) with appropriate ARIA roles
- MUST respect `prefers-reduced-motion` — disable or reduce all non-essential animations
- MUST provide descriptive alt text for all images
- MUST set the `lang` attribute on `<html>` per the active language
- Touch targets MUST be ≥ 44×44 px with ≥ 8 px spacing between adjacent targets

Rationale: Enterprise users include those with disabilities. Accessibility is both a legal
requirement and an expression of the "Approachable" brand value.

### IV. Internationalisation First

All user-visible content MUST support English (`en`) and German (`de`) from the moment
a feature ships.

Non-negotiable rules:

- MUST store all translatable strings in local static dictionaries (`src/i18n/*.ts`)
- MUST NOT use external translation APIs or CDN-hosted translation files
- Language MUST be auto-detected via `navigator.language` prefix match and be overridable
  via the header language switcher
- English MUST serve as the fallback for any missing translation key
- A feature is NOT considered complete until translations exist in both languages

Rationale: mpmX.ai's primary markets include Germany. Shipping English-only content, even
temporarily, is not acceptable for enterprise trust and compliance positioning.

### V. Performance & Mobile-First

All features MUST be developed mobile-first and MUST NOT degrade performance on mobile.

Non-negotiable rules:

- MUST follow mobile-first responsive design (smallest breakpoint defined first)
- MUST disable `backdrop-filter` / glassmorphism effects on viewports ≤ 767 px
- MUST animate only `transform` and `opacity` — never trigger CSS layout reflow
- Animation duration MUST NOT exceed 600 ms for UI transitions
- Background blur radii MUST be capped at 40 px on mobile viewports
- Hero trust badges and non-essential decorative elements MUST be hidden on mobile
- Horizontal scrolling is NEVER acceptable at any breakpoint
- CTA buttons MUST be `w-full` on mobile viewports

Rationale: Enterprise users frequently access on mobile or lower-powered devices.
Performance is a core aspect of the "Future-forward, Trustworthy" brand identity.

### VI. Architecture Patterns (NON-NEGOTIABLE)

All features MUST follow Next.js 15 App Router conventions and modern React 19 patterns.

Non-negotiable rules:

- Server Components are the default — every component is a Server Component unless it
  explicitly requires browser APIs, event listeners, or client-only state
- Client Components MUST be marked `'use client'` and kept as small as possible;
  push them to the leaves of the component tree
- Server Actions are the primary mutation pattern — form submissions and data writes
  MUST use Server Actions, not client-side `fetch()` to API Routes
- API Routes (`app/api/...`) are reserved for webhooks and integrations with external
  services that call into the app; they MUST NOT be used for user-facing form actions
- Data fetching MUST happen in Server Components — never in `useEffect`
- The following patterns are BANNED — they indicate a deprecated mental model:
  - `getServerSideProps` / `getStaticProps` (Pages Router patterns)
  - `React.FC` or `React.FunctionComponent` type annotations
  - `useEffect` for data fetching when a Server Component applies
  - Client-side `fetch()` to internal API Routes for user-facing mutations

Rationale: Next.js 15 App Router and React 19 Server Components reduce client bundle size,
eliminate request waterfalls, and provide end-to-end type safety. Deviating from these
patterns undermines the performance principle (V) and increases complexity for no gain.

### VII. Security

All features MUST apply defence-in-depth: application logic, database, and session layers
each enforce access control independently.

Non-negotiable rules:

- **S-1** OTP codes MUST be configured to expire within 10 minutes (Supabase Auth settings)
- **S-2** Supabase Auth rate limiting MUST never be disabled or bypassed
- **S-3** All auth verification (OTP, session checks) MUST happen in Server Actions or
  middleware — never in Client Components
- **S-4** MUST use `@supabase/ssr` for session management; sessions MUST be stored in
  httpOnly, Secure, SameSite cookies; the deprecated `@supabase/auth-helpers-nextjs`
  MUST NOT be used
- **S-5** All authenticated routes MUST be protected via Next.js middleware using Supabase
  session validation — page-level checks alone are not sufficient
- **S-6** Row Level Security (RLS) MUST be enabled on all Supabase database tables;
  every table MUST have explicit RLS policies defined before production use
- **S-7** `SUPABASE_SERVICE_ROLE_KEY` MUST never be prefixed with `NEXT_PUBLIC_`,
  imported in Client Components, or returned to the browser in any form
- **S-8** Email changes MUST require verification of the new address before taking effect;
  the UI MUST inform the user to check their new inbox to confirm
- **S-9** File uploads MUST validate MIME type (allow-list: `image/jpeg`, `image/png`,
  `image/webp`), enforce a maximum size (2 MB), and scope the storage path to the
  authenticated user's ID

Rationale: The app handles user identity and personal data. Each rule targets a specific,
real attack vector: brute-force (S-1, S-2), client-side trust (S-3), session hijacking
(S-4), route bypass (S-5), data leakage (S-6), credential exposure (S-7), account
takeover (S-8), and malicious uploads (S-9).

### VIII. Testing Philosophy

Tests exist to protect behaviour, not to hit coverage numbers. The rule is: test logic,
not markup.

**Tooling**:

- Unit & component tests: **Vitest** + **React Testing Library**
- E2E tests: **Playwright**

**What MUST be tested**:

- All utility and helper functions (unit tests)
- All Server Actions (unit tests, Supabase client mocked)
- All components with conditional rendering, form logic, or error/loading states
  (component tests)
- All components that invoke Server Actions (component tests — verify submit behaviour
  and error feedback)
- Critical user journeys (E2E tests):
  - Register → receive OTP → enter code → land on profile
  - Wrong or expired OTP → error shown → retry succeeds
  - Update email → "check your new inbox" message shown
  - Upload avatar → avatar reflected on profile
  - Logout → redirected to login, protected route blocked

**What MUST NOT be tested**:

- Purely presentational components with no conditional logic (e.g. `<Badge>`, `<Spinner>`,
  static layout wrappers)
- shadcn/ui primitives — they are tested upstream

**Supabase in tests**:

- Unit and component tests MUST mock the Supabase client — no real network calls
- E2E tests MUST run against a dedicated Supabase test project — never against production

**CI gate**:

- All Vitest unit and component tests MUST pass on every PR
- All Playwright E2E tests MUST pass on every PR
- A PR MUST NOT be merged if any test is failing or skipped without documented justification

Rationale: Testing at the right layer catches real bugs without creating brittle tests
that slow development. Mocking Supabase in unit tests keeps them fast; using a real test
project in E2E ensures RLS policies and database behaviour are validated end-to-end.

## Tech Stack

These versions are locked for the project. All features MUST use these technologies.
Introducing alternatives requires a MAJOR constitution amendment.

### Frontend

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 15 — App Router only |
| UI runtime | React | 19 |
| Language | TypeScript | latest stable — strict mode |
| Styling | Tailwind CSS | latest stable |
| Component library | shadcn/ui | latest stable |
| Icons | Lucide React | latest stable |

### Backend

| Layer | Technology | Notes |
|---|---|---|
| Platform | Supabase | Auth + Database + Storage bundled |
| Auth | Supabase Auth | OTP email flow |
| Database | Supabase PostgreSQL | Managed, accessed via Supabase JS client |
| File storage | Supabase Storage | Private buckets; signed URLs only |

### Testing

| Layer | Technology | Scope |
|---|---|---|
| Unit & component | Vitest + React Testing Library | Functions, Server Actions, logic-bearing components |
| E2E | Playwright | Critical user journeys; runs against test Supabase project |

### Deployment

| Layer | Technology | Notes |
|---|---|---|
| Hosting | Vercel | Zero-config for Next.js; Server Actions supported natively |

## Design & Brand Standards

The mpmX.ai Brand & Design System (`mpmxai_styleguide.md`) governs all visual decisions.
Key constraints on feature development:

- Neon colours (`--neon-green`, `--neon-blue`, `--neon-teal`) are accent-only — NEVER use
  as large background fills or as adjacent neon-on-neon text pairings
- Maximum body copy line length: 72 characters
- All icons MUST be sourced from Lucide React at line/outline style; icon colour MUST
  inherit `currentColor` — never hard-coded
- All imagery MUST use dark-themed UI screenshots; apply `rounded-lg` and optional
  `glow-green` shadow
- Image formats: SVG for logos/icons, PNG for screenshots with transparency,
  WebP for photos (AVIF as next-gen fallback)
- Container max width: 1400 px with 32 px padding

Any deviation from the design system MUST be documented with rationale before implementation.

## Development Workflow

1. **Spec First**: Every feature MUST have an approved spec (`spec.md`) before
   implementation begins.
2. **Plan Before Code**: An implementation plan (`plan.md`) MUST be completed and reviewed
   before any code is written.
3. **Constitution Check**: The "Constitution Check" gate in `plan.md` MUST pass before
   Phase 0 research begins; re-checked after Phase 1 design. Principles to verify:
   - I. Brand & Design System Adherence — new components follow the design system
   - II. Privacy by Design — no new external dependencies without consent gating
   - III. Accessibility — acceptance criteria include WCAG AA requirements
   - IV. Internationalisation First — translation keys planned for both `en` and `de`
   - V. Performance & Mobile-First — mobile behaviour defined in spec/plan
   - VI. Architecture Patterns — no banned patterns, Server Actions used for mutations,
     Server Components used for data fetching
   - VII. Security — RLS enabled, auth verification server-side, no service role key
     exposed, S-1 through S-9 satisfied
   - VIII. Testing Philosophy — all functions and Server Actions have unit tests, logic-
     bearing components have component tests, critical journeys have E2E tests, all
     passing on this PR
4. **i18n Concurrent**: Translation keys MUST be added alongside component development,
   not deferred as a post-development task.
5. **Accessibility Review**: Accessibility requirements MUST be part of the definition of
   done for each user story — not deferred to a polish phase.
6. **Brand Review**: Any new component or visual pattern MUST be validated against the
   design system before merging.

## Definition of Done

A feature is NOT done until every item in this checklist is satisfied. This applies to
every user story, every PR, every merge.

### Functional

- [ ] All acceptance criteria from the feature spec are met
- [ ] No known bugs against the specified behaviour
- [ ] No regressions in existing features

### Testing

- [ ] All new utility functions and Server Actions have unit tests (Vitest)
- [ ] All logic-bearing components have component tests (Vitest + RTL)
- [ ] New critical user journeys have E2E tests (Playwright)
- [ ] All tests passing — no skipped tests without documented justification

### Accessibility

- [ ] WCAG AA contrast verified on all new UI
- [ ] All interactive elements reachable and operable by keyboard
- [ ] `prefers-reduced-motion` respected for any new animations
- [ ] Semantic HTML used — no `<div>` substituting a button or link

### Internationalisation

- [ ] Every user-visible string has both `en` and `de` translations
- [ ] No hardcoded user-facing text in components

### Design

- [ ] All components use semantic design tokens — no hardcoded colours or fonts
- [ ] New patterns validated against `mpmxai_styleguide.md`

### Security

- [ ] No new secrets exposed client-side
- [ ] Any new Supabase tables have RLS enabled with explicit policies
- [ ] Applicable security rules S-1 through S-9 satisfied

### Performance & Mobile

- [ ] Feature tested on mobile viewports (≤ 767 px)
- [ ] No horizontal scroll introduced at any breakpoint
- [ ] Glass effects disabled on mobile if used

### Privacy

- [ ] No new external CDN or third-party script dependencies introduced
- [ ] Any new third-party integrations gated behind cookie consent

### Code Quality

- [ ] TypeScript strict mode satisfied — no `any`, no `@ts-ignore` without justification
- [ ] No `console.log` or `console.error` left in production code
- [ ] PR reviewed and approved before merge

## Governance

This Constitution supersedes all other development practices and styling decisions for
duckX. It is the authoritative reference for all feature specifications, implementation
plans, and task lists.

**Amendment Procedure**:

1. Propose the amendment with rationale and impact on existing features.
2. Identify all spec, plan, and task artifacts that require updates.
3. Update the constitution version per semantic versioning:
   - MAJOR: Principle removal or backward-incompatible redefinition
   - MINOR: New principle or section added / materially expanded guidance
   - PATCH: Clarifications, wording fixes, non-semantic refinements
4. Update `LAST_AMENDED_DATE` to the date of the amendment.
5. Propagate changes to all affected templates and runtime guidance files.

**Compliance**: All PRs and feature reviews MUST verify compliance with this constitution.
Complexity beyond what the current task requires MUST be justified in the Complexity
Tracking section of the relevant `plan.md`.

**Version**: 1.4.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
