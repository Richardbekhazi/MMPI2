// src/languages/languageManager.js
import { translations } from './translations.js';

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem('mmpi2_lang') || 'ar';
    this.translations = translations;
    this.initializeLanguage();
  }

  /**
   * Initialize the language on page load
   */
  initializeLanguage() {
    this.setLanguage(this.currentLang);
  }

  /**
   * Set the language and update UI
   */
  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not found, falling back to Arabic`);
      lang = 'ar';
    }

    this.currentLang = lang;
    localStorage.setItem('mmpi2_lang', lang);

    // Update document attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update page title
    document.title = this.translations[lang].title;

    // Update all data-lang elements
    this.updateAllTranslations();
  }

  /**
   * Update all translated elements in the DOM
   */
  updateAllTranslations() {
    // Update text content
    const langElements = document.querySelectorAll('[data-lang]');
    langElements.forEach(el => {
      const key = el.getAttribute('data-lang');
      if (this.translations[this.currentLang][key]) {
        el.textContent = this.translations[this.currentLang][key];
      }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
    placeholderElements.forEach(el => {
      const key = el.getAttribute('data-lang-placeholder');
      if (this.translations[this.currentLang][key]) {
        el.placeholder = this.translations[this.currentLang][key];
      }
    });

    // Update titles
    const titleElements = document.querySelectorAll('[data-lang-title]');
    titleElements.forEach(el => {
      const key = el.getAttribute('data-lang-title');
      if (this.translations[this.currentLang][key]) {
        el.title = this.translations[this.currentLang][key];
      }
    });
  }

  /**
   * Get translation for a key
   */
  translate(key, replacements = {}) {
    let text = this.translations[this.currentLang][key] || key;
    
    // Replace placeholders like {count}, {name}, etc.
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });

    return text;
  }

  /**
   * Get all translations for current language
   */
  getCurrentTranslations() {
    return this.translations[this.currentLang];
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.translations).map(lang => ({
      code: lang,
      name: {
        ar: 'العربية',
        en: 'English',
        fr: 'Français'
      }[lang]
    }));
  }

  /**
   * Check if current language is RTL
   */
  isRTL() {
    return this.currentLang === 'ar';
  }

  /**
   * Get current language code
   */
  getCurrentLanguage() {
    return this.currentLang;
  }
}

// Create singleton instance
export const languageManager = new LanguageManager();
export default languageManager;
