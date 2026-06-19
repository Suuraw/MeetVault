'use client'

import { useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Meeting, Highlight } from '@/lib/types'

const highlightColors = [
  { id: 'red', label: 'Action Item', bg: 'bg-red-500/30', border: 'border-red-500', textBg: 'bg-red-500/40' },
  { id: 'green', label: 'Decision', bg: 'bg-green-500/30', border: 'border-green-500', textBg: 'bg-green-500/40' },
  { id: 'yellow', label: 'Follow-up', bg: 'bg-yellow-500/30', border: 'border-yellow-500', textBg: 'bg-yellow-500/40' },
  { id: 'blue', label: 'Key Info', bg: 'bg-blue-500/30', border: 'border-blue-500', textBg: 'bg-blue-500/40' },
]

interface SelectionState {
  start: number
  end: number
  x: number
  y: number
}

export default function MeetingViewer() {
  const router = useRouter()
  const params = useParams()
  const meetingId = params.id as string

  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [selection, setSelection] = useState<SelectionState | null>(null)
  const [saveIndicator, setSaveIndicator] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Load meeting
  useEffect(() => {
    async function loadMeeting() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/meetings/${meetingId}`)
        if (!res.ok) throw new Error('Meeting not found')
        const data = await res.json()
        setMeeting(data)
        setHighlights(data.highlights || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meeting')
      } finally {
        setLoading(false)
      }
    }

    if (meetingId) loadMeeting()
  }, [meetingId])

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    if (!editMode || !transcriptRef.current) return

    const sel = window.getSelection()
    if (!sel || sel.toString().length === 0) {
      setSelection(null)
      return
    }

    const range = sel.getRangeAt(0)
    const preCaretRange = range.cloneRange()
    preCaretRange.selectNodeContents(transcriptRef.current)
    preCaretRange.setEnd(range.endContainer, range.endOffset)
    const start = preCaretRange.toString().length - sel.toString().length
    const end = start + sel.toString().length

    const rect = range.getBoundingClientRect()
    const containerRect = transcriptRef.current.getBoundingClientRect()

    setSelection({
      start,
      end,
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top - 50,
    })
  }, [editMode])

  // Save highlights with debounce
  const saveHighlightsToDb = useCallback((updatedHighlights: Highlight[]) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setSaveIndicator(true)
    setTimeout(() => setSaveIndicator(false), 1000)

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`http://127.0.0.1:8000/meetings/${meetingId}/highlights`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ highlights: updatedHighlights }),
        })
      } catch (err) {
        console.error('Failed to save highlights:', err)
      }
    }, 500)
  }, [meetingId])

  // Handle color selection from popover
  const handleColorSelect = (colorId: string) => {
    if (!selection || !meeting) return

    const newHighlight: Highlight = {
      start: selection.start,
      end: selection.end,
      color: colorId,
    }

    const updatedHighlights = [
      ...highlights.filter(h => !(h.start === selection.start && h.end === selection.end)),
      newHighlight,
    ]

    setHighlights(updatedHighlights)
    setSelection(null)
    saveHighlightsToDb(updatedHighlights)
  }

  // Handle clearing a highlight
  const handleClearHighlight = () => {
    if (!selection) return

    const updatedHighlights = highlights.filter(
      h => !(h.start === selection.start && h.end === selection.end)
    )

    setHighlights(updatedHighlights)
    setSelection(null)
    saveHighlightsToDb(updatedHighlights)
  }

  // Reconstruct text with highlight spans
  const renderTranscript = () => {
    if (!meeting || !meeting.transcript) return null

    const text = meeting.transcript
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)

    if (sortedHighlights.length === 0) {
      return text
    }

    const parts: Array<string | ReactNode> = []
    let lastEnd = 0

    sortedHighlights.forEach((h, idx) => {
      if (h.start > lastEnd) {
        parts.push(text.substring(lastEnd, h.start))
      }

      const colorInfo = highlightColors.find(c => c.id === h.color)
      parts.push(
        <span
          key={`highlight-${idx}`}
          className={`${colorInfo?.textBg || 'bg-yellow-500/40'} rounded px-0.5 cursor-pointer ${editMode ? 'hover:opacity-70' : ''}`}
          onClick={() => {
            if (editMode) {
              setSelection({
                start: h.start,
                end: h.end,
                x: 0,
                y: 0,
              })
            }
          }}
        >
          {text.substring(h.start, h.end)}
        </span>
      )

      lastEnd = h.end
    })

    if (lastEnd < text.length) {
      parts.push(text.substring(lastEnd))
    }

    return parts
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-[200px] flex flex-col">
          <header className="h-16 border-b border-half border-zinc-800 flex items-center justify-between px-4 md:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <div className="h-6 w-40 bg-zinc-800 rounded animate-pulse" />
          </header>
          <div className="p-4 md:p-8 space-y-4 flex-1 pb-20 md:pb-0">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error || !meeting) {
    return (
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 md:ml-[200px] flex flex-col items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-zinc-700 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-zinc-400">{error || 'Meeting not found'}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 text-zinc-300 hover:text-zinc-100 text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  const tagColors: { [key: string]: { bg: string; text: string } } = {
    sprint: { bg: 'bg-blue-900/30', text: 'text-blue-300' },
    standup: { bg: 'bg-teal-900/30', text: 'text-teal-300' },
    backend: { bg: 'bg-amber-900/30', text: 'text-amber-300' },
    interview: { bg: 'bg-green-900/30', text: 'text-green-300' },
    client: { bg: 'bg-zinc-800', text: 'text-zinc-400' },
    design: { bg: 'bg-purple-900/30', text: 'text-purple-300' },
    marketing: { bg: 'bg-pink-900/30', text: 'text-pink-300' },
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-[200px] flex flex-col">
        {/* Header */}
        <header className="border-b border-half border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 md:px-8 h-16">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="text-zinc-500 hover:text-zinc-200 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <h1 className="text-[14px] font-medium text-zinc-100 truncate md:whitespace-normal">{meeting.title}</h1>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`hidden md:block text-[13px] font-medium px-3 h-8 rounded-lg transition-colors ${
                editMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'border border-half border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {editMode ? '✓ Edit Mode' : 'Edit Mode'}
            </button>
          </div>

          {/* Meeting metadata */}
          <div className="px-4 md:px-8 pb-4 flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="flex items-center gap-1 md:gap-1.5 flex-wrap">
              {meeting.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded text-[10px] md:text-[11px] font-medium ${tagColors[tag]?.bg || 'bg-zinc-800'} ${tagColors[tag]?.text || 'text-zinc-400'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-zinc-500 text-[12px] md:text-[13px]">{meeting.date}</span>
            <span className="text-zinc-500 text-[12px] md:text-[13px]">{meeting.duration}</span>

            {/* Auto-save indicator */}
            {saveIndicator && (
              <span className="ml-auto text-[10px] md:text-[11px] text-green-400 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                Saved
              </span>
            )}
          </div>
        </header>

        {/* Mobile edit toggle */}
        <div className="md:hidden px-4 py-3 border-b border-half border-zinc-800 bg-zinc-900">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`w-full text-[13px] font-medium py-2 px-3 rounded-lg transition-colors ${
              editMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'border border-half border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {editMode ? '✓ Edit Mode ON' : 'Enter Edit Mode'}
          </button>
        </div>

        {editMode && (
          <div className="px-4 md:px-8 py-3 border-b border-half border-zinc-800 bg-zinc-900 text-[12px] text-zinc-400">
            Select text with your cursor or highlight to add notes.
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-start px-4 md:px-8 py-8 pb-20 md:pb-8">
          <div
            ref={transcriptRef}
            onMouseUp={handleMouseUp}
            className="max-w-3xl mx-auto w-full"
          >
            <p className="text-[14px] md:text-[15px] leading-relaxed text-zinc-200 break-words">
              {renderTranscript()}
            </p>

            {/* Color picker popover */}
            {selection && editMode && transcriptRef.current && (
              <div
                className="fixed bg-zinc-800 border border-half border-zinc-700 rounded-lg shadow-lg p-2 flex gap-1 z-50"
                style={{
                  left: `${transcriptRef.current.getBoundingClientRect().left + selection.x}px`,
                  top: `${transcriptRef.current.getBoundingClientRect().top + selection.y}px`,
                }}
              >
                {highlightColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorSelect(color.id)}
                    className={`w-6 h-6 rounded transition-all ${color.textBg} border border-half ${color.border} hover:opacity-80`}
                    title={color.label}
                  />
                ))}
                <button
                  onClick={handleClearHighlight}
                  className="w-6 h-6 rounded transition-all border border-half border-zinc-600 hover:border-zinc-500 flex items-center justify-center text-xs text-zinc-400 hover:text-zinc-300"
                  title="Clear"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Export button (floating) */}
<button
  onClick={async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()
      const pageWidth = 190
      const margin = 10

      // title
      doc.setFontSize(20)
      doc.setTextColor(0)
      doc.text(meeting.title ?? 'Meeting', margin, 20)

      // meta
      doc.setFontSize(12)
      doc.setTextColor(100)
      const dateStr = new Date(meeting.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
      doc.text(dateStr, margin, 30)

      // transcript with highlights
      doc.setFontSize(11)
      const text = meeting.transcript ?? ''
      const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)

      const colorMap: Record<string, [number, number, number]> = {
        red:    [254, 202, 202],
        green:  [134, 239, 172],
        yellow: [254, 240, 138],
        blue:   [191, 219, 254],
      }

      // build segments: { text, color? }
      type Segment = { text: string; color?: [number, number, number] }
      const segments: Segment[] = []
      let lastEnd = 0

      sortedHighlights.forEach((h) => {
        if (h.start > lastEnd) {
          segments.push({ text: text.substring(lastEnd, h.start) })
        }
        segments.push({
          text: text.substring(h.start, h.end),
          color: colorMap[h.color] ?? [254, 240, 138],
        })
        lastEnd = h.end
      })
      if (lastEnd < text.length) {
        segments.push({ text: text.substring(lastEnd) })
      }

      let y = 45
      let x = margin
      const lineHeight = 6
      const fontSize = 11
      doc.setFontSize(fontSize)

      segments.forEach((seg) => {
        const words = seg.text.split(/(\s+)/)
        words.forEach((word) => {
          const wordWidth = doc.getTextWidth(word)

          if (x + wordWidth > margin + pageWidth && word.trim() !== '') {
            x = margin
            y += lineHeight
          }

          if (seg.color) {
            const [r, g, b] = seg.color
            doc.setFillColor(r, g, b)
            doc.rect(x, y - 4, wordWidth, lineHeight, 'F')
          }

          doc.setTextColor(0)
          doc.text(word, x, y)
          x += wordWidth

          if (word === '\n') {
            x = margin
            y += lineHeight
          }
        })
      })

      doc.save(`${meeting.title ?? 'meeting'}-${dateStr}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }}
  className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-12 md:w-14 h-12 md:h-14 bg-zinc-100 text-zinc-950 rounded-full shadow-lg hover:bg-zinc-200 transition-colors flex items-center justify-center z-40"
  title="Export as PDF"
>
  <svg className="w-5 md:w-6 h-5 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
</button>
    </div>
  )
}
