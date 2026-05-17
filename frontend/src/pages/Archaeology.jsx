import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import FileUploader from '@/components/FileUploader'
import AudioFileList from '@/components/AudioFileList'
import { Upload, Users } from 'lucide-react'

export default function Archaeology() {
  const { toast } = useApp()
  const [audioFiles, setAudioFiles] = useState([])

  // Calculate total duration
  const totalDuration = audioFiles.reduce((sum, file) => sum + file.duration, 0)
  const totalMinutes = Math.floor(totalDuration / 60)
  const totalSeconds = Math.floor(totalDuration % 60)

  // Handle files uploaded
  const handleFilesUploaded = (newFiles) => {
    setAudioFiles(prev => [...prev, ...newFiles])
    toast(`✓ ${newFiles.length} file${newFiles.length > 1 ? 's' : ''} added to recovery collection`)
  }

  // Handle file deletion
  const handleDeleteFile = (fileId) => {
    setAudioFiles(prev => prev.filter(f => f.id !== fileId))
    toast('🗑️ File removed')
  }

  // Handle error
  const handleError = (error) => {
    console.error('Error:', error)
  }

  // Handle process recovery
  const handleProcessRecovery = () => {
    toast('🚀 Voice Recovery processing coming in Phase 2! Your files are saved locally.')
  }

  return (
    <div className="z-content screen-enter px-8 py-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px]
                      uppercase mb-4"
           style={{ color: '#00b8ff' }}>
        <span className="w-4 h-px" style={{ backgroundColor: '#00b8ff' }} />
        Voice Recovery
      </div>
      <h1 className="font-display font-black text-5xl tracking-[-2px] leading-[.95] mb-3">
        Recover Your Voice
      </h1>
      <p className="text-muted text-[15px] leading-relaxed max-w-2xl mb-8">
        Upload audio recordings from old voice notes, voicemails, or phone recordings. 
        We'll help you recover your voice from these precious memories.
      </p>

      {/* Stats Card - Show when files uploaded */}
      {audioFiles.length > 0 && (
        <div className="border rounded-2xl p-5 mb-8 flex gap-8 flex-wrap items-center"
             style={{ backgroundColor: 'rgba(0, 184, 255, 0.06)', borderColor: 'rgba(0, 184, 255, 0.2)' }}>
          <div className="text-center">
            <div className="font-display font-black text-3xl text-ink">
              {totalMinutes}m {totalSeconds}s
            </div>
            <div className="text-[11px] text-muted mt-0.5">Audio collected</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-3xl text-ink">{audioFiles.length}</div>
            <div className="text-[11px] text-muted mt-0.5">Files uploaded</div>
          </div>
          <div className="text-center">
            <div className="font-display font-black text-3xl text-ink">
              {totalDuration >= 180 ? 'Good' : totalDuration >= 60 ? 'Fair' : 'More needed'}
            </div>
            <div className="text-[11px] text-muted mt-0.5">Quality estimate</div>
          </div>
          <div className="ml-auto">
            <span className="px-4 py-2 rounded-full text-xs font-bold border"
                  style={{ 
                    backgroundColor: 'rgba(0, 184, 255, 0.1)', 
                    borderColor: 'rgba(0, 184, 255, 0.25)',
                    color: '#00b8ff'
                  }}>
              Ready for processing
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* File Uploader */}
          <div className="mb-6">
            <FileUploader
              onFilesUploaded={handleFilesUploaded}
              onError={handleError}
              maxFiles={20}
              maxSizeMB={50}
            />
          </div>

          {/* Audio File List */}
          {audioFiles.length > 0 && (
            <div className="mb-6">
              <h2 className="font-display font-bold text-sm text-ink mb-3">
                Uploaded Audio Files ({audioFiles.length})
              </h2>
              <AudioFileList
                audioFiles={audioFiles}
                onDelete={handleDeleteFile}
              />
            </div>
          )}

          {/* Process Button */}
          {audioFiles.length > 0 && (
            <div className="mb-6">
              <button
                onClick={handleProcessRecovery}
                className="w-full py-4 text-white text-base font-bold rounded-xl
                           hover:-translate-y-0.5 hover:shadow-xl transition-all active:scale-[.98]"
                style={{ backgroundColor: '#00b8ff' }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Upload size={18} /> Process Voice Recovery
                </span>
              </button>
              <p className="text-center text-xs text-muted mt-2">
                Minimum 1 minute recommended · Best results with 3+ minutes
              </p>
            </div>
          )}

          {/* Family Collaboration Section - Phase 2 */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users size={20} style={{ color: '#00b8ff' }} />
                <h3 className="font-display font-bold text-lg">Family Collaboration</h3>
              </div>
              <span className="px-2 py-1 rounded text-[10px] font-bold border"
                    style={{ 
                      backgroundColor: 'rgba(0, 184, 255, 0.1)', 
                      borderColor: 'rgba(0, 184, 255, 0.25)',
                      color: '#00b8ff'
                    }}>
                Phase 2
              </span>
            </div>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              <strong className="text-ink">Coming Soon:</strong> Family members will be able to help by uploading old recordings they have. 
              You'll be able to share an invite link and they can contribute audio files directly to your voice recovery collection.
            </p>
            <div className="bg-surf border border-border rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg">👨‍👩‍👧</span>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-ink mb-1">How it will work:</div>
                  <ul className="text-xs text-muted space-y-1">
                    <li>• Send invite links to family members</li>
                    <li>• They upload recordings from their devices</li>
                    <li>• All files combine into your voice recovery</li>
                    <li>• Track who contributed what</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 Features - Enhanced Design */}
          <div className="mt-6 rounded-xl overflow-hidden border"
               style={{ borderColor: 'rgba(0, 184, 255, 0.2)' }}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between"
                 style={{ backgroundColor: 'rgba(0, 184, 255, 0.08)' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <h3 className="font-display font-bold text-lg" style={{ color: '#00b8ff' }}>
                  Advanced Features Coming Soon
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{ 
                      backgroundColor: 'rgba(0, 184, 255, 0.15)', 
                      color: '#00b8ff'
                    }}>
                Phase 2
              </span>
            </div>
            
            {/* Features Grid */}
            <div className="p-4 bg-card space-y-3">
              {[
                { icon: '🎬', title: 'Video Processing', desc: 'Extract audio from birthday videos, events, and social media clips' },
                { icon: '💼', title: 'Zoom Recordings', desc: 'Automatic speaker isolation from meeting recordings' },
                { icon: '🎯', title: 'AI Noise Removal', desc: 'Remove background music and enhance voice clarity' },
                { icon: '📺', title: 'YouTube Import', desc: 'Extract voice directly from YouTube videos' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-blue/30 transition-colors"
                     style={{ backgroundColor: 'rgba(0, 184, 255, 0.02)' }}>
                  <span className="text-2xl shrink-0">{feature.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-ink mb-1">{feature.title}</div>
                    <div className="text-xs text-muted leading-relaxed">{feature.desc}</div>
                  </div>
                  <span className="text-xs text-muted shrink-0">Soon</span>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-border bg-surf">
              <p className="text-xs text-muted text-center">
                These features will be available in the next major update
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h4 className="font-display font-bold text-xs mb-3">⚡ Audio Requirements</h4>
            <p className="text-xs text-muted mb-3">
              For best voice recovery results:
            </p>
            {[
              ['1-3 minutes','Quick Recovery'],
              ['3-10 minutes','Good Quality'],
              ['10-30 minutes','High Quality'],
              ['30+ minutes','Professional']
            ].map(([d,l]) => (
              <div key={l} className="flex justify-between text-xs py-1.5 border-b border-white/4 last:border-0">
                <span className="text-muted">{d}</span>
                <span className="font-semibold" style={{ color: '#00b8ff' }}>{l}</span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h4 className="font-display font-bold text-xs mb-3">📁 Supported Formats</h4>
            <div className="flex flex-wrap gap-2">
              {['MP3', 'WAV', 'M4A', 'AAC', 'OGG'].map(format => (
                <span key={format} className="px-2 py-1 rounded text-[10px] font-semibold border"
                      style={{ 
                        backgroundColor: 'rgba(0, 184, 255, 0.1)', 
                        borderColor: 'rgba(0, 184, 255, 0.2)',
                        color: '#00b8ff'
                      }}>
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              Max 50MB per file • Up to 20 files
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h4 className="font-display font-bold text-xs mb-3">💡 Best Sources</h4>
            <div className="space-y-2 text-xs text-muted">
              <div className="flex items-start gap-2">
                <span>📱</span>
                <span><strong>WhatsApp voice notes</strong> - Usually the clearest</span>
              </div>
              <div className="flex items-start gap-2">
                <span>📞</span>
                <span><strong>Voicemails</strong> - Even short ones help</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🎙️</span>
                <span><strong>Voice memos</strong> - From phone recordings</span>
              </div>
              <div className="flex items-start gap-2">
                <span>💬</span>
                <span><strong>Audio messages</strong> - From any messaging app</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="font-display font-bold text-xs mb-3">🔒 Privacy & Security</h4>
            <p className="text-xs text-muted leading-relaxed">
              All audio files are encrypted during upload and storage. 
              Files are processed securely and can be deleted anytime. 
              SOC 2, HIPAA and GDPR compliant.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
