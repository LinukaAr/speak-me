// ── Supabase Client & Helpers ──────────────────────────────────
// Centralized Supabase integration for authentication, database, and storage

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're using Asgardeo for auth, not Supabase
    autoRefreshToken: false,
  },
})

// ── AUTHENTICATION HELPERS ──────────────────────────────────────

export const auth = {
  /**
   * Sign up a new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User's full name
   * @returns {Promise<{user, session, error}>}
   */
  signUp: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Create profile after sign up
      if (data.user) {
        await db.createProfile(data.user.id, {
          email: data.user.email,
          full_name: fullName,
          initials: getInitials(fullName),
        })
      }

      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error }
    }
  },

  /**
   * Sign in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user, session, error}>}
   */
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, session: data.session, error: null }
    } catch (error) {
      return { user: null, session: null, error }
    }
  },

  /**
   * Sign in with OAuth provider (Google, Apple, etc.)
   * @param {string} provider - OAuth provider name
   * @returns {Promise<{error}>}
   */
  signInWithOAuth: async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/speak`,
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<{error}>}
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<{error}>}
   */
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Get current session
   * @returns {Promise<{session, error}>}
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session: data.session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function
   * @returns {Object} Subscription object
   */
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// ── DATABASE HELPERS ────────────────────────────────────────────

export const db = {
  // ── PROFILES ──
  
  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<{profile, error}>}
   */
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Returns null if no rows, doesn't throw error

      if (error) throw error

      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  },

  /**
   * Create user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<{profile, error}>}
   */
  createProfile: async (userId, profileData) => {
    try {
      const { data, error} = await supabase
        .from('profiles')
        .insert({
          id: userId,
          ...profileData,
        })
        .select()
        .single()

      if (error) throw error

      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<{profile, error}>}
   */
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return { profile: data, error: null }
    } catch (error) {
      return { profile: null, error }
    }
  },

  // ── VOICE CLONES ──

  /**
   * Get all voice clones for a user
   * @param {string} userId - User ID
   * @returns {Promise<{voiceClones, error}>}
   */
  getVoiceClones: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { voiceClones: data, error: null }
    } catch (error) {
      return { voiceClones: [], error }
    }
  },

  /**
   * Create a new voice clone
   * @param {Object} voiceCloneData - Voice clone data
   * @returns {Promise<{voiceClone, error}>}
   */
  createVoiceClone: async (voiceCloneData) => {
    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .insert(voiceCloneData)
        .select()
        .single()

      if (error) throw error

      return { voiceClone: data, error: null }
    } catch (error) {
      return { voiceClone: null, error }
    }
  },

  /**
   * Get active voice clone for a user
   * @param {string} userId - User ID
   * @returns {Promise<{voiceClone, error}>}
   */
  getActiveVoiceClone: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle() // Returns null if no rows, doesn't throw error

      if (error) throw error

      return { voiceClone: data, error: null }
    } catch (error) {
      return { voiceClone: null, error }
    }
  },

  /**
   * Update voice clone
   * @param {string} id - Voice clone ID
   * @param {Object} updates - Updates
   * @returns {Promise<{voiceClone, error}>}
   */
  updateVoiceClone: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('voice_clones')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { voiceClone: data, error: null }
    } catch (error) {
      return { voiceClone: null, error }
    }
  },

  // ── VOICE SETTINGS ──

  /**
   * Get voice settings for a user
   * @param {string} userId - User ID
   * @returns {Promise<{settings, error}>}
   */
  getVoiceSettings: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('voice_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle() // Returns null if no rows, doesn't throw error

      if (error) throw error

      return { settings: data, error: null }
    } catch (error) {
      return { settings: null, error }
    }
  },

  /**
   * Upsert voice settings (insert or update)
   * @param {string} userId - User ID
   * @param {Object} settings - Settings object
   * @returns {Promise<{settings, error}>}
   */
  upsertVoiceSettings: async (userId, settings) => {
    try {
      const { data, error } = await supabase
        .from('voice_settings')
        .upsert({
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return { settings: data, error: null }
    } catch (error) {
      return { settings: null, error }
    }
  },

  // ── AUDIO RECORDINGS ──

  /**
   * Create audio recording metadata
   * @param {Object} recordingData - Recording data
   * @returns {Promise<{recording, error}>}
   */
  createAudioRecording: async (recordingData) => {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .insert(recordingData)
        .select()
        .single()

      if (error) throw error

      return { recording: data, error: null }
    } catch (error) {
      return { recording: null, error }
    }
  },

  /**
   * Get audio recordings for a voice clone
   * @param {string} voiceCloneId - Voice clone ID
   * @returns {Promise<{recordings, error}>}
   */
  getAudioRecordings: async (voiceCloneId) => {
    try {
      const { data, error } = await supabase
        .from('audio_recordings')
        .select('*')
        .eq('voice_clone_id', voiceCloneId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { recordings: data, error: null }
    } catch (error) {
      return { recordings: [], error }
    }
  },

  // ── CUSTOM PHRASES ──

  /**
   * Get custom phrases for a user
   * @param {string} userId - User ID
   * @returns {Promise<{phrases, error}>}
   */
  getCustomPhrases: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('custom_phrases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { phrases: data, error: null }
    } catch (error) {
      return { phrases: [], error }
    }
  },

  /**
   * Create custom phrase
   * @param {Object} phraseData - Phrase data
   * @returns {Promise<{phrase, error}>}
   */
  createCustomPhrase: async (phraseData) => {
    try {
      const { data, error } = await supabase
        .from('custom_phrases')
        .insert(phraseData)
        .select()
        .single()

      if (error) throw error

      return { phrase: data, error: null }
    } catch (error) {
      return { phrase: null, error }
    }
  },

  /**
   * Update custom phrase
   * @param {string} id - Phrase ID
   * @param {Object} updates - Updates
   * @returns {Promise<{phrase, error}>}
   */
  updateCustomPhrase: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('custom_phrases')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return { phrase: data, error: null }
    } catch (error) {
      return { phrase: null, error }
    }
  },

  /**
   * Delete custom phrase
   * @param {string} id - Phrase ID
   * @returns {Promise<{error}>}
   */
  deleteCustomPhrase: async (id) => {
    try {
      const { error } = await supabase
        .from('custom_phrases')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error }
    }
  },
}

// ── STORAGE HELPERS ─────────────────────────────────────────────

export const storage = {
  /**
   * Upload audio file to storage
   * @param {string} userId - User ID
   * @param {string} voiceCloneId - Voice clone ID
   * @param {File} file - Audio file
   * @returns {Promise<{path, error}>}
   */
  uploadAudio: async (userId, voiceCloneId, file) => {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const filePath = `${userId}/${voiceCloneId}/${fileName}`

      // Ensure we have the correct content type
      const contentType = file.type || 'audio/webm'

      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType, // Explicitly set content type
        })

      if (error) throw error

      return { path: data.path, error: null }
    } catch (error) {
      return { path: null, error }
    }
  },

  /**
   * Get public URL for audio file
   * @param {string} path - File path
   * @returns {Promise<{url, error}>}
   */
  getAudioUrl: async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .createSignedUrl(path, 3600) // 1 hour expiry

      if (error) throw error

      return { url: data.signedUrl, error: null }
    } catch (error) {
      return { url: null, error }
    }
  },

  /**
   * Delete audio file
   * @param {string} path - File path
   * @returns {Promise<{error}>}
   */
  deleteAudio: async (path) => {
    try {
      const { error } = await supabase.storage
        .from('audio-recordings')
        .remove([path])

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * List audio files for a user
   * @param {string} userId - User ID
   * @param {string} voiceCloneId - Voice clone ID (optional)
   * @returns {Promise<{files, error}>}
   */
  listUserAudio: async (userId, voiceCloneId = null) => {
    try {
      const path = voiceCloneId ? `${userId}/${voiceCloneId}` : userId

      const { data, error } = await supabase.storage
        .from('audio-recordings')
        .list(path)

      if (error) throw error

      return { files: data, error: null }
    } catch (error) {
      return { files: [], error }
    }
  },
}

// ── ERROR HANDLING UTILITIES ────────────────────────────────────

/**
 * Handle Supabase errors and return user-friendly messages
 * @param {Error} error - Supabase error
 * @returns {string} User-friendly error message
 */
export function handleSupabaseError(error) {
  if (!error) return 'An unknown error occurred'

  // Authentication errors
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.'
  }

  if (error.message?.includes('Email not confirmed')) {
    return 'Please confirm your email address before signing in.'
  }

  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists. Please sign in instead.'
  }

  if (error.message?.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.'
  }

  // Network errors
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return 'Network error. Please check your internet connection and try again.'
  }

  // Storage errors
  if (error.message?.includes('The resource already exists')) {
    return 'A file with this name already exists. Please rename and try again.'
  }

  if (error.message?.includes('Payload too large')) {
    return 'File is too large. Maximum file size is 50 MB.'
  }

  // Database errors
  if (error.code === 'PGRST116') {
    return 'No data found.'
  }

  if (error.code === '23505') {
    return 'This record already exists.'
  }

  // Generic error
  return error.message || 'An error occurred. Please try again.'
}

// ── UTILITY FUNCTIONS ───────────────────────────────────────────

/**
 * Get initials from full name
 * @param {string} fullName - Full name
 * @returns {string} Initials
 */
function getInitials(fullName) {
  if (!fullName) return '??'
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
