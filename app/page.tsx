'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { FilterTabs } from '@/components/filter-tabs'
import { MeetingCard } from '@/components/meeting-card'
import { NewMeetingModal } from '@/components/new-meeting-modal'
import { StatusBadge } from '@/components/status-badge'
import { Meeting } from '@/lib/types'

export default function Page() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  // Load meetings from API
  useEffect(() => {
    async function loadMeetings() {
      try {
        const res = await fetch('http://127.0.0.1:8000/meetings')
        if (res.ok) {
          const data = await res.json()
          setMeetings(data)
        }
      } catch (error) {
        console.error('Failed to load meetings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMeetings()
  }, [])

  // Filter meetings by tag
  const filteredMeetings = activeFilter === 'All'
    ? meetings
    : meetings.filter(m => m.tags.includes(activeFilter))

  // Get all tags for filter
  const allTags = Array.from(new Set(meetings.flatMap(m => m.tags)))

  const handleNewMeetingCreated = (newMeeting: Meeting) => {
    setMeetings([newMeeting, ...meetings])
    setModalOpen(false)
  }

  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meeting/${meetingId}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row pb-16 md:pb-0">
      <Sidebar />
      <main className="flex-1 md:ml-[200px] flex flex-col">
        <Header onNewMeeting={() => setModalOpen(true)} />
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} tags={allTags} />
        <section className="p-4 md:p-8 space-y-3 flex-1 overflow-y-auto">
          {loading ? (
            // Loading skeleton
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-zinc-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredMeetings.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16">
              <svg className="w-12 h-12 text-zinc-700 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="1" />
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <p className="text-zinc-400 text-sm">No meetings yet</p>
              <p className="text-zinc-500 text-xs mt-1">Create your first meeting to get started</p>
            </div>
          ) : (
            filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                id={meeting.id}
                title={meeting.title}
                tags={meeting.tags}
                date={new Date(meeting.recorded_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
                duration={meeting.duration}
                onClick={() => handleMeetingClick(meeting.id)}
              />
            ))
          )}
        </section>
      </main>
      <NewMeetingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onMeetingCreated={handleNewMeetingCreated}
      />
      <StatusBadge />
    </div>
  )
}
