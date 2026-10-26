# Lumina Travel — Build Progress

Tracks what's done against the phased plan in `lumina-travel-build-plan.md`. Every future step's changes land in this project folder and this file gets updated.

## Phase 0 — Scaffold ✅ done

- [x] `create-next-app` — Next.js 14, TypeScript, Tailwind, App Router, ESLint
- [x] Core packages installed: `prisma`, `@prisma/client`, `@clerk/nextjs` (v6, Next 14-compatible), `zod`, `@imagekit/next`, `@imagekit/nodejs`, `svix`
- [x] `prisma/schema.prisma` written (User, IdentityVerification, Package, AvailabilityDate, RoomOption, Booking, Favorite — matches Section 4 of the plan)
- [x] Tailwind theme tokens added in `tailwind.config.ts` (navy / rust / page / card / muted, `font-serif` / `font-sans`, `rounded-card` / `rounded-pill`)
- [x] Fonts wired in `app/layout.tsx` — Playfair Display (`--font-display`, headings) + Inter (`--font-body`, UI/body)
- [x] `app/globals.css` base colors set to the design system (page bg `#EEF2F7`, navy text)
- [x] `lib/prisma.ts` — Prisma client singleton (hot-reload safe)
- [x] `lib/imagekit.ts` — server-only ImageKit instance (private key, never imported client-side)
- [x] `.env.example` — all vars from Section 8
- [x] `docker-compose.yml` — local Postgres 16 for dev

### Notes / things to do on your own machine (sandbox network is restricted)

- **`npx prisma generate`** — run this once you `npm install` locally. Prisma's engine binaries download from `binaries.prisma.sh`, which this build sandbox can't reach, so the client wasn't generated here.
- **Local DB:** `docker compose up -d`, then set
  `DATABASE_URL="postgresql://lumina:lumina@localhost:5432/lumina_travel"` in `.env`, then `npx prisma db push`.
  (Or skip Docker and point `DATABASE_URL` at a free Neon/Supabase Postgres instance.)
- **`npm run dev`** hasn't been run/verified in this sandbox either, for the same network-access reason (Google Fonts, Prisma engines). It's standard Next.js 14 + Tailwind underneath, so it should run cleanly once you have full network access — flag it back to me if not.

## Phase 1 — Static UI shell (mock data) ✅ done

- [x] `components/nav/Navbar.tsx` — logo, active-tab underline, rust "Concierge" pill, avatar dropdown (static — real session lands in Phase 2)
- [x] `components/nav/Footer.tsx` — navy footer, brand blurb + link columns + copyright bar
- [x] `components/nav/BottomNav.tsx` — mobile-only fixed nav (Home / Explore / Bookings / Profile), hidden on `md:` and up
- [x] `lib/mock-data.ts` — the four seed packages from Section 10 (Maldives, Alpine, Kyoto, Serengeti), each with itinerary days, room options, and generated availability for the current month
- [x] `lib/pricing.ts` — the Section 5 price formula (`basePrice*adults + childRate*children + roomUpgrade + taxes`), used client-side now, reused as the server-side source of truth from Phase 4
- [x] `components/destinations/DestinationCard.tsx` — image, category pill, favorite heart toggle, price, "View Itinerary"
- [x] `components/destinations/FilterSidebar.tsx` — category checkboxes + price slider, filtering the mock array client-side
- [x] `app/destinations/page.tsx` — Curated Journeys grid wired to the filter sidebar
- [x] `app/destinations/[slug]/page.tsx` — package detail: hero, description, day-by-day itinerary, room preview, sticky "Reserve Your Journey" CTA
- [x] `components/booking/Calendar.tsx` — month grid, rust dot = fast filling, filled navy cell = selected, past/full days disabled
- [x] `components/booking/TravelerCounter.tsx` — adult/children steppers
- [x] `components/booking/RoomOptionCard.tsx` — radio room selector with per-option upgrade price
- [x] `components/booking/PriceSummaryCard.tsx` — sticky navy card, live breakdown, rust "Proceed to Booking" CTA
- [x] `app/destinations/[slug]/book/page.tsx` — Reserve Your Journey layout, all four booking components wired together with live client-state pricing, mock confirmation screen on submit
- [x] `components/verification/UploadBox.tsx` — drag-and-drop + camera/gallery buttons, local file preview only (no network call)
- [x] `app/profile/verification/page.tsx` — document type, document number, UploadBox, status pill, mock submit
- [x] `app/page.tsx` — home hero + featured destinations grid (replaces the `create-next-app` default)
- [x] Placeholder screens so nav links resolve instead of 404ing: `app/bookings/page.tsx` (empty state), `app/profile/page.tsx`, `app/concierge/page.tsx` (static form, submit disabled), `app/about/page.tsx`
- [x] `app/layout.tsx` updated to wrap every page in `<Navbar />` / `<Footer />` / `<BottomNav />`

