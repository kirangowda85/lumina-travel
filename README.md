# Lumina Travel

A curated-journeys booking app: browse destinations, reserve a trip with live
availability, verify identity, and reach a concierge. Next.js 14 (App
Router) + TypeScript + Tailwind, Postgres via Prisma, Clerk for auth,
ImageKit for file storage, Resend for email.

See `PROGRESS.md` for what's been built phase by phase.

## Local development

```bash
npm install                 # also runs `prisma generate` via postinstall
cp .env.example .env        # fill in the values below
docker compose up -d        # local Postgres (or point DATABASE_URL at a hosted DB instead)
npx prisma db push          # sync the schema
npx prisma db seed          # seed the four demo journeys
npm run dev
```

Open http://localhost:3000.

### Environment variables

All of these live in `.env.example` — copy it to `.env` and fill in real
values. **Never commit `.env`** (it's gitignored); `.env.example` is the only
env file meant to be checked in.

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Auth (Clerk) |
| `CLERK_WEBHOOK_SECRET` | Verifying the `/api/webhooks/clerk` signature |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` / `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` / `IMAGEKIT_PRIVATE_KEY` | Identity verification document uploads |
| `RESEND_API_KEY` / `CONCIERGE_TO_EMAIL` / `CONCIERGE_FROM_EMAIL` | Concierge form email |
| `NEXT_PUBLIC_SITE_URL` | Used by `robots.txt` / `sitemap.xml` |

## Deploying

This app is built to deploy cleanly on **Vercel** with a hosted Postgres
(Neon, Supabase, or Vercel Postgres all work). Any Node hosting that runs
`npm install && npm run build && npm start` works too — Vercel is just the
path of least friction given Next.js + the App Router.

1. **Database** — provision a Postgres instance and set `DATABASE_URL`.
   Then, from a machine with access to it:
   ```bash
   npx prisma migrate dev --name init   # generates prisma/migrations/ (do this once, locally, before first deploy)
   ```
   Every environment so far (Phases 0–8) used `prisma db push`, which is
   fine for iterating against a local/dev database but doesn't leave a
   migration history. Production deploys should run
   `npx prisma migrate deploy` (not `db push`) so schema changes are
   tracked and reproducible — wire that into your deploy pipeline as a
   pre- or post-build step, or run it manually before each release.
2. **Seed data** (optional, for a demo/staging environment) — run
   `npx prisma db seed` once against the production database after the
   first migration.
3. **Clerk** — create a production instance in the Clerk dashboard, set
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` to the production
   keys, then add a webhook endpoint at
   `https://<your-domain>/api/webhooks/clerk` subscribed to
   `user.created` / `user.updated` / `user.deleted`, and set
   `CLERK_WEBHOOK_SECRET` to its signing secret. Until this webhook has
   fired for an account, that user's `prisma.user` row won't exist yet and
   booking/verification/favoriting will show a "still setting up your
   account" message (by design — see `PROGRESS.md` Phase 2).
4. **ImageKit** — create an account/media library, set the three
   `IMAGEKIT_*` env vars, and add its URL endpoint's hostname to
   `images.remotePatterns` in `next.config.mjs` if it differs from the
   `ik.imagekit.io` default already listed there.
5. **Resend** — verify a sending domain, set `RESEND_API_KEY` and
   `CONCIERGE_FROM_EMAIL` to an address on that domain (Resend rejects sends
   from unverified domains), and set `CONCIERGE_TO_EMAIL` to wherever
   concierge inquiries should land.
6. **`NEXT_PUBLIC_SITE_URL`** — set to the real deployed domain so
   `robots.txt` / `sitemap.xml` point at the right place.
7. Deploy. On Vercel: import the repo, add the env vars above in Project
   Settings, and deploy — `postinstall` runs `prisma generate`
   automatically before `next build`.

### Health check

`GET /api/health` returns `{ status: "ok", db: "ok" }` (200) or
`{ status: "error", db: "unreachable" }` (503) — wire this into your
platform's health probe or an uptime monitor. It's unauthenticated and
intentionally minimal.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [ImageKit Documentation](https://imagekit.io/docs)
- [Resend Documentation](https://resend.com/docs)
