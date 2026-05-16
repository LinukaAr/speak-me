// ── QUICK PHRASES ──────────────────────────────
export const PHRASES = [
  { id: 'p1',  icon: '💧', text: 'I need some water please',      cat: 'daily',     uses: 42, emergency: false },
  { id: 'p2',  icon: '🚨', text: 'Call for help immediately',     cat: 'emergency', uses: 8,  emergency: true  },
  { id: 'p3',  icon: '👍', text: "Yes, that's correct",           cat: 'daily',     uses: 38, emergency: false },
  { id: 'p4',  icon: '👎', text: "No, that's not right",          cat: 'daily',     uses: 29, emergency: false },
  { id: 'p5',  icon: '💊', text: "It's time for my medication",   cat: 'medical',   uses: 31, emergency: false },
  { id: 'p6',  icon: '😴', text: 'I need to rest now',            cat: 'daily',     uses: 22, emergency: false },
  { id: 'p7',  icon: '🏥', text: 'Please call the nurse',         cat: 'medical',   uses: 19, emergency: false },
  { id: 'p8',  icon: '😊', text: 'Thank you so much',             cat: 'social',    uses: 51, emergency: false },
  { id: 'p9',  icon: '🤕', text: "I'm in pain right now",         cat: 'medical',   uses: 14, emergency: true  },
  { id: 'p10', icon: '📞', text: 'Call my family please',         cat: 'emergency', uses: 6,  emergency: true  },
  { id: 'p11', icon: '🍽️', text: "I'm hungry, I need some food",  cat: 'daily',     uses: 25, emergency: false },
  { id: 'p12', icon: '❄️', text: "I'm cold, need a blanket",      cat: 'daily',     uses: 17, emergency: false },
  { id: 'p13', icon: '🌡️', text: 'I think I have a fever',        cat: 'medical',   uses: 11, emergency: false },
  { id: 'p14', icon: '👋', text: 'Good morning everyone!',        cat: 'social',    uses: 33, emergency: false },
  { id: 'p15', icon: '😣', text: "I can't breathe properly",      cat: 'emergency', uses: 4,  emergency: true  },
  { id: 'p16', icon: '📺', text: 'Please turn on the television', cat: 'daily',     uses: 16, emergency: false },
  { id: 'p17', icon: '🌿', text: "I'd like some fresh air",       cat: 'daily',     uses: 9,  emergency: false },
  { id: 'p18', icon: '👂', text: 'Can you repeat that please?',   cat: 'social',    uses: 28, emergency: false },
]

// ── LANGUAGES ──────────────────────────────────
export const LANGUAGES = [
  { code: 'en',  flag: '🇬🇧', name: 'English',  status: 'live'   },
  { code: 'si',  flag: '🇱🇰', name: 'Sinhala',  status: 'soon'   },
  { code: 'ta',  flag: '🇱🇰', name: 'Tamil',    status: 'soon'   },
  { code: 'hi',  flag: '🇮🇳', name: 'Hindi',    status: 'soon'   },
  { code: 'fr',  flag: '🇫🇷', name: 'French',   status: 'future' },
  { code: 'de',  flag: '🇩🇪', name: 'German',   status: 'future' },
  { code: 'es',  flag: '🇪🇸', name: 'Spanish',  status: 'future' },
  { code: 'zh',  flag: '🇨🇳', name: 'Mandarin', status: 'future' },
]

// ── FAMILY MEMBERS ─────────────────────────────
export const FAMILY_MEMBERS = [
  { id: 'f1', name: 'Sarah Kumar',    relation: 'Daughter', role: 'carer',     status: 'active',  initials: 'S',  gradient: 'linear-gradient(135deg,#e8365d,#ff6b87)' },
  { id: 'f2', name: 'Michael Kumar',  relation: 'Son',      role: 'family',    status: 'active',  initials: 'M',  gradient: 'linear-gradient(135deg,#4080ff,#60a5fa)' },
  { id: 'f3', name: 'Dr. P. Mendis',  relation: 'Physician',role: 'emergency', status: 'active',  initials: 'DR', gradient: 'linear-gradient(135deg,#e8365d,#c42d4e)' },
  { id: 'f4', name: 'Rachel Perera',  relation: 'Friend',   role: 'family',    status: 'invited', initials: 'R',  gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
]

// ── AUDIO SOURCES (Voice Archaeology) ──────────
export const AUDIO_SOURCES = [
  { id: 'a1', icon: '📱', name: 'WhatsApp Voice Notes',  detail: '12 clips merged',        duration: '20m 26s', status: 'done' },
  { id: 'a2', icon: '🎥', name: 'Birthday Videos',       detail: '3 clips, voice segments', duration: '12m 10s', status: 'done' },
  { id: 'a3', icon: '💼', name: 'Zoom Recordings',       detail: '1 file, speaker isolated',duration: '8m 44s',  status: 'done' },
  { id: 'a4', icon: '📞', name: 'Old Voicemails',        detail: "Michael's phone · 2019",  duration: '5m 41s',  status: 'done' },
  { id: 'a5', icon: '🎬', name: 'Graduation Video',      detail: 'Michael · 2016',          duration: '1m 22s',  status: 'done' },
]

// ── SOURCE TYPES ────────────────────────────────
export const SOURCE_TYPES = [
  { id: 's1', icon: '📱', title: 'WhatsApp Voice Notes', desc: 'Voice notes to family — most abundant source', quality: 'high' },
  { id: 's2', icon: '🎥', title: 'Videos (Phone/Social)', desc: 'Birthday videos, events, TikToks, Instagram stories', quality: 'high' },
  { id: 's3', icon: '📞', title: 'Voicemails',            desc: 'Old voicemails on family phones. Even 10s works', quality: 'med' },
  { id: 's4', icon: '🎙', title: 'Podcasts / Interviews', desc: 'Podcast guest, interview, recorded talk — studio quality', quality: 'high' },
  { id: 's5', icon: '📼', title: 'Home Videos / VHS',     desc: 'Old VHS tapes, DVD home movies, digitised films', quality: 'low' },
  { id: 's6', icon: '💼', title: 'Zoom / Work Recordings',desc: 'Recorded meetings, presentations, webinars', quality: 'high' },
  { id: 's7', icon: '🎬', title: 'YouTube Videos',        desc: 'Any YouTube content where you speak', quality: 'high' },
  { id: 's8', icon: '📻', title: 'Radio / Audio',         desc: 'Radio appearances, sermons, lectures', quality: 'med' },
]

// ── SENTENCES FOR VOICE BANKING ─────────────────
export const BANK_SENTENCES = [
  'The quick brown fox jumps over the lazy dog.',
  'I love spending Sunday mornings with my family.',
  'The weather today is absolutely beautiful and clear.',
  'Please make sure to lock the door when you leave.',
  'My favourite book is sitting on the wooden shelf.',
  'She laughed so hard that her eyes began to water.',
  'Could you help me find a good restaurant nearby?',
  "I've always believed that kindness costs nothing.",
  'The children played until the sun set behind the hills.',
  "Thank you for everything you've done for me.",
]