### Notes / things to verify on your own machine

- Not run/built in this sandbox (same network restriction as Phase 0 — no `npm install`). Everything here is plain Next 14 App Router + Tailwind with no new dependencies beyond what Phase 0 already installed, so `npm install && npm run dev` should just work — flag it back to me if not.
- Destination images are hotlinked from `images.unsplash.com` using plain `<img>` tags (not `next/image`), so there's nothing to add to `next.config.mjs` for Phase 1. Swap to `next/image` + real ImageKit URLs when Phase 3 wires the DB, since that's when `next.config.mjs` needs `images.remotePatterns` anyway.
- All booking/filter/verification state is local `useState` — nothing persists across a refresh yet. That's expected; Phase 2–6 replace it with real auth, DB queries, and server actions per the plan.
- Calendar availability is generated relative to the current month on each render (see `lib/mock-data.ts`), so it won't go stale, but it also means the "fast filling" days shift slightly on `npm run dev` restarts since a few booked counts are randomized — fine for a mock shell, will be replaced by real `AvailabilityDate` rows in Phase 3/4.

## Phase 2 — Auth ✅ done

- [x] `app/layout.tsx` — wrapped in `<ClerkProvider>`, with `appearance.variables` set to the navy/rust/page tokens so hosted Clerk UI matches the rest of the site
- [x] `middleware.ts` — `clerkMiddleware()` + `createRouteMatcher()` protecting `/bookings`, `/profile`, and `/destinations/[slug]/book`; everything else (home, destinations grid/detail, concierge, about, sign-in/up) stays public
- [x] `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx` — hosted `<SignIn />` / `<SignUp />`, `formButtonPrimary` restyled to rust
- [x] `app/api/webhooks/clerk/route.ts` — verifies the `svix` signature (never trusts an unverified body, per Section 9), then upserts into `User` on `user.created` / `user.updated` and deletes on `user.deleted`
- [x] `components/nav/Navbar.tsx` — mock avatar dropdown replaced with real `<SignedIn>` / `<SignedOut>` state: `<UserButton />` (with custom "Identity verification" / "My bookings" links) when signed in, a "Sign in" pill when signed out
- [x] `app/profile/page.tsx` — now a server component reading `currentUser()` for real name/email/avatar instead of the hardcoded "Guest" placeholder

### Notes / things to do on your own machine

