// --- Constants & Config ---
const KEY_INDEX = "mmpi2_user_index";
const FILE_KEY = name => `mmpi2_user_file_${encodeURIComponent(name)}`;

// --- DOM Helpers ---
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// --- Language & Translation ---
let currentLang = 'ar';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-lang-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.title = translations[lang].title;
}


// Custom Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toastArea');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  
  // Icon based on type
  const iconHTML = type === 'success' 
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  el.innerHTML = `<div class="toast-icon">${iconHTML}</div><span style="font-weight:600; font-size:14px">${message}</span>`;
  
  container.appendChild(el);
  
  // Remove after 4 seconds
  setTimeout(() => {
    el.style.animation = 'fadeOut 0.3s forwards';
    el.addEventListener('animationend', () => el.remove());
  }, 4000);
}

// View Navigation System
function switchView(viewId) {
  const sections = $$('.view-section');
  sections.forEach(sec => {
    sec.classList.remove('active');
    // Subtle delay to allow CSS transitions if needed
  });
  
  setTimeout(() => {
     const target = document.getElementById(viewId);
     if(target) target.classList.add('active');
  }, 50);

  // If switching to list, render it
  if(viewId === 'prevUsers') renderPrev();
}

// --- Data Logic (Original Functionality Preserved) ---

function loadIndex(){
  try{ return JSON.parse(localStorage.getItem(KEY_INDEX)) || []; }catch{ return []; }
}
function saveIndex(arr){ localStorage.setItem(KEY_INDEX, JSON.stringify(arr)); }

function readUserFile(name){
  const raw = localStorage.getItem(FILE_KEY(name));
  if(!raw) return null;
  try{ return JSON.parse(raw); }catch{ return null; }
}
function writeUserFile(name, data){
  localStorage.setItem(FILE_KEY(name), JSON.stringify(data));
}
function removeUserFile(name){ localStorage.removeItem(FILE_KEY(name)); }

// --- Event Listeners ---

// Language Switcher
$('#language-switcher').onchange = (e) => {
  setLanguage(e.target.value);
};


// Navigation
$("#btnHome").onclick = () => switchView('welcome');
$("#btnNew").onclick  = () => switchView('newUser');
$("#btnPrev").onclick = () => switchView('prevUsers');
$("#cancelNew").onclick = () => switchView('welcome');

// Create User
$("#createUser").onclick = async () => {
  const name = $("#name").value.trim();
  const age = $("#age").value.trim();
  const folder = $("#folder").value.trim();
  const date = $("#date").value;
  const gender = $("#gender").value;

  if(!name){ return showToast(translations[currentLang].toastEnterName, "error"); }
  if(!age || isNaN(Number(age)) || Number(age) < 0 || Number(age) > 200){ return showToast(translations[currentLang].toastInvalidAge, "error"); }
  if(!folder){ return showToast(translations[currentLang].toastEnterFolder, "error"); }
  if(!date){ return showToast(translations[currentLang].toastEnterDate, "error"); }
  if(!gender){ return showToast(translations[currentLang].toastEnterGender, "error"); }

  const index = loadIndex();
  if(index.some(u => u.name === name)){
    return showToast(translations[currentLang].toastUserExists, "error");
  }

  const userInfo = { name, age: Number(age), folder_number: folder, date, gender };

  // Attempt to load questions mockup or empty
  let questions = [];
  try{
    const res = await fetch("Core/core_data.json");
    if(res.ok){
      const core = await res.json();
      questions = (core || []).map(item => ({
        "English Question Number": item["English Question Number"],
        "Arabic Question Number": item["Arabic Question Number"],
        "Y": item["Y"],
        "Question Text": item["Question Text"],
        "Answer": null
      }));
    }
  }catch(e){ /* Ignore */ }

  const userFile = { user_info: userInfo, questions };

  index.push(userInfo);
  saveIndex(index);
  writeUserFile(name, userFile);

  showToast(translations[currentLang].toastSuccess.replace('{name}', name));

  // Clear and redirect
  $("#name").value = "";
  $("#age").value = "";
  $("#folder").value = "";
  $("#date").value = "";
  $("#gender").value = "";
  
  switchView('prevUsers');
};

