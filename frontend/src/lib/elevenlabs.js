// ── ElevenLabs API Integration ──────────────────
// Replace VITE_ELEVENLABS_API_KEY in .env with your real key

const API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY || ''
const BASE_URL = 'https://api.elevenlabs.io/v1'

const headers = () => ({
  'xi-api-key': API_KEY,
  'Content-Type': 'application/json',
})

// ── Clone voice from audio blobs ─────────────────
export async function cloneVoice(name, audioBlobs) {
  const form = new FormData()
  form.append('name', name)
  form.append('description', 'SilentStage voice banking')
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