- **Not run/built in this sandbox** — same network restriction as Phases 0–1, plus this phase specifically needs real Clerk keys to do anything. Drop your keys into `.env` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) and `npm run dev` should give you working sign-in/sign-up immediately — Clerk's hosted components don't need any other config to render.
- **Webhook setup (do this before testing sign-up end to end):** in the Clerk Dashboard, add an endpoint pointing at `https://<your-domain-or-ngrok-tunnel>/api/webhooks/clerk`, subscribe to `user.created`, `user.updated`, `user.deleted`, then copy the signing secret into `CLERK_WEBHOOK_SECRET`. Locally this means either the Clerk CLI's tunnel or `ngrok http 3000` — webhooks can't reach `localhost` directly.
- **This is why `/profile` will 500 without the webhook wired up**: `middleware.ts` only checks that a Clerk session exists, it doesn't guarantee a matching `User` row exists yet. Until the webhook has fired at least once for your test account, `prisma.user...` lookups (Phase 3+) will find nothing. Get the webhook working first, then sign up a test user, then move on.
- `/bookings` and `/destinations/[slug]/book` are now gated by `clerkMiddleware()` — signed-out visitors get bounced to `/sign-in` and land back on the original page after signing in (Clerk's default behavior, no extra config needed).
- Clerk's `createRouteMatcher()` is what the build plan calls for and still works fine on `@clerk/nextjs` v6, but Clerk's newer guidance is moving toward checking auth in the route/page itself rather than centralizing it in middleware. Not a Phase 2 blocker — flagging in case you want to harden this differently later.

## Phase 3 — Destinations from DB ✅ done

- [x] `prisma/schema.prisma` — added `location String` and `itinerary Json` to `Package` (the mock shape needed both and the original schema had neither)
- [x] `lib/packages.ts` — new server-only data-access layer (`getAllPackages`, `getFeaturedPackages`, `getPackageBySlug`, `getAllSlugs`), each Prisma row mapped onto the exact same `Package` shape from `types/index.ts` so every existing component (`DestinationCard`, `Calendar`, `PriceSummaryCard`, etc.) kept working with zero prop changes
- [x] `prisma/seed.ts` — seeds the four Phase 1 mock journeys (packages, room options, availability) into Postgres via upsert; wired up in `package.json`'s `"prisma.seed"` field so `npx prisma db seed` picks it up
- [x] `app/page.tsx`, `app/destinations/page.tsx`, `app/destinations/[slug]/page.tsx` — now async server components fetching from `lib/packages.ts` instead of importing the static `packages` array
- [x] `components/destinations/DestinationsExplorer.tsx` — new client component; the category/price filtering `useState` logic that used to live directly in `app/destinations/page.tsx` moved here so the page itself could become a server component
- [x] `app/destinations/[slug]/book/page.tsx` — was a `"use client"` page reading `useParams()` and importing mock data directly into the client bundle; split into an async server component (fetches the package via Prisma) rendering the new `components/booking/BookingClient.tsx`, which holds all the pre-existing traveler/room/date interactive state unchanged
- [x] `next.config.mjs` — added `images.remotePatterns` for `images.unsplash.com`
- [x] Swapped the plain `<img>` tags for `next/image` in `app/page.tsx` (hero), `components/destinations/DestinationCard.tsx`, and `app/destinations/[slug]/page.tsx` (hero) — the swap flagged in the Phase 1 notes as a "do this once Phase 3 wires the DB" item
- [x] `package.json` — added `server-only` (guards `lib/packages.ts` from ever being pulled into a client bundle) and `tsx` (runs `prisma/seed.ts`) as dependencies

### Notes / things to do on your own machine

- **Same network restriction as every prior phase** — this sandbox can't reach `binaries.prisma.sh` or npm, so none of this was run/built here. `lib/mock-data.ts` is now unused by the app itself but is still imported by `prisma/seed.ts`, so leave it in place.
- **Before this will render anything:** `npm install` (pulls in `server-only` and `tsx`), then `npx prisma generate`, then apply the schema (`npx prisma db push` for the local Postgres from `docker-compose.yml`, or `migrate dev` if you'd rather keep migration history), then `npx prisma db seed`. Once seeded, `npm run dev` should show the same four journeys the mock shell had — same data, same visuals, now round-tripping through Postgres.
- **`/profile` and Clerk-gated routes still need the webhook wired up** per the Phase 2 notes — that's unrelated to this phase but still a prerequisite for testing `/destinations/[slug]/book` end to end as a signed-in user.
- `AvailabilityDate` rows are seeded once for "the current month" at seed time (reusing `buildAvailability`'s logic via the mock data), so if you seed today and come back next month the calendar will show a past month with no fresh dates — re-run `npx prisma db seed` to regenerate. Phase 4 should probably replace this with either a wider seed window or a small cron/script, flagging that back to you rather than guessing at the right approach here.
- Home page and destination detail page favorite-heart toggle is still local `useState` (`DestinationCard.tsx`) — it doesn't persist to the `Favorite` table yet. Not a Phase 3 item per the plan, but flagging since it now sits right next to real DB data and looks like it should persist.

## Phase 4 — Booking flow ✅ done

- [x] `lib/actions/booking.ts` — new `createBooking` server action: checks the Clerk session, re-validates the package/date/room server-side (never trusts client input), recomputes price with the same `calculatePrice` formula from `lib/pricing.ts`, and — inside a `prisma.$transaction` that re-reads the availability row first — increments `AvailabilityDate.booked` and creates the `Booking` row atomically, so two people racing for the last spots on the same date can't both succeed
- [x] `components/booking/BookingClient.tsx` — "Proceed to Booking" now calls `createBooking` via `useTransition` instead of a local `setConfirmed(true)`; shows a "Reserving…" pending state, surfaces server-returned errors (sold out, not signed in, etc.) inline, and on success shows the real booking id + total instead of a generic mock message
- [x] `components/booking/PriceSummaryCard.tsx` — added `submitting` and `error` props to render the pending label and inline error text under the CTA
- [x] `app/bookings/page.tsx` — placeholder copy updated to reflect that bookings now persist (the list view itself is Phase 5)
- [x] `fastFilling` on `AvailabilityDate` is now derived server-side too: once a booking pushes `booked / capacity` to 75%+ it flips true (and never flips back off), rather than only being set at seed time

### Notes / things to verify on your own machine

- Same network restriction as every prior phase — not run here. Once you've completed the Phase 3 setup (`generate` / `db push` / `db seed`) this should work immediately, no new env vars needed.
- **Booking will fail with a clear message, not a crash, if the Clerk webhook from Phase 2 hasn't fired for your test account yet** — `createBooking` checks for a matching `User` row before touching `Booking` (which has a real FK to `User.id`). Sign up, wait for the webhook, then try booking.
- On a sold-out/race-condition error, the client calls `router.refresh()` so the calendar's availability re-renders with the real numbers — worth confirming that actually shows the now-disabled date rather than a stale one.
- Money handling is still "trust the server-computed total" with no payment step — Section 5 of the plan doesn't call for real payment processing in this phase, so `Booking.status` just goes straight to `RESERVED`. Flag if that's wrong.
- `useTransition` wrapping an async server-action call is the standard Next 14 App Router pattern for a pending UI state, but it's worth a manual click-through to confirm the pending/error/success states all render as expected — that's exactly the kind of thing that looks right in code and still needs eyes on a real browser.

## Phase 5 — My Bookings ✅ done

- [x] `prisma/schema.prisma` — added the missing `Booking.roomOption` relation (the field existed as a bare `roomOptionId` with no FK relation, so there was no way to join to the room name without a second query)
- [x] `lib/bookings.ts` — new server-only `getBookingsForUser(userId)`, joining `Booking` → `Package` → `RoomOption` into a flat `UserBooking` shape for display
- [x] `app/bookings/page.tsx` — now an async server component: reads the Clerk session, fetches the user's bookings, and renders `BookingsList`
- [x] `components/booking/BookingsList.tsx` — new client component: empty state (same copy/CTA as the Phase 1 placeholder) when there are no bookings, otherwise a row per booking with thumbnail, dates, traveler count, room, total, and a status pill (Reserved / Cancelled / Completed)
- [x] `lib/actions/booking.ts` — added `cancelBooking(bookingId)`: verifies the booking belongs to the calling user, flips `status` to `CANCELLED`, and releases the held capacity back onto the matching `AvailabilityDate` (recomputing `fastFilling` the same way `createBooking` sets it) — all inside one transaction. Cancel only shows for `RESERVED` bookings with a future date.

### Notes / things to verify on your own machine

- Same network restriction as every phase so far — not run here.
- This phase added a schema change (the `Booking.roomOption` relation), so if you've already run `db push`/migrated for Phases 3–4, you'll need to re-run `npx prisma generate` and push the schema again before this compiles against your local `@prisma/client`.
- Cancelling a booking releases its held seats back to `AvailabilityDate.booked` — worth a manual check that a cancelled date reopens correctly on the booking calendar (`components/booking/Calendar.tsx`) after a refresh.
- No pagination on the bookings list — fine for a demo account with a handful of bookings, but flag if this needs to handle real volume before Phase 9.

## Phase 6 — Identity verification (ImageKit) ✅ done

- [x] `app/api/imagekit-auth/route.ts` — new route handler that re-checks the Clerk session, then returns short-lived `token` / `expire` / `signature` from `@imagekit/next/server`'s `getUploadAuthParams`, plus the public key. This is what the client calls right before uploading — never generated client-side since it needs `IMAGEKIT_PRIVATE_KEY`.
- [x] `components/verification/VerificationForm.tsx` — new client component that owns the form state (document type/number/file) that used to live directly in the page; on submit it fetches the signed params from the new auth route, uploads the file straight to ImageKit via `@imagekit/next`'s `upload()` (with `onProgress` driving a "Uploading… N%" button label), then calls the `submitVerification` server action with the resulting CDN URL + fileId. Handles the SDK's specific error classes (`ImageKitAbortError`, `ImageKitInvalidRequestError`, `ImageKitServerError`, `ImageKitUploadNetworkError`) with distinct inline messages instead of one generic failure string.
- [x] `lib/actions/verification.ts` — new `submitVerification` server action: re-validates document type/number/url/fileId with `zod` (the upload itself already happened client-side, but the form fields didn't go through a signed step, so they're still re-checked here per Section 9), confirms the `User` row exists (same webhook-timing guard as booking actions), then upserts `IdentityVerification` — resubmission (e.g. after a rejection) always resets `status` back to `"pending"` and bumps `submittedAt`. Best-effort deletes the previous `documentFileId` from ImageKit on resubmission via `lib/imagekit.ts`'s server client, without failing the submission if that delete errors.
- [x] `lib/verification.ts` — new server-only `getVerificationForUser(userId)`, mirroring the `lib/bookings.ts` pattern, mapping the Prisma row onto a small display shape.
- [x] `app/profile/verification/page.tsx` — now an async server component: reads the Clerk session, fetches any existing verification row, and passes it as `initial` into `VerificationForm`. Approved/pending users see their status pill and a static message instead of the form; only `null`/`rejected` states show the editable form (so an approved user can't accidentally resubmit, and a rejected one can retry).
- [x] `components/verification/UploadBox.tsx` — unchanged (still selection-only); the actual upload call now lives in `VerificationForm` around it, keeping `UploadBox` a dumb drag/drop + file-picker component.

### Notes / things to verify on your own machine

- Same network restriction as every phase so far — not run here, and this phase specifically needs real ImageKit keys (`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_PRIVATE_KEY` — all already in `.env.example` from Phase 0) to do anything past rendering the empty form.
- Uploaded files go to the `/identity-verification` folder in your ImageKit media library with `useUniqueFileName: true` — worth checking that folder exists/gets auto-created and that nothing else in the account expects that path.
- The delete-on-resubmit call in `submitVerification` assumes `imagekit.files.delete` from `@imagekit/nodejs` matches the shape used elsewhere in `lib/imagekit.ts` — hasn't been exercised against a real ImageKit account in this sandbox, so worth a manual resubmit-after-rejection test to confirm the old file actually disappears and a delete failure doesn't block the new submission.
- There's still no admin surface to move a submission from `pending` to `approved`/`rejected` — the build plan doesn't call for one yet, so this phase just leaves `status` sitting at `pending` after submission. Flag if that's needed before Phase 9, otherwise it's presumably a manual DB update or an admin phase not yet listed.
- `documentImageUrl` is stored but never rendered back to the user (no thumbnail on the status view) — not in Phase 1's original mock scope, but worth flagging since Phase 3 added `images.unsplash.com` to `next.config.mjs`'s `remotePatterns` for a similar reason; your ImageKit URL endpoint's hostname would need adding there too if a preview gets added later.

## Phase 7 — Concierge / About ✅ done

- [x] `lib/actions/concierge.ts` — new `sendConciergeMessage` server action: validates name/email/message with `zod`, sends via `resend`'s `emails.send` (`to` = `CONCIERGE_TO_EMAIL`, `from` = `CONCIERGE_FROM_EMAIL`, `replyTo` set to the visitor's own email so the concierge team can just hit reply), and returns a friendly error instead of throwing if `RESEND_API_KEY` isn't set — matches the "optional" framing `.env.example` already gave this var back in Phase 0. Includes a honeypot (`company`) field: a submission with anything in it is silently accepted but never actually sent, since `/concierge` is a public, signed-out-accessible form with no other spam defense per the Phase 2 middleware notes.
- [x] `components/concierge/ConciergeForm.tsx` — new client component replacing the static disabled form; owns name/email/message state, submits via `useTransition` + the server action (same pending/error pattern as `BookingClient.tsx`), and swaps to a "Message sent" confirmation panel on success instead of resetting the form.
- [x] `app/concierge/page.tsx` — now an async server component reading `currentUser()` (same as `app/profile/page.tsx`) to prefill name/email for signed-in visitors; still fully usable signed-out since Clerk data is optional here, not required like the booking/verification flows.
- [x] `app/about/page.tsx` — unchanged copy, added a "Talk to concierge" card at the bottom linking to `/concierge` — the page had no other outstanding Phase 7 items in the plan, this was just a natural cross-link now that concierge is functional.
- [x] `package.json` — added `resend` as a dependency.
- [x] `.env.example` — added `CONCIERGE_TO_EMAIL` and `CONCIERGE_FROM_EMAIL` alongside the existing `RESEND_API_KEY` (Section 8 only listed the API key; these two were needed once the send call was actually written).

### Notes / things to verify on your own machine

- Same network restriction as every phase so far — not run here, and this phase specifically needs a real `RESEND_API_KEY` plus a domain verified in Resend for `CONCIERGE_FROM_EMAIL` to actually deliver (Resend rejects sends from unverified domains).
- No confirmation email is sent to the visitor themselves — just the one email to `CONCIERGE_TO_EMAIL` with `replyTo` set to them. The in-page "Message sent" panel is the only acknowledgment they get. Flag if a visitor-facing receipt email is wanted; easy to add as a second `resend.emails.send` call once there's a from-address you're comfortable auto-replying from.
- The honeypot is a single hidden text field (`company`) — reasonable first line of defense for a demo, but it's not rate-limited or CAPTCHA'd, so a targeted bot could still get through. Flag if this form needs harder anti-abuse before Phase 9.
- Worth a manual click-through once `RESEND_API_KEY` is set to confirm the email actually lands (and isn't caught by spam filtering on the receiving side) — that's the kind of thing that looks right in code and still needs eyes on a real inbox.

## Phase 8 — Polish ✅ done

- [x] **Favorites now persist** — flagged back in the Phase 3 notes as something that "looks like it should persist" once real DB data was in play. `lib/favorites.ts` (`getFavoritedPackageIds`) and `lib/actions/favorites.ts` (`toggleFavorite`) back the heart toggle with the existing `Favorite` table; `app/page.tsx` and `app/destinations/page.tsx` now fetch the signed-in user's favorited ids server-side and pass them into `DestinationCard` / `DestinationsExplorer` as `initialFavorited`. `DestinationCard.tsx` updates optimistically on click and reverts if the server call fails; a signed-out click routes to `/sign-in` instead of silently failing.
- [x] **Loading states** — added `loading.tsx` skeletons (brand-styled, `animate-pulse` blocks matching each page's real layout) for every route that does an async DB/Clerk fetch: `app/destinations`, `app/destinations/[slug]`, `app/destinations/[slug]/book`, `app/bookings`, `app/profile`, `app/profile/verification`. These render automatically via Next's route-segment Suspense boundary while the server component's data fetch is in flight.
- [x] **Branded error boundaries** — `app/not-found.tsx` (404) and `app/error.tsx` (client component, catches render/data errors with a "Try again" button that calls `reset()`) replace Next's default unstyled pages, matching the rest of the site instead of dropping visitors onto a generic error screen.
- [x] **Per-page metadata** — root `app/layout.tsx` now uses a title template (`"%s | Lumina Travel"`) instead of one fixed string; every route (`destinations`, `destinations/[slug]` via `generateMetadata` using the package's own title/description/image for Open Graph, `destinations/[slug]/book`, `bookings`, `profile`, `profile/verification`, `concierge`, `about`) exports its own `title`/`description` so browser tabs, search results, and link previews are no longer all identically "Lumina Travel | Curated Journeys."
- [x] `app/about/page.tsx` — added a "Talk to concierge" cross-link card (small, in scope now that Phase 7 made the form functional).

### Notes / things to verify on your own machine

- Same network restriction as every phase so far — not run here.
- Favorites: `toggleFavorite` relies on the same `User`-row-must-exist-first guard as booking/verification actions, so it'll return a friendly "still setting up your account" error immediately post-signup until the Clerk webhook has fired — expected, same as every other write path.
- No dedicated "My Favorites" page/nav entry was added — nothing in the nav (`Navbar.tsx` / `BottomNav.tsx`) currently links to one, so this phase only made the existing heart-toggle interaction real rather than introducing new surface area. Flag if a favorites list page is wanted; `lib/favorites.ts` already returns exactly what a list page's data layer would need.
- `app/error.tsx` only catches errors thrown during rendering within `app/`'s route segments (the standard Next.js error-boundary behavior) — it won't catch errors from the root `layout.tsx` itself; that would need a `global-error.tsx`. Not added since nothing in `layout.tsx` does data fetching that could throw, but flagging in case that changes later.
- Metadata `openGraph.images` on the destination detail page points straight at the hotlinked `images.unsplash.com` URL — fine for now, but if that ever moves behind ImageKit (per the Phase 3 note about swapping to real ImageKit URLs eventually), this needs to move with it.
- Loading skeletons are static Tailwind markup, not measured against real content — worth a quick visual check on a throttled connection to confirm nothing jumps around once real content replaces the skeleton (layout-shift check), especially the destination detail hero.

## Phase 9 — Deploy ✅ done

- [x] `package.json` — added `"postinstall": "prisma generate"`, so any platform running a plain `npm install && npm run build` (Vercel included) generates the Prisma client automatically before `next build` runs, instead of relying on a manual step that every prior phase's notes had to call out separately.
- [x] `.gitignore` — added a bare `.env` entry. The starter template only ignored `.env*.local`, which would have let a real `.env` (holding `CLERK_SECRET_KEY`, `IMAGEKIT_PRIVATE_KEY`, `DATABASE_URL`, `RESEND_API_KEY`) get committed. `.env.example` stays tracked as the template.
- [x] `next.config.mjs` — added `images.remotePatterns` for `ik.imagekit.io` (Phase 6 added ImageKit uploads but never added its CDN host here — harmless until something actually renders an uploaded document image, but worth having ahead of that), plus baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` — the last one explicitly allows `camera=(self)` since `UploadBox.tsx` uses `capture="environment"`).
- [x] `app/api/health/route.ts` — new unauthenticated health check: runs `SELECT 1` against the database and returns 200/503 accordingly, for platform health probes / uptime monitors.
- [x] `app/robots.ts`, `app/sitemap.ts` — Next's metadata-route convention, replacing the nonexistent `robots.txt`/`sitemap.xml` the app never had. Sitemap includes the public static routes plus every destination slug (from the same `getAllSlugs()` Phase 3 already wrote for `generateStaticParams`); robots disallows `/api/`, `/bookings`, `/profile`, and the booking flow, since those are either non-content or sit behind Clerk's sign-in wall.
- [x] `middleware.ts` — added `txt` and `xml` to the matcher's static-file exclusion list so `robots.txt`/`sitemap.xml` skip the Clerk middleware entirely instead of running through it needlessly (they were never protected routes, just unnecessary overhead).
- [x] `.env.example` — added `NEXT_PUBLIC_SITE_URL`, used by the new robots/sitemap routes.
- [x] `README.md` — replaced the untouched `create-next-app` boilerplate with real setup/deploy docs: env var reference table, step-by-step Vercel + hosted-Postgres + Clerk-production + ImageKit + Resend deploy checklist, and the health-check endpoint.

### Notes / things to do on your own machine

- **This is the phase where `db push` stops being enough.** Every environment through Phase 8 used `npx prisma db push` for speed while iterating. Before a real deploy, run `npx prisma migrate dev --name init` locally against a database you're fine resetting, commit the generated `prisma/migrations/` folder (not present in this zip — needs a real Postgres connection to generate, which this sandbox doesn't have), and use `npx prisma migrate deploy` in the production pipeline from then on. README spells this out but flagging it here too since it's the one Phase 9 item that can't be done inside this sandbox at all, with or without network access — it needs an actual database to talk to.
- Same network restriction as every phase — the health check, robots/sitemap routes, and header config are all straightforward Next.js/Prisma code but none of it has been hit by a real request in this sandbox.
- No CI/CD pipeline file (GitHub Actions, etc.) was added — nothing in the plan or prior phases specified a particular CI provider, so this stayed at "what a manual or Vercel-native deploy needs" rather than guessing at a specific pipeline. Flag if you want one scaffolded for a specific provider.
- The security headers in `next.config.mjs` are a reasonable baseline, not a full hardening pass (no CSP, for instance — Clerk's hosted components, ImageKit's CDN, and Unsplash images make a correct `Content-Security-Policy` fiddly to get right without breaking something, so it's deliberately left out rather than shipped half-correct). Flag if you want that added next.
- `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000` if unset, so robots/sitemap won't be broken in dev, but production **must** set it or the sitemap will advertise localhost URLs to search engines.
