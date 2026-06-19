'use client'

interface HeaderProps {
  onNewMeeting: () => void
}

export function Header({ onNewMeeting }: HeaderProps) {
  return (
    <header className="h-16 border-b border-half border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
      <h1 className="text-[14px] font-medium text-zinc-100">Meetings</h1>
      <button
        onClick={onNewMeeting}
        className="bg-zinc-100 text-zinc-950 text-[13px] font-medium px-4 h-8 rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Meeting
      </button>
    </header>
  )
}
