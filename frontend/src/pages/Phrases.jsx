import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import PhraseCard from '@/components/ui/PhraseCard'
import clsx from 'clsx'

const TABS = ['all','daily','medical','emergency','social']

export default function Phrases() {
  const { phrases, toast } = useApp()
  const [tab, setTab] = useState('all')

  const emergency = phrases.filter(p => p.urgent)
  const rest = phrases
    .filter(p => !p.urgent)
    .filter(p => tab === 'all' ? true : p.cat === tab)
    .sort((a, b) => b.uses - a.uses)

  return (
    <div className="z-content screen-enter px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-black text-5xl tracking-[-2px] leading-none mb-2">
            Quick Phrases
          </h1>
          <p className="text-muted text-sm">One tap → your voice speaks instantly</p>
        </div>
        <button
          onClick={() => toast('✚ Add phrase feature — connect Supabase to persist!')}
          className="flex items-center gap-2 px-5 py-2.5
                     bg-blue/10 border border-blue/25 text-blue text-sm font-semibold
                     rounded-xl hover:bg-blue/18 transition-colors"
        >
          + Add Phrase
        </button>
      </div>

      {/* Emergency pinned */}
      <div className="bg-red/6 border border-red/20 rounded-xl p-4 mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-ink">🚨 Emergency — Always Active</h2>
          <span className="text-[10px] text-muted">Pinned regardless of tab</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {emergency.map(p => <PhraseCard key={p.id} phrase={p} />)}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap border-b border-border pb-0">
        {TABS.map(t => {
          const count = t === 'all'
            ? phrases.filter(p => !p.urgent).length
            : phrases.filter(p => p.cat === t && !p.urgent).length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-all relative',
                tab === t
                  ? 'text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue'
                  : 'text-muted hover:text-ink'
              )}
            >
              {t}{' '}
              <span className={clsx(
                'text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center ml-1',
                tab === t ? 'bg-blue text-bg' : 'bg-subtle text-muted'
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {rest.map(p => <PhraseCard key={p.id} phrase={p} />)}
      </div>
    </div>
  )
}
