# 📁 New Project Structure Guide

Your MMPI-2 project has been reorganized for better maintainability and Firebase integration.

## 📂 New Folder Structure

```
MMPI2/
├── public/                    # Served static files
│   └── index.html            # Main entry point
│
├── src/                       # Source files
│   ├── config/
│   │   └── firebase.js       # Firebase configuration & initialization
│   │
│   ├── languages/
│   │   ├── translations.js   # All translations (AR, EN, FR)
│   │   └── languageManager.js # Language switching & RTL/LTR management
│   │
│   ├── db/
│   │   └── firebaseOperations.js # All Firebase database operations
│   │
│   ├── js/
│   │   └── app.js            # Main application logic
│   │
│   └── css/
│       └── styles.css        # All styling
│
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # npm configuration
└── README.md                # Project documentation
```

## 🚀 Key Changes

### 1. **Modular Organization**
- Each feature is in its own folder
- Easier to find and update code
- Better for team collaboration

### 2. **Firebase Integration Ready**
- `src/config/firebase.js` - Firebase initialization
- `src/db/firebaseOperations.js` - All database operations
- Works alongside localStorage
- Fallback to localStorage if Firebase unavailable

### 3. **Language System Enhanced**
- `src/languages/translations.js` - 40+ strings per language
- `src/languages/languageManager.js` - Smart language switching
- Automatic RTL/LTR handling
- Easy to add new languages

### 4. **Environment Configuration**
- `.env.example` - Template for your secrets
- `.env` - Actual secrets (in .gitignore)
- Never commit real API keys!

## 📝 File Descriptions

### `public/index.html`
Main application entry point. Links to all CSS and JS files.
- Firebase library imports
- Module script initialization
- All UI elements

### `src/config/firebase.js`
Firebase setup and initialization.
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
export const db = getFirestore(app);
```

### `src/languages/translations.js`
Complete translations for all 3 languages.
- 40+ translation keys
- Arabic (RTL), English, French
- Easy to add more languages

### `src/languages/languageManager.js`
Handles language switching and translation.
```javascript
languageManager.setLanguage('ar');  // Switch to Arabic
languageManager.translate('key');   // Get translation
```

### `src/db/firebaseOperations.js`
All Firebase database functions:
- `saveUserInfo()` - Save user data
- `getAllUsers()` - Get all users
- `updateUser()` - Update user info
- `deleteUser()` - Delete user
- `saveAssessment()` - Save assessment
- And more...

### `src/js/app.js`
Main application logic:
- Event listeners
- DOM manipulation
- User management
- Data persistence (localStorage + Firebase)

### `src/css/styles.css`
All styling (same as before, just organized).
- Glassmorphism design
- RTL/LTR support
- Responsive layout

## 🔧 How to Use

### 1. **Serving Locally**
```bash
npm install
npm start
# Opens at http://localhost:8000
```

### 2. **Using Firebase**
Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
```

Then in your code:
```javascript
import { db } from './src/config/firebase.js';
import * as firebaseOps from './src/db/firebaseOperations.js';

// Use Firebase
const users = await firebaseOps.getAllUsers();
```

### 3. **Changing Language**
```javascript
// In HTML:
<select id="language-switcher">
  <option value="ar">العربية</option>
  <option value="en">English</option>
  <option value="fr">Français</option>
</select>

// In JS:
languageManager.setLanguage('en');
```

### 4. **Adding New UI Strings**
1. Add to `src/languages/translations.js`:
```javascript
ar: {
  myNewKey: "نص جديد",
  ...
},
en: {
  myNewKey: "New text",
  ...
}
```

2. Use in HTML:
```html
<p data-lang="myNewKey">Placeholder text</p>
```

3. It auto-translates when language changes!

## 📦 Firebase Collections Structure

### `users` Collection
```javascript
{
  id: "auto-generated",
  name: "أحمد محمد",
  age: 30,
  folder_number: "2023-A01",
  date: "2024-02-20",
  gender: "Male",
  createdAt: "2024-02-20T10:00:00Z",
  updatedAt: "2024-02-20T10:00:00Z"
}
```

### `user_assessments` Collection
```javascript
{
  id: "auto-generated",
  userId: "reference-to-user",
  user_info: { ...user data },
  questions: [ ...assessment questions ],
  status: "new|in_progress|completed",
  progress: 0-100,
  createdAt: "2024-02-20T10:00:00Z",
  updatedAt: "2024-02-20T10:00:00Z"
}
```

## 🔐 Security Best Practices

1. **Never commit `.env` with real keys**
   ```
   ✅ Commit: .env.example
   ❌ Don't commit: .env
   ```

2. **Use environment variables**
   ```javascript
   const apiKey = process.env.VITE_FIREBASE_API_KEY;
   ```

3. **Set Firebase security rules**
   ```firestore
   match /users/{userId} {
     allow read, write: if request.auth.uid == userId;
   }
   ```

4. **Use .gitignore to exclude secrets**
   Already configured in `.gitignore`

## 🎯 Next Steps

1. ✅ Install dependencies
   ```bash
   npm install
   ```

2. ✅ Create `.env` file with your Firebase keys
   ```bash
   cp .env.example .env
   # Edit .env with real values
   ```

3. ✅ Start local server
   ```bash
   npm start
   ```

4. ✅ Push to GitHub
   ```bash
   git add .
   git commit -m "Reorganize project with Firebase integration"
   git push origin main
   ```

5. ✅ Deploy to GitHub Pages
   - Settings → Pages → Deploy from main branch

## 📚 Documentation Files

- `QUICK_START.md` - Quick overview
- `README.md` - Complete guide
- `GITHUB_SETUP.md` - GitHub deployment
- `DATABASE_SETUP.md` - Database integration
- `LANGUAGE_GUIDE.md` - Translation system

## ❓ Troubleshooting

**Q: Where do I put my Firebase keys?**
A: In `.env` file (not committed to git). Copy from `.env.example`.

**Q: How do I add a new language?**
A: Add to `src/languages/translations.js`, then add option to HTML selector.

**Q: Why is my Firebase not working?**
A: Check if `useFirebase = true` in `src/js/app.js` and .env file has real keys.

**Q: How do I run locally?**
A: `npm install` then `npm start` at http://localhost:8000

## 🚀 You're All Set!

Your project is now:
- ✅ Properly organized in folders
- ✅ Ready for Firebase integration
- ✅ Using modular imports
- ✅ Environment-variable protected
- ✅ Production-ready

Start with `npm install` and `npm start`!
