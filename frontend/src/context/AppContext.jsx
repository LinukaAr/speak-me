import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export const PHRASES = [
  { id: 1,  icon: '💧', text: 'I need some water please',      cat: 'daily',     uses: 42, urgent: false },
  { id: 2,  icon: '🚨', text: 'Call for help immediately',     cat: 'emergency', uses: 8,  urgent: true  },
  { id: 3,  icon: '👍', text: "Yes, that's correct",           cat: 'daily',     uses: 38, urgent: false },
  { id: 4,  icon: '👎', text: "No, that's not right",          cat: 'daily',     uses: 29, urgent: false },
  { id: 5,  icon: '💊', text: "It's time for my medication",   cat: 'medical',   uses: 31, urgent: false },
  { id: 6,  icon: '😴', text: 'I need to rest now',            cat: 'daily',     uses: 22, urgent: false },
  { id: 7,  icon: '🏥', text: 'Please call the nurse',         cat: 'medical',   uses: 19, urgent: false },
  { id: 8,  icon: '😊', text: 'Thank you so much',             cat: 'social',    uses: 51, urgent: false },
  { id: 9,  icon: '🤕', text: "I'm in pain right now",         cat: 'emergency', uses: 14, urgent: true  },
  { id: 10, icon: '📞', text: 'Call my family please',         cat: 'emergency', uses: 6,  urgent: true  },
  { id: 11, icon: '🍽️', text: "I'm hungry, need food",         cat: 'daily',     uses: 25, urgent: false },
  { id: 12, icon: '❄️', text: "I'm cold, need a blanket",      cat: 'daily',     uses: 17, urgent: false },
  { id: 13, icon: '🌡️', text: 'I think I have a fever',        cat: 'medical',   uses: 11, urgent: false },
  { id: 14, icon: '👋', text: 'Good morning everyone!',        cat: 'social',    uses: 33, urgent: false },
  { id: 15, icon: '😣', text: "I can't breathe properly",      cat: 'emergency', uses: 4,  urgent: true  },
  { id: 16, icon: '📺', text: 'Please turn on the TV',         cat: 'daily',     uses: 16, urgent: false },
  { id: 17, icon: '🌿', text: "I'd like some fresh air",       cat: 'daily',     uses: 9,  urgent: false },
  { id: 18, icon: '👂', text: 'Can you repeat that please?',   cat: 'social',    uses: 28, urgent: false },
  { id: 19, icon: '🩺', text: 'I need to see a doctor',        cat: 'medical',   uses: 7,  urgent: false },
  { id: 20, icon: '🤝', text: 'Nice to meet you',              cat: 'social',    uses: 15, urgent: false },
]

export const FAMILY_MEMBERS = [
  { id: 1, name: 'Sarah Kumar',     relation: 'Daughter',          role: 'carer',     avatar: 'SK', color: 'from-red   to-red2',   online: true,  email: 'sarah@email.com'   },
  { id: 2, name: 'Michael Kumar',   relation: 'Son',               role: 'family',    avatar: 'MK', color: 'from-blue  to-blue',   online: true,  email: 'michael@email.com' },
  { id: 3, name: 'Dr. Priya Mendis',relation: 'Physician',         role: 'emergency', avatar: 'PM', color: 'from-red   to-red2',   online: false, email: 'priya@hospital.lk' },
  { id: 4, name: 'Rachel Perera',   relation: 'Friend',            role: 'invited',   avatar: 'RP', color: 'from-amber to-amber',  online: false, email: 'rachel@email.com'  },
]

export function AppProvider({ children }) {
  const [user,         setUser]         = useState(null)
  const [voiceId,      setVoiceId]      = useState(null)
  const [voiceName,    setVoiceName]    = useState('')
  const [speaking,     setSpeaking]     = useState(false)
  const [lastSpoken,   setLastSpoken]   = useState('')
  const [toasts,       setToasts]       = useState([])
  const [phrases,      setPhrases]      = useState(PHRASES)
  const [outputLang,   setOutputLang]   = useState('English')
  const [voiceArch,    setVoiceArch]    = useState({
    totalMinutes: 48, contributors: 6, clips: 23, similarity: 91, status: 'active'
  })

  const toast = useCallback((msg, type = 'default') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }, [])

  const login = useCallback((email, displayName) => {
    const name = displayName || email?.split('@')[0] || 'User'
    const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    setUser({ name, email, initials })
    setVoiceId(`v_${initials.toLowerCase()}_${Math.random().toString(36).slice(2, 8)}`)
    setVoiceName(name)
  }, [])

  const logout = useCallback(() => {
    setUser(null); setVoiceId(null); setVoiceName('')
  }, [])

  const simulateSpeak = useCallback((text) => {
    if (!text.trim()) return
    setSpeaking(true)
    setLastSpoken(text)
    setTimeout(() => setSpeaking(false), text.length * 60 + 800)
  }, [])

  const incrementPhrase = useCallback((id) => {
    setPhrases(p => p.map(ph => ph.id === id ? { ...ph, uses: ph.uses + 1 } : ph))
  }, [])

  return (
    <AppContext.Provider value={{
      user, login, logout,
      voiceId, voiceName, setVoiceId, setVoiceName,
      speaking, lastSpoken, simulateSpeak,
      toasts, toast,
      phrases, incrementPhrase,
      outputLang, setOutputLang,
      voiceArch, setVoiceArch,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
