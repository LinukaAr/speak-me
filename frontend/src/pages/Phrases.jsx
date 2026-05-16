import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import PhraseCard from '@/components/ui/PhraseCard'
import { X } from 'lucide-react'
import clsx from 'clsx'

const TABS = ['all','daily','medical','social']

const CATEGORIES = [
  { value: 'daily', label: 'Daily', color: '#00b8ff' },
  { value: 'medical', label: 'Medical', color: '#009bd6' },
  { value: 'social', label: 'Social', color: '#00719c' },
  { value: 'emergency', label: 'Emergency', color: '#e8365d' },
]

const EMOJI_OPTIONS = ['💬', '💭', '🗣️', '💡', '⭐', '❤️', '👋', '🙏', '✨', '🎯', '📝', '💪', '🌟', '🎉', '👍', '🤝', '💯', '🔔']

export default function Phrases() {
  const { phrases, toast, addPhrase, voiceId } = useApp()
  const [tab, setTab] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPhrase, setNewPhrase] = useState({
    text: '',
    icon: '💬',
    cat: 'daily',
    urgent: false,
  })

  const emergency = phrases.filter(p => p.urgent)
  const rest = phrases
    .filter(p => !p.urgent)
    .filter(p => tab === 'all' ? true : p.cat === tab)
    .sort((a, b) => b.uses - a.uses)

  const handleAddPhrase = async () => {
    if (!newPhrase.text.trim()) {
      toast('⚠️ Please enter a phrase text', 'warning')
      return
    }

    try {
      // Add phrase to state (and Supabase if connected)
      await addPhrase(newPhrase)
      
      toast('✓ Phrase added successfully! Tap it to speak in your voice.', 'success')
      
      // Reset form and close modal
      setNewPhrase({
        text: '',
        icon: '💬',
        cat: 'daily',
        urgent: false,
      })
      setShowAddModal(false)
    } catch (error) {
      toast('❌ Failed to add phrase. Please try again.', 'error')
    }
  }

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
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5
                     bg-blue/10 border border-blue/25 text-blue text-sm font-semibold
                     rounded-xl hover:bg-blue/18 transition-colors"
          style={{ backgroundColor: 'rgba(0, 184, 255, 0.1)', borderColor: 'rgba(0, 184, 255, 0.25)', color: '#00b8ff' }}
        >
          + Add Phrase
        </button>
      </div>

      {/* Emergency pinned */}
      <div className="bg-red/6 border border-red/20 rounded-xl p-4 mb-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-sm text-ink">🚨 Emergency</h2>
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
              style={tab === t ? { '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 184, 255, 0))' } : {}}
            >
              {t}{' '}
              <span className={clsx(
                'text-[10px] w-4 h-4 rounded-full inline-flex items-center justify-center ml-1',
                tab === t ? 'bg-blue text-bg' : 'bg-subtle text-muted'
              )}
              style={tab === t ? { backgroundColor: '#00b8ff', color: '#fff' } : {}}>
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

      {/* Add Phrase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
             onClick={() => setShowAddModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
               onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl">Add New Phrase</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surf transition-colors flex items-center justify-center text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue/8 border border-blue/20 rounded-xl p-3 mb-4 flex gap-3">
              <span className="text-lg shrink-0">🎙️</span>
              <div className="text-xs text-muted leading-relaxed">
                <strong className="text-ink block mb-1" style={{ color: '#00b8ff' }}>Voice Automatically Attached</strong>
                Your phrase will speak in {voiceId ? 'your cloned voice' : 'the demo voice'}. 
                {!voiceId && ' Clone your voice in Voice Banking to personalize all phrases.'}
              </div>
            </div>

            <div className="space-y-4">
              {/* Phrase Text */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Phrase Text</label>
                <textarea
                  value={newPhrase.text}
                  onChange={e => setNewPhrase({ ...newPhrase, text: e.target.value })}
                  placeholder="Enter what you want to say..."
                  rows={3}
                  className="w-full bg-surf border border-border rounded-xl px-4 py-3 text-sm text-ink
                           placeholder:text-muted focus:border-blue/40 focus:outline-none transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Icon</label>
                <div className="grid grid-cols-9 gap-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewPhrase({ ...newPhrase, icon: emoji })}
                      className={clsx(
                        'w-10 h-10 rounded-lg border transition-all text-lg flex items-center justify-center',
                        newPhrase.icon === emoji
                          ? 'border-blue bg-blue/10'
                          : 'border-border hover:border-border2 bg-surf'
                      )}
                      style={newPhrase.icon === emoji ? { borderColor: '#00b8ff', backgroundColor: 'rgba(0, 184, 255, 0.1)' } : {}}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setNewPhrase({ ...newPhrase, cat: cat.value, urgent: cat.value === 'emergency' })}
                      className={clsx(
                        'px-4 py-2.5 rounded-lg border text-sm font-medium transition-all',
                        newPhrase.cat === cat.value
                          ? 'border-current'
                          : 'border-border hover:border-border2'
                      )}
                      style={newPhrase.cat === cat.value ? { 
                        backgroundColor: `${cat.color}15`, 
                        borderColor: cat.color, 
                        color: cat.color 
                      } : {}}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium
                           text-muted hover:text-ink hover:border-border2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPhrase}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
                           text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ backgroundColor: '#00b8ff' }}
                >
                  Add Phrase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
