// src/db/firebaseOperations.js
import { db } from '../config/firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const USER_DATA_COLLECTION = 'user_assessments';

/**
 * Save user basic information
 */
export async function saveUserInfo(userData) {
  try {
    const docRef = await addDoc(collection(db, USERS_COLLECTION), {
      name: userData.name,
      age: userData.age,
      folder_number: userData.folder_number,
      date: userData.date,
      gender: userData.gender,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
}

/**
 * Get all users
 */
export async function getAllUsers() {
  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
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
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
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
    const q = query(collection(db, USERS_COLLECTION), where('name', '==', userName));
    const querySnapshot = await getDocs(q);
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
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { id: userId, ...updates };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId) {
  try {
    // Delete associated assessment data
    const assessments = await getAssessmentsByUserId(userId);
    for (const assessment of assessments) {
      await deleteDoc(doc(db, USER_DATA_COLLECTION, assessment.id));
    }
    
    // Delete user
    await deleteDoc(doc(db, USERS_COLLECTION, userId));
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
    const docRef = await addDoc(collection(db, USER_DATA_COLLECTION), {
      userId: userId,
      user_info: assessmentData.user_info,
      questions: assessmentData.questions,
      status: assessmentData.status || 'new',
      progress: assessmentData.progress || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
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
    const q = query(collection(db, USER_DATA_COLLECTION), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
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
    const docRef = doc(db, USER_DATA_COLLECTION, assessmentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
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
    await deleteDoc(doc(db, USER_DATA_COLLECTION, assessmentId));
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
      averageAge: users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.age, 0) / users.length) : 0
    };

    // Get assessment statistics
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

export default {
  saveUserInfo,
  getAllUsers,
  getUserById,
  getUserByName,
  updateUser,
  deleteUser,
  saveAssessment,
  getAssessmentsByUserId,
  updateAssessment,
  deleteAssessment,
  getStatistics,
  backupToLocalStorage,
  getLocalStorageBackup
};
