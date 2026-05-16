import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import AudioRecorder from '@/components/AudioRecorder'
import FileUploader from '@/components/FileUploader'
import AudioFileList from '@/components/AudioFileList'
import VoiceCloneProgress from '@/components/VoiceCloneProgress'
import { cloneVoiceFromFiles, handleApiError } from '@/lib/elevenlabs'
import { db, storage } from '@/lib/supabase'
import { Dna, AlertTriangle, Mic, Upload, Volume2 } from 'lucide-react'
import clsx from 'clsx'

export default function VoiceBankingPage() {
  const { user, supabaseUserId, setVoiceId, toast } = useApp()
  const navigate = useNavigate()
  
  const [audioFiles, setAudioFiles] = useState([])
  const [cloneStatus, setCloneStatus] = useState('idle') // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [clonedVoiceId, setClonedVoiceId] = useState(null)
  const [inputMode, setInputMode] = useState('record') // 'record' | 'upload'
  const [clonedVoiceName, setClonedVoiceName] = useState(null)

  // Calculate total duration
  const totalDuration = audioFiles.reduce((sum, file) => sum + file.duration, 0)
  const canClone = totalDuration >= 3

  // Handle recording complete
  const handleRecordingComplete = (audioFile) => {
    setAudioFiles(prev => [...prev, audioFile])
  }

  // Handle files uploaded
  const handleFilesUploaded = (newFiles) => {
    setAudioFiles(prev => [...prev, ...newFiles])
  }

  // Handle file deletion
  const handleDeleteFile = (fileId) => {
    setAudioFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Handle error
  const handleError = (error) => {
    console.error('Error:', error)
  }

  // Handle voice cloning
  const handleCloneVoice = async () => {
    if (!canClone) {
      toast('⚠️ You need at least 3 seconds of audio to clone your voice')
      return
    }

    const userName = user?.name || user?.email || 'My Voice'
    const isSupabaseConfigured = supabaseUserId !== null

    try {
      setCloneStatus('uploading')
      setUploadProgress(0)
      setErrorMessage(null)

      let voiceCloneId = null
      let uploadedFilePaths = []

      // Step 1: Upload audio files to Supabase Storage (if configured)
      if (isSupabaseConfigured) {
        toast('📤 Uploading audio files to cloud storage...')
        
        // Create a temporary voice clone ID for organizing files
        voiceCloneId = crypto.randomUUID()
        
        for (let i = 0; i < audioFiles.length; i++) {
          const audioFile = audioFiles[i]
          
          // Convert blob to File object if needed
          const file = audioFile.blob instanceof File 
            ? audioFile.blob 
            : new File([audioFile.blob], audioFile.name, { type: audioFile.blob.type })
          
          // Upload to Supabase Storage
          const { path, error } = await storage.uploadAudio(supabaseUserId, voiceCloneId, file)
          
          if (error) {
            console.error('Storage upload error:', error)
            toast(`⚠️ Failed to upload ${audioFile.name} to storage`)
            // Continue anyway - we can still clone without storage
          } else {
            uploadedFilePaths.push({
              path,
              fileName: audioFile.name,
              fileSize: audioFile.blob.size,
              duration: audioFile.duration,
              source: audioFile.source,
            })
          }
          
          // Update progress
          setUploadProgress(Math.floor(((i + 1) / audioFiles.length) * 50))
        }
        
      }

      // Step 2: Clone voice with ElevenLabs
      toast('🧬 Cloning voice with ElevenLabs AI...')
      setUploadProgress(60)
      
      const result = await cloneVoiceFromFiles(userName, audioFiles)
      setUploadProgress(80)
      
      // Step 3: Save voice clone metadata to Supabase (if configured)
      if (isSupabaseConfigured && voiceCloneId) {
        toast('💾 Saving voice clone metadata...')
        
        // Create voice clone record
        const { voiceClone, error: voiceCloneError } = await db.createVoiceClone({
          user_id: supabaseUserId,
          elevenlabs_voice_id: result.voice_id,
          voice_name: result.name,
          is_active: true,
          metadata: {
            total_duration: totalDuration,
            file_count: audioFiles.length,
          },
        })
        
        if (voiceCloneError) {
          console.error('Failed to save voice clone:', voiceCloneError)
          toast('⚠️ Voice cloned but failed to save metadata')
        } else {
          // Save audio recording metadata
          for (const fileData of uploadedFilePaths) {
            await db.createAudioRecording({
              user_id: supabaseUserId,
              voice_clone_id: voiceClone.id,
              file_name: fileData.fileName,
              file_path: fileData.path,
              file_size: fileData.fileSize,
              duration_seconds: fileData.duration,
              source: fileData.source,
            })
          }
          
          toast('✅ Voice clone metadata saved')
        }
      }
      
      setUploadProgress(100)
      
      // Set processing status
      setCloneStatus('processing')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save voice ID to AppContext (and localStorage as fallback)
      setVoiceId(result.voice_id, result.name)
      setClonedVoiceId(result.voice_id)
      setClonedVoiceName(result.name)
      
      setCloneStatus('success')
    } catch (error) {
      const friendlyError = handleApiError(error, error.response)
      setErrorMessage(friendlyError)
      setCloneStatus('error')
      toast('❌ Voice cloning failed: ' + friendlyError)
    }
  }

  // Handle retry
  const handleRetry = () => {
    setCloneStatus('idle')
    setUploadProgress(0)
    setErrorMessage(null)
  }

  // Navigate to speak page
  const handleNavigateToSpeak = () => {
    navigate('/speak')
  }

  return (
    <div className="z-content screen-enter px-4 sm:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px]
                        uppercase text-red mb-4">
          <span className="w-4 h-px bg-red" />
          Voice Banking
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl tracking-[-1px] sm:tracking-[-2px] leading-[.95] mb-3">
          Clone Your Voice
        </h1>
        <p className="text-muted text-[15px] leading-relaxed max-w-2xl">
          Record or upload audio files of your voice. We'll use ElevenLabs AI to create a digital clone
          that you can use for text-to-speech synthesis.
        </p>
      </div>

      {/* Input mode toggle */}
      <div className="inline-flex items-center bg-surf border border-border rounded-xl p-1 mb-6">
        <button
          onClick={() => setInputMode('record')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            inputMode === 'record'
              ? 'bg-card shadow-sm text-ink border border-border'
              : 'text-muted hover:text-ink'
          )}
        >
          <Mic size={15} /> Record
        </button>
        <button
          onClick={() => setInputMode('upload')}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
            inputMode === 'upload'
              ? 'bg-card shadow-sm text-ink border border-border'
              : 'text-muted hover:text-ink'
          )}
        >
          <Upload size={15} /> Upload file
        </button>
      </div>

      {/* Main content */}
      <div className="mb-6">
        {inputMode === 'record' ? (
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            onError={handleError}
          />
        ) : (
          <FileUploader
            onFilesUploaded={handleFilesUploaded}
            onError={handleError}
          />
        )}
      </div>

      {/* Clone Button — shown right after recording, before file list */}
      {audioFiles.length > 0 && cloneStatus === 'idle' && (
        <div className="mb-6">
          <button
            onClick={handleCloneVoice}
            disabled={!canClone}
            className="w-full py-4 bg-gradient-to-r from-red to-purple text-white
                       text-base font-bold rounded-xl
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red/30
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       transition-all active:scale-[.98]"
          >
            {canClone
              ? <span className="flex items-center justify-center gap-2"><Dna size={18} /> Clone My Voice with ElevenLabs</span>
              : <span className="flex items-center justify-center gap-2"><AlertTriangle size={18} /> Need at least 3 seconds of audio</span>
            }
          </button>
          <p className="text-center text-xs text-muted mt-2">
            Minimum 3 seconds required · Recommended: 1–5 minutes for good quality
          </p>
        </div>
      )}

      {/* Audio File List */}
      {audioFiles.length > 0 && (
        <div className="mb-6">
          <AudioFileList
            audioFiles={audioFiles}
            onDelete={handleDeleteFile}
          />
        </div>
      )}

      {/* Progress Component */}
      <VoiceCloneProgress
        status={cloneStatus}
        progress={uploadProgress}
        voiceId={clonedVoiceId}
        voiceName={clonedVoiceName}
        errorMessage={errorMessage}
        onRetry={handleRetry}
        onNavigateToSpeak={handleNavigateToSpeak}
      />

      {/* Info Section */}
      {audioFiles.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display font-bold text-lg mb-3">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue/10 border border-blue/20 flex items-center justify-center mb-3">
                <Mic size={18} className="text-blue" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Record or Upload</h4>
              <p className="text-xs text-muted leading-relaxed">
                Use your microphone to record your voice, or upload existing audio files (MP3, WAV, M4A).
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center mb-3">
                <Dna size={18} className="text-purple" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Clone with AI</h4>
              <p className="text-xs text-muted leading-relaxed">
                ElevenLabs AI analyzes your voice and creates a digital clone that captures your unique tone and style.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-green/10 border border-green/20 flex items-center justify-center mb-3">
                <Volume2 size={18} className="text-green" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Speak Anything</h4>
              <p className="text-xs text-muted leading-relaxed">
                Type any text and hear it spoken in your own voice. Use it for communication, messages, or content creation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
