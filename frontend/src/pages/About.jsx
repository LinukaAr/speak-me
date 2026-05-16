import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic, MessageSquare, Mic2, Accessibility,
  Globe, Lock, ChevronRight, ArrowRight,
  Play, Zap, FolderHeart, ShieldCheck,
} from 'lucide-react'
import clsx from 'clsx'

const SECTIONS = [
  { id: 'speak',         label: 'Speak',           Icon: Mic           },
  { id: 'phrases',       label: 'Quick Phrases',   Icon: MessageSquare },
  { id: 'voice-banking', label: 'Voice Banking',   Icon: Mic2          },
  { id: 'accessibility', label: 'Accessibility',   Icon: Accessibility },
  { id: 'language',      label: 'Output Language', Icon: Globe         },
  { id: 'privacy',       label: 'Privacy & Data',  Icon: Lock          },
]

export default function About() {
  const [active, setActive] = useState('speak')
  const navigate = useNavigate()

  return (
    <div className="z-content screen-enter flex flex-col md:grid md:grid-cols-[220px_1fr] min-h-[calc(100vh-65px)]">

      {/* ── SIDE NAV ── */}
      <aside className="md:border-r md:border-border md:px-4 md:py-8 md:bg-surf/40
                        border-b border-border bg-surf/40 md:border-b-0">
        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden overflow-x-auto hide-scrollbar gap-1 px-3 py-2">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0',
                active === id
                  ? 'bg-blue/10 text-ink border-blue/20'
                  : 'text-muted hover:bg-blue/5 hover:text-ink border-transparent'
              )}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Desktop: vertical nav */}
        <div className="hidden md:flex flex-col gap-1">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted px-3 mb-3">
            Help & Guide
          </p>
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left w-full border',
                active === id
                  ? 'bg-blue/8 text-ink border-blue/20'
                  : 'text-muted hover:bg-blue/5 hover:text-ink border-transparent'
              )}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div className="px-4 sm:px-6 md:px-10 py-6 md:py-10 max-w-3xl">

        {/* ── SPEAK ── */}
        {active === 'speak' && (
          <div className="screen-enter">
            <DocTitle icon={<Mic size={22} />}>Speak</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              The Speak page is the heart of SpeakMe. Type anything you want to say and the app
              will play it back in your cloned voice — or a demo voice if you haven't banked yours yet.
            </p>

            <DocStep n="1" title="Type your message">
              Use the large text area to type what you want to say. You can write full sentences,
              single words, or paste any text. Press <Kbd>⌘ Enter</Kbd> on desktop or tap
              <strong className="text-ink"> Speak Me</strong> to play.
            </DocStep>

            <DocStep n="2" title="Choose your language">
              Use the language selector above the text box. English is live now — Sinhala, Tamil,
              Hindi and more are coming in future updates.
            </DocStep>

            <DocStep n="3" title="Quick Phrases shortcut">
              Below the text box you'll find Quick Phrases — pre-saved sentences you can tap to
              instantly load and speak without typing.
            </DocStep>

            <DocStep n="4" title="Use your own voice">
              The "Speak in your own voice" link takes you to Voice Banking to create your clone.
              Once cloned, every phrase plays in <em>your</em> voice.
            </DocStep>

            <CallToAction label="Go to Speak" onClick={() => navigate('/speak')} />
          </div>
        )}

        {/* ── QUICK PHRASES ── */}
        {active === 'phrases' && (
          <div className="screen-enter">
            <DocTitle icon={<MessageSquare size={22} />}>Quick Phrases</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Quick Phrases lets you save and instantly play frequently used sentences — things like
              "I need some water" or "Call my family" — without typing them every time.
            </p>

            <DocStep n="1" title="Browse by category">
              Phrases are grouped into categories: <strong className="text-ink">Daily</strong>,{' '}
              <strong className="text-ink">Medical</strong>,{' '}
              <strong className="text-amber">Emergency</strong>, and{' '}
              <strong className="text-ink">Social</strong>. Use the tabs to filter.
            </DocStep>

            <DocStep n="2" title="Tap a phrase to speak it">
              Tap any phrase card and it is instantly spoken in your voice. No typing required.
            </DocStep>

            <DocStep n="3" title="Add your own phrases">
              Use the <strong className="text-ink">+ Add Phrase</strong> button to create custom
              phrases with your own text, icon, and category.
            </DocStep>

            <DocStep n="4" title="Emergency phrases">
              Emergency phrases (marked in red) are pinned to the top for fastest access.
              These include "Call for help immediately" and "I can't breathe properly".
            </DocStep>

            <CallToAction label="Go to Quick Phrases" onClick={() => navigate('/phrases')} />
          </div>
        )}

        {/* ── VOICE BANKING ── */}
        {active === 'voice-banking' && (
          <div className="screen-enter">
            <DocTitle icon={<Mic2 size={22} />}>Voice Banking</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Voice Banking lets you record your voice and create a digital clone powered by
              ElevenLabs AI. Once cloned, all speech synthesis across the app uses your voice.
            </p>

            <DocStep n="1" title="Record or upload audio">
              Use the <strong className="text-ink">Record</strong> tab to record live using your
              microphone, or switch to <strong className="text-ink">Upload file</strong> to use
              existing MP3, WAV, or M4A files.
            </DocStep>

            <DocStep n="2" title="Minimum 3 seconds required">
              You need at least 3 seconds of audio to clone. For better quality, aim for
              1–5 minutes. For professional quality, 30+ minutes is recommended.
            </DocStep>

            <DocStep n="3" title='Click "Clone My Voice with ElevenLabs"'>
              Once you have audio, the clone button appears above your recordings. Tap it to send
              your audio to ElevenLabs and create your voice clone. This takes around 10–30 seconds.
            </DocStep>

            <DocStep n="4" title="Your voice is now active">
              After cloning, a green <strong className="text-green">Voice Active</strong> badge
              appears in the top navigation. Every phrase you speak will now use your cloned voice.
            </DocStep>

            <div className="mt-5 p-4 bg-amber/6 border border-amber/20 rounded-xl text-xs text-muted leading-relaxed">
              <strong className="text-amber">Tip:</strong> Bank your voice now while it is still
              strong. If your voice changes over time, your clone preserves how it sounds today.
            </div>

            <CallToAction label="Go to Voice Banking" onClick={() => navigate('/voice-banking')} />
          </div>
        )}

        {/* ── ACCESSIBILITY ── */}
        {active === 'accessibility' && (
          <div className="screen-enter">
            <DocTitle icon={<Accessibility size={22} />}>Accessibility</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Found in <strong className="text-ink">Settings → Accessibility</strong>. These options
              let you customise SpeakMe to suit your vision, motion, and sensory needs.
              All preferences are saved automatically and apply across every page.
            </p>

            <FeatureRow
              icon={<span className="text-base">Aa</span>}
              title="Larger text"
              desc="Increases all font sizes across the app by ~20%. Useful if the default text is too small to read comfortably."
            />
            <FeatureRow
              icon={<span className="text-base">◑</span>}
              title="High contrast"
              desc="Brightens muted text and strengthens borders so elements are easier to distinguish, especially in bright environments."
            />
            <FeatureRow
              icon={<span className="text-base">✦</span>}
              title="Reduce motion"
              desc="Disables all animations and transitions app-wide. Helpful if movement on screen causes discomfort or distraction."
            />
            <FeatureRow
              icon={<span className="text-base">📳</span>}
              title="Haptic feedback"
              desc="On supported mobile devices, the phone vibrates each time a phrase is spoken — providing a physical confirmation without needing to look at the screen."
            />

            <CallToAction label="Open Accessibility Settings" onClick={() => navigate('/settings')} />
          </div>
        )}

        {/* ── OUTPUT LANGUAGE ── */}
        {active === 'language' && (
          <div className="screen-enter">
            <DocTitle icon={<Globe size={22} />}>Output Language</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Found in <strong className="text-ink">Settings → Language</strong>. Controls the
              language used for speech synthesis output.
            </p>

            <div className="flex items-center gap-3 bg-amber/6 border border-amber/20 rounded-xl p-4 mb-6">
              <span className="text-2xl shrink-0">🌍</span>
              <div>
                <div className="text-sm font-semibold text-amber mb-0.5">English only — for now</div>
                <div className="text-xs text-muted leading-relaxed">
                  Version 1 supports English. Sinhala, Tamil, and Hindi are the top priorities
                  for the post-launch roadmap. French, German, Spanish and 70+ more languages
                  are planned for future phases.
                </div>
              </div>
            </div>

            <FeatureRow icon={<span>🇬🇧</span>} title="English" desc="Fully live. All features work with English text input and voice synthesis." badge="Live" badgeCls="bg-green/10 text-green" />
            <FeatureRow icon={<span>🇱🇰</span>} title="Sinhala & Tamil" desc="High priority for the post-launch update. The UI, voice synthesis, and phrase library will all support these languages." badge="Coming soon" badgeCls="bg-amber/10 text-amber" />
            <FeatureRow icon={<span>🇮🇳</span>} title="Hindi" desc="Planned alongside Sinhala and Tamil." badge="Coming soon" badgeCls="bg-amber/10 text-amber" />
            <FeatureRow icon={<span>🌐</span>} title="70+ languages" desc="ElevenLabs supports a wide range of languages. Full multilingual support is on the roadmap." badge="Future" badgeCls="bg-subtle/50 text-muted" />
          </div>
        )}

        {/* ── PRIVACY & DATA ── */}
        {active === 'privacy' && (
          <div className="screen-enter">
            <DocTitle icon={<Lock size={22} />}>Privacy & Data</DocTitle>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Found in <strong className="text-ink">Settings → Privacy</strong>. You are in full
              control of your data. Nothing is shared without your explicit consent.
            </p>

            <FeatureRow
              icon={<ShieldCheck size={16} className="text-green" />}
              title="Store speech history"
              desc='When enabled, phrases you speak are saved so you can review them later. Turn this off to "private mode" — nothing you say is recorded anywhere on the device.'
            />
            <FeatureRow
              icon={<Zap size={16} className="text-blue" />}
              title="Share usage analytics"
              desc="Sends anonymous usage data (which features you use, how often) to help improve SpeakMe. No voice audio, personal details, or phrase content is ever included."
            />
            <FeatureRow
              icon={<FolderHeart size={16} className="text-red" />}
              title="Delete all my data"
              desc="Permanently removes your voice clone ID, speech history, and all app preferences stored on this device. This action signs you out and cannot be undone."
            />

            <div className="mt-6 p-4 bg-surf rounded-xl border border-border text-xs text-muted leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3).
              Supabase is SOC 2, HIPAA, and GDPR compliant.
              Your voice clone is processed by ElevenLabs and is never shared with third parties
              without your explicit consent.
            </div>

            <CallToAction label="Open Privacy Settings" onClick={() => navigate('/settings')} />
          </div>
        )}

      </div>
    </div>
  )
}

