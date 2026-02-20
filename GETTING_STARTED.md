# 🚀 Getting Started Guide

Quick start guide for MMPI-2 Assessment System

## ⚡ 5-Minute Setup

### Step 1: Start the App (30 seconds)
```bash
npm install        # Install dependencies (first time only)
npm start          # Start server
```

Open: **http://127.0.0.1:8000**

### Step 2: Create a Test User (1 minute)
1. Click **"New User"** button
2. Fill in the form:
   - Name: `احمد محمد` (or any name)
   - Age: `30`
   - File Number: `2023-A01`
   - Date: Select today's date
   - Gender: Select one
3. Click **"Save and Create"**
4. View result in **"Archive"** tab

### Step 3: Test Language Switching (30 seconds)
1. Click language dropdown (top right)
2. Select **English** → Page switches to LTR
3. Select **Français** → Page switches to LTR
4. Select **العربية** → Page switches to RTL
5. All text translates instantly ✓

## 📋 Core Features Tour

### User Management
- ✅ **Create**: New User button
- ✅ **View**: Archive shows all users
- ✅ **Edit**: Click to select user
- ✅ **Delete**: Select and delete button
- ✅ **Export**: Save as JSON
- ✅ **Import**: Restore from JSON

### Data Persistence
- ✅ **Automatic save** to browser localStorage
- ✅ **Offline support** - works without internet
- ✅ **Tab sync** - updates across browser tabs
- ✅ **No server needed** for local testing

### Language Support
- ✅ **Arabic** (العربية) - RTL layout
- ✅ **English** - LTR layout  
- ✅ **French** (Français) - LTR layout
- ✅ **60+ strings** fully translated

## 🎯 Common Tasks

### Export User Data
1. Click **"Archive"** tab
2. Select users (checkboxes)
3. Click **"Export"**
4. Files download as JSON

### Import Saved Users
1. Click **"Archive"** tab
2. Click **"Import"**
3. Select JSON files
4. Users appear in list

### Copy a User
1. Select one user
2. Click **"Copy"**
3. Enter new name
4. Duplicate created

### Delete Users
1. Select users
2. Click **"Delete"**
3. Confirm deletion
4. Users removed

## 🔍 File Locations

```
public/                     # What your browser sees
├── index.html             # Main page
├── styles.css             # All styling
├── app.js                 # Main logic (400+ lines)
├── translations.js        # 60+ translation keys
├── languageManager.js     # Language system
└── firebaseOperations.js  # Firebase functions (optional)

src/                        # Source code (reference)
└── [same structure as public/]
```

## 🔐 Where Data Is Stored

### By Default (localStorage)
- **Location**: Browser storage
- **Persistence**: Until cache cleared
- **Access**: Same device only
- **Good for**: Testing, local use

### With Firebase (Optional)
- **Location**: Cloud (Google servers)
- **Persistence**: Forever
- **Access**: Any device with internet
- **Good for**: Production, team sharing

## 🌐 Enable Firebase (Optional)

### When You're Ready:

1. **Copy the template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Firebase credentials** to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_project
   ```

3. **Enable in app** - Edit `public/app.js` line 11:
   ```javascript
   let useFirebase = true;  // Change from false
   ```

4. **That's it!** Data now syncs to Firebase

## 🐛 Troubleshooting

### "CSS not showing"
- Clear cache: `Ctrl+Shift+Del`
- Check: http://127.0.0.1:8000
- Verify: `public/styles.css` exists

### "Data disappeared"
- Check if localStorage cleared
- Try private/incognito window
- Use Export to backup first

### "Language not changing"
- Clear browser cache
- Check console: `F12` → Console
- Try: `localStorage.clear()` then reload

### "Can't create user"
- Fill all fields (including gender)
- No duplicate names allowed
- Check for errors in toast messages

## 📊 Understanding Status Colors

When viewing user list:
- **Blue badge**: New user (no progress)
- **Yellow badge**: In progress (some questions answered)
- **Green badge**: Completed (all questions answered)

## 🔧 Customize the App

### Change App Title
Edit `public/index.html` line 7:
```html
<title>MMPI-2 | Your Title Here</title>
```

### Change Colors
Edit `public/styles.css` lines 4-6:
```css
--brand-primary: #3b82f6;    /* Main blue */
--danger: #ef4444;           /* Red for delete */
--success: #10b981;          /* Green for success */
```

### Add Translation
Edit `public/translations.js`:
1. Find the section for your language
2. Add new key
3. Use with `data-lang="myKey"`

## 📱 Mobile Testing

The app works great on mobile:
1. Open on phone: `http://YOUR_IP:8000`
2. Replace `YOUR_IP` with your computer's IP
3. All features work the same
4. RTL layouts auto-adjust

## 💾 Backup Your Data

### Manual Backup
1. Go to "Archive"
2. Select all users
3. Click "Export"
4. Save JSON files safely

### Restore from Backup
1. Go to "Archive"
2. Click "Import"
3. Select your JSON files
4. Data restored instantly

## ✅ Quality Checklist

Before using in production:

- [ ] Test all 3 languages work
- [ ] Test creating 5+ users
- [ ] Test export/import
- [ ] Test on mobile device
- [ ] Clear cache and reload page
- [ ] Test in different browser
- [ ] Export backup copy
- [ ] Read full README.md

## 🚀 Next Steps

1. **Test the app** locally for 5 minutes
2. **Create sample data** to understand workflow
3. **Try export/import** to backup data
4. **Enable Firebase** when ready for production
5. **Deploy to GitHub Pages** for team access

## 📞 Quick Reference

| Task | Steps |
|------|-------|
| Start app | `npm start` |
| Create user | Click "New User" button |
| View users | Click "Archive" tab |
| Change language | Top-right dropdown |
| Export data | Select users → "Export" |
| Import data | Click "Import" → select JSON |
| Clear data | `localStorage.clear()` in console |
| Enable Firebase | Set `useFirebase = true` |

## 🎓 Learning Resources

- **HTML/CSS**: Visual styling in `public/styles.css`
- **JavaScript**: App logic in `public/app.js`
- **Translations**: All text in `public/translations.js`
- **Language System**: How it works in `public/languageManager.js`

## 💡 Tips & Tricks

- **Bulk select**: Hold Shift + click
- **Deselect all**: Click "Clear Selection"
- **Quick delete**: Select + press Delete key
- **Search users**: Use browser find (`Ctrl+F`)
- **See data**: Open DevTools → Application → Storage

---

**Ready to start? Run `npm start` now!**

For more details, see [README.md](README.md)
