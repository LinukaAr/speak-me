import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import AudioRecorder from '@/components/AudioRecorder'
import FileUploader from '@/components/FileUploader'
import AudioFileList from '@/components/AudioFileList'
import VoiceCloneProgress from '@/components/VoiceCloneProgress'
import { cloneVoiceFromFiles, handleApiError } from '@/lib/elevenlabs'
import { supabase, db, storage, handleSupabaseError } from '@/lib/supabase'

export default function VoiceBankingPage() {
  const { user, supabaseUserId, setVoiceId, toast } = useApp()
  const navigate = useNavigate()
  
  // Debug: Log user state
  useEffect(() => {
    console.log('🔍 VoiceBankingPage mounted')
    console.log('User from AppContext:', user)
    console.log('Supabase User ID:', supabaseUserId)
  }, [user, supabaseUserId])
  
  const [audioFiles, setAudioFiles] = useState([])
  const [cloneStatus, setCloneStatus] = useState('idle') // 'idle' | 'uploading' | 'processing' | 'success' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const [clonedVoiceId, setClonedVoiceId] = useState(null)
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
    console.log('🔵 Clone button clicked!')
    console.log('Can clone:', canClone)
    console.log('User:', user)
    console.log('Audio files:', audioFiles)
    console.log('Total duration:', totalDuration)
    
    if (!canClone) {
      toast('⚠️ You need at least 3 seconds of audio to clone your voice')
      return
    }

    // Use a default name if user is not set (shouldn't happen, but fallback)
    const userName = user?.name || user?.email || 'My Voice'
    console.log('Using name:', userName)

    // Check if Supabase is configured
    const isSupabaseConfigured = supabaseUserId !== null
    console.log('Supabase configured:', isSupabaseConfigured)

    try {
      setCloneStatus('uploading')
      setUploadProgress(0)
      setErrorMessage(null)
      
      console.log('🟢 Starting voice cloning process...')

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
        
        toast('✅ Files uploaded to cloud storage')
      }

      // Step 2: Clone voice with ElevenLabs
      console.log('🟡 Calling ElevenLabs API...')
      console.log('User name:', userName)
      console.log('Audio files to send:', audioFiles.map(f => ({ name: f.name, duration: f.duration, size: f.blob.size })))
      
      toast('🧬 Cloning voice with ElevenLabs AI...')
      setUploadProgress(60)
      
      const result = await cloneVoiceFromFiles(userName, audioFiles)
      
      console.log('✅ ElevenLabs response:', result)
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
      
      // Set success status
      setCloneStatus('success')
      toast('✅ Voice cloned successfully!')
      
      // Show info about storage
      if (!isSupabaseConfigured) {
        console.info('💡 Tip: Configure Supabase to save audio files and enable multi-device sync')
      }
      
    } catch (error) {
      console.error('❌ Voice cloning error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response,
      })
      
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
    <div className="z-content screen-enter px-8 py-8 max-w-7xl mx-auto">
      {/* Debug Banner */}
      {!user && (
        <div className="mb-6 p-4 bg-amber/10 border border-amber/30 rounded-xl">
          <div className="font-bold text-amber mb-1">⚠️ Not Logged In</div>
          <div className="text-sm text-muted">
            You need to sign in first. User data: {JSON.stringify(user)}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-2 px-4 py-2 bg-amber text-white rounded-lg text-sm font-semibold"
          >
            Go to Login
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2px]
                        uppercase text-red mb-4">
          <span className="w-4 h-px bg-red" />
          Voice Banking
        </div>
        <h1 className="font-display font-black text-5xl tracking-[-2px] leading-[.95] mb-3">
          Clone Your Voice
        </h1>
        <p className="text-muted text-[15px] leading-relaxed max-w-2xl">
          Record or upload audio files of your voice. We'll use ElevenLabs AI to create a digital clone
          that you can use for text-to-speech synthesis.
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Audio Recorder */}
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onError={handleError}
        />

        {/* File Uploader */}
        <FileUploader
          onFilesUploaded={handleFilesUploaded}
          onError={handleError}
        />
      </div>

      {/* Audio File List */}
      {audioFiles.length > 0 && (
        <div className="mb-6">
          <AudioFileList
            audioFiles={audioFiles}
            onDelete={handleDeleteFile}
          />
        </div>
      )}

      {/* Clone Button */}
      {audioFiles.length > 0 && cloneStatus === 'idle' && (
        <div className="mb-6">
          <button
            onClick={handleCloneVoice}
            disabled={!canClone}
            className="w-full py-4 bg-gradient-to-r from-red to-purple text-white
                       text-lg font-bold rounded-xl
                       hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red/30
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       transition-all active:scale-[.98]"
          >
            {canClone ? '🧬 Clone My Voice with ElevenLabs' : '⚠️ Need at least 3 seconds of audio'}
          </button>
          <p className="text-center text-xs text-muted mt-2">
            Minimum 3 seconds required • Recommended: 1-5 minutes for good quality • 30+ minutes for professional quality
          </p>
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
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-semibold text-sm mb-1">Record or Upload</h4>
              <p className="text-xs text-muted leading-relaxed">
                Use your microphone to record your voice, or upload existing audio files (MP3, WAV, M4A).
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-semibold text-sm mb-1">Clone with AI</h4>
              <p className="text-xs text-muted leading-relaxed">
                ElevenLabs AI analyzes your voice and creates a digital clone that captures your unique tone and style.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">3️⃣</div>
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
