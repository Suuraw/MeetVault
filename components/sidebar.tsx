'use client'

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[200px] border-r border-half border-zinc-800 flex-col fixed h-screen bg-zinc-950 z-20">
        <div className="p-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-zinc-100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
          </svg>
          <span className="text-[14px] font-medium tracking-tight text-zinc-100">MeetVault</span>
        </div>
        <nav className="flex-1 px-3 space-y-1 mt-2">
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-normal text-zinc-100 bg-zinc-900 rounded-lg" href="#">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-normal text-zinc-500 hover:text-zinc-200 transition-colors" href="#">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            All Meetings
          </a>
          <a className="flex items-center gap-3 px-3 py-2 text-[13px] font-normal text-zinc-500 hover:text-zinc-200 transition-colors" href="#">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Tags
          </a>
        </nav>
        <div className="p-4 mt-auto border-t border-half border-zinc-800">
          <button className="flex items-center gap-3 px-3 py-2 text-[13px] font-normal text-zinc-500 hover:text-zinc-200 transition-colors w-full">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
            </svg>
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-half border-zinc-800 bg-zinc-950 flex items-center justify-around z-20">
        <a className="flex flex-col items-center justify-center h-full flex-1 text-zinc-100 hover:bg-zinc-900 transition-colors" href="#" title="Dashboard">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </a>
        <a className="flex flex-col items-center justify-center h-full flex-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors" href="#" title="All Meetings">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </a>
        <a className="flex flex-col items-center justify-center h-full flex-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors" href="#" title="Tags">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>
        <button className="flex flex-col items-center justify-center h-full flex-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors" title="Settings">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
            <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
          </svg>
        </button>
      </nav>
    </>
  )
}
