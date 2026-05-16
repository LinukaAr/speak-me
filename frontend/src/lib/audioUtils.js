// ── Audio File Utilities ────────────────────────
// Validation and processing utilities for audio files

// Constants
export const ACCEPTED_FORMATS = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/m4a']
export const ACCEPTED_EXTENSIONS = ['.mp3', '.wav', '.m4a']
export const MAX_FILE_SIZE_MB = 25
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

/**
 * Validate audio file format and size
 * @param {File} file - File object to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateAudioFile(file) {
  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    }
  }

  // Check MIME type
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format. Please upload MP3, WAV, or M4A files. Detected: ${file.type || 'unknown'}`,
    }
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension. Please upload files with .mp3, .wav, or .m4a extension. Detected: ${extension}`,
    }
  }

  return { valid: true }
}

/**
 * Get audio duration from blob
 * @param {Blob} blob - Audio blob
 * @returns {Promise<number>} Duration in seconds
 */
export function getAudioDuration(blob) {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const objectUrl = URL.createObjectURL(blob)
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(objectUrl)
      resolve(audio.duration)
    })
    
    audio.addEventListener('error', (e) => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load audio metadata'))
    })
    
    audio.src = objectUrl
  })
}

/**
 * Get quality indicator based on total audio duration
 * @param {number} totalDurationSeconds - Total duration in seconds
 * @returns {{level: string, message: string, color: string}}
 */
export function getQualityIndicator(totalDurationSeconds) {
  if (totalDurationSeconds < 3) {
    return {
      level: 'insufficient',
      message: 'Minimum 3 seconds required',
      color: 'red',
    }
  }
  
  if (totalDurationSeconds >= 3 && totalDurationSeconds < 60) {
    return {
      level: 'instant',
      message: 'Instant Clone (3-60 seconds)',
      color: 'amber',
    }
  }
  
  if (totalDurationSeconds >= 60 && totalDurationSeconds < 300) {
    return {
      level: 'good',
      message: 'Good Quality (1-5 minutes)',
      color: 'blue',
    }
  }
  
  if (totalDurationSeconds >= 1800) {
    return {
      level: 'professional',
      message: 'Professional Clone (30+ minutes)',
      color: 'green',
    }
  }
  
  return {
    level: 'standard',
    message: 'Standard Quality (5-30 minutes)',
    color: 'blue',
  }
}

/**
 * Format duration in MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Generate unique ID for audio file
 * @returns {string} Unique ID
 */
export function generateAudioFileId() {
  return `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
