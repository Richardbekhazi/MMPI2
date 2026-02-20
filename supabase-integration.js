/**
 * Supabase Integration Module (PostgreSQL Alternative)
 * 
 * Setup Instructions:
 * 1. Go to https://supabase.com
 * 2. Create new project
 * 3. Get your project URL and API key
 * 4. Run the SQL setup script in Supabase console
 * 5. Install: npm install @supabase/supabase-js
 */

// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_KEY = "your-anon-key-here";

// Initialize (requires supabase-js package)
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// For CDN usage:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
// Then access via: window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

let supabase = null;

function initializeSupabase() {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase initialized successfully");
    return supabase;
  } catch (error) {
    console.error("Supabase initialization error:", error);
    return null;
  }
}

// ============================================
// SQL SETUP (Run in Supabase console first)
// ============================================

const setupSQL = `
-- Create users_index table
CREATE TABLE IF NOT EXISTS users_index (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER NOT NULL,
  folder_number VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users_data table
CREATE TABLE IF NOT EXISTS users_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name VARCHAR(255) UNIQUE NOT NULL,
  user_info JSONB NOT NULL,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_name) REFERENCES users_index(name) ON DELETE CASCADE
);

-- Create backups table
CREATE TABLE IF NOT EXISTS backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_users INTEGER DEFAULT 0,
  completed_assessments INTEGER DEFAULT 0,
  in_progress_assessments INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_index_name ON users_index(name);
CREATE INDEX idx_users_data_user_name ON users_data(user_name);
CREATE INDEX idx_backups_created_at ON backups(created_at);
`;

// ============================================
// USER INDEX OPERATIONS
// ============================================

async function loadIndexFromSupabase() {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('users_index')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error loading index:", error);
    return [];
  }
}

