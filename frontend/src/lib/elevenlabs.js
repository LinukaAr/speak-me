// ── ElevenLabs API Integration ──────────────────
// Replace VITE_ELEVENLABS_API_KEY in .env with your real key

const API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
const BASE_URL = 'https://api.elevenlabs.io/v1'

const headers = () => ({
  'xi-api-key': API_KEY,
  'Content-Type': 'application/json',
})

// ── Clone voice from audio files ─────────────────
export async function cloneVoiceFromFiles(name, audioFiles) {
  console.log('📞 cloneVoiceFromFiles called')
  console.log('Name:', name)
  console.log('Audio files:', audioFiles)
  console.log('API Key configured:', !!API_KEY)
  console.log('API Key (first 10 chars):', API_KEY?.substring(0, 10))
  
  if (!API_KEY) {
    throw new Error('ElevenLabs API key not configured')
  }

  const form = new FormData()
  form.append('name', name)
  form.append('description', 'SilentStage voice banking')
  
  // Add each audio file to the form
  audioFiles.forEach((audioFile, index) => {
    const filename = audioFile.name || `audio_${index}.mp3`
    console.log(`Adding file ${index}:`, filename, 'Size:', audioFile.blob.size, 'Type:', audioFile.blob.type)
    form.append('files', audioFile.blob, filename)
  })

  console.log('🚀 Sending request to ElevenLabs...')
  console.log('URL:', `${BASE_URL}/voices/add`)
  
  const res = await fetch(`${BASE_URL}/voices/add`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  })
  
  console.log('📥 Response status:', res.status)
  console.log('📥 Response ok:', res.ok)
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    console.error('❌ ElevenLabs API error:', errorData)
    throw new Error(errorData.detail?.message || `Voice cloning failed: ${res.status}`)
  }
  
  const data = await res.json()
  
  return {
    voice_id: data.voice_id,
    name: name,
  }
}

// ── Clone voice from audio blobs (legacy) ────────
export async function cloneVoice(name, audioBlobs) {
  const form = new FormData()
  form.append('name', name)
  form.append('description', 'SpeakMe voice banking')
  audioBlobs.forEach((blob, i) => form.append('files', blob, `recording_${i}.mp3`))

  const res = await fetch(`${BASE_URL}/voices/add`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  })
  if (!res.ok) throw new Error(`Clone failed: ${res.status}`)
  const { voice_id } = await res.json()
  return voice_id
}

// ── Text-to-speech with cloned voice ─────────────
export async function synthesise(text, voiceId, settings = {}) {
  const { stability = 0.75, similarity_boost = 0.85, speed = 1.0 } = settings
  const res = await fetch(`${BASE_URL}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      text,
      model_id: 'eleven_turbo_v2',
      voice_settings: { stability, similarity_boost },
    }),
  })
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`)
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

// ── Audio isolation (noise removal) ──────────────
export async function isolateAudioFile(audioBlob) {
  if (!API_KEY) {
    throw new Error('ElevenLabs API key not configured')
  }

  const form = new FormData()
  form.append('audio', audioBlob, 'audio.mp3')
  
  const res = await fetch(`${BASE_URL}/audio-isolation`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.detail?.message || `Audio isolation failed: ${res.status}`)
  }
  
  return await res.blob()
}

// ── Audio isolation (legacy) ─────────────────────
export async function isolateAudio(audioBlob) {
  const form = new FormData()
  form.append('audio', audioBlob, 'audio.mp3')
  const res = await fetch(`${BASE_URL}/audio-isolation`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  })
  if (!res.ok) throw new Error(`Isolation failed: ${res.status}`)
  return await res.blob()
}

// ── Mock synthesise for demo (no API key needed) ──
export function mockSpeak(text) {
  return new Promise(resolve => {
    // Uses browser's built-in SpeechSynthesis as a demo fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      utt.rate = 0.95
      utt.pitch = 1.0
      window.speechSynthesis.speak(utt)
    }
    setTimeout(resolve, 800)
  })
}

// ── Validate API key ──────────────────────────────
export async function validateApiKey() {
  if (!API_KEY) {
    return { valid: false, error: 'API key not configured' }
  }

  try {
    const res = await fetch(`${BASE_URL}/user`, {
      headers: { 'xi-api-key': API_KEY },
    })
    
    if (res.ok) {
      return { valid: true }
    }
    
    if (res.status === 401) {
      return { valid: false, error: 'Invalid API key' }
    }
    
    return { valid: false, error: `API error: ${res.status}` }
  } catch (error) {
    return { valid: false, error: 'Network error - could not reach ElevenLabs API' }
  }
}

// ── Error handling utility ───────────────────────
export function handleApiError(error, response) {
  // Handle HTTP status codes
  if (response?.status === 401) {
    return 'Invalid API key. Please check your ElevenLabs API key in the .env file and restart the development server.'
  }
  
  if (response?.status === 402 || error?.message?.includes('402')) {
    return 'ElevenLabs account has no credits. Please add credits at https://elevenlabs.io/app/settings/billing or upgrade your plan.'
  }
  
  if (response?.status === 429) {
    return 'Rate limit exceeded. Please wait a few minutes before trying again. ElevenLabs has usage limits on API calls.'
  }
  
  if (response?.status === 500) {
    return 'ElevenLabs server error. The service may be temporarily unavailable. Please try again in a few moments.'
  }
  
  if (response?.status === 400) {
    return 'Invalid request. Please check that your audio files meet the requirements (MP3/WAV/M4A, max 25MB, at least 3 seconds).'
  }
  
  // Handle network errors
  if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
    return 'Network connection error. Please check your internet connection and try again.'
  }
  
  if (error?.name === 'AbortError') {
    return 'Request timeout. The operation took too long. Please try again with smaller files or check your connection.'
  }
  
  // Return the error message if available, otherwise a generic message
  return error?.message || 'An unexpected error occurred. Please try again.'
}
