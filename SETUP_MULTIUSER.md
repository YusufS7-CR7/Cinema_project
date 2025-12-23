# Multi-User Setup Guide: Supabase + Vercel (Free)

This guide walks you through setting up a multi-user website with free services: Supabase for authentication and database, and Vercel for frontend hosting.

## 1. Create a Supabase Project (5 min)

### Step 1.1: Go to Supabase and create a free account
- Visit [supabase.com](https://supabase.com)
- Sign up with email or GitHub
- Create a new project (choose region closest to you, free plan is fine)

### Step 1.2: Get your Supabase keys
- Go to **Project Settings > API** (left sidebar)
- Copy:
  - `Project URL` — looks like `https://your-project.supabase.co`
  - `anon public` key (under "Project API keys")
- Save these somewhere safe — you'll need them next

### Step 1.3: Enable Email Authentication in Supabase
- Go to **Authentication > Providers** (left sidebar)
- Make sure "Email" is enabled (it should be by default)
- Click **Save**

## 2. Set Up Environment Variables Locally

### Step 2.1: Create `.env.local` in the `front/` folder
Create a file `front/.env.local` (use `.env.example` as reference):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-step-1.2
```

Replace the values with your actual Supabase keys.

### Step 2.2: Install dependencies
```bash
cd front
npm install
```

This installs `supabase` package and other dependencies.

## 3. Test Locally (npm run dev)

### Step 3.1: Run development server
```bash
cd front
npm run dev
```

You should see the app running (usually `http://localhost:5173`).

### Step 3.2: Test login/signup
- Open the app in browser
- Try signing up with email + password
- Try logging in
- If it works, you have multi-user authentication working locally!

**Note:** Users are now stored in Supabase Postgres database (not your machine).

## 4. Deploy Frontend to Vercel (Free, 5 min)

### Step 4.1: Push to GitHub
Make sure your project is on GitHub (public or private):

```bash
cd c:/Users/Dell/Desktop/project
git add .
git commit -m "Add Supabase auth and deploy config"
git push origin main
```

(If no repo yet: `git init`, add GitHub remote, then push.)

### Step 4.2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click **Add New Project**
4. Select your repository from the list
5. In **Build and Output Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Scroll down to **Environment Variables** and add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
7. Click **Deploy**

Wait ~2-3 minutes. Your site is now live at `your-project.vercel.app`!

## 5. Database Tables (Optional, but recommended)

If you want to store extra user data beyond email/password:

### Step 5.1: Create `users` table in Supabase
- Go to Supabase dashboard
- Click **SQL Editor** (left sidebar)
- Click **New Query**
- Paste:

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- Click **Run**

### Step 5.2: Enable RLS (Row Level Security)
- Go to **Authentication > Policies** (left sidebar)
- Click on the `users` table
- Create a policy so users can read/write their own data

(This prevents users from seeing each other's data unless you allow it.)

## 6. Use Supabase in Frontend (Examples)

Already added components: `LoginModal.tsx` and `SignUpModal.tsx` in `src/app/components/`.

### Example: Get current logged-in user
```typescript
import { getCurrentUser } from '@/lib/supabase';

const { user, error } = await getCurrentUser();
if (user) console.log('Logged in as:', user.email);
```

### Example: Listen to auth changes
```typescript
import { onAuthStateChange } from '@/lib/supabase';

const unsubscribe = onAuthStateChange((user) => {
  if (user) console.log('User:', user);
  else console.log('Not logged in');
});

// Later: unsubscribe();
```

### Example: Store custom user data
```typescript
import { supabase } from '@/lib/supabase';

const { error } = await supabase
  .from('users')
  .insert([{ id: user.id, email: user.email, name: 'John' }]);
```

## Troubleshooting

### "Supabase configuration missing" warning
→ Make sure `.env.local` is in `front/` folder and has correct keys.

### Login doesn't work locally
→ Check browser console (F12). Verify keys in `.env.local`.

### Deploy fails on Vercel
→ Go to Vercel dashboard → Project → Deployments → click failed build → read error logs.

### Need managed database (Node API + Postgres)?
See [server/README.md](../server/README.md) for Railway/Fly.io setup if you want to keep Node API with real Postgres instead of Supabase.

## What You Have Now

✅ **Multi-user authentication** (email/password) via Supabase  
✅ **Frontend deployed** on Vercel (live URL)  
✅ **Database** (PostgreSQL) in Supabase (free tier, 500 MB)  
✅ **Real-time sync** — all users share same data via Postgres  

## Cost (December 2025)

- **Supabase**: Free tier (500 MB DB, 2 GB bandwidth/month) — enough for hobby projects
- **Vercel**: Free tier (automatic deployments from GitHub)
- **Total**: $0/month for small projects

Scale as you grow — both have paid tiers when you exceed limits.

---

**Next steps:**
1. Create Supabase project (Step 1)
2. Add env vars locally (Step 2)
3. Test with `npm run dev` (Step 3)
4. Push to GitHub + deploy on Vercel (Step 4)

Questions? Check browser console and Supabase logs for error details.
