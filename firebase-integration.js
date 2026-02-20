/**
 * Firebase Integration Module
 * Replace localStorage with Firebase Firestore database
 * 
 * Setup Instructions:
 * 1. Go to https://firebase.google.com
 * 2. Create a new project
 * 3. Create a Firestore database
 * 4. Copy your config and paste below
 * 5. Install Firebase: npm install firebase
 */

// ============================================
// FIREBASE CONFIGURATION (UPDATE WITH YOUR KEYS)
// ============================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ============================================
// FIREBASE INITIALIZATION
// ============================================

// Note: In production, import from CDN or bundler:
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";

// For now, ensure Firebase is loaded from CDN in your HTML:
// <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js"></script>

// ============================================
// WRAPPER FUNCTIONS (Replace localStorage calls)
// ============================================

// Initialize Firebase (call this once on app start)
function initializeFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log("Firebase initialized successfully");
    return db;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback to localStorage
    return null;
  }
}

let db = null;

// ============================================
// USER INDEX OPERATIONS
// ============================================

/**
 * Load all user index entries from Firestore
 * Replaces: localStorage.getItem(KEY_INDEX)
 */
async function loadIndexFromFirebase() {
  if (!db) return loadIndex(); // Fallback to localStorage
  
  try {
    const querySnapshot = await db.collection("users_index").getDocs();
    const index = [];
    querySnapshot.forEach((doc) => {
      index.push({ id: doc.id, ...doc.data() });
    });
    return index;
  } catch (error) {
    console.error("Error loading index:", error);
    return loadIndex(); // Fallback to localStorage
  }
}

/**
 * Save user index to Firestore
 * Replaces: localStorage.setItem(KEY_INDEX, JSON.stringify(arr))
 */
async function saveIndexToFirebase(index) {
  if (!db) {
    saveIndex(index); // Fallback to localStorage
    return;
  }

  try {
    const batch = db.batch();
    
    // Delete existing index
    const existing = await db.collection("users_index").getDocs();
    existing.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Add new index entries
    index.forEach((user) => {
      const docRef = db.collection("users_index").doc(user.name);
      batch.set(docRef, user);
    });
    
    await batch.commit();
    console.log("Index saved to Firebase");
  } catch (error) {
    console.error("Error saving index:", error);
    saveIndex(index); // Fallback
  }
}

// ============================================
// USER FILE OPERATIONS
// ============================================

/**
 * Read a specific user file from Firestore
 * Replaces: localStorage.getItem(FILE_KEY(name))
 */
async function readUserFileFromFirebase(name) {
  if (!db) return readUserFile(name); // Fallback
  
  try {
    const doc = await db.collection("users").doc(name).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error("Error reading user file:", error);
    return readUserFile(name); // Fallback
  }
}

/**
 * Write user file to Firestore
 * Replaces: localStorage.setItem(FILE_KEY(name), JSON.stringify(data))
 */
async function writeUserFileToFirebase(name, data) {
  if (!db) {
    writeUserFile(name, data); // Fallback
    return;
  }

  try {
    await db.collection("users").doc(name).set({
      ...data,
      updatedAt: new Date(),
      lastModified: firebase.firestore.Timestamp.now()
    });
    console.log(`User ${name} saved to Firebase`);
  } catch (error) {
    console.error("Error writing user file:", error);
    writeUserFile(name, data); // Fallback
  }
}

/**
 * Delete user file from Firestore
 * Replaces: localStorage.removeItem(FILE_KEY(name))
 */
async function removeUserFileFromFirebase(name) {
  if (!db) {
    removeUserFile(name); // Fallback
    return;
  }

  try {
    await db.collection("users").doc(name).delete();
    console.log(`User ${name} deleted from Firebase`);
  } catch (error) {
    console.error("Error deleting user file:", error);
    removeUserFile(name); // Fallback
  }
}

// ============================================
// HYBRID FUNCTIONS (Auto-detect and use Firebase or localStorage)
// ============================================

/**
 * Smart wrapper that tries Firebase first, falls back to localStorage
 */
async function createUserSmartly(name, userData, questions) {
  if (db) {
    // Firebase path
    const userFile = { user_info: userData, questions };
    await writeUserFileToFirebase(name, userFile);
    const index = await loadIndexFromFirebase();
    index.push(userData);
    await saveIndexToFirebase(index);
  } else {
    // Fallback to localStorage
    const userFile = { user_info: userData, questions };
    writeUserFile(name, userFile);
    const index = loadIndex();
    index.push(userData);
    saveIndex(index);
  }
}

/**
 * Smart delete function
 */
