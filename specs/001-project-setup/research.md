# Research: 001-project-setup

**Date**: 2026-03-06
**Branch**: `001-project-setup`
**Source**: Training knowledge (cutoff August 2025); live web access unavailable in this session.
Verify against official docs before implementation where noted.

---

## Decision Log

### Decision 1 — Tailwind CSS Version: v4 (CSS-first)

**Decision**: Use Tailwind CSS v4 (the default shipped by `create-next-app` Next.js 15).

**Rationale**: `create-next-app` with Next.js 15 installs Tailwind v4 automatically when
Tailwind is selected during project init. There is no flag to select v3. Using v4 keeps the
project on the default, supported toolchain.

**Alternatives considered**:
- Tailwind v3 — rejected because it requires a manual downgrade after init, diverges from
  the Next.js 15 default, and introduces ongoing maintenance friction.

**Impact**: The constitution CSS Architecture section previously referenced `tailwind.config.ts`
as the token mapping layer. This is a v3 pattern. A PATCH amendment (v1.5.0 → v1.5.1) was
applied to the constitution and spec TR-004 was updated accordingly.

---

### Decision 2 — CSS Token Architecture (`@theme {}` in `src/app/globals.css`)

**Decision**: All token definitions and Tailwind utility mappings live in `src/app/globals.css`.

```css
@import "tailwindcss";

/* Maps CSS vars → Tailwind utilities (bg-background, text-foreground, etc.) */
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  /* ... all mpmX.ai tokens */
}

/* Raw HSL values from mpmxai_styleguide.md */
:root {
  --background: 220 13% 9%;
  --foreground: 210 20% 95%;
  /* ... */
}

/* Utility classes: .glass, .glow-green, .text-gradient, etc. */
```

**Rationale**: Tailwind v4 is CSS-first — the `@theme {}` block inside CSS replaces the
`theme.extend` object in `tailwind.config.ts`. Keeping all token concerns in one file is
cleaner and aligns with the constitution's single-file CSS architecture rule.

**Note**: `@import "tailwindcss"` replaces the v3 directives
(`@tailwind base`, `@tailwind components`, `@tailwind utilities`).

---

### Decision 3 — shadcn/ui Initialization

**Decision**: `npx shadcn@latest init` (interactive) or `npx shadcn@latest init -d` (defaults).

**Rationale**: shadcn/ui latest auto-detects Tailwind v4 and writes the correct `@theme {}`
format. Components directory should be configured to `src/components` (not the default `components`
at root) to match the project structure.

**Init options to select**:
- Style: Default (or New York — user preference)
- CSS variables: Yes
- Components path: `src/components`

**Individual component installs** (after init):
```bash
npx shadcn@latest add button input label card avatar separator
```

**Verify against**: https://ui.shadcn.com/docs/installation/next

---

### Decision 4 — Supabase Middleware Pattern

**Decision**: `@supabase/ssr` v0.5+ pattern with `getAll()`/`setAll()` cookie API and
`supabase.auth.getUser()`.

**Key rules** (critical for security):
1. Use `getUser()` in middleware — NOT `getSession()`. `getSession()` reads from cookies
   without server validation; `getUser()` validates the JWT against Supabase servers.
2. Return the original `supabaseResponse` object — never a freshly created
   `NextResponse.next()`. If a new response is returned, cookies set during the call are
   dropped and the session is broken.
3. Do not add logic between `createServerClient()` and `supabase.auth.getUser()`.

**For this feature**: Middleware only refreshes the session (placeholder). Route protection
is added in the auth feature (002-user-auth).

**Pattern**:
```ts
// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshes the session — do not add logic before this call
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

**Verify against**: https://supabase.com/docs/guides/auth/server-side/nextjs

---

### Decision 5 — Supabase Client Architecture

**Decision**: Two client helpers in `src/lib/supabase/`:
- `client.ts` — `createBrowserClient` for use in Client Components only
- `server.ts` — `createServerClient` for use in Server Components and Server Actions

**Rationale**: Separates browser and server contexts cleanly. Server Components create a
fresh server client per request (reads cookies from the current request); Client Components
use a singleton browser client.

**Note**: `SUPABASE_SERVICE_ROLE_KEY` is ONLY used in server-side code that bypasses RLS
(admin operations). It must never appear in `client.ts` or any `'use client'` file.

---

### Decision 6 — Vitest Configuration

**Decision**: Vitest with `@vitejs/plugin-react`, jsdom environment, globals enabled.

**Packages** (dev dependencies):
```
vitest @vitejs/plugin-react jsdom
@testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**`vitest.config.ts`**:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

**`vitest.setup.ts`**:
```ts
import '@testing-library/jest-dom'
```

**Note**: Server Components cannot be unit-tested with jsdom. E2E tests (Playwright) cover
Server Component behaviour end-to-end.

---

### Decision 7 — Playwright Configuration

**Decision**: `@playwright/test` + `dotenv` for loading `.env.test` (test Supabase project).

**Packages** (dev dependencies):
```
@playwright/test dotenv
```

**`.env.test`** (gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=https://<test-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<test-anon-key>
```

**`playwright.config.ts`**:
```ts
import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env.test') })

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Note**: `.env.test` MUST be listed in `.gitignore`. In CI, inject test Supabase credentials
as environment secrets — do not commit `.env.test`.

---

### Decision 8 — Font Loading

**Decision**: `@fontsource/montserrat` installed as an npm package, imported in `app/layout.tsx`.

**Rationale**: Constitution Principle II prohibits external font CDNs (Google Fonts, etc.).
`@fontsource` self-hosts the font files as npm packages, which is privacy-compliant and
eliminates the external DNS lookup.

**Usage**:
```ts
// src/app/layout.tsx
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
```

---

### Decision 9 — Project Directory Structure

**Decision**: `src/app/` layout (`--src-dir` flag); all application code under `src/`.

```
src/
  app/          ← Next.js routing, layouts, pages, globals.css
  components/
    ui/         ← shadcn/ui primitives
  lib/
    supabase/   ← client helpers
  i18n/         ← reserved for translation dictionaries
proxy.ts   ← at repo root
```

**Rationale**: Using `--src-dir` places `app/` inside `src/app/`, which is the most widely
adopted Next.js project layout. All application code (components, lib, i18n) lives under
`src/` alongside `src/app/`, keeping the repo root clean. The `@/*` alias resolves to
`./src/*`. shadcn/ui is configured to put components in `src/components` during init.

---

## Pre-Implementation Checklist

- [x] Constitution PATCH applied (v1.5.0 → v1.5.1): `tailwind.config.ts` references removed
- [x] Spec TR-004 updated to reference `@theme {}` pattern
- [ ] Create two Supabase projects: `duckx-prod` and `duckx-test` (manual step — Supabase dashboard)
- [ ] Add `.env.test` to `.gitignore` before creating the file
