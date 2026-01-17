# Git Push Commands

Since you just installed Git, you need to **close and reopen PowerShell** for it to work.

## Steps:

1. **Close this PowerShell window**
2. **Open a NEW PowerShell window**
3. **Navigate to your project:**
```powershell
cd C:\Users\jros\.gemini\antigravity\playground\golden-omega
```

4. **Run these commands one by one:**

```powershell
# Initialize Git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Coffee Realm PWA"

# Set main branch
git branch -M main

# Add remote
git remote add origin https://github.com/yowkirow/the-coffee-realm.git

# Push to GitHub (Git Credential Helper will ask for login)
git push -u origin main
```

5. **When prompted**, sign in with your GitHub credentials

---

## After Push is Complete:

### Deploy to Vercel:

1. Go to Vercel (already open in your browser)
2. Click **Import** next to `yowkirow/the-coffee-realm`
3. **Environment Variables** - Add these:
   - `VITE_SUPABASE_URL` = (from Supabase Settings → API)
   - `VITE_SUPABASE_ANON_KEY` = (from Supabase Settings → API)
4. Click **Deploy**

Your app will be live in ~2 minutes! 🚀
