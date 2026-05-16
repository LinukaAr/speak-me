import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useApp } from '@/context/AppContext'
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
  const { user, logout, voiceName, toast } = useApp()
  const navigate = useNavigate()
  const [section, setSection] = useState('Voice Clone')
  const [stability, setStability] = useState(75)
  const [similarity, setSimilarity] = useState(85)
  const [privToggles, setPrivToggles] = useState({ history: true, analytics: false })
  const [emToggles,   setEmToggles]   = useState({ location: true, inactivity: true })
  const [selLang, setSelLang] = useState('English')

  const tog = (_obj, set, key) => set(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="z-content screen-enter grid grid-cols-[200px_1fr] min-h-[calc(100vh-65px)]">

      {/* ── SIDE NAV ── */}
      <aside className="border-r border-border px-4 py-8 bg-surf/40">
        <div className="flex flex-col gap-1">
          {NAV.map(n => (
            <button
              key={n}
              onClick={() => setSection(n)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left',
                section === n
                  ? 'bg-red/8 text-ink border border-red/15'
                  : 'text-muted hover:bg-white/4 hover:text-ink border border-transparent'
              )}
            >
              {{'Voice Clone':'🎙','Language':'🌍','Privacy':'🔒','Emergency':'🚨','Accessibility':'♿','Account':'👤'}[n]}
              <span className="ml-1">{n}</span>
            </button>
          ))}
          <div className="mt-auto pt-6">
            <button
              onClick={() => { logout(); signOut() }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm
                         text-red hover:bg-red/8 w-full text-left transition-all"
            >
              → Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── BODY ── */}
      <div className="px-10 py-8 overflow-y-auto">

        {section === 'Voice Clone' && (
          <div>
            <SectionTitle>🎙 Your Voice Clone</SectionTitle>

            {/* Clone card */}
            <div className="flex items-center gap-4 bg-green/6 border border-green/20
                            rounded-xl p-5 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red to-purple
                              flex items-center justify-center font-display font-black text-xl text-white">
                {user?.initials}
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-base">{voiceName} — Professional Clone</div>
                <div className="text-xs text-muted mt-0.5">Voice ID: v_ak_8x7f2 · 48m training audio · Created May 16, 2026</div>
              </div>
              <span className="bg-green/10 text-green border border-green/20 px-3 py-1.5 rounded-full text-xs font-bold">
                91% Similarity
              </span>
            </div>

            {[{ label:'Stability', val:stability, set:setStability, help:'Higher = more consistent; lower = more expressive' },
              { label:'Similarity Boost', val:similarity, set:setSimilarity, help:'Higher = closer to original voice; lower = more creative' }
            ].map(({ label, val, set, help }) => (
              <SettingRow key={label} title={label} desc={help}>
                <div className="flex items-center gap-3">
                  <input type="range" min={0} max={100} value={val}
                    onChange={e => set(+e.target.value)}
                    className="w-32 accent-red" />
                  <span className="text-xs text-muted w-8 text-right">{val}%</span>
                </div>
              </SettingRow>
            ))}

            <SettingRow title="Re-train voice clone" desc="Add more recordings to improve similarity score">
              <button
                onClick={() => { navigate('/archaeology'); toast('🔍 Adding more audio via Voice Archaeology…') }}
                className="px-4 py-1.5 bg-red/10 border border-red/25 text-red text-xs font-bold
                           rounded-lg hover:bg-red/18 transition-colors"
              >
                Add Audio
              </button>
            </SettingRow>
          </div>
        )}

        {section === 'Language' && (
          <div>
            <SectionTitle>🌍 Output Language</SectionTitle>
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
                        ? 'border-purple/50 bg-purple/10'
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
            <SectionTitle>🔒 Privacy & Data</SectionTitle>
            {[
              { key:'history',   title:'Store speech history',      desc:'Save all spoken phrases for replay and history review' },
              { key:'analytics', title:'Share usage analytics',     desc:'Help improve SilentStage with anonymised usage data'   },
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
            <SectionTitle>🚨 Emergency Settings</SectionTitle>
            {[
              { key:'location',   title:'Send location with alert',   desc:'Emergency contacts receive your GPS location when alert fires' },
              { key:'inactivity', title:'Alert on 4+ hours inactivity',desc:"Notify Primary Carer if you haven't used SilentStage in 4 hours" },
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
            <SectionTitle>♿ Accessibility</SectionTitle>
            <p className="text-sm text-muted mb-5">Customise SilentStage for your specific needs and abilities.</p>
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
            <SectionTitle>👤 Account</SectionTitle>
            <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red to-purple
                              flex items-center justify-center font-display font-black text-xl text-white">
                {user?.initials}
              </div>
              <div>
                <div className="font-display font-bold text-base">{user?.name}</div>
                <div className="text-xs text-muted">{user?.email}</div>
              </div>
            </div>
            {[['Change display name','Edit how your name appears across SilentStage'],
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
                className="px-5 py-2.5 bg-red/10 border border-red/25 text-red text-sm font-bold
                           rounded-xl hover:bg-red/18 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h2 className="font-display font-black text-2xl tracking-tight mb-5 pb-4 border-b border-border">{children}</h2>
}

function SettingRow({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0 gap-4">
      <div>
        <div className="text-sm font-semibold text-ink">{title}</div>
        <div className="text-xs text-muted mt-0.5">{desc}</div>
      </div>
      {children}
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
