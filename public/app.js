// public/app.js
// MMPI-2 Application Main Script
// Uses modular imports and Firebase integration

// --- Constants & Config ---
const KEY_INDEX = "mmpi2_user_index";
const FILE_KEY = name => `mmpi2_user_file_${encodeURIComponent(name)}`;

let useFirebase = false; // Toggle for Firebase

// --- DOM Helpers ---
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// --- Initialize Language Manager ---
let currentLang = localStorage.getItem('mmpi2_lang') || 'ar';

function setLanguage(lang) {
  if (window.languageManager) {
    window.languageManager.setLanguage(lang);
    currentLang = lang;
  }
}

// Custom Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toastArea');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  
  const iconHTML = type === 'success' 
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  el.innerHTML = `<div class="toast-icon">${iconHTML}</div><span style="font-weight:600; font-size:14px">${message}</span>`;
  container.appendChild(el);
  
  setTimeout(() => {
    el.style.animation = 'fadeOut 0.3s forwards';
    el.addEventListener('animationend', () => el.remove());
  }, 4000);
}

// View Navigation System
function switchView(viewId) {
  const sections = $$('.view-section');
  sections.forEach(sec => sec.classList.remove('active'));
  
  setTimeout(() => {
    const target = document.getElementById(viewId);
    if(target) target.classList.add('active');
  }, 50);

  if(viewId === 'prevUsers') renderPrev();
}

// --- Data Logic (localStorage with Firebase fallback) ---

function loadIndex() {
  try { 
    return JSON.parse(localStorage.getItem(KEY_INDEX)) || []; 
  } catch { 
    return []; 
  }
}

function saveIndex(arr) { 
  localStorage.setItem(KEY_INDEX, JSON.stringify(arr));
  
  // Also save to Firebase if available
  if (useFirebase && window.firebaseOps) {
    arr.forEach(user => {
      window.firebaseOps.saveUserInfo(user).catch(err => console.warn('Firebase sync error:', err));
    });
  }
}

function readUserFile(name) {
  const raw = localStorage.getItem(FILE_KEY(name));
  if(!raw) return null;
  try{ 
    return JSON.parse(raw); 
  } catch { 
    return null; 
  }
}

function writeUserFile(name, data) {
  localStorage.setItem(FILE_KEY(name), JSON.stringify(data));
  
  // Also save to Firebase if available
  if (useFirebase && window.firebaseOps) {
    window.firebaseOps.saveAssessment(name, data).catch(err => console.warn('Firebase sync error:', err));
  }
}

function removeUserFile(name) { 
  localStorage.removeItem(FILE_KEY(name));
}

// --- Event Listeners ---

// Language Switcher
const langSwitcher = document.getElementById('language-switcher');
if (langSwitcher) {
  langSwitcher.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
}

// Navigation
const btnHome = document.getElementById('btnHome');
if (btnHome) btnHome.addEventListener('click', () => switchView('welcome'));

const btnNew = document.getElementById('btnNew');
if (btnNew) btnNew.addEventListener('click', () => switchView('newUser'));

const btnPrev = document.getElementById('btnPrev');
if (btnPrev) btnPrev.addEventListener('click', () => switchView('prevUsers'));

const cancelNew = document.getElementById('cancelNew');
if (cancelNew) cancelNew.addEventListener('click', () => switchView('welcome'));

const cancelNew2 = document.getElementById('cancelNew2');
if (cancelNew2) cancelNew2.addEventListener('click', () => switchView('welcome'));

const closePrev = document.getElementById('closePrev');
if (closePrev) closePrev.addEventListener('click', () => switchView('welcome'));

