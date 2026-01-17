# Quick Upload to GitHub (No Git Required)

Since Git is not installed, follow these steps to upload your code:

## Option 1: GitHub Desktop (Recommended - Easiest)

1. Download **GitHub Desktop**: [desktop.github.com](https://desktop.github.com)
2. Install and sign in with your GitHub account
3. Click **Add** → **Add Existing Repository**
4. Browse to: `C:\Users\jros\.gemini\antigravity\playground\golden-omega`
5. Click **Publish repository**
6. Done! Your code is now on GitHub

## Option 2: Web Upload (Manual but works)

1. Go to: https://github.com/yowkirow/the-coffee-realm
2. Click **uploading an existing file**
3. Drag and drop ALL files from `C:\Users\jros\.gemini\antigravity\playground\golden-omega`
   - **IMPORTANT**: Do NOT upload `node_modules` folder (it's huge and unnecessary)
   - Upload everything else
4. Add commit message: "Initial commit"
5. Click **Commit changes**

## Option 3: Install Git (For future use)

1. Download: [git-scm.com/downloads](https://git-scm.com/downloads)
2. Install with default options
3. **Restart PowerShell**
4. Then run these commands:
```bash
cd C:\Users\jros\.gemini\antigravity\playground\golden-omega
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yowkirow/the-coffee-realm.git
git push -u origin main
```

---

## After Upload: Deploy to Vercel

Once files are on GitHub:

1. Go to Vercel (already open in your browser)
2. Click **Import** next to `yowkirow/the-coffee-realm`
3. **Add Environment Variables**:
   - Click **Add** for each:
   - `VITE_SUPABASE_URL` = (your Supabase project URL)
   - `VITE_SUPABASE_ANON_KEY` = (your Supabase anon key)
4. Click **Deploy**
5. Wait 2 minutes ☕

**Where to get Supabase credentials:**
- Go to your Supabase project
- Settings → API
- Copy "Project URL" and "anon public" key
