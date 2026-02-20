# GitHub Setup & Deployment Guide

## Quick Start: Push to GitHub in 5 Minutes

### Step 1: Create a Repository on GitHub

1. Go to https://github.com/new
2. Name it: `MMPI2`
3. Add description: `Professional MMPI-2 Psychological Assessment System`
4. Choose **Public** (so we can deploy to GitHub Pages)
5. Check "Add a README file" (we already have one, but it's fine)
6. Click **Create repository**

### Step 2: Initialize Git Locally

Open PowerShell and navigate to your project:

```powershell
cd "C:\Users\Richa\Desktop\Worksapce\MMPI2"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MMPI-2 Assessment System with complete translations and localStorage"
```

### Step 3: Connect to GitHub

Copy the commands from your GitHub repo page (they'll look like this):

```powershell
# Add remote connection
git remote add origin https://github.com/YOUR_USERNAME/MMPI2.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**That's it!** Your code is now on GitHub at: `https://github.com/YOUR_USERNAME/MMPI2`

---

## Deploy to GitHub Pages (Free Hosting)

### For Static Site (No Backend)

GitHub Pages automatically hosts static files:

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **main** branch
4. Click **Save**

Your site will be live at:
```
https://YOUR_USERNAME.github.io/MMPI2/
```

The page might take 2-3 minutes to build. Refresh after a few minutes!

---

## Using Git for Version Control

### Push Changes After Editing

```powershell
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Add Firebase integration and database guide"

# Push to GitHub
git push origin main
```

### Create Branches for Features

```powershell
# Create new branch
git checkout -b feature/database-integration

# Make changes, then...
git add .
git commit -m "Implement Firebase database layer"
git push origin feature/database-integration

# Then create Pull Request on GitHub to merge back to main
```

---

## GitHub Link for Your README

### For projects WITH a backend/database:

```markdown
## 🔗 Live Demo & Repository

- **GitHub Repository**: [https://github.com/YOUR_USERNAME/MMPI2](https://github.com/YOUR_USERNAME/MMPI2)
- **Issues & Discussions**: [GitHub Issues](https://github.com/YOUR_USERNAME/MMPI2/issues)
- **Project Status**: Active Development
```

### Embed in HTML

Add to your `index.html` header or footer:

```html
<a href="https://github.com/YOUR_USERNAME/MMPI2" class="github-link" target="_blank">
  <svg viewBox="0 0 16 16" width="32" height="32" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
  </svg>
  View on GitHub
</a>
```

---

## Database Integration with GitHub

### Option 1: Store Credentials Securely

If using Firebase or Supabase with GitHub:

1. **NEVER commit API keys!**
2. Create `.env.example`:

```plaintext
# .env.example (safe to commit)
FIREBASE_API_KEY=PASTE_YOUR_KEY_HERE
FIREBASE_PROJECT_ID=PASTE_YOUR_PROJECT_ID
SUPABASE_URL=PASTE_YOUR_URL_HERE
SUPABASE_KEY=PASTE_YOUR_KEY_HERE
```

3. Create `.env` (actual keys, never commit):

```plaintext
# .env (add to .gitignore)
FIREBASE_API_KEY=AIzaSyD...
FIREBASE_PROJECT_ID=your-project-123
```

4. Load in your script:

```javascript
// Load from env or use GitHub Secrets (for automated deployments)
const apiKey = process.env.FIREBASE_API_KEY || "default-key";
```

### Option 2: Use GitHub Secrets (For CI/CD)

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add: `FIREBASE_API_KEY` = `your-api-key`
4. Use in workflows (if using GitHub Actions for deployment)

### Option 3: Store in GitHub Environment

1. Settings → Environments
2. Create "production" environment
3. Add secrets there
4. Use in Actions workflows

---

## Continuous Deployment (Auto-deploy on Push)

### Using GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

Now every push to `main` automatically deploys to GitHub Pages!

---

## Full Database Integration Example (MongoDB Backend)

### Repository Structure for Backend:

```
MMPI2/
├── frontend/
│   ├── index.html
│   ├── main.html
│   ├── styles.css
│   ├── script.js
│   ├── language.js
│   └── firebase-integration.js
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── api.js
│   └── .env
├── .gitignore
├── README.md
└── package.json
```

### `package.json` for Backend:

```json
{
  "name": "mmpi2-backend",
  "version": "1.0.0",
  "description": "MMPI-2 Assessment System Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "deploy": "git push origin main"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

### Deployment Options:

| Platform | Cost | Setup | Best For |
|----------|------|-------|----------|
| **Vercel** | Free | 5 min | Full stack |
| **Heroku** | $7+/month | 10 min | Production |
| **Railway** | Pay per use | 5 min | Flexible |
| **Render** | Free tier | 10 min | Starter projects |
| **Digital Ocean** | $4+/month | 20 min | Developers |

### Deploy to Vercel (Easiest):

```bash
npm i -g vercel
vercel
# Login with GitHub, follow prompts
```

---

## Collaborative Development on GitHub

### Fork & Pull Request Workflow

1. Collaborators **fork** your repo
2. They **clone** their fork locally
3. Create a **feature branch**
4. Make changes and **commit**
5. **Push** to their fork
6. Open **Pull Request** to your main repo
7. You **review** and **merge**

```powershell
# Their workflow:
git clone https://github.com/THEIR_USERNAME/MMPI2.git
cd MMPI2
git checkout -b feature/new-feature
# Make changes...
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Then open PR on GitHub
```

---

## Troubleshooting

### "fatal: not a git repository"

```powershell
cd C:\Users\Richa\Desktop\Worksapce\MMPI2
git init
```

### "Permission denied (publickey)"

Generate SSH key:

```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
```

Paste into GitHub → Settings → SSH and GPG keys

### "Updates were rejected"

```powershell
# Pull latest from GitHub first
git pull origin main
# Then push your changes
git push origin main
```

---

## Important GitHub Links

- **Your Repository**: `https://github.com/YOUR_USERNAME/MMPI2`
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/MMPI2`
- **GitHub Issues**: Report bugs at `https://github.com/YOUR_USERNAME/MMPI2/issues`
- **GitHub Discussions**: Ask questions at `https://github.com/YOUR_USERNAME/MMPI2/discussions`

---

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Enable GitHub Pages
4. 📊 Choose database (Firebase/Supabase/MongoDB)
5. 🔗 Update README with live links
6. 🚀 Deploy backend (if using one)

**Questions?** Check the README.md for detailed setup instructions!