async function deleteUserSmartly(names) {
  if (db) {
    for (const name of names) {
      await removeUserFileFromFirebase(name);
    }
    let index = await loadIndexFromFirebase();
    index = index.filter(u => !names.includes(u.name));
    await saveIndexToFirebase(index);
  } else {
    for (const name of names) {
      removeUserFile(name);
    }
    let index = loadIndex();
    index = index.filter(u => !names.includes(u.name));
    saveIndex(index);
  }
}

/**
 * Smart load all users function
 */
async function loadAllUsersSmartly() {
  if (db) {
    return await loadIndexFromFirebase();
  } else {
    return loadIndex();
  }
}

// ============================================
// BACKUP & EXPORT/IMPORT WITH FIREBASE
// ============================================

/**
 * Backup all data to Firebase
 */
async function backupToFirebase() {
  if (!db) {
    console.warn("Firebase not initialized");
    return;
  }

  try {
    const index = await loadIndexFromFirebase();
    const backup = {
      timestamp: new Date().toISOString(),
      totalUsers: index.length,
      version: "1.0.0",
      users: []
    };

    for (const user of index) {
      const userFile = await readUserFileFromFirebase(user.name);
      backup.users.push(userFile);
    }

    await db.collection("backups").add({
      backup: backup,
      createdAt: firebase.firestore.Timestamp.now()
    });

    console.log("Backup completed successfully");
    return backup;
  } catch (error) {
    console.error("Backup failed:", error);
  }
}

/**
 * Restore from Firebase backup
 */
async function restoreFromFirebaseBackup(backupId) {
  if (!db) {
    console.warn("Firebase not initialized");
    return;
  }

  try {
    const backupDoc = await db.collection("backups").doc(backupId).get();
    if (!backupDoc.exists) {
      console.error("Backup not found");
      return;
    }

    const { backup } = backupDoc.data();
    const batch = db.batch();

    // Restore all users
    for (const user of backup.users) {
      const userRef = db.collection("users").doc(user.user_info.name);
      batch.set(userRef, user);

      const indexRef = db.collection("users_index").doc(user.user_info.name);
      batch.set(indexRef, user.user_info);
    }

    await batch.commit();
    console.log("Restore completed successfully");
    return true;
  } catch (error) {
    console.error("Restore failed:", error);
    return false;
  }
}

// ============================================
// STATISTICS & ANALYTICS
// ============================================

/**
 * Get statistics about all users
 */
async function getUserStatisticsFromFirebase() {
  if (!db) return null;

  try {
    const index = await loadIndexFromFirebase();
    const stats = {
      totalUsers: index.length,
      maleCount: index.filter(u => u.gender === 'Male').length,
      femaleCount: index.filter(u => u.gender === 'Female').length,
      averageAge: index.reduce((sum, u) => sum + u.age, 0) / (index.length || 1),
      completedCount: 0,
      inProgressCount: 0,
      newCount: 0
    };

    // Count status
    for (const user of index) {
      const userFile = await readUserFileFromFirebase(user.name);
      if (userFile && userFile.questions) {
        const answered = userFile.questions.filter(q => q.Answer).length;
        const total = userFile.questions.length;
        if (answered === total) {
          stats.completedCount++;
        } else if (answered > 0) {
          stats.inProgressCount++;
        } else {
          stats.newCount++;
        }
      }
    }

    return stats;
  } catch (error) {
    console.error("Error getting statistics:", error);
    return null;
  }
}

// ============================================
// EXPORT & DOWNLOAD
// ============================================

/**
 * Export all data as JSON file with Firebase data
 */
async function exportAllDataAsJSON() {
  try {
    const index = await loadAllUsersSmartly();
    const allData = {
      exportDate: new Date().toISOString(),
      totalRecords: index.length,
      records: []
    };

    for (const user of index) {
      const userData = db 
        ? await readUserFileFromFirebase(user.name)
        : readUserFile(user.name);
      allData.records.push(userData);
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mmpi2-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Export completed");
  } catch (error) {
    console.error("Export failed:", error);
  }
}

// ============================================
// INITIALIZATION
// ============================================

// Call this when your app starts
document.addEventListener('DOMContentLoaded', () => {
  db = initializeFirebase();
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeFirebase,
    loadIndexFromFirebase,
    saveIndexToFirebase,
    readUserFileFromFirebase,
    writeUserFileToFirebase,
    removeUserFileFromFirebase,
    createUserSmartly,
    deleteUserSmartly,
    loadAllUsersSmartly,
    backupToFirebase,
    restoreFromFirebaseBackup,
    getUserStatisticsFromFirebase,
    exportAllDataAsJSON
  };
}
