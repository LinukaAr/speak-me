import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'
import {
  Mic, Globe, Lock, AlertTriangle, Accessibility, User,
  ChevronRight, LogOut,
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

const NAV = ['Voice Clone','Language','Privacy','Emergency','Accessibility','Account']

export default function Settings() {
  const { signOut } = useAuthContext()
  const { user, logout, voiceId, voiceName, voiceCreatedAt, voiceSettings, updateVoiceSettings, toast } = useApp()
  const navigate = useNavigate()
  const [section, setSection] = useState('Voice Clone')
  const [privToggles, setPrivToggles] = useState({ history: true, analytics: false })
  const [emToggles,   setEmToggles]   = useState({ location: true, inactivity: true })
  const [selLang, setSelLang] = useState('English')

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

        {section === 'Voice Clone' && (
          <div>
            <SectionTitle icon={<Mic size={20} />}>Your Voice Clone</SectionTitle>

            {voiceId ? (
              <>
                {/* Clone card */}
                <div className="flex flex-wrap items-center gap-4 bg-green/6 border border-green/20
                                rounded-xl p-5 mb-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red to-purple
                                  flex items-center justify-center font-display font-black text-xl text-white">
                    {user?.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-base">{voiceName}</div>
                    <div className="text-xs text-muted mt-0.5">
                      Voice ID: {voiceId.slice(0, 12)}... · Created {formatDate(voiceCreatedAt)}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 bg-green/10 text-green border border-green/20 px-3 py-1.5 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green" />
                    Active
                  </span>
                </div>

                {[{ label:'Stability', val:voiceSettings.stability, help:'Higher = more consistent; lower = more expressive' },
                  { label:'Similarity Boost', val:voiceSettings.similarityBoost, help:'Higher = closer to original voice; lower = more creative' }
                ].map(({ label, val, help }) => (
                  <SettingRow key={label} title={label} desc={help}>
                    <div className="flex items-center gap-3">
                      <input type="range" min={0} max={100} value={val}
                        onChange={e => {
                          const key = label === 'Stability' ? 'stability' : 'similarityBoost'
                          updateVoiceSettings({ [key]: +e.target.value })
                        }}
                        className="w-32 accent-red" />
                      <span className="text-xs text-muted w-8 text-right">{val}%</span>
                    </div>
                  </SettingRow>
                ))}

                <SettingRow title="Update voice clone" desc="Add more recordings or create a new voice clone">
                  <button
                    onClick={() => { navigate('/voice-banking'); toast('🎙 Opening Voice Banking…') }}
                    className="px-4 py-1.5 bg-red/10 border border-red/25 text-red text-xs font-bold
                               rounded-lg hover:bg-red/18 transition-colors"
                  >
                    Voice Banking
                  </button>
                </SettingRow>
              </>
            ) : (
              <div className="bg-amber/6 border border-amber/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎙</div>
                <h3 className="font-display font-bold text-lg mb-2">No Voice Clone Yet</h3>
                <p className="text-sm text-muted mb-4">
                  Create your voice clone to start speaking with your own voice
                </p>
                <button
                  onClick={() => navigate('/voice-banking')}
                  className="px-5 py-2.5 bg-red text-white text-sm font-bold
                             rounded-xl hover:shadow-lg hover:shadow-red/30 transition-all"
                >
                  Clone Your Voice
                </button>
              </div>
            )}
          </div>
        )}

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
            {[
              { key:'history',   title:'Store speech history',      desc:'Save all spoken phrases for replay and history review' },
              { key:'analytics', title:'Share usage analytics',     desc:'Help improve SpeakMe with anonymised usage data'   },
            ].map(({ key, title, desc }) => (
              <SettingRow key={key} title={title} desc={desc}>
                <Toggle on={privToggles[key]} onToggle={() => tog(privToggles, setPrivToggles, key)} />
              </SettingRow>
            ))}
            <SettingRow title="Delete all my data" desc="Permanently delete your voice clone and all stored data">
              <button
                onClick={() => toast('⚠️ This action is irreversible. Confirmation email sent.')}
                className="px-4 py-1.5 bg-red/8 border border-red/20 text-red text-xs font-bold
                           rounded-lg hover:bg-red/15 transition-colors"
              >
                Delete Data
              </button>
            </SettingRow>
            <div className="mt-5 p-4 bg-surf rounded-xl border border-border text-xs text-muted leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Supabase is SOC 2, HIPAA and GDPR compliant.
              Your voice clone is never shared with third parties without your explicit consent.
            </div>
          </div>
        )}

        {section === 'Emergency' && (
          <div>
            <SectionTitle icon={<AlertTriangle size={20} />}>Emergency Settings</SectionTitle>
            {[
              { key:'location',   title:'Send location with alert',   desc:'Emergency contacts receive your GPS location when alert fires' },
              { key:'inactivity', title:'Alert on 4+ hours inactivity',desc:"Notify Primary Carer if you haven't used SpeakMe in 4 hours" },
            ].map(({ key, title, desc }) => (
              <SettingRow key={key} title={title} desc={desc}>
                <Toggle on={emToggles[key]} onToggle={() => tog(emToggles, setEmToggles, key)} />
              </SettingRow>
            ))}
            <button
              onClick={() => toast('🚨 TEST ALERT SENT — All emergency contacts notified (test mode)')}
              className="mt-4 px-5 py-2.5 bg-red/10 border border-red/25 text-red text-sm font-bold
                         rounded-xl hover:bg-red/18 transition-colors"
            >
              Send Test Alert
            </button>
          </div>
        )}

        {section === 'Accessibility' && (
          <div>
            <SectionTitle icon={<Accessibility size={20} />}>Accessibility</SectionTitle>
            <p className="text-sm text-muted mb-5">Customise SpeakMe for your specific needs and abilities.</p>
            {[['Larger text mode','Increase all font sizes for easier reading'],
              ['High contrast mode','Increase colour contrast for visual accessibility'],
              ['Reduce motion','Disable animations and transitions'],
              ['Haptic feedback','Vibrate on phrase playback (mobile)'],
            ].map(([t,d]) => (
              <SettingRow key={t} title={t} desc={d}>
                <Toggle on={false} onToggle={() => toast(`${t} toggled`)} />
              </SettingRow>
            ))}
          </div>
        )}

        {section === 'Account' && (
          <div>
            <SectionTitle icon={<User size={20} />}>Account</SectionTitle>
            <div className="flex flex-wrap items-center gap-4 bg-card border border-border rounded-xl p-5 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue to-blue3
                              flex items-center justify-center font-display font-black text-xl text-bg">
                {user?.initials}
              </div>
              <div>
                <div className="font-display font-bold text-base">{user?.name}</div>
                <div className="text-xs text-muted">{user?.email}</div>
              </div>
            </div>
            {[['Change display name','Edit how your name appears across SpeakMe'],
              ['Change email address','Update the email used for login and alerts'],
              ['Change password','Update your account password'],
            ].map(([t,d]) => (
              <SettingRow key={t} title={t} desc={d}>
                <button onClick={() => toast(`${t} dialog — connect Supabase Auth`)}
                  className="px-3 py-1.5 border border-border text-muted text-xs rounded-lg hover:text-ink hover:border-border2 transition-all">
                  Edit
                </button>
              </SettingRow>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              <button
                onClick={() => { logout(); signOut() }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red/10 border border-red/25 text-red text-sm font-bold
                           rounded-xl hover:bg-red/18 transition-colors"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
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
