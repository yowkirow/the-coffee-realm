# Quick Deployment Guide - The Coffee Realm PWA

## 🚀 5-Minute Setup

### Step 1: Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) → **Start your project**
2. Create new organization (or use existing)
3. Click **New project**:
   - Name: `coffee-realm`
   - Database Password: (generate strong password - save it!)
   - Region: Choose closest to you
   - Click **Create new project** (wait ~2 min)

4. Once ready, click **SQL Editor** (left sidebar)
5. Click **New query**
6. Open `SUPABASE_SETUP.md` in your project
7. Copy ALL the SQL code
8. Paste into SQL Editor
9. Click **Run** (bottom right)

10. Go to **Settings** → **API**
11. Copy these two values:
    - **Project URL** (looks like: `https://xxxxx.supabase.co`)
    - **anon public** key (long string)

### Step 2: Environment Variables (30 seconds)

1. In your project folder, create `.env.local` file
2. Paste this (replace with YOUR values):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-anon-key-here
```

3. Test locally:
```bash
npm run dev
```

### Step 3: Git & GitHub (1 minute)

**First, install Git if you haven't:**
- Download: [git-scm.com/downloads](https://git-scm.com/downloads)
- Install with default options
- Restart your terminal

**Then:**
```bash
git init
git add .
git commit -m "Initial commit - Coffee Realm PWA"
```

**Create GitHub repo:**
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `coffee-realm-pwa`
3. Keep it **Public** or **Private** (your choice)
4. **DO NOT** initialize with README
5. Click **Create repository**

**Push code:**
```bash
git remote add origin https://github.com/YOUR-USERNAME/coffee-realm-pwa.git
git branch -M main
git push -u origin main
```

### Step 4: Vercel Deployment (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. **Import Git Repository** → Select your `coffee-realm-pwa` repo
4. Click **Import**
5. **Environment Variables** → Add these:
   - `VITE_SUPABASE_URL` = (your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (your anon key)
6. Click **Deploy**
7. Wait ~2 minutes ☕

### ✅ Done!

Your app will be live at: `https://coffee-realm-pwa.vercel.app`

## Testing

1. Visit your Vercel URL
2. Click **Sign Up**
3. Create account with your email
4. Check email for Supabase confirmation link
5. Confirm email
6. Login and test the loyalty card!

## Troubleshooting

**"Git not recognized"**: Install Git from [git-scm.com](https://git-scm.com/downloads) and restart terminal

**Build fails on Vercel**: Check environment variables are set correctly

**Can't login**: Check Supabase email confirmation settings in Authentication → Providers
