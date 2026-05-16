import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'
import {
  Mic, Globe, Lock, AlertTriangle, Accessibility, User,
  ChevronRight, LogOut, Pencil, Check, X, ExternalLink,
} from 'lucide-react'
import clsx from 'clsx'

const LANGS = [
  { flag:'🇬🇧', name:'English',  tag:'Live',        cls:'live'   },
  { flag:'🇱🇰', name:'Sinhala',  tag:'Post-Hackathon',cls:'soon'   },
  { flag:'🇱🇰', name:'Tamil',    tag:'Post-Hackathon',cls:'soon'   },
  { flag:'🇮🇳', name:'Hindi',    tag:'Post-Hackathon',cls:'soon'   },
  { flag:'🇫🇷', name:'French',   tag:'Roadmap',     cls:'future' },
  { flag:'🇩🇪', name:'German',   tag:'Roadmap',     cls:'future' },
  { flag:'🇪🇸', name:'Spanish',  tag:'Roadmap',     cls:'future' },
  { flag:'🤟',  name:'Sign (ASL)',tag:'Phase 3+',    cls:'future' },
]

const NAV = ['Accessibility','Language','Privacy','Account']

export default function Settings() {
  const { signOut } = useAuthContext()
  const { user, logout, updateDisplayName, deleteAllData, voiceId, voiceName, voiceCreatedAt, voiceSettings, updateVoiceSettings, toast, accessibility, updateAccessibility, privacySettings, updatePrivacySettings } = useApp()
  const navigate = useNavigate()
  const [section, setSection] = useState('Accessibility')
  const [privToggles, setPrivToggles] = useState({ history: true, analytics: false })
  const [emToggles,   setEmToggles]   = useState({ location: true, inactivity: true })
  const [selLang, setSelLang] = useState('English')
  const [editingName,   setEditingName]   = useState(false)
  const [nameInput,     setNameInput]     = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const nameRef = useRef(null)

  const tog = (_obj, set, key) => set(p => ({ ...p, [key]: !p[key] }))

  // Format creation date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const ICONS = {
    'Voice Clone':   Mic,
    'Language':      Globe,
    'Privacy':       Lock,
    'Emergency':     AlertTriangle,
    'Accessibility': Accessibility,
    'Account':       User,
  }

  return (
    <div className="z-content screen-enter flex flex-col md:grid md:grid-cols-[200px_1fr] min-h-[calc(100vh-65px)]">

      {/* ── SIDE NAV (desktop) / TOP TAB STRIP (mobile) ── */}
      <aside className="md:border-r md:border-border md:px-4 md:py-8 md:bg-surf/40
                        border-b border-border bg-surf/40 md:border-b-0">
        {/* Mobile: horizontal scrollable tab strip */}
        <div className="flex md:hidden overflow-x-auto hide-scrollbar gap-1 px-3 py-2">
          {NAV.map(n => {
            const Icon = ICONS[n]
            return (
              <button
                key={n}
                onClick={() => setSection(n)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0',
                  section === n
                    ? 'bg-blue/10 text-ink border-blue/20'
                    : 'text-muted hover:bg-blue/5 hover:text-ink border-transparent'
                )}
              >
                <Icon size={13} />
                {n}
              </button>
            )
          })}
        </div>

        {/* Desktop: vertical nav */}
        <div className="hidden md:flex flex-col gap-1">
          {NAV.map(n => {
            const Icon = ICONS[n]
            return (
              <button
                key={n}
                onClick={() => setSection(n)}
                className={clsx(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                  section === n
                    ? 'bg-blue/8 text-ink border border-blue/20'
                    : 'text-muted hover:bg-blue/5 hover:text-ink border border-transparent'
                )}
              >
                <Icon size={15} />
                <span>{n}</span>
              </button>
            )
          })}
          <div className="mt-auto pt-6">
            <button
              onClick={() => { logout(); signOut() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm
                         text-red hover:bg-red/8 w-full text-left transition-all"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── BODY ── */}
      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 overflow-y-auto">

        {section === 'Language' && (
          <div>
            <SectionTitle icon={<Globe size={20} />}>Output Language</SectionTitle>
            <p className="text-sm text-muted mb-5">
              Version 1 (hackathon build) supports English only. Sinhala, Tamil and Hindi are
              top priorities for the post-hackathon roadmap.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {LANGS.map(l => {
                const disabled = l.cls !== 'live'
                return (
                  <button
                    key={l.name}
                    onClick={() => {
                      if (disabled) { toast(`${l.name} support is planned post-hackathon`); return }
                      setSelLang(l.name)
                    }}
                    className={clsx(
                      'p-4 rounded-xl border text-center transition-all',
                      selLang === l.name
                        ? 'border-blue/50 bg-blue/10'
                        : disabled
                          ? 'border-border bg-card opacity-50 cursor-not-allowed'
                          : 'border-border bg-card hover:border-border2'
                    )}
                  >
                    <div className="text-2xl mb-1.5">{l.flag}</div>
                    <div className="text-sm font-semibold">{l.name}</div>
                    <span className={clsx(
                      'text-[10px] px-2 py-0.5 rounded mt-1.5 inline-block',
                      l.cls === 'live'   ? 'bg-green/10 text-green'   :
                      l.cls === 'soon'   ? 'bg-amber/10 text-amber'   :
                                           'bg-subtle/50 text-muted'
                    )}>
                      {l.tag}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {section === 'Privacy' && (
          <div>
            <SectionTitle icon={<Lock size={20} />}>Privacy & Data</SectionTitle>

            <SettingRow
              title="Store speech history"
              desc="Save phrases you speak so they appear in history. Turn off to speak without any record."
            >
              <Toggle
                on={privacySettings.storeHistory}
                onToggle={() => {
                  const next = !privacySettings.storeHistory
                  updatePrivacySettings('storeHistory', next)
                  toast(next ? '✓ Speech history enabled' : '✓ Speech history disabled — nothing will be recorded')
                }}
              />
            </SettingRow>

            <SettingRow
              title="Share usage analytics"
              desc="Send anonymous usage data to help improve SpeakMe. No personal data or voice audio is included."
            >
              <Toggle
                on={privacySettings.analytics}
                onToggle={() => {
                  const next = !privacySettings.analytics
                  updatePrivacySettings('analytics', next)
                  toast(next ? '✓ Analytics enabled — thank you!' : '✓ Analytics disabled')
                }}
              />
            </SettingRow>

            {/* Delete data — two-step confirm */}
            <SettingRow
              title="Delete all my data"
              desc="Permanently removes your voice clone, speech history, and all app preferences from this device."
            >
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red font-semibold">Are you sure?</span>
                  <button
                    onClick={() => {
                      deleteAllData()
                      logout()
                      signOut()
                      toast('🗑 All data deleted. Signing you out…')
                    }}
                    className="px-3 py-1.5 bg-red text-white text-xs font-bold rounded-lg
                               hover:bg-red/80 transition-colors"
                  >
                    Yes, delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 border border-border text-muted text-xs rounded-lg
                               hover:text-ink hover:border-border2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-1.5 bg-red/8 border border-red/20 text-red text-xs font-bold
                             rounded-lg hover:bg-red/15 transition-colors"
                >
                  Delete Data
                </button>
              )}
            </SettingRow>

            <div className="mt-5 p-4 bg-surf rounded-xl border border-border text-xs text-muted leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Supabase is SOC 2, HIPAA and GDPR compliant.
              Your voice clone is never shared with third parties without your explicit consent.
            </div>
          </div>
        )}


        {section === 'Accessibility' && (
          <div>
            <SectionTitle icon={<Accessibility size={20} />}>Accessibility</SectionTitle>
            <p className="text-sm text-muted mb-5">Customise SpeakMe for your specific needs and abilities.</p>

            <SettingRow title="Larger text" desc="Increases all font sizes by ~20% for easier reading">
              <Toggle
                on={accessibility.largerText}
                onToggle={() => updateAccessibility('largerText', !accessibility.largerText)}
              />
            </SettingRow>

            <SettingRow title="High contrast" desc="Brightens text and borders for improved visibility">
              <Toggle
                on={accessibility.highContrast}
                onToggle={() => updateAccessibility('highContrast', !accessibility.highContrast)}
              />
            </SettingRow>

            <SettingRow title="Reduce motion" desc="Disables all animations and transitions">
              <Toggle
                on={accessibility.reduceMotion}
                onToggle={() => updateAccessibility('reduceMotion', !accessibility.reduceMotion)}
              />
            </SettingRow>

            <SettingRow
              title="Haptic feedback"
              desc={
                'vibrate' in navigator
                  ? 'Vibrate when a phrase is spoken (mobile)'
                  : 'Vibration not supported on this device'
              }
            >
              <Toggle
                on={accessibility.hapticFeedback}
                onToggle={() => {
                  if (!('vibrate' in navigator)) {
                    toast('⚠️ Haptic feedback is not supported on this device')
                    return
                  }
                  const next = !accessibility.hapticFeedback
                  updateAccessibility('hapticFeedback', next)
                  if (next) navigator.vibrate([80, 40, 80])
                }}
              />
            </SettingRow>

            {(accessibility.largerText || accessibility.highContrast || accessibility.reduceMotion || accessibility.hapticFeedback) && (
              <div className="mt-5 p-4 bg-blue/6 border border-blue/20 rounded-xl flex items-center justify-between gap-4">
                <p className="text-xs text-muted">
                  Your accessibility preferences are saved and apply across all pages.
                </p>
                <button
                  onClick={() => {
                    const off = { largerText: false, highContrast: false, reduceMotion: false, hapticFeedback: false }
                    Object.entries(off).forEach(([k, v]) => updateAccessibility(k, v))
                    toast('Accessibility settings reset')
                  }}
                  className="text-xs text-muted hover:text-red shrink-0 transition-colors"
                >
                  Reset all
                </button>
              </div>
            )}
          </div>
        )}

        {section === 'Account' && (
          <div>
            <SectionTitle icon={<User size={20} />}>Account</SectionTitle>

            {/* Profile card */}
            <div className="flex flex-wrap items-center gap-4 bg-card border border-border rounded-xl p-5 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue to-blue3
                              flex items-center justify-center font-display font-black text-xl text-bg shrink-0">
                {user?.initials}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-base">{user?.name}</div>
                <div className="text-xs text-muted truncate">{user?.email}</div>
              </div>
            </div>

            {/* Display name — inline editable */}
            <SettingRow title="Display name" desc="How your name appears across SpeakMe">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={nameRef}
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        updateDisplayName(nameInput)
                        setEditingName(false)
                        toast('✓ Display name updated')
                      }
                      if (e.key === 'Escape') setEditingName(false)
                    }}
                    className="px-3 py-1.5 bg-surf border border-blue/40 rounded-lg text-sm text-ink
                               focus:outline-none focus:border-blue/70 w-36"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      updateDisplayName(nameInput)
                      setEditingName(false)
                      toast('✓ Display name updated')
                    }}
                    className="p-1.5 rounded-lg bg-green/10 border border-green/25 text-green hover:bg-green/20 transition-colors"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="p-1.5 rounded-lg bg-red/8 border border-red/20 text-red hover:bg-red/15 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setNameInput(user?.name || ''); setEditingName(true) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted text-xs
                             rounded-lg hover:text-ink hover:border-border2 transition-all"
                >
                  <Pencil size={11} /> Edit
                </button>
              )}
            </SettingRow>

            {/* Email — read-only, managed by auth provider */}
            <SettingRow title="Email address" desc="Please contact support">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted max-w-[160px] truncate">{user?.email}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surf border border-border text-muted">
                  Read-only
                </span>
              </div>
            </SettingRow>

            {/* Password — managed by Asgardeo */}
            <SettingRow title="Password" desc="Change your password via your account">
              <a
                href="https://accounts.asgardeo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted text-xs
                           rounded-lg hover:text-ink hover:border-border2 transition-all"
              >
                Manage <ExternalLink size={11} />
              </a>
            </SettingRow>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2.5 font-display font-black text-2xl tracking-tight mb-5 pb-4 border-b border-border">
      {icon && <span className="text-muted">{icon}</span>}
      {children}
    </h2>
  )
}

function SettingRow({ title, desc, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-border last:border-0 gap-2 sm:gap-4">
      <div>
        <div className="text-sm font-semibold text-ink">{title}</div>
        <div className="text-xs text-muted mt-0.5">{desc}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={clsx('w-10 h-[22px] rounded-full relative transition-colors shrink-0', on ? 'bg-green' : 'bg-subtle')}
    >
      <span className={clsx('absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all', on ? 'left-[22px]' : 'left-[3px]')} />
    </button>
  )
}
