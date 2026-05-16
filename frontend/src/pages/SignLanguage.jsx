import { useApp } from '@/context/AppContext'

export default function SignLanguage() {
  const { toast } = useApp()

  return (
    <div className="z-content screen-enter px-8 py-8 max-w-5xl">

      {/* Coming soon banner */}
      <div className="flex items-start gap-4 bg-amber/6 border border-amber/25
                      rounded-2xl p-5 mb-8">
        <span className="text-3xl shrink-0 mt-0.5">🤟</span>
        <div>
          <h4 className="font-display font-bold text-base text-amber mb-1">
            Sign Language Input — Future Development Plan
          </h4>
          <p className="text-sm text-muted leading-relaxed">
            This feature is <strong className="text-ink">NOT built at the hackathon</strong>. We had 24 hours and
            could not source a sufficiently labelled sign language dataset to train a reliable
            real-time recognition model. An undertrained model that misidentifies signs could
            cause someone to say the wrong thing in a critical moment — we won't ship that.
            Below is our planned architecture for post-hackathon development.
          </p>
        </div>
      </div>

      <h1 className="font-display font-black text-5xl tracking-[-2px] leading-[.95] mb-3">
        Sign → Your Voice
      </h1>
      <p className="text-muted text-[15px] max-w-lg leading-relaxed mb-8">
        The vision: make a sign in front of your camera — SpeakMe recognises it
        and speaks the phrase in your own cloned voice, instantly.
      </p>

      {/* Concept preview */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-display font-bold text-sm">Concept Preview — Planned UX</h3>
          <span className="text-[10px] bg-amber/10 text-amber border border-amber/20
                           px-2.5 py-1 rounded-full font-bold">Design Mockup</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 border-r border-border flex flex-col items-center">
            {/* Camera placeholder */}
            <div className="w-48 h-48 rounded-2xl bg-surf border-2 border-dashed border-border2
                            flex flex-col items-center justify-center mb-4 relative">
              {/* Corner brackets */}
              {[['top-2 left-2','border-t-2 border-l-2'],['top-2 right-2','border-t-2 border-r-2'],
                ['bottom-2 left-2','border-b-2 border-l-2'],['bottom-2 right-2','border-b-2 border-r-2']
              ].map(([pos, b]) => (
                <div key={pos} className={`absolute w-5 h-5 border-amber ${b} ${pos}`} />
              ))}
              <span className="text-5xl mb-2">🤟</span>
              <div className="text-xs text-muted">Camera feed</div>
              <div className="text-[10px] text-subtle mt-1">MediaPipe tracking</div>
            </div>
            <p className="text-xs text-muted text-center">
              21 hand landmarks detected per hand at 30fps
            </p>
          </div>
          <div className="p-8">
            <h5 className="text-[10px] font-bold tracking-widest uppercase text-muted mb-4">
              Recognised Gesture
            </h5>
            <div className="bg-surf rounded-xl p-4 mb-4 border-l-2 border-amber">
              <div className="text-base font-semibold mb-1">I need help please</div>
              <div className="text-xs text-amber">Confidence: 94% · ASL Sign #47</div>
            </div>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => toast('🎙 Sign → ElevenLabs TTS → Speaking in your voice')}
                className="px-4 py-2 bg-red text-white text-xs font-bold rounded-lg
                           hover:bg-red/80 transition-colors"
              >
                ▶ Speak This
              </button>
              <button
                onClick={() => toast('✕ Sign rejected — please try again')}
                className="px-4 py-2 border border-border text-muted text-xs rounded-lg
                           hover:text-ink transition-colors"
              >
                ✕ Wrong
              </button>
            </div>
            <div className="text-xs text-muted">
              Languages planned post-hackathon:<br />
              <span className="text-ink font-medium">ASL · BSL · ISL · SSL (Sinhala Sign Language)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical plan */}
      <h2 className="font-display font-bold text-sm text-ink mb-4">Planned Technical Architecture</h2>
      <div className="flex flex-col gap-3 mb-8">
        {[
          ['01','Dataset Sourcing',          'Partner with deaf advocacy organisations — SLAD (Sri Lanka), NAD (USA), BDA (UK) — to source and label comprehensive datasets. Target: ASL, BSL, ISL, and SSL (Sinhala Sign Language).','bg-purple/10 border-purple/20'],
          ['02','Hand Landmark Detection',   'MediaPipe Holistic provides 21 hand landmarks + 33 body pose landmarks at 30fps in real time. Runs on device CPU — no GPU required on mobile.','bg-blue/10 border-blue/20'],
          ['03','Gesture Classification',    'Custom LSTM or Transformer-based classifier trained on landmark sequences. Transfer learning from pre-trained gesture recognition base to reduce dataset requirements.','bg-green/10 border-green/20'],
          ['04','ElevenLabs Integration',    'Recognised gesture → mapped to phrase text → ElevenLabs TTS fires in user\'s cloned voice. End-to-end latency target: under 3 seconds.','bg-red/10 border-red/20'],
          ['05','Personalised Model',        'Users correct misrecognised signs → corrections feed back into a personalised model. Each user\'s recognition improves with use over time.','bg-amber/10 border-amber/20'],
        ].map(([num, title, desc, cls]) => (
          <div key={num} className={`flex gap-4 p-4 rounded-xl border ${cls}`}>
            <span className="font-display font-black text-lg text-muted shrink-0 w-7">{num}</span>
            <div>
              <div className="font-semibold text-sm text-ink mb-1">{title}</div>
              <div className="text-xs text-muted leading-relaxed">{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap */}
      <h2 className="font-display font-bold text-sm text-ink mb-4">Overall Future Roadmap</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { phase:'Phase 1 · Live Now',      title:'Web App (v1)',              desc:'Text & weakened voice → ElevenLabs → real-time cloned voice synthesis.',    tag:'✓ Live',        tc:'text-green',  bc:'border-green/20' },
          { phase:'Phase 2 · Post-Hackathon',title:'Android & iOS Mobile Apps', desc:'Native apps with biometric login, offline phrases, push emergency alerts, home screen widgets, and smartwatch support.',tag:'In Planning',   tc:'text-amber',  bc:'border-amber/20' },
          { phase:'Phase 3 · Post-Hackathon',title:'Sign Language Camera Input',desc:'MediaPipe + custom LSTM classifier. ASL, BSL, ISL, SSL. Dataset partnership with deaf advocacy organisations.',        tag:'Planned',      tc:'text-purple', bc:'border-purple/20'},
          { phase:'Phase 4 · Post-Hackathon',title:'Multilingual Output',       desc:'Sinhala, Tamil, Hindi, Bengali UI + TTS. 70+ ElevenLabs languages. Priority: Sinhala and Tamil for Sri Lanka.',         tag:'Roadmap',      tc:'text-blue',   bc:'border-blue/20'  },
        ].map(({ phase, title, desc, tag, tc, bc }) => (
          <div key={title} className="bg-card border border-border rounded-xl p-5">
            <div className="text-[10px] font-bold tracking-wider text-muted mb-2">{phase}</div>
            <div className="font-display font-bold text-base mb-2">{title}</div>
            <div className="text-xs text-muted leading-relaxed mb-3">{desc}</div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${tc} ${bc} bg-transparent`}>
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
