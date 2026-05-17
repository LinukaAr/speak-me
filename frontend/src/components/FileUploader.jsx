import { useState, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import { validateAudioFile, getAudioDuration, generateAudioFileId, ACCEPTED_EXTENSIONS, MAX_FILE_SIZE_MB } from '@/lib/audioUtils'
import clsx from 'clsx'

export default function FileUploader({ onFilesUploaded, onError, maxFiles = 10, maxSizeMB = MAX_FILE_SIZE_MB }) {
  const { toast } = useApp()
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const processFiles = async (files) => {
    setIsProcessing(true)
    const audioFiles = []
    const errors = []

    for (const file of files) {
      try {
        // Validate file
        const validation = validateAudioFile(file)
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        // Get duration
        const duration = await getAudioDuration(file)

        // Create audio file object
        const audioFile = {
          id: generateAudioFileId(),
          name: file.name,
          blob: file,
          duration,
          format: file.type,
          source: 'upload',
          timestamp: Date.now(),
        }

        audioFiles.push(audioFile)
      } catch (error) {
        errors.push(`${file.name}: Failed to process file`)
      }
    }

    setIsProcessing(false)

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach(error => toast(`❌ ${error}`))
      if (errors.length === files.length) {
        onError(new Error('All files failed validation'))
        return
      }
    }

    // Call callback with successfully processed files
    if (audioFiles.length > 0) {
      onFilesUploaded(audioFiles)
      toast(`✓ ${audioFiles.length} file${audioFiles.length > 1 ? 's' : ''} uploaded successfully`)
    }
  }

  const handleFileInput = (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      if (files.length > maxFiles) {
        toast(`❌ Maximum ${maxFiles} files allowed`)
        return
      }
      processFiles(files)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set dragging to false if leaving the drop zone itself
    if (e.currentTarget === e.target) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      if (files.length > maxFiles) {
        toast(`❌ Maximum ${maxFiles} files allowed`)
        return
      }
      processFiles(files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-card border-2 rounded-xl p-6"
         style={{ borderColor: 'rgba(0, 184, 255, 0.3)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📁</span>
          <h3 className="font-display font-bold text-lg">Upload Audio Files</h3>
        </div>
        <span className="px-2 py-1 rounded text-[10px] font-bold"
              style={{ 
                backgroundColor: 'rgba(0, 184, 255, 0.1)', 
                color: '#00b8ff'
              }}>
          AUDIO ONLY
        </span>
      </div>

      {/* Supported Formats Banner */}
      <div className="mb-4 p-3 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(0, 184, 255, 0.05)', 
             borderColor: 'rgba(0, 184, 255, 0.2)'
           }}>
        <div className="flex items-start gap-2">
          <span className="text-sm">⚠️</span>
          <div className="flex-1">
            <p className="text-xs font-semibold mb-1" style={{ color: '#00b8ff' }}>
              Supported Audio Formats Only
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['MP3', 'WAV', 'M4A', 'AAC', 'OGG'].map(format => (
                <span key={format} className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{ 
                        backgroundColor: 'rgba(0, 184, 255, 0.15)', 
                        borderColor: 'rgba(0, 184, 255, 0.3)',
                        color: '#00b8ff'
                      }}>
                  .{format.toLowerCase()}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-muted">
              Video files (.mp4, .mov) will be supported in Phase 2
            </p>
          </div>
        </div>
      </div>

      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          isDragging
            ? 'scale-[1.02]'
            : 'hover:bg-white/5',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
        style={isDragging ? {
          borderColor: '#00b8ff',
          backgroundColor: 'rgba(0, 184, 255, 0.08)'
        } : {
          borderColor: 'rgba(0, 184, 255, 0.3)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        {isProcessing ? (
          <div className="py-4">
            <div className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-3"
                 style={{ borderColor: '#00b8ff', borderTopColor: 'transparent' }} />
            <p className="text-sm text-muted">Processing files...</p>
          </div>
        ) : (
          <>
            <div className="text-5xl mb-3">
              {isDragging ? '📥' : '🎵'}
            </div>
            <p className="text-base font-bold text-ink mb-2">
              {isDragging ? 'Drop audio files here' : 'Upload Your Audio Recordings'}
            </p>
            <p className="text-sm text-muted mb-4">
              Click to browse or drag and drop audio files
            </p>
            <button
              type="button"
              className="px-6 py-2.5 text-white text-sm font-bold rounded-xl
                         hover:-translate-y-0.5 hover:shadow-lg transition-all"
              style={{ backgroundColor: '#00b8ff' }}
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              Choose Audio Files
            </button>
            <p className="text-xs text-muted mt-3">
              Max {maxSizeMB}MB per file • Up to {maxFiles} files
            </p>
          </>
        )}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-surf border border-border">
        <p className="text-xs font-semibold text-ink mb-2">💡 Best Practices:</p>
        <ul className="text-xs text-muted space-y-1">
          <li>• <strong>Clear audio:</strong> Minimal background noise</li>
          <li>• <strong>Single speaker:</strong> Only your voice</li>
          <li>• <strong>Duration:</strong> Minimum 3 seconds, recommended 1-5 minutes</li>
          <li>• <strong>Multiple files:</strong> Combine several recordings for better quality</li>
        </ul>
      </div>

      {/* Test Mode Info */}
      <div className="mt-4 p-3 rounded-lg border"
           style={{ 
             backgroundColor: 'rgba(255, 193, 7, 0.05)', 
             borderColor: 'rgba(255, 193, 7, 0.2)'
           }}>
        <div className="flex items-start gap-2">
          <span className="text-sm">🧪</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber mb-1">
              Don't have audio files to test?
            </p>
            <p className="text-[10px] text-muted leading-relaxed">
              You can record a voice memo on your phone and transfer it, or use any audio recording app. 
              Most voice recorder apps save as MP3 or M4A format which are supported.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
