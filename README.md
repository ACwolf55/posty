# Posty (Chirp)

A Twitter/X-style microblogging clone with Clerk auth, rate-limited posting, and tRPC end-to-end type safety. Built following Theo Browne's T3 stack tutorial to get hands-on with the modern Next.js ecosystem.

## Project History

I built this following [Theo Browne's "Chirp" T3 stack tutorial](https://www.youtube.com/watch?v=YkOSUVzOAA4) to learn modern Next.js patterns — specifically **tRPC, Prisma, Clerk, and serverless rate limiting with Upstash Redis**. After three years teaching with the React + Node/Express stack at DevMountain, this was my way of catching up to where the JS world had moved.

The tutorial code is the foundation; the value here was learning the patterns and tooling. Next step is extending past where the tutorial ends — see the roadmap.

## Tech Stack (T3)

| Layer | Tech |
|---|---|
| Framework | Next.js 13 (Pages Router) |
| Auth | Clerk |
| API | tRPC (end-to-end TypeScript) |
| Database | PostgreSQL via Prisma (`relationMode = "prisma"` for serverless) |
| Rate limiting | Upstash Redis + `@upstash/ratelimit` |
| Data fetching | TanStack Query (via tRPC) |
| Validation | Zod |
| Styling | Tailwind CSS |
| Toast UX | react-hot-toast |
| Date formatting | dayjs |
| Language | TypeScript |

## Features

- Sign in / sign up via Clerk (Google, GitHub, email)
- Post short messages (max 400 chars)
- Global feed
- Individual user profiles (`/[slug]`)
- Individual post pages (`/post/[id]`)
- **Rate-limited posting** (3 posts per minute per user) via Upstash Redis at the edge
- Toast notifications on success/error
- Time-since-post formatting

## Project Structure

```
src/
├── pages/           # Next.js pages (index, [slug], post/, api/)
├── components/      # shared UI
├── server/          # tRPC routers + procedures
├── utils/           # helpers + tRPC client setup
├── styles/          # global CSS
└── middleware.ts    # Clerk auth middleware

prisma/
└── schema.prisma    # Post + Example models
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account (free tier)
- Upstash account (free Redis)

### Configuration

Copy `.env.example` to `.env` and fill in:
```
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Run

```bash
npm install
npx prisma db push    # sync schema to DB
npm run dev
```

## Roadmap (extending past the tutorial)

- [ ] Image attachments on posts (UploadThing or Cloudinary)
- [ ] Like / unlike
- [ ] Reply threads
- [ ] User-to-user follow graph
- [ ] Notifications on replies / likes
- [ ] Search posts by content or user
- [ ] Dark mode toggle

## What I Learned

- The T3 stack philosophy: type safety end-to-end without writing API contracts twice
- tRPC vs traditional REST — when to reach for which
- Prisma schema design and `relationMode = "prisma"` for serverless Postgres
- Clerk's drop-in auth vs rolling my own with NextAuth
- Server-side rate limiting with Upstash Redis at the edge
- Next.js Pages Router (predates App Router but still widely used in production)
- Zod schemas for runtime validation tied to TypeScript types
