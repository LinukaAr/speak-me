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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📁</span>
        <h3 className="font-display font-bold text-lg">Upload Audio Files</h3>
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
            ? 'border-red bg-red/5 scale-[1.02]'
            : 'border-border2 hover:border-red/40 hover:bg-white/5',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
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
            <div className="inline-block w-8 h-8 border-4 border-red/30 border-t-red rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted">Processing files...</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">
              {isDragging ? '📥' : '☁️'}
            </div>
            <p className="text-sm font-semibold text-ink mb-1">
              {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted mb-3">
              MP3, WAV, or M4A files • Max {maxSizeMB}MB per file • Up to {maxFiles} files
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-red/10 border border-red/25 text-red text-xs font-semibold
                         rounded-lg hover:bg-red/18 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              Choose Files
            </button>
          </>
        )}
      </div>

      <div className="mt-4 text-xs text-muted space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>Use clear recordings without background noise</li>
          <li>Single speaker only (your voice)</li>
          <li>Minimum 3 seconds, recommended 1-5 minutes</li>
          <li>You can upload multiple files to reach the target duration</li>
        </ul>
      </div>
    </div>
  )
}
