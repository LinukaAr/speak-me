import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import clsx from 'clsx'

const SOURCES = [
  { id:'wa', icon:'📱', title:'WhatsApp Voice Notes',   desc:'Voice notes sent to family or friends — often the richest source.', quality:'High',   clips:12, mins:'20m 26s', done:true  },
  { id:'vd', icon:'🎥', title:'Videos (Phone/Social)',  desc:'Birthday, events, TikToks, Instagram stories where you speak.',     quality:'High',   clips:3,  mins:'12m 10s', done:true  },
  { id:'vm', icon:'📞', title:'Voicemails',             desc:'Old voicemails on family phones — even a 10-second greeting works.', quality:'Medium', clips:2,  mins:'5m 41s',  done:true  },
  { id:'zm', icon:'💼', title:'Zoom / Meetings',        desc:'Recorded meetings, presentations, or webinars.',                    quality:'High',   clips:1,  mins:'8m 44s',  done:true  },
  { id:'yt', icon:'🎬', title:'YouTube / Online Video', desc:'Any YouTube content or online interviews where you speak.',         quality:'High',   clips:0,  mins:'—',       done:false },
  { id:'rd', icon:'📻', title:'Radio / Recordings',     desc:'Radio appearances, sermons, lectures, recorded speech.',            quality:'Medium', clips:0,  mins:'—',       done:false },
  { id:'vhs',icon:'📼', title:'Home Videos / VHS',      desc:'Old VHS tapes, DVD home movies, digitised family films.',          quality:'Lower',  clips:1,  mins:'1m 22s',  done:true  },
  { id:'pc', icon:'🎙', title:'Podcasts / Interviews',  desc:'Podcast appearances or interviews — studio quality audio.',         quality:'High',   clips:0,  mins:'—',       done:false },
]

const CONTRIBUTORS = [
  { initial:'S', name:'Sarah (Daughter)', bg:'from-blue to-blue2',   detail:'3 WhatsApp notes + birthday video', added:'+8m 22s', status:'done'    },
  { initial:'M', name:'Michael (Son)',    bg:'from-blue3 to-blue4',  detail:'2 voicemails + graduation video',   added:'+5m 41s', status:'done'    },
  { initial:'J', name:'James (Friend)',   bg:'from-green to-green',  detail:'Checking group chats…',             added:'Pending', status:'pending' },
]