async function saveIndexToSupabase(indexArray) {
  if (!supabase) return;

  try {
    for (const user of indexArray) {
      const { error } = await supabase
        .from('users_index')
        .upsert({
          name: user.name,
          age: user.age,
          folder_number: user.folder_number,
          date: user.date,
          gender: user.gender,
          updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

      if (error) throw error;
    }
    console.log("Index saved successfully");
  } catch (error) {
    console.error("Error saving index:", error);
  }
}

async function deleteUserFromIndexSupabase(name) {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('users_index')
      .delete()
      .eq('name', name);

    if (error) throw error;
    console.log(`User ${name} deleted from index`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

// ============================================
// USER FILE OPERATIONS
// ============================================

async function readUserFileFromSupabase(name) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('users_data')
      .select('user_info, questions')
      .eq('user_name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("User not found");
        return null;
      }
      throw error;
    }

    return {
      user_info: data.user_info,
      questions: data.questions
    };
  } catch (error) {
    console.error("Error reading user file:", error);
    return null;
  }
}

async function writeUserFileToSupabase(name, data) {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('users_data')
      .upsert({
        user_name: name,
        user_info: data.user_info,
        questions: data.questions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_name' });

    if (error) throw error;
    console.log(`User ${name} saved successfully`);
  } catch (error) {
    console.error("Error saving user file:", error);
  }
}

async function removeUserFileFromSupabase(name) {
  if (!supabase) return;

  try {
    const { error: dataError } = await supabase
      .from('users_data')
      .delete()
      .eq('user_name', name);

    const { error: indexError } = await supabase
      .from('users_index')
      .delete()
      .eq('name', name);

    if (dataError) throw dataError;
    if (indexError) throw indexError;

    console.log(`User ${name} removed`);
  } catch (error) {
    console.error("Error removing user:", error);
  }
}

// ============================================
// SMART HYBRID FUNCTIONS
// ============================================

async function createUserSmartly(name, userData, questions) {
  if (supabase) {
    // Save to index
    await supabase
      .from('users_index')
      .insert([{
        name: userData.name,
        age: userData.age,
        folder_number: userData.folder_number,
        date: userData.date,
        gender: userData.gender
      }]);

    // Save to data
    await writeUserFileToSupabase(name, {
      user_info: userData,
      questions: questions
    });
  } else {
    // Fallback to localStorage
    const index = loadIndex();
    index.push(userData);
    saveIndex(index);
    writeUserFile(name, { user_info: userData, questions });
  }
}

async function deleteUserSmartly(names) {
  if (supabase) {
    for (const name of names) {
      await removeUserFileFromSupabase(name);
    }
  } else {
    for (const name of names) {
      removeUserFile(name);
    }
    let index = loadIndex();
    index = index.filter(u => !names.includes(u.name));
    saveIndex(index);
  }
}

async function loadAllUsersSmartly() {
  if (supabase) {
    return await loadIndexFromSupabase();
  } else {
    return loadIndex();
  }
}

// ============================================
// BACKUP & RESTORE
// ============================================

async function backupToSupabase() {
  if (!supabase) {
    console.warn("Supabase not initialized");
    return;
  }

  try {
    const index = await loadIndexFromSupabase();
    const backup = {
      timestamp: new Date().toISOString(),
      totalUsers: index.length,
      version: "1.0.0",
      users: []
    };

    for (const user of index) {
      const userData = await readUserFileFromSupabase(user.name);
      if (userData) backup.users.push(userData);
    }

    const { data, error } = await supabase
      .from('backups')
      .insert([{ backup_data: backup }]);

    if (error) throw error;
    console.log("Backup completed successfully");
    return backup;
  } catch (error) {
    console.error("Backup failed:", error);
  }
}

async function restoreFromSupabaseBackup(backupId) {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from('backups')
      .select('backup_data')
      .eq('id', backupId)
      .single();

    if (error) throw error;

    const { backup_data: backup } = data;

    // Restore all users
    for (const userFile of backup.users) {
      await writeUserFileToSupabase(userFile.user_info.name, userFile);
    }

    console.log("Restore completed successfully");
    return true;
  } catch (error) {
    console.error("Restore failed:", error);
    return false;
  }
}

// ============================================
// STATISTICS
// ============================================

async function getUserStatisticsFromSupabase() {
  if (!supabase) return null;

  try {
    const index = await loadIndexFromSupabase();
    const stats = {
      totalUsers: index.length,
      maleCount: index.filter(u => u.gender === 'Male').length,
      femaleCount: index.filter(u => u.gender === 'Female').length,
      averageAge: index.reduce((sum, u) => sum + u.age, 0) / (index.length || 1),
      completedCount: 0,
      inProgressCount: 0,
      newCount: 0
    };

    // Count statuses
    for (const user of index) {
      const userData = await readUserFileFromSupabase(user.name);
      if (userData && userData.questions) {
        const answered = userData.questions.filter(q => q.Answer).length;
        const total = userData.questions.length;
        if (answered === total) {
          stats.completedCount++;
        } else if (answered > 0) {
          stats.inProgressCount++;
        } else {
          stats.newCount++;
        }
      }
    }

    // Save statistics
    await supabase
      .from('statistics')
      .insert([{
        total_users: stats.totalUsers,
        completed_assessments: stats.completedCount,
        in_progress_assessments: stats.inProgressCount
      }]);

    return stats;
  } catch (error) {
    console.error("Error getting statistics:", error);
    return null;
  }
}

// ============================================
// REAL-TIME SUBSCRIPTIONS (Supabase exclusive feature)
// ============================================

/**
 * Listen to real-time changes in users_index
 */
function subscribeToUserChanges(callback) {
  if (!supabase) return null;

  return supabase
    .from('users_index')
    .on('*', payload => {
      console.log('Change received!', payload);
      callback(payload);
    })
    .subscribe();
}

/**
 * Listen to specific user changes
 */
function subscribeToUserData(userName, callback) {
  if (!supabase) return null;

  return supabase
    .from('users_data')
    .on('UPDATE', payload => {
      if (payload.new.user_name === userName) {
        callback(payload.new);
      }
    })
    .subscribe();
}

// ============================================
// EXPORT & DOWNLOAD
// ============================================

async function exportAllDataAsJSON() {
  try {
    const index = await loadAllUsersSmartly();
    const allData = {
      exportDate: new Date().toISOString(),
      totalRecords: index.length,
      records: []
    };

    for (const user of index) {
      const userData = supabase
        ? await readUserFileFromSupabase(user.name)
        : readUserFile(user.name);
      allData.records.push(userData);
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mmpi2-supabase-export-${new Date().toISOString().split('T')[0]}.json`;
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
// AUTHENTICATION (Optional)
// ============================================

async function signUpUser(email, password) {
  if (!supabase) return { error: "Supabase not initialized" };

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

async function loginUser(email, password) {
  if (!supabase) return { error: "Supabase not initialized" };

  try {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
}

async function logoutUser() {
  if (!supabase) return { error: "Supabase not initialized" };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  supabase = initializeSupabase();
});

// Export for modular use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeSupabase,
    loadIndexFromSupabase,
    saveIndexToSupabase,
    readUserFileFromSupabase,
    writeUserFileToSupabase,
    removeUserFileFromSupabase,
    createUserSmartly,
    deleteUserSmartly,
    loadAllUsersSmartly,
    backupToSupabase,
    restoreFromSupabaseBackup,
    getUserStatisticsFromSupabase,
    subscribeToUserChanges,
    subscribeToUserData,
    exportAllDataAsJSON,
    signUpUser,
    loginUser,
    logoutUser
  };
}
