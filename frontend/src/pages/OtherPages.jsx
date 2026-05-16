// ══════════════════════════════════════════
// FAMILY ACCESS PAGE
// ══════════════════════════════════════════
import React, { useState } from 'react'
import { useApp } from '../App.jsx'
import { Btn, Card, Badge, Toggle, SideCard, Eyebrow, Avatar, Divider } from '../components/UI.jsx'
import { FAMILY_MEMBERS, LANGUAGES } from '../lib/data.js'

const ROLE_COLORS = { carer: 'green', family: 'blue', emergency: 'red', invited: 'amber' }
const ROLE_LABELS = { carer: 'Primary Carer', family: 'Family Member', emergency: 'Emergency', invited: 'Invited' }

export function FamilyPage() {
  const { showToast } = useApp()
  const [members, setMembers] = useState(FAMILY_MEMBERS)
  const [sendLocation, setSendLocation] = useState(true)
  const [inactivityAlert, setInactivityAlert] = useState(true)
  const [carerSpeak, setCarerSpeak] = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ padding: '44px 48px', borderRight: '1px solid var(--border)' }}>
        <Eyebrow color="var(--purple)">Your Safety Network</Eyebrow>
        <h2 style={{ fontSize: 42, marginBottom: 10 }}>Family Access</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 500, marginBottom: 36, lineHeight: 1.65 }}>
          Manage who can help you communicate and who gets notified in an emergency.
        </p>

        {/* Members */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
            Active Members
          </div>
          {members.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', borderRadius: 'var(--r-lg)',
              background: 'var(--card)', border: '1px solid var(--border)',
              marginBottom: 9, transition: 'all var(--t-base)',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Avatar initials={m.initials} gradient={m.gradient} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{m.relation}</div>
              </div>
              <Badge color={ROLE_COLORS[m.role]}>{ROLE_LABELS[m.role]}</Badge>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Edit', 'Remove'].map(action => (
                  <button key={action} onClick={() => showToast(action === 'Remove' ? `Removed ${m.name}` : `Editing ${m.name}…`, action === 'Remove' ? 'warning' : 'default')}
                    style={{
                      padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border)',
                      background: 'transparent', color: action === 'Remove' ? 'var(--text-3)' : 'var(--text-3)',
                      fontSize: 11, cursor: 'pointer', transition: 'all var(--t-base)',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = action === 'Remove' ? 'var(--red)' : 'var(--border2)'; e.target.style.color = action === 'Remove' ? 'var(--red)' : 'var(--text)' }}
                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-3)' }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Invite */}
        <div onClick={() => showToast('📨 Invite link generated and copied!', 'success')}
          style={{
            border: '2px dashed var(--border2)', borderRadius: 'var(--r-lg)',
            padding: '22px', textAlign: 'center', cursor: 'pointer',
            transition: 'all var(--t-base)', marginBottom: 28,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'rgba(232,54,93,.04)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ fontSize: 26, marginBottom: 8 }}>+</div>
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Invite a family member, carer, or emergency contact</p>
        </div>

        {/* Emergency settings */}
        <div style={{ background: 'rgba(232,54,93,.06)', border: '1.5px solid rgba(232,54,93,.2)', borderRadius: 'var(--r-lg)', padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 18 }}>🚨 Emergency Settings</div>
          {[
            ['Send location with emergency alert', 'Emergency contacts receive your GPS location', sendLocation, setSendLocation],
            ['Alert on 4+ hours inactivity', "Notify carers if you haven't used SilentStage", inactivityAlert, setInactivityAlert],
            ['Allow carer to speak on my behalf', 'Primary Carer can use your voice clone if you cannot type', carerSpeak, setCarerSpeak],
          ].map(([title, desc, val, setter]) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{desc}</div>
              </div>
              <Toggle on={val} onChange={setter} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '44px 28px', background: 'rgba(13,13,26,.5)' }}>
        <SideCard title="Access Permissions" icon="🔐">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Action', 'Carer', 'Family'].map(h => (
                  <th key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', padding: '6px 0', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[['Speak using voice clone', true, false], ['Add quick phrases', true, true], ['View phrase history', true, true], ['Trigger emergency alert', true, true], ['Change voice settings', false, false], ['Delete voice clone', false, false]].map(([action, carer, family]) => (
                <tr key={action} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td style={{ fontSize: 12, color: 'var(--text-3)', padding: '7px 0' }}>{action}</td>
                  <td style={{ fontSize: 13, color: carer ? 'var(--green)' : 'var(--border2)', padding: '7px 6px' }}>{carer ? '✓' : '✗'}</td>
                  <td style={{ fontSize: 13, color: family ? 'var(--green)' : 'var(--border2)', padding: '7px 6px' }}>{family ? '✓' : '✗'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SideCard>
        <SideCard title="Privacy" icon="🔒">
          <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
            All voice data is encrypted at rest and in transit. SOC2, HIPAA and GDPR compliant.<br /><br />
            Your voice clone is never shared with family members without your consent.<br /><br />
            Every family member action is logged with timestamp and role.
          </p>
        </SideCard>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// SIGN LANGUAGE PAGE
// ══════════════════════════════════════════
export function SignLanguagePage() {
  const { showToast } = useApp()
  return (
    <div style={{ padding: '44px 48px', maxWidth: 900, animation: 'fadeUp .4s ease both' }}>
      {/* Coming soon banner */}
      <div style={{
        background: 'rgba(245,158,11,.06)', border: '1.5px solid rgba(245,158,11,.25)',
        borderRadius: 'var(--r-lg)', padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 36,
      }}>
        <span style={{ fontSize: 32, flexShrink: 0 }}>🤟</span>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--amber)', marginBottom: 6 }}>
            Sign Language Input — Future Plan C (Post-Hackathon)
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
            This feature was NOT built at the hackathon. We had only 24 hours and could not find a sufficiently comprehensive, labelled sign language dataset. An undertrained model that misidentifies signs could cause someone to say the wrong thing in a critical moment — which is worse than no feature at all. Below is our planned architecture for after the hackathon.
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: 40, marginBottom: 10 }}>Sign → Your Voice</h2>
      <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 560, marginBottom: 32, lineHeight: 1.65 }}>
        Make a sign in front of your camera. SilentStage recognises it and speaks the phrase in your cloned voice — instantly.
      </p>

      {/* Concept mockup */}
      <Card style={{ overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Concept Preview — How It Will Work</div>
          <Badge color="amber">Design Mockup Only</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '32px', borderRight: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{
              width: 180, height: 180, borderRadius: 14, background: 'var(--surf)',
              border: '2px dashed var(--border2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', position: 'relative',
            }}>
              {/* Corner guides */}
              {[['top:8px','left:8px','borderWidth:2px 0 0 2px'],['top:8px','right:8px','borderWidth:2px 2px 0 0'],['bottom:8px','left:8px','borderWidth:0 0 2px 2px'],['bottom:8px','right:8px','borderWidth:0 2px 2px 0']].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', width: 18, height: 18, borderColor: 'var(--amber)', borderStyle: 'solid', ...Object.fromEntries(pos.map(p => p.split(':'))) }} />
              ))}
              <div style={{ fontSize: 48, marginBottom: 8 }}>🤟</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Camera feed</div>
              <div style={{ fontSize: 10, color: 'var(--subtle)', marginTop: 3 }}>MediaPipe tracking</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Hand landmarks detected<br />
              <span style={{ color: 'var(--amber)' }}>21 points per hand · 30fps</span>
            </div>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
              Recognised Gesture
            </div>
            <div style={{ background: 'var(--surf)', borderRadius: 10, padding: '14px 16px', marginBottom: 14, borderLeft: '3px solid var(--amber)' }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>I need help please</div>
              <div style={{ fontSize: 11, color: 'var(--amber)' }}>Confidence: 94% · ASL Sign #47</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Btn size="sm" onClick={() => showToast('🎙 Sign → ElevenLabs TTS → Speaking in your voice!', 'success')}>▶ Speak This</Btn>
              <Btn variant="ghost" size="sm" onClick={() => showToast('✕ Sign marked as incorrect', 'default')}>✕ Wrong</Btn>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Languages planned:<br />
              <span style={{ color: 'var(--text)' }}>ASL · BSL · ISL · SSL (Sinhala Sign Language)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Roadmap */}
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Development Roadmap</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { phase: 'Phase A · Live Now', title: 'Text & Voice Input', desc: 'Type or speak weakened voice → ElevenLabs synthesises in your cloned voice in real time', color: 'green' },
          { phase: 'Phase B · 3–6 Months', title: 'Android & iOS Apps', desc: 'Native mobile apps with biometric login, offline phrases, push emergency alerts, smartwatch integration', color: 'amber' },
          { phase: 'Phase C · 6–12 Months', title: 'Sign Language Input', desc: 'MediaPipe Holistic + custom LSTM classifier. ASL, BSL, ISL, SSL. Partner with deaf advocacy orgs for dataset.', color: 'purple' },
          { phase: 'Phase D · 12+ Months', title: 'Full Language Expansion', desc: 'Sinhala, Tamil, Hindi UI + TTS. 70+ ElevenLabs languages. Regional sign language support.', color: 'blue' },
        ].map(({ phase, title, desc, color }) => (
          <Card key={title} style={{ padding: '20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>{phase}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 12 }}>{desc}</div>
            <Badge color={color}>{color === 'green' ? '✓ Live in v1' : color === 'amber' ? 'In Planning' : 'Future Plan'}</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ══════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════
export function SettingsPage() {
  const { user, logout, showToast, language, setLanguage } = useApp()
  const [stability, setStability]   = useState(75)
  const [similarity, setSimilarity] = useState(85)
  const [storeHistory, setStoreHistory] = useState(true)
  const [analytics, setAnalytics]       = useState(false)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 'calc(100vh - 64px)' }}>
      {/* Settings nav */}
      <div style={{ borderRight: '1px solid var(--border)', padding: '28px 16px', background: 'rgba(13,13,26,.5)' }}>
        {[['🎙 Voice Clone', true], ['🌍 Language', false], ['🔒 Privacy', false], ['🚨 Emergency', false], ['♿ Accessibility', false], ['👤 Account', false]].map(([label, active]) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 9, fontSize: 13, cursor: 'pointer',
            color: active ? 'var(--text)' : 'var(--text-3)',
            background: active ? 'var(--red-dim)' : 'transparent',
            border: active ? '1px solid rgba(232,54,93,.2)' : '1px solid transparent',
            marginBottom: 3, transition: 'all var(--t-base)',
          }}>
            {label}
          </div>
        ))}
        <Divider margin="20px 0" />
        <div onClick={() => { logout(); showToast('Signed out successfully', 'default') }}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, fontSize:13, cursor:'pointer', color:'var(--red)' }}>
          → Sign Out
        </div>
      </div>

      <div style={{ padding: '44px 48px', overflowY: 'auto' }}>

        {/* Voice Clone */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            🎙 Your Voice Clone
          </div>
          <Card style={{ padding: '20px 22px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16, border: '1.5px solid rgba(15,219,138,.2)' }}>
            <Avatar initials={user?.initials} gradient="linear-gradient(135deg,var(--red),var(--purple))" size={52} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{user?.voiceName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Voice ID: {user?.voiceId} · {user?.voiceDuration} training audio</div>
            </div>
            <Badge color="green">{user?.voiceSimilarity}% Similarity</Badge>
          </Card>
          {[['Stability', stability, setStability, 'Higher = more consistent; lower = more expressive'], ['Similarity Boost', similarity, setSimilarity, 'Higher = closer to your original voice']].map(([label, val, setter, desc]) => (
            <Card key={label} style={{ padding: '14px 18px', marginBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{desc}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)', minWidth: 32, textAlign: 'right' }}>{val}%</span>
                <input type="range" min={0} max={100} value={val} onChange={e => setter(Number(e.target.value))} style={{ width: 130, accentColor: 'var(--red)' }} />
              </div>
            </Card>
          ))}
        </section>

        {/* Language */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            🌍 Output Language
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {LANGUAGES.map(lang => {
              const active = language === lang.code
              const live   = lang.status === 'live'
              return (
                <div key={lang.code} onClick={() => { if (!live) { showToast(`${lang.name} coming in a future update`, 'warning'); return }; setLanguage(lang.code) }}
                  style={{
                    background: active ? 'var(--purple-dim)' : 'var(--card)',
                    border: `1.5px solid ${active ? 'rgba(155,109,255,.4)' : 'var(--border)'}`,
                    borderRadius: 'var(--r-lg)', padding: '14px', textAlign: 'center',
                    cursor: live ? 'pointer' : 'not-allowed',
                    opacity: live ? 1 : .45, transition: 'all var(--t-base)',
                  }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{lang.flag}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{lang.name}</div>
                  <Badge color={lang.status === 'live' ? 'green' : lang.status === 'soon' ? 'amber' : 'muted'} style={{ fontSize: 10 }}>
                    {lang.status === 'live' ? 'Live ✓' : lang.status === 'soon' ? 'Coming Soon' : 'Future'}
                  </Badge>
                </div>
              )
            })}
          </div>
        </section>

        {/* Privacy */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
            🔒 Privacy & Data
          </div>
          {[
            ['Store speech history', 'Save all spoken phrases for replay', storeHistory, setStoreHistory],
            ['Share usage analytics', 'Help improve SilentStage (anonymised)', analytics, setAnalytics],
          ].map(([title, desc, val, setter]) => (
            <Card key={title} style={{ padding: '14px 18px', marginBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div><div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{desc}</div></div>
              <Toggle on={val} onChange={setter} />
            </Card>
          ))}
          <Card style={{ padding: '14px 18px', marginBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 14, fontWeight: 600 }}>Delete all my data</div><div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>Permanently delete voice clone and all data from SilentStage and ElevenLabs</div></div>
            <Btn variant="danger" size="sm" onClick={() => showToast('⚠️ This action is irreversible. Please contact support.', 'error')}>
              Delete Data
            </Btn>
          </Card>
        </section>
      </div>
    </div>
  )
}

// Default exports for routing
export default FamilyPage
