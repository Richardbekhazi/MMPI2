// public/firebaseOperations.js
// Firebase Database Operations
// Import and use these functions when Firebase is enabled

// Note: These functions require Firebase SDK and proper initialization
// To use these, ensure:
// 1. Firebase SDK is imported in index.html
// 2. useFirebase flag is set to true in app.js
// 3. .env file has valid Firebase credentials

const USERS_COLLECTION = 'users';
const USER_DATA_COLLECTION = 'user_assessments';

/**
 * Save user basic information to Firestore
 * @param {Object} userData - User data object
 * @param {string} userData.name - User's name
 * @param {number} userData.age - User's age
 * @param {string} userData.folder_number - File number
 * @param {string} userData.date - Assessment date
 * @param {string} userData.gender - Gender (Male/Female)
 */
export async function saveUserInfo(userData) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const docRef = await db.collection(USERS_COLLECTION).add({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
}

/**
 * Get all users from Firestore
 */
export async function getAllUsers() {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const querySnapshot = await db.collection(USERS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

/**
 * Get single user by ID
 */
export async function getUserById(userId) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const doc = await db.collection(USERS_COLLECTION).doc(userId).get();
    
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

/**
 * Get user by name
 */
export async function getUserByName(userName) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const querySnapshot = await db.collection(USERS_COLLECTION)
      .where('name', '==', userName)
      .get();
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by name:', error);
    throw error;
  }
}

/**
 * Update user information
 */
export async function updateUser(userId, updates) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    await db.collection(USERS_COLLECTION).doc(userId).update({
      ...updates,
      updatedAt: new Date()
    });
    return { id: userId, ...updates };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user and associated assessments
 */
export async function deleteUser(userId) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    
    // Delete associated assessment data
    const assessments = await getAssessmentsByUserId(userId);
    for (const assessment of assessments) {
      await db.collection(USER_DATA_COLLECTION).doc(assessment.id).delete();
    }
    
    // Delete user
    await db.collection(USERS_COLLECTION).doc(userId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Save assessment data for a user
 */
export async function saveAssessment(userId, assessmentData) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const docRef = await db.collection(USER_DATA_COLLECTION).add({
      userId: userId,
      user_info: assessmentData.user_info,
      questions: assessmentData.questions,
      status: assessmentData.status || 'new',
      progress: assessmentData.progress || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...assessmentData };
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
}

/**
 * Get assessment data for a user
 */
export async function getAssessmentsByUserId(userId) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    const querySnapshot = await db.collection(USER_DATA_COLLECTION)
      .where('userId', '==', userId)
      .get();
    
    const assessments = [];
    querySnapshot.forEach((doc) => {
      assessments.push({ id: doc.id, ...doc.data() });
    });
    return assessments;
  } catch (error) {
    console.error('Error getting assessments:', error);
    throw error;
  }
}

/**
 * Update assessment progress
 */
export async function updateAssessment(assessmentId, updates) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    await db.collection(USER_DATA_COLLECTION).doc(assessmentId).update({
      ...updates,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
}

/**
 * Delete assessment
 */
export async function deleteAssessment(assessmentId) {
  try {
    if (!window.firebase || !window.firebase.firestore) {
      throw new Error('Firebase not initialized');
    }
    
    const db = window.firebase.firestore();
    await db.collection(USER_DATA_COLLECTION).doc(assessmentId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
}

/**
 * Get statistics for all users
 */
export async function getStatistics() {
  try {
    const users = await getAllUsers();
    const stats = {
      totalUsers: users.length,
      maleCount: users.filter(u => u.gender === 'Male').length,
      femaleCount: users.filter(u => u.gender === 'Female').length,
      averageAge: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.age || 0), 0) / users.length) : 0
    };

    let completedCount = 0;
    let inProgressCount = 0;
    let newCount = 0;

    for (const user of users) {
      const assessments = await getAssessmentsByUserId(user.id);
      assessments.forEach(assessment => {
        if (assessment.status === 'completed') completedCount++;
        else if (assessment.status === 'in_progress') inProgressCount++;
        else if (assessment.status === 'new') newCount++;
      });
    }

    stats.completedCount = completedCount;
    stats.inProgressCount = inProgressCount;
    stats.newCount = newCount;

    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    throw error;
  }
}

/**
 * Backup all data to localStorage as fallback
 */
export async function backupToLocalStorage() {
  try {
    const users = await getAllUsers();
    const backup = {
      timestamp: new Date().toISOString(),
      users: users,
      count: users.length
    };
    localStorage.setItem('mmpi2_firebase_backup', JSON.stringify(backup));
    return backup;
  } catch (error) {
    console.error('Error backing up data:', error);
    throw error;
  }
}

/**
 * Get backup from localStorage
 */
export function getLocalStorageBackup() {
  try {
    const backup = localStorage.getItem('mmpi2_firebase_backup');
    return backup ? JSON.parse(backup) : null;
  } catch (error) {
    console.error('Error getting backup:', error);
    return null;
  }
}