function DocTitle({ icon, children }) {
  return (
    <h2 className="flex items-center gap-2.5 font-display font-black text-2xl tracking-tight mb-2 pb-4 border-b border-border">
      <span className="text-muted">{icon}</span>
      {children}
    </h2>
  )
}

function DocStep({ n, title, children }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="w-6 h-6 rounded-full bg-blue/15 border border-blue/25 text-blue
                      flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-ink mb-1">{title}</div>
        <div className="text-xs text-muted leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function FeatureRow({ icon, title, desc, badge, badgeCls }) {
  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-surf border border-border
                      flex items-center justify-center shrink-0 text-muted">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-ink">{title}</span>
          {badge && (
            <span className={clsx('text-[10px] px-2 py-0.5 rounded-full font-semibold', badgeCls)}>
              {badge}
            </span>
          )}
        </div>
        <div className="text-xs text-muted leading-relaxed">{desc}</div>
      </div>
    </div>
  )
}

function Kbd({ children }) {
  return (
    <kbd className="px-1.5 py-0.5 bg-surf border border-border rounded text-[10px] font-mono text-ink mx-0.5">
      {children}
    </kbd>
  )
}

function CallToAction({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-blue/10 border border-blue/25
                 text-blue text-sm font-semibold rounded-xl hover:bg-blue/18 transition-colors"
    >
      {label} <ArrowRight size={14} />
    </button>
  )
}
