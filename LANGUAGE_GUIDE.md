/**
 * LANGUAGE & LOCALIZATION GUIDE
 * 
 * This document explains how the multi-language system works
 * and how to add new languages or modify translations.
 */

// ============================================
// LANGUAGE STRUCTURE
// ============================================

/*
 * Current Supported Languages:
 * 
 * 1. ar (Arabic)
 *    - Direction: RTL (Right-to-Left)
 *    - Text alignment: right
 *    - Margin/padding: mirrored
 * 
 * 2. en (English)
 *    - Direction: LTR (Left-to-Right)
 *    - Text alignment: left
 *    - Standard layout
 * 
 * 3. fr (French)
 *    - Direction: LTR (Left-to-Right)
 *    - Text alignment: left
 *    - Standard layout
 */

// ============================================
// HOW THE SYSTEM WORKS
// ============================================

/*
 * 1. TRANSLATION OBJECTS (language.js)
 *    - Each language has a key (ar, en, fr)
 *    - Each key contains all translatable strings
 *    - Format: translations[language][key] = "translated text"
 * 
 * 2. HTML ATTRIBUTES
 *    - data-lang="key" → translates text content
 *    - data-lang-placeholder="key" → translates placeholder attribute
 * 
 * 3. AUTOMATIC ORIENTATION
 *    - document.documentElement.dir = 'rtl' (for Arabic)
 *    - document.documentElement.dir = 'ltr' (for English/French)
 *    - CSS handles alignment changes automatically
 * 
 * 4. CSS RESPECTS DIR ATTRIBUTE
 *    - text-align: right/left works automatically
 *    - margin-right/left use flexbox for automatic flipping
 */

// ============================================
// ADDING NEW LANGUAGES
// ============================================

/*
 * Step 1: Add translations to language.js
 * 
 * Copy the English object and translate all strings:
 */

const translations_EXAMPLE = {
  // ... existing translations ...
  
  // German Example:
  de: {
    title: "MMPI-2 | Armaturenbrett",
    logoSubtitle: "Psychologisches Bewertungssystem",
    home: "Startseite",
    welcomeTitle: "Willkommen im MMPI-Testsystem",
    welcomeMessage: "Eine professionelle Plattform zur Verwaltung psychologischer Tests. Sie können neue Fachdateien erstellen, das Archiv verwalten und Daten mit vollständiger Leichtigkeit exportieren.",
    newUser: "Neuer Benutzer",
    // ... continue for all keys ...
    toastDeleted: "Erfolgreich gelöscht"
  },
  
  // Spanish Example:
  es: {
    title: "MMPI-2 | Panel de control",
    logoSubtitle: "Sistema de evaluación psicológica",
    home: "Inicio",
    // ... translate all keys ...
  }
};

/*
 * Step 2: Update HTML language selector
 * 
 * Add to index.html in the header:
 * 
 * <select id="language-switcher" class="btn btn-ghost">
 *   <option value="ar">العربية</option>
 *   <option value="en">English</option>
 *   <option value="fr">Français</option>
 *   <option value="de">Deutsch</option>       ← Add this
 *   <option value="es">Español</option>       ← Add this
 * </select>
 * 
 * Important: Use native language names in the options!
 * Bad: <option value="es">Spanish</option>
 * Good: <option value="es">Español</option>
 */

// ============================================
// HOW TRANSLATION WORKS IN SCRIPT.JS
// ============================================

/*
 * Function: setLanguage(lang)
 * 
 * What it does:
 * 1. Sets currentLang variable
 * 2. Updates document language: document.documentElement.lang = lang
 * 3. Updates direction: document.documentElement.dir = (lang === 'ar' ? 'rtl' : 'ltr')
 * 4. Finds all elements with data-lang attribute
 * 5. Replaces their text with translation
 * 6. Finds all elements with data-lang-placeholder
 * 7. Replaces their placeholder with translation
 * 8. Updates page title
 * 
 * Example:
 * <h1 data-lang="welcomeTitle">مرحباً بكم في نظام اختبار MMPI</h1>
 * becomes:
 * <h1 data-lang="welcomeTitle">Welcome to MMPI Test System</h1> (when English selected)
 */

// ============================================
// CSS FOR RTL/LTR SUPPORT
// ============================================

/*
 * CSS automatically handles direction changes:
 * 
 * html[dir="rtl"] body {
 *   text-align: right;
 *   direction: rtl;
 * }
 * 
 * html[dir="ltr"] body {
 *   text-align: left;
 *   direction: ltr;
 * }
 * 
 * Flexbox automatically mirrors:
 * 
 * .nav-actions {
 *   display: flex;
 *   gap: 8px;
 * }
 * 
 * In RTL: items appear right-to-left
 * In LTR: items appear left-to-right
 * (No extra CSS needed!)
 */

// ============================================
// COMPLETE CHECKLIST FOR NEW LANGUAGE
// ============================================

/*
 * ✓ 1. Add all translation keys to language.js
 *      (Copy from English object, translate all ~40 keys)
 * 
 * ✓ 2. Add language to HTML selector
 *      (index.html - language-switcher select element)
 * 
 * ✓ 3. Test all pages with new language:
 *      - Welcome page
 *      - New User form
 *      - Archive/Previous Users list
 *      - Toast messages
 * 
 * ✓ 4. Check RTL/LTR (for Arabic-like languages):
 *      - Text alignment
 *      - Icon positions
 *      - Form inputs
 * 
 * ✓ 5. Test language switching:
 *      - Change from language A to B
 *      - Change back to A
 *      - All text should update
 */

// ============================================
// COMMON TRANSLATION KEYS
// ============================================