// Create User
const createUser = document.getElementById('createUser');
if (createUser) {
  createUser.addEventListener('click', async () => {
    const name = document.getElementById('name')?.value.trim();
    const age = document.getElementById('age')?.value.trim();
    const folder = document.getElementById('folder')?.value.trim();
    const date = document.getElementById('date')?.value;
    const gender = document.getElementById('gender')?.value;

    const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];

    if(!name) return showToast(t.toastEnterName, "error");
    if(!age || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 200) return showToast(t.toastInvalidAge, "error");
    if(!folder) return showToast(t.toastEnterFolder, "error");
    if(!date) return showToast(t.toastEnterDate, "error");
    if(!gender) return showToast(t.toastEnterGender, "error");

    const index = loadIndex();
    if(index.some(u => u.name === name)) {
      return showToast(t.toastUserExists, "error");
    }

    const userInfo = { name, age: Number(age), folder_number: folder, date, gender };
    let questions = [];

    const userFile = { user_info: userInfo, questions };

    index.push(userInfo);
    saveIndex(index);
    writeUserFile(name, userFile);

    showToast(t.toastSuccess.replace('{name}', name));

    // Clear form
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const folderInput = document.getElementById('folder');
    const dateInput = document.getElementById('date');
    const genderInput = document.getElementById('gender');
    
    if (nameInput) nameInput.value = "";
    if (ageInput) ageInput.value = "";
    if (folderInput) folderInput.value = "";
    if (dateInput) dateInput.value = "";
    if (genderInput) genderInput.value = "";
    
    switchView('prevUsers');
  });
}

