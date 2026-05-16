import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { FAMILY_MEMBERS } from '@/context/AppContext'
import clsx from 'clsx'

const ROLE_STYLE = {
  carer:     { label: 'Primary Carer', cls: 'bg-green/10 text-green border-green/20'  },
  family:    { label: 'Family Member', cls: 'bg-blue/10  text-blue  border-blue/20'   },
  emergency: { label: 'Emergency',     cls: 'bg-red/10   text-red   border-red/20'    },
  invited:   { label: 'Invited',       cls: 'bg-amber/10 text-amber border-amber/20'  },
}

const PERMS = [
  ['Speak using patient\'s voice',     true,  false],
  ['Add quick phrases',                true,  true ],
  ['View phrase history',              true,  true ],
  ['Trigger emergency alert',          true,  true ],
  ['Change voice settings',            false, false],
  ['Delete voice clone',               false, false],
  ['Manage family access',             false, false],
]

export default function Family() {
  const { toast } = useApp()
  const [members, setMembers] = useState(FAMILY_MEMBERS)
  const [toggles, setToggles] = useState({ location: true, inactivity: true, carerTakeover: false })

  const tog = key => setToggles(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="z-content screen-enter grid grid-cols-1 xl:grid-cols-[1fr_340px] min-h-[calc(100vh-65px)]">

      {/* ── MAIN ── */}
      <div className="px-8 py-8 border-r border-border">
        <h1 className="font-display font-black text-5xl tracking-[-2px] leading-none mb-2">
          Family Access
        </h1>
        <p className="text-muted text-sm leading-relaxed max-w-lg mb-8">
          Manage who can help you communicate and who gets notified in an emergency.
          Your safety network — built with care.
        </p>

        {/* Members */}
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted mb-3">Active Members</p>
        <div className="flex flex-col gap-2.5 mb-5">
          {members.map(m => {
            const rs = ROLE_STYLE[m.role]
            return (
              <div key={m.id}
                className="flex items-center gap-3 px-4 py-3.5
                           bg-card border border-border rounded-xl hover:border-border2 transition-colors">
                <div className={clsx(
                  'w-11 h-11 rounded-full flex items-center justify-center shrink-0',
                  'font-display font-black text-sm text-bg bg-gradient-to-br',
                  m.color
                )}>
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-muted">{m.relation} · {m.email}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  {m.online && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
                </div>
                <span className={clsx('text-[10px] font-semibold px-2.5 py-1 rounded-full border', rs.cls)}>
                  {rs.label}
                </span>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => toast(`Edit access for ${m.name}`)}
                    className="px-2.5 py-1 text-[10px] border border-border text-muted
                               rounded-lg hover:border-border2 hover:text-ink transition-all"
                  >Edit</button>
                  {m.role !== 'carer' && (
                    <button
                      onClick={() => { setMembers(p => p.filter(x => x.id !== m.id)); toast(`Removed ${m.name}`) }}
                      className="px-2.5 py-1 text-[10px] border border-border text-muted
                                 rounded-lg hover:border-red/40 hover:text-red transition-all"
                    >Remove</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => toast('📨 Invite link generated and copied to clipboard!')}
          className="w-full py-4 border-2 border-dashed border-border2 rounded-xl
                     text-sm text-muted hover:border-blue hover:text-blue transition-all mb-8"
        >
          + Invite a family member, carer or emergency contact
        </button>

        {/* Emergency settings */}
        <div className="bg-red/6 border border-red/20 rounded-xl p-5">
          <h3 className="font-display font-bold text-sm text-ink mb-4">🚨 Emergency Settings</h3>
          <div className="flex flex-col gap-4">
            {[
              { key:'location',     title:'Send location with emergency alert', desc:'Emergency contacts receive your GPS coordinates' },
              { key:'inactivity',   title:'Alert on 4+ hours inactivity',        desc:"Notify carers if you haven't used SilentStage" },
              { key:'carerTakeover',title:'Allow carer to speak on my behalf',   desc:'Primary Carer can use your voice clone if you cannot' },
            ].map(({ key, title, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-ink">{title}</div>
                  <div className="text-xs text-muted mt-0.5">{desc}</div>
                </div>
                <button
                  onClick={() => tog(key)}
                  className={clsx(
                    'w-10 h-[22px] rounded-full relative transition-colors shrink-0',
                    toggles[key] ? 'bg-green' : 'bg-subtle'
                  )}
                >
                  <span className={clsx(
                    'absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all',
                    toggles[key] ? 'left-[22px]' : 'left-[3px]'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div className="px-6 py-8 bg-surf/40 hidden xl:block">
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h4 className="font-display font-bold text-xs mb-3">🔐 Access Permissions</h4>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-muted font-medium pb-2 border-b border-white/5">Action</th>
                <th className="text-center text-muted font-medium pb-2 border-b border-white/5 w-12">Carer</th>
                <th className="text-center text-muted font-medium pb-2 border-b border-white/5 w-12">Family</th>
              </tr>
            </thead>
            <tbody>
              {PERMS.map(([action, carer, family]) => (
                <tr key={action} className="border-b border-white/4 last:border-0">
                  <td className="py-1.5 text-muted pr-2">{action}</td>
                  <td className="py-1.5 text-center">{carer  ? <span className="text-green">✓</span> : <span className="text-subtle">✗</span>}</td>
                  <td className="py-1.5 text-center">{family ? <span className="text-green">✓</span> : <span className="text-subtle">✗</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="font-display font-bold text-xs mb-3">🔒 Privacy</h4>
          <p className="text-xs text-muted leading-relaxed">
            All voice data is encrypted at rest and in transit. SOC2, HIPAA and GDPR compliant.
            <br /><br />
            Your voice clone is never shared with anyone — including family members — without your explicit consent.
            <br /><br />
            Every family member action is logged with timestamp and access role.
          </p>
        </div>
      </div>
    </div>
  )
}
