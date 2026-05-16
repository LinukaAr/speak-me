import clsx from 'clsx'

export default function VoiceCloneProgress({
  status,
  progress = 0,
  voiceId = null,
  voiceName = null,
  errorMessage = null,
  onRetry,
  onNavigateToSpeak,
}) {
  // Don't render anything if idle
  if (status === 'idle') {
    return null
  }

  return (
    <div className={clsx(
      'bg-card border rounded-xl p-6 transition-all',
      status === 'success' && 'border-green/30 bg-green/5',
      status === 'error' && 'border-red/30 bg-red/5',
      (status === 'uploading' || status === 'processing') && 'border-blue/30 bg-blue/5'
    )}>
      {/* Uploading State */}
      {status === 'uploading' && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 border-3 border-blue/30 border-t-blue rounded-full animate-spin" />
            <h3 className="font-display font-bold text-lg text-ink">Uploading to ElevenLabs...</h3>
          </div>
          
          {/* Progress bar */}
          <div className="relative w-full h-3 bg-surf rounded-full overflow-hidden mb-2">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue to-purple transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted">
            <span>Uploading audio files...</span>
            <span className="font-mono font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      {/* Processing State */}
      {status === 'processing' && (
        <div className="text-center py-4">
          <div className="inline-block w-12 h-12 border-4 border-purple/30 border-t-purple rounded-full animate-spin mb-4" />
          <h3 className="font-display font-bold text-xl text-ink mb-2">
            Cloning Your Voice...
          </h3>
          <p className="text-sm text-muted">
            ElevenLabs is creating your voice clone. This usually takes 30-60 seconds.
          </p>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="font-display font-bold text-2xl text-ink mb-2">
            Voice Clone Created!
          </h3>
          <p className="text-sm text-muted mb-4">
            Your voice has been successfully cloned and is ready to use.
          </p>
          
          {voiceId && (
            <div className="bg-surf border border-border rounded-lg p-3 mb-4">
              <div className="text-xs text-muted mb-1">Voice ID</div>
              <code className="text-xs font-mono text-ink break-all">{voiceId}</code>
              {voiceName && (
                <>
                  <div className="text-xs text-muted mt-2 mb-1">Voice Name</div>
                  <div className="text-sm font-semibold text-ink">{voiceName}</div>
                </>
              )}
            </div>
          )}

          <button
            onClick={onNavigateToSpeak}
            className="px-6 py-3 bg-green text-white text-sm font-semibold rounded-xl
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green/30
                       transition-all active:scale-[.97]"
          >
            Go to Speak Page →
          </button>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="font-display font-bold text-xl text-red mb-2">
            Voice Cloning Failed
          </h3>
          <div className="bg-red/10 border border-red/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-ink leading-relaxed">
              {errorMessage || 'An unexpected error occurred while cloning your voice.'}
            </p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onRetry}
              className="px-5 py-2.5 bg-red/10 border border-red/25 text-red text-sm font-semibold
                         rounded-xl hover:bg-red/18 transition-colors"
            >
              🔄 Try Again
            </button>
          </div>

          <div className="mt-4 text-xs text-muted">
            <p className="mb-1"><strong>Common issues:</strong></p>
            <ul className="text-left inline-block space-y-0.5">
              <li>• Check your internet connection</li>
              <li>• Verify your ElevenLabs API key is valid</li>
              <li>• Ensure audio files meet requirements (3s+, MP3/WAV/M4A)</li>
              <li>• Try with fewer or smaller files</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
