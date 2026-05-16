import React, { useState } from 'react'
import { useApp } from '../App.jsx'
import { Btn, Card, Badge, Eyebrow, SideCard } from '../components/UI.jsx'
import { AUDIO_SOURCES, SOURCE_TYPES, FAMILY_MEMBERS } from '../lib/data.js'

export default function ArchaeologyPage() {
  const { showToast } = useApp()
  const [selected, setSelected]   = useState(new Set(['s1', 's2', 's6']))
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded]   = useState(false)
  const [dragOver, setDragOver]   = useState(false)

  const toggle = id => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const handleUpload = async () => {
    setUploading(true)
    await new Promise(r => setTimeout(r, 2800))
    setUploaded(true)
    setUploading(false)
  }

  const qualityColors = { high: 'green', med: 'amber', low: 'muted' }
  const qualityLabels = { high: '★ High Quality', med: '◆ Medium Quality', low: '◇ Lower Quality' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 'calc(100vh - 64px)' }}>

      {/* MAIN */}
      <div style={{ padding: '44px 48px', borderRight: '1px solid var(--border)' }}>
        <Eyebrow color="var(--amber)">Voice Archaeology™</Eyebrow>
        <h2 style={{ fontSize: 42, marginBottom: 12 }}>Already lost<br />your voice?<br /><span style={{ color: 'var(--red)' }}>We'll find it.</span></h2>
        <p style={{ color: 'var(--text-2)', fontSize: 15, maxWidth: 520, marginBottom: 36, lineHeight: 1.65 }}>
          Your voice exists in old videos, voicemails, and WhatsApp messages. SpeakMe recovers it — even from just 3 seconds of audio.
        </p>

        {/* Summary (if already done) */}
        <div style={{
          background: 'var(--green-dim)', border: '1.5px solid rgba(15,219,138,.25)',
          borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 32,
          display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center',
        }}>
          {[['48m', 'Audio recovered'], ['6', 'Contributors'], ['23', 'Source clips'], ['91%', 'Similarity']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--green)' }}>{num}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
          <Badge color="green" style={{ marginLeft: 'auto' }}>✓ Professional Clone Active</Badge>
        </div>

        {/* Source picker */}
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
          Select All Audio Sources You Have
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {SOURCE_TYPES.map(src => {
            const isSel = selected.has(src.id)
            return (
              <div key={src.id} onClick={() => toggle(src.id)} style={{
                background: isSel ? 'rgba(232,54,93,.06)' : 'var(--card)',
                border: `1.5px solid ${isSel ? 'var(--red-glow)' : 'var(--border)'}`,
                borderRadius: 'var(--r-lg)', padding: '18px 18px',
                cursor: 'pointer', transition: 'all var(--t-base)',
                position: 'relative',
              }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--border2)' }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                {isSel && (
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--red)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                  }}>✓</div>
                )}
                <span style={{ fontSize: 26, display: 'block', marginBottom: 9 }}>{src.icon}</span>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{src.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 10 }}>{src.desc}</div>
                <Badge color={qualityColors[src.quality]} style={{ fontSize: 10 }}>
                  {qualityLabels[src.quality]}
                </Badge>
              </div>
            )
          })}
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload() }}
          onClick={handleUpload}
          style={{
            border: `2px dashed ${dragOver ? 'var(--red)' : uploaded ? 'rgba(15,219,138,.4)' : 'var(--border2)'}`,
            borderRadius: 'var(--r-lg)', padding: '36px', textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: dragOver ? 'rgba(232,54,93,.04)' : uploaded ? 'var(--green-dim)' : 'rgba(255,255,255,.01)',
            transition: 'all var(--t-base)', marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>{uploaded ? '✅' : '⬆'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            {uploaded ? 'All files processed!' : uploading ? 'Processing…' : 'Upload your audio or video files'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 14 }}>
            {uploaded ? '3 files · 34 minutes of clean voice audio extracted'
              : 'Drag and drop, or click to browse · Any format accepted'}
          </div>
          {!uploaded && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['MP3','MP4','WAV','M4A','MOV','AAC','OGG','WMA'].map(f => (
                <span key={f} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 6, background: 'var(--border2)', color: 'var(--text-3)', fontWeight: 600 }}>{f}</span>
              ))}
            </div>
          )}
          {uploading && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--amber)' }}>
              <span style={{ width:14,height:14,border:'2px solid rgba(245,158,11,.3)',borderTop:'2px solid var(--amber)',borderRadius:'50%',animation:'spin .8s linear infinite' }} />
              Extracting audio and removing background noise…
            </div>
          )}
        </div>

        {/* Family contributors */}
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Family Contributors</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[
            { name: 'Sarah (Daughter)', detail: '3 WhatsApp notes + birthday video', added: '+8m 22s', status: 'done' },
            { name: 'Michael (Son)', detail: '2 voicemails + graduation video', added: '+5m 41s', status: 'done' },
            { name: 'James (Friend)', detail: 'Checking group chats…', added: 'Pending', status: 'pending' },
          ].map(m => (
            <div key={m.name} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: 'var(--r-lg)',
              background: 'var(--card)', border: '1px solid var(--border)',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{m.detail}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: m.status === 'done' ? 'var(--green)' : 'var(--text-3)' }}>{m.added}</div>
              <Badge color={m.status === 'done' ? 'green' : 'amber'}>
                {m.status === 'done' ? '✓ Submitted' : '⏳ Pending'}
              </Badge>
            </div>
          ))}
        </div>
        <Btn variant="ghost" style={{ width: '100%', justifyContent: 'center', borderStyle: 'dashed', borderColor: 'var(--border2)' }}
          onClick={() => showToast('📨 Invite link copied to clipboard!', 'success')}>
          + Invite another family member
        </Btn>
      </div>

      {/* SIDEBAR */}
      <div style={{ padding: '44px 28px', background: 'rgba(13,13,26,.5)' }}>
        <SideCard title="Minimum Requirements" icon="⚡">
          {[['Instant Clone','3–60 seconds','green'],['Good Clone','1–5 minutes','amber'],['Pro Clone','30+ minutes','blue'],['Broadcast Grade','1–3 hours','purple']].map(([t,v,c]) => (
            <div key={t} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
              <span style={{ color:'var(--text-3)' }}>{t}</span>
              <span style={{ color:`var(--${c})`, fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </SideCard>

        <SideCard title="Audio Found" icon="📊">
          {[['WhatsApp notes','~12 min',85],['Birthday video','~4 min',55],['Zoom recording','~18 min',70]].map(([label,val,pct]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                <span style={{ color:'var(--text-3)' }}>{label}</span>
                <span style={{ color:'var(--green)' }}>{val}</span>
              </div>
              <div style={{ height:4, background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', background:'var(--green)', width:`${pct}%`, borderRadius:2 }} />
              </div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, paddingTop:10, borderTop:'1px solid var(--border)' }}>
            <span style={{ color:'var(--text-3)' }}>Total estimated</span>
            <span style={{ color:'var(--green)', fontWeight:700 }}>~34 minutes</span>
          </div>
        </SideCard>

        <SideCard title="Privacy" icon="🔒">
          <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
            All audio is encrypted in transit and at rest. Supabase is SOC 2, HIPAA and GDPR compliant.<br /><br />
            Raw training audio is deleted after your Voice ID is created. Only the Voice ID is retained.
          </p>
        </SideCard>

        <SideCard title="Pro Tips" icon="💡">
          <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.7 }}>
            Ask family members to search their phones for voice notes. WhatsApp notes are often the richest source.<br /><br />
            Video quality doesn't matter — only the audio track. Even grainy VHS footage can yield a usable voice sample.
          </p>
        </SideCard>
      </div>
    </div>
  )
}
