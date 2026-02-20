# 🧠 MMPI-2 Psychological Assessment System

Professional web-based platform for managing and administering the Minnesota Multiphasic Personality Inventory (MMPI-2) assessments.

## ✨ Features

- 🌐 **Multi-language Support**: Arabic (RTL), English, French with automatic text direction
- 💾 **Data Persistence**: localStorage for client-side storage + Firebase integration ready
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 👥 **User Management**: Create, view, edit, delete, and export user profiles
- 📊 **Assessment Tracking**: Monitor progress and completion status
- 🔄 **RTL/LTR Auto-switching**: Automatically adjusts layout for Arabic/English/French
- 📤 **Import/Export**: JSON file support for data backup and migration

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```
The app will open at `http://127.0.0.1:8000`

### 3. Create a Test User
- Click "New User" button
- Fill in: Name, Age, File Number, Procedure Date, Gender
- Click "Save and Create"
- View in the "Archive" section

## 📁 Project Structure

```
MMPI2/
├── public/                      # Served files (web root)
│   ├── index.html              # Main app entry point
│   ├── styles.css              # All styling
│   ├── app.js                  # Main application logic
│   ├── translations.js         # 60+ translation strings (3 languages)
│   ├── languageManager.js      # Language switching & RTL/LTR
│   └── firebaseOperations.js   # Firebase CRUD functions (optional)
│
├── src/                         # Source code (for reference/build)
│   ├── config/firebase.js      # Firebase configuration
│   ├── languages/
│   │   ├── translations.js
│   │   └── languageManager.js
│   ├── db/firebaseOperations.js
│   ├── js/app.js
│   └── css/styles.css
│
├── .env.example                # Environment variables template
├── package.json                # npm scripts & dependencies
└── README.md                   # This file
```

## 🌍 Language Support

Switch languages using the dropdown in the header:

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| 🇸🇦 العربية | `ar` | RTL | ✅ Complete |
| 🇬🇧 English | `en` | LTR | ✅ Complete |
| 🇫🇷 Français | `fr` | LTR | ✅ Complete |

All UI text is fully translated including:
- Forms and labels
- Buttons and actions
- Toast notifications
- Status messages
- Error messages

## 💾 Data Storage

### Local Storage (Default)
- Data stored in browser's localStorage
- Works offline
- No server required
- Perfect for local testing

### Firebase (Optional)
To enable Firebase sync:

1. **Create `.env` file** (copy from `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=mmpi2-a998b
VITE_FIREBASE_AUTH_DOMAIN=mmpi2-a998b.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=mmpi2-a998b.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. **Enable in `public/app.js`** (line ~11):
```javascript
let useFirebase = true;  // Change from false to true
```

## 🎮 User Guide

### Creating a New Assessment
1. Click **"New User"** button
2. Enter required information:
   - **Full Name**: Assessment subject's name
   - **Age**: Subject's age in years
   - **File Number**: Reference identifier
   - **Procedure Date**: Assessment date
   - **Gender**: Male or Female
3. Click **"Save and Create"**
4. View created assessment in **"Archive"**

### Managing Assessments
- **View**: All assessments shown in the archive list
- **Open**: Click arrow icon or select and click "Open"
- **Copy**: Select one assessment, click "Copy", enter new name
- **Delete**: Select assessments, click "Delete" (confirm action)
- **Export**: Select assessments, click "Export" (downloads JSON)
- **Import**: Click "Import", select JSON files to restore

### Language Switching
1. Click language dropdown (header right)
2. Select desired language
3. Entire UI updates instantly
4. Page layout automatically adjusts for RTL languages

### Understanding Status Badges

| Badge | Meaning |
|-------|---------|
| 🔵 New | Assessment just created |
| 🟡 In Progress | Some questions answered |
| 🟢 Completed | All questions answered |

## 🔧 Configuration

### Environment Variables (`.env`)
Create a `.env` file with your credentials (see `.env.example`).

**Important**: Never commit `.env` to Git! It's already in `.gitignore`.

### Adding New Translations
To add a new translation string:

1. Open `public/translations.js`
2. Add key to all three language objects:
```javascript
ar: {
  myNewKey: "النص العربي",
  ...
},
en: {
  myNewKey: "English text",
  ...
},
fr: {
  myNewKey: "Texte français",
  ...
}
```

3. Use in HTML with `data-lang` attribute:
```html
<span data-lang="myNewKey">Placeholder text</span>
```

## 📊 User Data Structure

### User Profile
```javascript
{
  name: "أحمد محمد",
  age: 30,
  folder_number: "2023-A01",
  date: "2024-02-20",
  gender: "Male" | "Female"
}
```

### Assessment Data
```javascript
{
  user_info: { ... },
  questions: [ ... ],
  status: "new" | "in_progress" | "completed",
  progress: 0-100
}
```

## 🔐 Security Notes

- **Local Storage**: Data stored in browser only - not encrypted
- **Firebase**: Enable Firestore security rules in production
- **API Keys**: Store in `.env` file (never commit to Git)
- **Authentication**: Implement user login for production use

## 🐛 Troubleshooting

### CSS/Styling not showing?
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure server is running on port 8000
- Check that `public/styles.css` exists

### Language not switching?
- Check browser console for errors (F12)
- Ensure all `data-lang` attributes are correct
- Clear localStorage: `localStorage.clear()` in console

### Data not persisting?
- Check if localStorage is enabled in browser
- Verify no browser privacy mode enabled
- Check browser storage quota not exceeded

### Firebase not connecting?
- Verify `.env` file has correct credentials
- Check Firebase project settings
- Ensure `useFirebase = true` in `public/app.js`
- Check browser console for Firebase errors

## 📦 Technologies Used

- **Frontend**: HTML5, CSS3, ES6+ JavaScript
- **Storage**: Browser localStorage + Firebase (optional)
- **Styling**: CSS Variables, Glassmorphism design
- **Fonts**: Google Fonts (Cairo for Arabic support)
- **Icons**: Inline SVG icons
- **Build**: http-server for development

## 📝 Scripts

```bash
npm start        # Start development server on port 8000
npm run dev      # Same as npm start
npm run build    # No build needed (static site)
npm run preview  # Preview dist folder
npm run deploy   # Push to GitHub (git push)
```

## 🌐 Deployment

### GitHub Pages (Static)
1. Push to GitHub main branch:
```bash
git add .
git commit -m "MMPI-2 app ready for deployment"
git push origin main
```

2. Enable GitHub Pages:
   - Settings → Pages → Source: main branch
   - Your site: `https://yourusername.github.io/MMPI2`

### Firebase Hosting
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Deploy:
```bash
firebase deploy
```

## ✅ Quality Assurance

- [x] Multi-language support (AR, EN, FR)
- [x] Automatic RTL/LTR switching
- [x] Responsive design (mobile, tablet, desktop)
- [x] User CRUD operations
- [x] Data persistence (localStorage)
- [x] Import/Export functionality
- [x] Toast notifications
- [x] Error handling
- [x] Firebase integration ready
- [x] Clean, organized file structure

## 🚀 Next Steps

1. **Test all features** locally
2. **Customize translations** if needed
3. **Enable Firebase** when ready
4. **Deploy to GitHub Pages** or Firebase Hosting
5. **Implement authentication** for production
6. **Set up Firestore security rules**

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Review error messages in toast notifications
3. Check `.env` file configuration
4. Review translations.js for translation keys
5. Verify all files exist in `public/` folder

## 📄 License

MIT - Feel free to use and modify

---

**Made with ❤️ for psychological assessment professionals**

Last Updated: February 20, 2026 | Version: 1.0.0
