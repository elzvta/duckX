# Quickstart: Project Foundation Setup

**Branch**: `001-project-setup`
**Time to complete**: ~60–90 minutes (excluding Vercel deployment wait time)

---

## Prerequisites

- Node.js 22+ installed (`node --version`); if not, use nvm:
  ```bash
  nvm install 22
  nvm use 22
  ```
- Yarn installed (`yarn --version`; install via `npm install -g yarn` if missing)
- Supabase account (authenticated via GitHub at supabase.com)
- Vercel account (authenticated via GitHub at vercel.com)
- Repository cloned and checked out on branch `001-project-setup`

---

## Step 1 — Initialize the Next.js App

```bash
yarn create next-app@latest . \
  --typescript \
  --eslint \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

> `--no-src-dir` keeps `app/` at the repository root. We create `src/` manually for
> application code (components, lib, i18n). This matches the project's path conventions
> (`app/globals.css`, `src/components/ui/`).

Verify it works:
```bash
yarn dev
# Open http://localhost:3000 — default Next.js page should load
```

Create the `src/` directory structure:
```bash
mkdir -p src/components/ui src/lib/supabase src/i18n
```

---

## Step 2 — Install Core Dependencies

```bash
# Fonts and icons
yarn add @fontsource/montserrat lucide-react

# Supabase
yarn add @supabase/supabase-js @supabase/ssr

# Dev: testing
yarn add -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Dev: E2E
yarn add -D @playwright/test dotenv
npx playwright install chromium
```

---

## Step 3 — Design System (`app/globals.css`)

Replace `app/globals.css` entirely with the mpmX.ai design tokens. The file structure is:

```css
@import "tailwindcss";

/* ─── Token → Tailwind utility mapping ─────────────────────────────────────── */
@theme {
  /* Fonts */
  --font-sans: "Montserrat", sans-serif;

  /* Colours — these generate bg-*, text-*, border-* utilities */
  --color-background:   hsl(var(--background));
  --color-foreground:   hsl(var(--foreground));
  --color-primary:      hsl(var(--primary));
  --color-primary-fg:   hsl(var(--primary-foreground));
  --color-secondary:    hsl(var(--secondary));
  --color-secondary-fg: hsl(var(--secondary-foreground));
  --color-muted:        hsl(var(--muted));
  --color-muted-fg:     hsl(var(--muted-foreground));
  --color-accent:       hsl(var(--accent));
  --color-accent-fg:    hsl(var(--accent-foreground));
  --color-destructive:  hsl(var(--destructive));
  --color-border:       hsl(var(--border));
  --color-input:        hsl(var(--input));
  --color-ring:         hsl(var(--ring));
  --color-card:         hsl(var(--card));
  --color-card-fg:      hsl(var(--card-foreground));
  --color-popover:      hsl(var(--popover));
  --color-popover-fg:   hsl(var(--popover-foreground));

  /* Neon accents */
  --color-neon-green:   hsl(var(--neon-green));
  --color-neon-blue:    hsl(var(--neon-blue));
  --color-neon-teal:    hsl(var(--neon-teal));

  /* Radius */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}

/* ─── Raw HSL values (dark theme — only supported theme) ────────────────────── */
/* Source: mpmxai_styleguide.md §3 Colour Palette */
:root {
  --background:           220 13% 9%;
  --foreground:           210 20% 95%;
  --primary:              142 76% 55%;   /* neon green */
  --primary-foreground:   220 13% 9%;
  --secondary:            220 13% 14%;
  --secondary-foreground: 210 20% 85%;
  --muted:                220 13% 14%;
  --muted-foreground:     210 10% 55%;
  --accent:               220 13% 18%;
  --accent-foreground:    210 20% 95%;
  --destructive:          0 72% 51%;
  --border:               220 13% 18%;
  --input:                220 13% 14%;
  --ring:                 142 76% 55%;
  --card:                 220 13% 11%;
  --card-foreground:      210 20% 95%;
  --popover:              220 13% 11%;
  --popover-foreground:   210 20% 95%;
  --neon-green:           142 76% 55%;
  --neon-blue:            199 89% 48%;
  --neon-teal:            174 72% 45%;
  --radius:               0.5rem;
}

/* ─── Utility classes ───────────────────────────────────────────────────────── */

.glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@media (max-width: 767px) {
  .glass {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

.glow-green  { box-shadow: 0 0 20px hsl(var(--neon-green) / 0.35); }
.glow-blue   { box-shadow: 0 0 20px hsl(var(--neon-blue)  / 0.35); }
.glow-teal   { box-shadow: 0 0 20px hsl(var(--neon-teal)  / 0.35); }

.text-gradient {
  background: linear-gradient(135deg, hsl(var(--neon-green)), hsl(var(--neon-blue)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-bg {
  background: linear-gradient(135deg, hsl(var(--background)), hsl(var(--secondary)));
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px hsl(var(--neon-green) / 0.35); }
  50%       { box-shadow: 0 0 35px hsl(var(--neon-green) / 0.55); }
}

.animate-fade-in    { animation: fade-in 0.4s ease-out both; }
.animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **Note**: HSL values above are placeholders based on the style guide's dark palette.
> Adjust to match the exact values in `mpmxai_styleguide.md` §3 if they differ.

---

## Step 4 — Root Layout (`app/layout.tsx`)

```tsx
import type { Metadata } from 'next'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'duckX',
  description: 'duckX — powered by mpmX.ai',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

---

## Step 5 — Smoke-Test Page (`app/page.tsx`)

Replace the default page with a design token verification page:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-gradient">duckX</h1>
      <p className="text-foreground text-lg">Design system smoke test</p>
      <div className="glass rounded-lg p-6 w-full max-w-sm glow-green">
        <p className="text-muted-foreground text-sm">Glass card with neon glow</p>
      </div>
    </main>
  )
}
```

Open http://localhost:3000 — you should see a dark background, Montserrat font, gradient
heading, and a glassmorphism card with green glow.

---

## Step 6 — shadcn/ui

Run the interactive init:
```bash
npx shadcn@latest init
```

When prompted:
- **Style**: Default
- **Base color**: Slate (or Neutral — will be overridden by your CSS vars)
- **CSS variables**: Yes
- **Components directory**: `src/components`

Add the base components:
```bash
npx shadcn@latest add button input label card avatar separator
```

Verify the smoke-test page still renders correctly (shadcn init modifies `globals.css`
— merge its additions rather than overwriting the mpmX.ai tokens).

---

## Step 7 — Supabase Connection

### 7a. Create Supabase Projects

In the Supabase dashboard, create two projects:
- **duckx-prod** — production
- **duckx-test** — for Playwright E2E tests

Copy the Project URL and anon key from each project's API settings.

### 7b. Environment Files

Create `.env.local` (gitignored — never commit this):
```
NEXT_PUBLIC_SUPABASE_URL=https://<prod-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
```

Create `.env.test` (gitignored — never commit this):
```
NEXT_PUBLIC_SUPABASE_URL=https://<test-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<test-anon-key>
```

Add both to `.gitignore`:
```
.env.local
.env.test
```

### 7c. Browser Client (`src/lib/supabase/client.ts`)

```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 7d. Server Client (`src/lib/supabase/server.ts`)

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can't be set (safe to ignore)
          }
        },
      },
    }
  )
}
```

### 7e. Middleware (`middleware.ts`)

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  // Refreshes the session — add route protection logic after this feature
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

Verify `yarn dev` boots without errors and no middleware errors appear in the console.

---

## Step 8 — Vitest

Create `vitest.config.ts`:
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
    alias: { '@': path.resolve(__dirname, './') },
  },
})
```

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom'
```

Add scripts to `package.json`:
```json
"test": "vitest",
"test:run": "vitest run"
```

Verify:
```bash
yarn test
# Should output: 0 tests passed, no errors
```

---

## Step 9 — Playwright

Create `playwright.config.ts`:
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

Create `e2e/` directory:
```bash
mkdir e2e && touch e2e/.gitkeep
```

Add script to `package.json`:
```json
"test:e2e": "playwright test"
```

Verify:
```bash
yarn test:e2e
# Should launch Playwright and exit cleanly (0 tests, no errors)
```

---

## Step 10 — Vercel Deployment

1. Push the branch to GitHub.
2. Go to vercel.com → New Project → Import from GitHub → select this repository.
3. In Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` (prod project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prod project anon key)
   - `SUPABASE_SERVICE_ROLE_KEY` (prod service role key — mark as sensitive)
4. Deploy. Verify the deployment passes and the app loads at the Vercel preview URL.

---

## Verification Checklist

- [ ] `yarn dev` starts without errors, app loads at http://localhost:3000
- [ ] Dark background, Montserrat font, gradient heading visible on smoke-test page
- [ ] Glass card with neon glow renders correctly
- [ ] shadcn Button and Card render with dark theme (no white backgrounds)
- [ ] `yarn build` completes without TypeScript errors
- [ ] `yarn test` exits 0 (no config errors)
- [ ] `yarn test:e2e` launches Playwright without errors
- [ ] Vercel deployment passes
- [ ] `.env.local` and `.env.test` not committed to git
