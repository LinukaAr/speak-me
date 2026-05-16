import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import Waveform from '@/components/ui/Waveform'
import { getAudioDuration, generateAudioFileId, formatDuration } from '@/lib/audioUtils'
import { Mic, Pause, Play, Square } from 'lucide-react'
import clsx from 'clsx'

export default function AudioRecorder({ onRecordingComplete, onError }) {
  const { toast } = useApp()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const timerRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle stop
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
          const duration = await getAudioDuration(audioBlob)
          
          const audioFile = {
            id: generateAudioFileId(),
            name: `recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${mimeType.split('/')[1]}`,
            blob: audioBlob,
            duration,
            format: mimeType,
            source: 'recording',
            timestamp: Date.now(),
          }

          onRecordingComplete(audioFile)
          toast(`✓ Recording saved (${formatDuration(duration)})`)
        } catch (error) {
          onError(error)
          toast('❌ Failed to process recording')
        }

        // Cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
        setIsRecording(false)
        setRecordingDuration(0)
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingDuration(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)

      toast('🎙 Recording started')
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        onError(new Error('Microphone permission denied'))
        toast('❌ Microphone permission denied. Please allow microphone access in your browser settings.')
      } else if (error.name === 'NotFoundError') {
        onError(new Error('No microphone found'))
        toast('❌ No microphone found. Please connect a microphone and try again.')
      } else {
        onError(error)
        toast('❌ Failed to start recording')
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mic size={20} className="text-muted" />
        <h3 className="font-display font-bold text-lg">Record Your Voice</h3>
      </div>

      {!isRecording ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted mb-6">
            Click the button below to start recording your voice. Speak clearly and naturally.
          </p>
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 mx-auto
                       bg-red text-white text-sm font-semibold rounded-xl
                       hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red/30
                       transition-all active:scale-[.97]"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            Start Recording
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Waveform visualization */}
          <div className="bg-surf rounded-xl p-4">
            <Waveform bars={18} active={!isPaused} className="mb-2" />
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-ink">
                {formatDuration(recordingDuration)}
              </div>
              <div className="text-xs text-muted mt-1">
                {isPaused ? 'Paused' : 'Recording...'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            {!isPaused ? (
              <button
                onClick={pauseRecording}
                className="flex items-center gap-2 px-4 py-2 bg-amber/10 border border-amber/25 text-amber
                           text-sm font-semibold rounded-lg hover:bg-amber/18 transition-colors"
              >
                <Pause size={14} /> Pause
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="flex items-center gap-2 px-4 py-2 bg-blue/10 border border-blue/25 text-blue
                           text-sm font-semibold rounded-lg hover:bg-blue/18 transition-colors"
              >
                <Play size={14} /> Resume
              </button>
            )}
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red/10 border border-red/25 text-red
                         text-sm font-semibold rounded-lg hover:bg-red/18 transition-colors"
            >
              <Square size={14} /> Stop & Save
            </button>
          </div>

          <p className="text-xs text-muted text-center">
            Minimum 3 seconds required • Recommended: 1-5 minutes for good quality
          </p>
        </div>
      )}
    </div>
  )
}
