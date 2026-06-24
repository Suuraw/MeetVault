'use client'

import { useState, useRef } from 'react'
import { Meeting } from '@/lib/types'

interface NewMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onMeetingCreated?: (meeting: Meeting) => void
}

export function NewMeetingModal({ isOpen, onClose, onMeetingCreated }: NewMeetingModalProps) {
  const [tags, setTags] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTag = (tag: string) => setTags(prev => [...prev, tag])
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      setAudioFile(file)
      setError(null)
      if (!date) {
        const today = new Date().toISOString().split('T')[0]
        setDate(today)
      }
    } else {
      setError('Please select an audio or video file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-zinc-500', 'bg-zinc-800/50')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-zinc-500', 'bg-zinc-800/50')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-zinc-500', 'bg-zinc-800/50')
    }
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile || !title) {
      setError('Please select audio file and enter title')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('title', title)
      formData.append('tags', JSON.stringify(tags))
      formData.append('recorded_at', date ? date : new Date().toISOString())

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcribe`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Transcription failed')
      const meeting = await res.json()
      onMeetingCreated?.(meeting)
      setTitle('')
      setDate('')
      setTags([])
      setAudioFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transcribe audio')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setTitle('')
      setDate('')
      setTags([])
      setAudioFile(null)
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Desktop Modal */}
      <div className="hidden md:flex fixed inset-0 bg-zinc-950/80 backdrop-blur-[2px] z-50 items-center justify-center p-4">
        <div className="bg-zinc-900 border border-half border-zinc-800 rounded-xl w-full max-w-[420px] overflow-hidden">
          <ModalContent
            tags={tags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            title={title}
            date={date}
            audioFile={audioFile}
            loading={loading}
            error={error}
            dropZoneRef={dropZoneRef}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTitleChange={setTitle}
            onDateChange={setDate}
            onTranscribe={handleTranscribe}
            onClose={handleClose}
          />
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col">
        <div className="flex-1 bg-zinc-950/80 backdrop-blur-[2px]" onClick={handleClose} />
        <div className="bg-zinc-900 border-t border-half border-zinc-800 rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <ModalContent
            tags={tags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            title={title}
            date={date}
            audioFile={audioFile}
            loading={loading}
            error={error}
            dropZoneRef={dropZoneRef}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTitleChange={setTitle}
            onDateChange={setDate}
            onTranscribe={handleTranscribe}
            onClose={handleClose}
            isMobile
          />
        </div>
      </div>
    </>
  )
}

interface ModalContentProps {
  tags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  title: string
  date: string
  audioFile: File | null
  loading: boolean
  error: string | null
  dropZoneRef: React.RefObject<HTMLDivElement>
  fileInputRef: React.RefObject<HTMLInputElement>
  onFileSelect: (file: File) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onTitleChange: (value: string) => void
  onDateChange: (value: string) => void
  onTranscribe: () => void
  onClose: () => void
  isMobile?: boolean
}

const AVAILABLE_TAGS = [
  'sprint', 'standup', 'Training','backend', 'frontend', 'design', 'review',
  'planning', 'retrospective', 'interview', 'client', 'demo',
  'onboarding', '1on1', 'all-hands', 'hiring',
]

function ModalContent(props: ModalContentProps) {
  const {
    tags, onAddTag, onRemoveTag,
    title, date, audioFile, loading, error,
    dropZoneRef, fileInputRef, onFileSelect, onDragOver, onDragLeave, onDrop,
    onTitleChange, onDateChange, onTranscribe, onClose, isMobile
  } = props

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 sticky top-0 bg-zinc-900 border-b border-half border-zinc-800">
        {isMobile && (
          <div className="flex-1 flex justify-center">
            <div className="w-10 h-1 bg-zinc-700 rounded-full" />
          </div>
        )}
        <h2 className={`text-[14px] font-medium text-zinc-100 ${isMobile ? 'absolute left-6' : ''}`}>New Meeting</h2>
        {!isMobile && (
          <button
            onClick={onClose}
            disabled={loading}
            className="text-zinc-500 hover:text-zinc-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-6 space-y-6">
        {/* Drop zone */}
        <div
          ref={dropZoneRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-dashed border border-half border-zinc-700 rounded-xl p-8 text-center bg-zinc-800/30 hover:border-zinc-500 transition-colors cursor-pointer group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*"
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
            className="hidden"
          />
          {audioFile ? (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p className="text-[13px] text-zinc-300 font-medium truncate">{audioFile.name}</p>
                <p className="text-[11px] text-zinc-500 mt-1">File selected</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-zinc-400 group-hover:text-zinc-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <div>
                <p className="text-[13px] text-zinc-500">Drop audio file here</p>
                <p className="text-[11px] text-zinc-600 mt-1">.mp3 · .mp4 · .wav · .m4a</p>
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Title</label>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              disabled={loading}
              className="w-full h-9 bg-zinc-950 border border-half border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 disabled:opacity-50"
              placeholder="Weekly Sync..."
              type="text"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Tags</label>

            {/* Pills */}
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {tags.length === 0 ? (
                <span className="text-[11px] text-zinc-600 italic">No tags added</span>
              ) : (
                tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-full text-[12px] text-zinc-300">
                    {t}
                    <button
                      onClick={() => onRemoveTag(t)}
                      disabled={loading}
                      className="text-zinc-500 hover:text-zinc-200 leading-none disabled:opacity-50"
                    >×</button>
                  </span>
                ))
              )}
            </div>

            {/* Select → auto-add on change */}
            <select
              value=""
              onChange={(e) => { if (e.target.value) onAddTag(e.target.value) }}
              disabled={loading || AVAILABLE_TAGS.every(t => tags.includes(t))}
              className="w-full h-9 bg-zinc-950 border border-half border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-700 disabled:opacity-50"
            >
              <option value="" disabled>Select tag...</option>
              {AVAILABLE_TAGS.filter(t => !tags.includes(t)).map(item => (
                <option key={item} value={item} className="bg-zinc-950">{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Date</label>
            <div className="relative">
              <input
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                disabled={loading}
                className="w-full h-9 bg-zinc-950 border border-half border-zinc-800 rounded-lg px-3 pl-9 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
                type="date"
              />
              <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-[11px] text-zinc-600 italic">auto-set on upload</p>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-half border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[13px] text-zinc-500">Whisper transcription</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${loading ? 'bg-amber-900/30 text-amber-300' : 'bg-zinc-800 text-zinc-500'}`}>
            {loading ? 'Processing' : 'Ready'}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
            <p className="text-[12px] text-red-300">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={onTranscribe}
          disabled={loading || !audioFile || !title}
          className="w-full h-9 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 12a11 11 0 1 1-9-10.6" />
            </svg>
          )}
          {loading ? 'Transcribing...' : 'Transcribe + Save'}
        </button>
      </div>
    </>
  )
}