/*
 * These keys appear in every language:
 * 
 * NAVIGATION & UI:
 * - title: Page title (shown in browser tab)
 * - home: Home button
 * - archive: Archive button
 * - back: Back button
 * 
 * FORMS:
 * - createNewRecord: Form title
 * - fullName, fullNamePlaceholder
 * - age, agePlaceholder
 * - fileNumber, fileNumberPlaceholder
 * - procedureDate
 * - gender, selectGender, male, female
 * 
 * ACTIONS:
 * - saveAndCreate: Save button
 * - openFile, clearSelection, export, import, copy, delete
 * 
 * STATUS:
 * - statusNew, statusInProgress, statusCompleted
 * 
 * MESSAGES (Toast notifications):
 * - toastSuccess, toastEnterName, toastInvalidAge
 * - toastExported, toastImported, toastDeleted
 * - etc.
 * 
 * You MUST include all keys for each language,
 * otherwise you'll see "undefined" in the UI!
 */

// ============================================
// TRANSLATION KEY NAMING CONVENTIONS
// ============================================

/*
 * Good naming makes translations easy to manage:
 * 
 * UI Labels:
 * - fullName (not "fn" or "nameInput")
 * - age (not "ageField")
 * 
 * Placeholders:
 * - fullNamePlaceholder (append "Placeholder")
 * 
 * Toast Messages:
 * - toastSuccess (prefix "toast")
 * - toastEnterName
 * 
 * Buttons/Actions:
 * - openFile (verb + noun format)
 * - export (simple verbs)
 * 
 * Status Values:
 * - statusNew, statusInProgress, statusCompleted (prefix "status")
 * 
 * Benefits:
 * - Easy to search in code
 * - Consistent naming
 * - Easy to add new languages
 */

// ============================================
// RIGHT-TO-LEFT (RTL) CONSIDERATIONS
// ============================================

/*
 * AUTOMATIC (CSS Handles These):
 * ✓ Text alignment
 * ✓ Flexbox item order
 * ✓ Margin/padding with logical properties
 * 
 * MANUAL (Check When Adding Features):
 * ⚠ Icon positioning (if absolutely positioned)
 * ⚠ Transforms and rotations
 * ⚠ Float properties (deprecated, but if used)
 * ⚠ Box shadows (usually okay)
 * 
 * TESTING RTL:
 * 1. Open browser dev tools
 * 2. Change document.documentElement.dir = 'rtl'
 * 3. Verify layout looks correct
 * 4. Check form inputs align properly
 * 5. Verify lists are right-to-left
 */

// ============================================
// ADDING NEW TRANSLATION KEYS
// ============================================

/*
 * When you add a new feature, you must:
 * 
 * 1. Add the key to ALL language objects
 *    Don't just add to English!
 * 
 * 2. Use consistent naming:
 *    newFeatureTitle (not "titleNewFeature")
 * 
 * 3. Add to HTML:
 *    <div data-lang="newFeatureTitle">English Text</div>
 * 
 * 4. Script.js automatically translates it
 *    No code changes needed!
 * 
 * Example:
 * // In language.js
 * en: { newFeatureTitle: "New Feature" }
 * ar: { newFeatureTitle: "ميزة جديدة" }
 * fr: { newFeatureTitle: "Nouvelle Fonctionnalité" }
 * 
 * // In HTML
 * <h2 data-lang="newFeatureTitle">English Text</h2>
 * 
 * That's it! When user switches language, it updates automatically.
 */

// ============================================
// DEBUGGING TRANSLATION ISSUES
// ============================================

/*
 * Problem: Text shows as "undefined"
 * Solution: Check if key exists in language.js for that language
 * 
 * Problem: Text doesn't update when switching languages
 * Solution: Make sure you have data-lang attribute in HTML
 * 
 * Problem: RTL layout looks wrong
 * Solution: Use Firefox dev tools Inspector → Inspector → Show Browser Styles
 *           Look for direction/text-align/margin properties
 * 
 * Problem: Form input placeholder doesn't translate
 * Solution: Use data-lang-placeholder (not data-lang)
 * 
 * Debugging command in browser console:
 * console.log(translations); // See all translations
 * setLanguage('ar'); // Test Arabic
 */

// ============================================
// PERFORMANCE NOTES
// ============================================

/*
 * Language switching is instant because:
 * 1. No API calls needed
 * 2. All translations stored in memory
 * 3. DOM updates are cached
 * 
 * Memory usage:
 * - 3 languages ≈ 10 KB
 * - 10 languages ≈ 30 KB
 * (Not a concern for modern browsers)
 * 
 * Optimization tip:
 * If adding 20+ languages, consider lazy-loading
 * translations only when that language is selected.
 */

// ============================================
// FUTURE: DATABASE-STORED TRANSLATIONS
// ============================================

/*
 * When integrating Firebase/Supabase, you could:
 * 
 * 1. Store translations in database
 * 2. Load on app start
 * 3. Allow admin to edit translations
 * 4. Add new languages without code changes
 * 
 * Database structure:
 * 
 * {
 *   "language": "es",
 *   "keys": {
 *     "title": "MMPI-2 | Panel de control",
 *     "home": "Inicio",
 *     ...
 *   }
 * }
 */

// ============================================
// REFERENCES
// ============================================

/*
 * Related Files:
 * - language.js: Translation strings
 * - script.js: setLanguage() function
 * - styles.css: RTL/LTR CSS support
 * - index.html: data-lang attributes
 * 
 * Resources:
 * - MDN: Structural Markup and Right-to-Left Text
 * - W3C: Structural Markup and Right-to-Left Text in HTML
 * - www.w3.org/International/questions/qa-html-dir
 */
