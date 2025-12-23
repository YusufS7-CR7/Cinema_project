# Server (Node.js + Express) for project

Quick start:

1. Install dependencies

```bash
cd server
npm install
```

2. Run locally

```bash
# dev with auto-reload
npm run dev

# or production
npm start
```

3. Environment variables

- `JWT_SECRET` — secret for signing tokens (set in `.env` or platform env)

Notes about storage and deployment

- The server uses SQLite at `server/data/database.sqlite`. On many free hosts the filesystem is ephemeral; for production/multi-user use prefer a managed DB (Supabase, Railway Postgres, Fly Postgres).
- For authentication and DB-as-a-service consider using Supabase Auth + Postgres (recommended free tier for quick start).

Deployment suggestions (free options):

- Frontend: deploy `front/` to Vercel or Netlify (both have generous free tiers).
- Backend: deploy `server/` to Railway or Fly.io (connect GitHub repo, set `JWT_SECRET`, and use managed Postgres or keep SQLite for testing).
- Alternatively combine: put frontend on Vercel and backend as Serverless functions on Vercel, or use Supabase for auth and DB and only host minimal API.

API endpoints

- `POST /api/auth/register` {email,password,name} => {token,user}
- `POST /api/auth/login` {email,password} => {token,user}
- `GET /api/me` (Bearer token) => current user
- `GET /api/protected` (Bearer token) => sample protected data