// Render List
function renderPrev(){
  const index = loadIndex();
  const listWrap = $("#listWrap");
  const emptyState = $("#emptyState");
  
  listWrap.innerHTML = "";

  if(index.length === 0){ 
    emptyState.classList.remove('hidden');
    listWrap.classList.add('hidden');
    return; 
  }
  
  emptyState.classList.add('hidden');
  listWrap.classList.remove('hidden');

  index.forEach(u => {
    const file = readUserFile(u.name);
    let status = translations[currentLang].statusNew;
    let statusClass = "status-none";
    
    if(file && Array.isArray(file.questions)){
      const answered = file.questions.filter(q => q.Answer === 'Yes' || q.Answer === 'No').length;
      const total = file.questions.length;
      if(total > 0 && answered === total) {
         status = translations[currentLang].statusCompleted; statusClass = "status-completed";
      } else if (answered > 0) {
         status = translations[currentLang].statusInProgress; statusClass = "status-progress";
      }
    }

    const encodedName = encodeURIComponent(u.name);
    
    const el = document.createElement("div");
    el.className = "user-item";
    // Click on item toggles checkbox
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
          <span class="meta-bit" title="${translations[currentLang].age}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${u.age} ${translations[currentLang].ageYear}
          </span>
          <span class="meta-bit" title="${translations[currentLang].file}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            ${u.folder_number}
          </span>
          <span class="meta-bit" title="${translations[currentLang].date}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${u.date}
          </span>
          <span class="meta-bit">
             ${u.gender === 'Male' ? translations[currentLang].male : u.gender === 'Female' ? translations[currentLang].female : '-'}
          </span>
        </div>
      </div>
      <button class="btn btn-ghost btn-icon-only openOne" data-name="${encodedName}" title="${translations[currentLang].openFile}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;
    listWrap.appendChild(el);
  });

  // Wire up single open buttons
  $$('.openOne').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      openSelected([decodeURIComponent(btn.dataset.name)]);
    };
  });
}

function getSelectedNames(){
  return Array.from(document.querySelectorAll('.sel:checked')).map(cb => decodeURIComponent(cb.dataset.name));
}

function openSelected(names){
  if(!names || names.length !== 1){ return showToast(translations[currentLang].toastSelectSingleForOpen, "error"); }
  const name = names[0];
  window.location.href = `main.html?user=${encodeURIComponent(name)}`;
}

// --- Bulk Actions ---

$("#openUser").onclick = () => openSelected(getSelectedNames());

$("#clearSel").onclick = () => { 
  $$('.sel').forEach(cb => cb.checked = false); 
};

$("#exportSel").onclick = () => {
  const names = getSelectedNames();
  if(names.length === 0){ return showToast(translations[currentLang].toastSelectUserToExport, "error"); }
  
  names.forEach(name => {
    const data = readUserFile(name);
    if(!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  showToast(translations[currentLang].toastExported);
};

$("#importBtn").onclick = () => $("#importInput").click();

$("#importInput").onchange = async e => {
  const files = Array.from(e.target.files || []);
  if(files.length === 0) return;
  
  const index = loadIndex();
  const existing = new Set(index.map(u => u.name));
  const imported = [];
  const skipped = [];

  for(const f of files){
    try{
      const text = await f.text();
      const json = JSON.parse(text);
      const info = json.user_info || {};
      const name = info.name;
      
      if(!name){ skipped.push(f.name); continue; }
      if(existing.has(name)){ skipped.push(name); continue; }
      
      writeUserFile(name, json);
      index.push(info); existing.add(name); imported.push(name);
    }catch{ skipped.push(f.name); }
  }
  
  saveIndex(index);
  renderPrev();
  
  if(imported.length) showToast(translations[currentLang].toastImported.replace('{count}', imported.length));
  if(skipped.length) setTimeout(() => showToast(translations[currentLang].toastSkipped.replace('{count}', skipped.length), "error"), 1000);
  
  e.target.value = "";
};

$("#copyUser").onclick = () => {
  const names = getSelectedNames();
  if(names.length !== 1){ return showToast(translations[currentLang].toastSelectSingleToCopy, "error"); }
  
  const original = names[0];
  const newName = prompt(translations[currentLang].enterNewName);
  
  if(!newName) return;
  
  const index = loadIndex();
  if(index.some(u => u.name === newName)){ return showToast(translations[currentLang].toastNameExists, "error"); }
  
  const file = readUserFile(original);
  if(!file) return showToast(translations[currentLang].toastFileNotFound, "error");
  
  const copy = JSON.parse(JSON.stringify(file));
  copy.user_info.name = newName;
  
  writeUserFile(newName, copy);
  index.push(copy.user_info); 
  saveIndex(index);
  
  renderPrev();
  showToast(translations[currentLang].toastCopied.replace('{original}', original).replace('{newName}', newName));
};

$("#deleteUser").onclick = () => {
  const names = getSelectedNames();
  if(names.length === 0){ return showToast(translations[currentLang].toastSelectUserToDelete, "error"); }
  
  if(!confirm(translations[currentLang].confirmDelete.replace('{count}', names.length))) return;
  
  let index = loadIndex();
  names.forEach(n => removeUserFile(n));
  index = index.filter(u => !names.includes(u.name));
  
  saveIndex(index);
  renderPrev();
  showToast(translations[currentLang].toastDeleted);
};

// Set initial language
setLanguage(currentLang);