// Render List
function renderPrev() {
  const index = loadIndex();
  const listWrap = document.getElementById('listWrap');
  const emptyState = document.getElementById('emptyState');
  const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];
  
  if (!listWrap) return;
  
  listWrap.innerHTML = "";

  if(index.length === 0) { 
    if (emptyState) emptyState.classList.remove('hidden');
    listWrap.classList.add('hidden');
    return; 
  }
  
  if (emptyState) emptyState.classList.add('hidden');
  listWrap.classList.remove('hidden');

  index.forEach(u => {
    const file = readUserFile(u.name);
    let status = t.statusNew;
    let statusClass = "status-none";
    
    if(file && Array.isArray(file.questions)) {
      const answered = file.questions.filter(q => q.Answer === 'Yes' || q.Answer === 'No').length;
      const total = file.questions.length;
      if(total > 0 && answered === total) {
        status = t.statusCompleted;
        statusClass = "status-completed";
      } else if (answered > 0) {
        status = t.statusInProgress;
        statusClass = "status-progress";
      }
    }

    const encodedName = encodeURIComponent(u.name);
    
    const el = document.createElement("div");
    el.className = "user-item";
    el.onclick = (e) => {
      if(e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        const cb = el.querySelector('.custom-check');
        cb.checked = !cb.checked;
      }
    };

    el.innerHTML = `
      <div class="checkbox-wrapper">
        <input type="checkbox" class="custom-check sel" data-name="${encodedName}">
      </div>
      <div class="user-info" style="margin-right: 16px;">
        <div class="user-name">
          ${u.name}
          <span class="status-badge ${statusClass}">${status}</span>
        </div>
        <div class="user-meta">
          <span class="meta-bit" title="${t.age}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${u.age} ${t.ageYear}
          </span>
          <span class="meta-bit" title="${t.file}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            ${u.folder_number}
          </span>
          <span class="meta-bit" title="${t.date}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${u.date}
          </span>
          <span class="meta-bit">
            ${u.gender === 'Male' ? t.male : u.gender === 'Female' ? t.female : '-'}
          </span>
        </div>
      </div>
      <button class="btn btn-ghost btn-icon-only openOne" data-name="${encodedName}" title="${t.openFile}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;
    listWrap.appendChild(el);
  });

  $$('.openOne').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openSelected([decodeURIComponent(btn.dataset.name)]);
    };
  });
}

function getSelectedNames() {
  return Array.from(document.querySelectorAll('.sel:checked')).map(cb => decodeURIComponent(cb.dataset.name));
}

function openSelected(names) {
  const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];
  if(!names || names.length !== 1) return showToast(t.toastSelectSingleForOpen, "error");
  const name = names[0];
  window.location.href = `main.html?user=${encodeURIComponent(name)}`;
}

// Bulk Actions
const openUser = document.getElementById('openUser');
if (openUser) openUser.addEventListener('click', () => openSelected(getSelectedNames()));

const clearSel = document.getElementById('clearSel');
if (clearSel) clearSel.addEventListener('click', () => { 
  $$('.sel').forEach(cb => cb.checked = false); 
});

const exportSel = document.getElementById('exportSel');
if (exportSel) {
  exportSel.addEventListener('click', () => {
    const names = getSelectedNames();
    const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];
    if(names.length === 0) return showToast(t.toastSelectUserToExport, "error");
    
    names.forEach(name => {
      const data = readUserFile(name);
      if(!data) return;
      const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${name}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    });
    showToast(t.toastExported);
  });
}

const importBtn = document.getElementById('importBtn');
if (importBtn) importBtn.addEventListener('click', () => {
  const importInput = document.getElementById('importInput');
  if (importInput) importInput.click();
});

const importInput = document.getElementById('importInput');
if (importInput) {
  importInput.addEventListener('change', async e => {
    const files = Array.from(e.target.files || []);
    if(files.length === 0) return;
    
    const index = loadIndex();
    const existing = new Set(index.map(u => u.name));
    const imported = [];
    const skipped = [];
    const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];

    for(const f of files) {
      try {
        const text = await f.text();
        const json = JSON.parse(text);
        const info = json.user_info || {};
        const name = info.name;
        
        if(!name) { skipped.push(f.name); continue; }
        if(existing.has(name)) { skipped.push(name); continue; }
        
        writeUserFile(name, json);
        index.push(info);
        existing.add(name);
        imported.push(name);
      } catch {
        skipped.push(f.name);
      }
    }
    
    saveIndex(index);
    renderPrev();
    
    if(imported.length) showToast(t.toastImported.replace('{count}', imported.length));
    if(skipped.length) setTimeout(() => showToast(t.toastSkipped.replace('{count}', skipped.length), "error"), 1000);
    
    e.target.value = "";
  });
}

const copyUser = document.getElementById('copyUser');
if (copyUser) {
  copyUser.addEventListener('click', () => {
    const names = getSelectedNames();
    const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];
    if(names.length !== 1) return showToast(t.toastSelectSingleToCopy, "error");
    
    const original = names[0];
    const newName = prompt(t.enterNewName);
    
    if(!newName) return;
    
    const index = loadIndex();
    if(index.some(u => u.name === newName)) return showToast(t.toastNameExists, "error");
    
    const file = readUserFile(original);
    if(!file) return showToast(t.toastFileNotFound, "error");
    
    const copy = JSON.parse(JSON.stringify(file));
    copy.user_info.name = newName;
    
    writeUserFile(newName, copy);
    index.push(copy.user_info);
    saveIndex(index);
    
    renderPrev();
    showToast(t.toastCopied.replace('{original}', original).replace('{newName}', newName));
  });
}

const deleteUser = document.getElementById('deleteUser');
if (deleteUser) {
  deleteUser.addEventListener('click', () => {
    const names = getSelectedNames();
    const t = window.languageManager?.getCurrentTranslations() || window.translations[currentLang];
    if(names.length === 0) return showToast(t.toastSelectUserToDelete, "error");
    
    if(!confirm(t.confirmDelete.replace('{count}', names.length))) return;
    
    let index = loadIndex();
    names.forEach(n => removeUserFile(n));
    index = index.filter(u => !names.includes(u.name));
    
    saveIndex(index);
    renderPrev();
    showToast(t.toastDeleted);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  console.log('%c MMPI-2 App Loaded Successfully', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
  console.log('Language:', currentLang);
  console.log('Firebase:', useFirebase);
});
