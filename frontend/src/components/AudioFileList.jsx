import { useState, useEffect, useRef } from 'react'
import { formatDuration, getQualityIndicator } from '@/lib/audioUtils'
import clsx from 'clsx'

export default function AudioFileList({ audioFiles, onDelete, onPlay }) {
  const [playingFileId, setPlayingFileId] = useState(null)
  const audioElementRef = useRef(null)
  const objectUrlsRef = useRef(new Map())

  // Calculate total duration and quality
  const totalDuration = audioFiles.reduce((sum, file) => sum + file.duration, 0)
  const qualityInfo = getQualityIndicator(totalDuration)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url))
      objectUrlsRef.current.clear()
    }
  }, [])

  // Cleanup object URLs when files are removed
  useEffect(() => {
    const currentFileIds = new Set(audioFiles.map(f => f.id))
    objectUrlsRef.current.forEach((url, id) => {
      if (!currentFileIds.has(id)) {
        URL.revokeObjectURL(url)
        objectUrlsRef.current.delete(id)
      }
    })
  }, [audioFiles])

  const handlePlay = (audioFile) => {
    // If already playing this file, pause it
    if (playingFileId === audioFile.id) {
      if (audioElementRef.current) {
        audioElementRef.current.pause()
        setPlayingFileId(null)
      }
      return
    }

    // Stop current playback if any
    if (audioElementRef.current) {
      audioElementRef.current.pause()
    }

    // Get or create object URL
    let objectUrl = objectUrlsRef.current.get(audioFile.id)
    if (!objectUrl) {
      objectUrl = URL.createObjectURL(audioFile.blob)
      objectUrlsRef.current.set(audioFile.id, objectUrl)
    }

    // Create new audio element and play
    const audio = new Audio(objectUrl)
    audioElementRef.current = audio

    audio.addEventListener('ended', () => {
      setPlayingFileId(null)
    })

    audio.addEventListener('error', () => {
      setPlayingFileId(null)
    })

    audio.play()
    setPlayingFileId(audioFile.id)
    
    if (onPlay) {
      onPlay(audioFile.id)
    }
  }

  const handleDelete = (audioFile) => {
    // Stop playback if this file is playing
    if (playingFileId === audioFile.id && audioElementRef.current) {
      audioElementRef.current.pause()
      setPlayingFileId(null)
    }

    // Revoke object URL
    const objectUrl = objectUrlsRef.current.get(audioFile.id)
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrlsRef.current.delete(audioFile.id)
    }

    onDelete(audioFile.id)
  }

  const getFormatBadge = (format) => {
    const formatMap = {
      'audio/mp3': 'MP3',
      'audio/mpeg': 'MP3',
      'audio/wav': 'WAV',
      'audio/x-m4a': 'M4A',
      'audio/m4a': 'M4A',
      'audio/webm': 'WEBM',
      'audio/mp4': 'MP4',
    }
    return formatMap[format] || 'AUDIO'
  }

  if (audioFiles.length === 0) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg">Audio Files ({audioFiles.length})</h3>
        <div className="text-right">
          <div className="text-sm font-semibold text-ink">
            Total: {formatDuration(totalDuration)}
          </div>
          <div className={clsx(
            'text-xs font-medium mt-0.5',
            qualityInfo.color === 'red' && 'text-red',
            qualityInfo.color === 'amber' && 'text-amber',
            qualityInfo.color === 'blue' && 'text-blue',
            qualityInfo.color === 'green' && 'text-green'
          )}>
            {qualityInfo.message}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {audioFiles.map((audioFile) => (
          <div
            key={audioFile.id}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-lg border transition-all',
              playingFileId === audioFile.id
                ? 'bg-green/5 border-green/30'
                : 'bg-surf border-border hover:border-border2'
            )}
          >
            {/* Icon */}
            <div className="text-2xl shrink-0">
              {audioFile.source === 'recording' ? '🎤' : '📁'}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink truncate">
                {audioFile.name}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted">
                  {formatDuration(audioFile.duration)}
                </span>
                <span className="text-xs text-subtle">•</span>
                <span className={clsx(
                  'text-[10px] px-1.5 py-0.5 rounded font-medium',
                  'bg-subtle/50 text-muted'
                )}>
                  {getFormatBadge(audioFile.format)}
                </span>
                <span className="text-xs text-subtle">•</span>
                <span className="text-xs text-muted capitalize">
                  {audioFile.source}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handlePlay(audioFile)}
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                  playingFileId === audioFile.id
                    ? 'bg-green/10 border border-green/30 text-green hover:bg-green/18'
                    : 'bg-blue/10 border border-blue/30 text-blue hover:bg-blue/18'
                )}
                title={playingFileId === audioFile.id ? 'Pause' : 'Play'}
              >
                {playingFileId === audioFile.id ? '⏸' : '▶'}
              </button>
              <button
                onClick={() => handleDelete(audioFile)}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           bg-red/10 border border-red/30 text-red hover:bg-red/18
                           transition-all"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalDuration < 3 && (
        <div className="mt-4 p-3 bg-red/5 border border-red/20 rounded-lg">
          <p className="text-xs text-red">
            ⚠️ <strong>Minimum duration not met.</strong> You need at least 3 seconds of audio to create a voice clone.
            Current total: {formatDuration(totalDuration)}
          </p>
        </div>
      )}
    </div>
  )
}
