# Security Decisions — Plain Language Reference

This file explains the "why" behind each security rule in the constitution (Principle VII).
Written for a senior frontend developer who is new to backend security.

---

## S-1: OTP expiry ≤ 10 minutes

**The problem**: A 6-digit code sent by email is only useful if an attacker cannot guess it
before the real user types it in. If the code is valid for 1 hour (Supabase's default),
that's a long window for interception or guessing.

**The fix**: Set OTP expiry to 10 minutes in Supabase → Auth → Settings. No code needed —
it's a dashboard setting. Industry standard is 5–10 minutes (banks, Google, Microsoft).

---

## S-2: Never disable rate limiting

**The problem**: 6 digits = 1,000,000 combinations. An attacker could write a script that
tries all of them in seconds if there's no limit.

**The fix**: Supabase Auth automatically blocks repeated failed attempts. You don't build
this — you just never turn it off. The rule exists so no one "optimises it away" in dev.

---

## S-3: Auth verification happens server-side only

**The problem**: If you verify an OTP in the browser (Client Component), an attacker can
modify the JavaScript to skip the check and tell the app "yes, this is valid."

**The fix**: Call `supabase.auth.verifyOtp()` inside a Server Action. The browser submits
the form; the server decides if it's valid. The client has no say in the outcome.

---

## S-4: Use `@supabase/ssr`, sessions in httpOnly cookies

**The problem**: The old package (`@supabase/auth-helpers-nextjs`) stored tokens in
`localStorage`. JavaScript can read `localStorage`, so an XSS attack (injected script)
could steal the token and impersonate the user permanently.

**The fix**: `@supabase/ssr` stores tokens in **httpOnly cookies**. The browser sends them
automatically but JavaScript cannot read them. Even if an attacker injects a script, they
cannot steal the session token.

**Practical note**: Install `@supabase/ssr`, not `@supabase/auth-helpers-nextjs`. They look
similar but behave very differently.

---

## S-5: Protect routes in middleware, not just in pages

**The problem**: If you only check "is the user logged in?" inside the page component,
the page still renders briefly before the check runs, or a fast user could navigate away
before the redirect fires. Also, you'd have to duplicate the check on every protected page.

**The fix**: `proxy.ts` runs on every request *before* any page loads. One file
protects all authenticated routes. Unauthenticated users are redirected to login
immediately, before anything renders.

**Location**: `/proxy.ts` at the project root.

---

## S-6: Row Level Security on all tables

**The problem**: Your Server Actions query the database. If a Server Action has a bug —
say, it accidentally fetches a user profile without filtering by the current user's ID —
it could return another user's data. Application code bugs happen.

**The fix**: Supabase's PostgreSQL has Row Level Security (RLS). You write a policy like:
"a user can only SELECT rows where `user_id = auth.uid()`." The database enforces this
regardless of what your application code does. It's a second safety net below your app.

**Practical note**: RLS is off by default on new tables. You must enable it explicitly and
write policies. A table with RLS enabled but no policies rejects all queries by default —
which is safe but will break your app until you add policies.

---

## S-7: Never expose the service role key

**The problem**: Supabase gives you two keys:
- **Anon key** — safe to put in the browser. Supabase's RLS policies limit what it can do.
- **Service role key** — bypasses RLS entirely. It can read and write anything in your
  database. If this leaks to the browser, your entire database is exposed to anyone.

**The fix**: Never prefix it with `NEXT_PUBLIC_`. Never import it in a Client Component.
Use it only in Server Actions or API Routes that run exclusively on the server.

**How to check**: Search your codebase for `SUPABASE_SERVICE_ROLE_KEY`. It should only
appear in server-only files, never in anything with `'use client'`.

---

## S-8: Email change requires new-address verification

**The problem**: If changing your email took effect immediately, an attacker who briefly
accesses your account could change the email to their own and lock you out permanently.

**The fix**: Supabase sends a confirmation link to the *new* email address. The change only
takes effect after the user clicks it. The old address also receives a security notification.
This is automatic when you call `supabase.auth.updateUser({ email: newEmail })` — you don't
build it, but your UI needs to tell the user "check your new inbox to confirm."

---

## S-9: File upload validation

**The problem**: Without validation, a user could upload:
- A malicious executable disguised as an image
- A 500 MB file that exhausts your storage quota
- A file to a path like `avatars/../other-user-id/avatar` that overwrites another user's
  avatar (path traversal)

**The fix**:
1. **MIME type check**: Only accept `image/jpeg`, `image/png`, `image/webp`. Check the
   actual MIME type, not just the file extension (extensions are trivially faked).
2. **Size limit**: Reject files over 2 MB before uploading.
3. **Scoped path**: Always upload to `avatars/{current_user_id}/avatar`. The user ID comes
   from the server session — never from user input.

---

## Quick reference table

| Rule | What it protects against | Where it's enforced |
|---|---|---|
| S-1: OTP expiry 10 min | Code interception / slow guessing | Supabase dashboard |
| S-2: Rate limiting on | Brute-force code guessing | Supabase (automatic) |
| S-3: Server-side verification | Client-side bypass | Server Action |
| S-4: httpOnly cookies | XSS token theft | `@supabase/ssr` |
| S-5: Middleware route protection | Unauthenticated access | `proxy.ts` |
| S-6: RLS on all tables | Application code bugs leaking data | Supabase database |
| S-7: Service role key server-only | Full database exposure | Env var discipline |
| S-8: Email change verification | Account takeover via email change | Supabase (automatic) |
| S-9: Upload validation | Malicious files, oversized uploads, path traversal | Server Action |
