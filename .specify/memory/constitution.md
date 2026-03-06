<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial ratification — no prior version existed)
Modified principles: none (first version)
Added sections:
  - Core Principles (5 principles)
  - Design & Brand Standards
  - Development Workflow
  - Governance
Removed sections: none
Templates updated:
  ✅ .specify/memory/constitution.md — written (this file)
  ⚠ .specify/templates/plan-template.md — Constitution Check section uses generic
     placeholder; update after first plan to reference specific principle gates
  ✅ .specify/templates/spec-template.md — no changes required (no new mandatory sections)
  ✅ .specify/templates/tasks-template.md — no changes required
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
4. **i18n Concurrent**: Translation keys MUST be added alongside component development,
   not deferred as a post-development task.
5. **Accessibility Review**: Accessibility requirements MUST be part of the definition of
   done for each user story — not deferred to a polish phase.
6. **Brand Review**: Any new component or visual pattern MUST be validated against the
   design system before merging.

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

**Version**: 1.0.0 | **Ratified**: 2026-03-06 | **Last Amended**: 2026-03-06