export default function Archaeology() {
  const { toast } = useApp()
  const [selected, setSelected] = useState(new Set(['wa','vd','vm','zm','vhs']))

  const toggle = id => setSelected(p => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id)
    toast(n.has(id) ? '✓ Source added to recovery plan' : '✕ Source removed')
    return n
  })

  return (
    <div className="z-content screen-enter px-8 py-8 max-w-6xl">

      {/* Header */}
      <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px]
                      uppercase text-amber mb-4">
        <span className="w-4 h-px bg-amber" />
        Voice Archaeology™
      </div>
      <h1 className="font-display font-black text-5xl tracking-[-2px] leading-[.95] mb-3">
        Already lost your voice?<br />We'll find it.
      </h1>
      <p className="text-muted text-[15px] leading-relaxed max-w-xl mb-8">
        Your voice exists in old videos, voicemails, and WhatsApp messages.
        SpeakMe recovers it — even from 3 seconds of audio.
      </p>

      {/* Summary card */}
      <div className="bg-green/6 border border-green/20 rounded-2xl p-5 mb-8 flex gap-8 flex-wrap items-center">
        {[['48m','Audio recovered'],['6','Contributors'],['23','Source clips'],['91%','Similarity score']].map(([n,l]) => (
          <div key={l} className="text-center">
            <div className="font-display font-black text-3xl text-ink">{n}</div>
            <div className="text-[11px] text-muted mt-0.5">{l}</div>
          </div>
        ))}
        <div className="ml-auto">
          <span className="bg-green/10 text-green border border-green/20
                           px-4 py-2 rounded-full text-xs font-bold">
            ✓ Professional Clone Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* Sources grid */}
          <h2 className="font-display font-bold text-sm text-ink mb-3">Audio Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {SOURCES.map(s => {
              const sel = selected.has(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.id)}
                  className={clsx(
                    'relative text-left p-4 rounded-xl border transition-all',
                    sel
                      ? 'bg-blue/6 border-blue/35'
                      : 'bg-card border-border hover:border-border2'
                  )}
                >
                  {sel && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue
                                    flex items-center justify-center text-[10px] text-bg font-bold">
                      ✓
                    </div>
                  )}
                  <span className="text-2xl mb-2 block">{s.icon}</span>
                  <div className="font-semibold text-sm text-ink mb-1">{s.title}</div>
                  <div className="text-xs text-muted leading-snug mb-2">{s.desc}</div>
                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      'text-[10px] px-2 py-0.5 rounded font-medium border',
                      s.quality === 'High'   ? 'bg-green/10 text-green border-green/20'   :
                      s.quality === 'Medium' ? 'bg-amber/10 text-amber border-amber/20'   :
                                               'bg-subtle/50 text-muted border-border'
                    )}>
                      {s.quality === 'High' ? '★' : s.quality === 'Medium' ? '◆' : '◇'} {s.quality}
                    </span>
                    {s.done && <span className="text-[10px] text-green">{s.mins} found</span>}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Family contributions */}
          <h2 className="font-display font-bold text-sm text-ink mb-3">Family Contributors</h2>
          <div className="flex flex-col gap-2.5 mb-4">
            {CONTRIBUTORS.map(c => (
              <div key={c.name}
                className="flex items-center gap-3 px-4 py-3
                           bg-card border border-border rounded-xl">
                <div className={clsx(
                  'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center',
                  'font-display font-black text-sm shrink-0',
                  c.bg
                )}>
                  {c.initial}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.name}</div>
                  <div className="text-xs text-muted">{c.detail}</div>
                </div>
                <span className="text-xs font-bold text-green">{c.added}</span>
                <span className={clsx(
                  'text-[10px] px-2.5 py-1 rounded-full border font-semibold',
                  c.status === 'done'
                    ? 'bg-green/10 text-green border-green/20'
                    : 'bg-amber/10 text-amber border-amber/20'
                )}>
                  {c.status === 'done' ? '✓ Submitted' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => toast('📨 Invite link copied to clipboard!')}
            className="w-full py-3.5 border-2 border-dashed border-border2 rounded-xl
                       text-sm text-muted hover:border-blue hover:text-blue transition-all"
          >
            + Invite another family member
          </button>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h4 className="font-display font-bold text-xs mb-3">⚡ Min. Requirements</h4>
            {[['3–60s','Instant Clone','text-muted'],['1–5 min','Good Clone','text-amber'],['30+ min','Pro Clone','text-blue'],['1–3 hrs','Broadcast','text-purple']].map(([d,l,c]) => (
              <div key={l} className="flex justify-between text-xs py-1.5 border-b border-white/4 last:border-0">
                <span className="text-muted">{d}</span>
                <span className={clsx('font-semibold', c)}>{l}</span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h4 className="font-display font-bold text-xs mb-3">💡 Pro Tips</h4>
            <p className="text-xs text-muted leading-relaxed">
              Ask family to search their phones for WhatsApp voice notes — often the richest source.
              <br /><br />
              Video quality doesn't matter — only the audio track. Even grainy VHS footage works.
              <br /><br />
              Avoid clips with background music or multiple speakers.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-display font-bold text-xs mb-3">🔒 Privacy</h4>
            <p className="text-xs text-muted leading-relaxed">
              All audio is encrypted in transit and at rest. SOC 2, HIPAA and GDPR compliant.
              Raw training audio is deleted after cloning. Only your Voice ID is retained.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
