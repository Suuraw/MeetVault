'use client'

interface MeetingCardProps {
  id: string
  title: string
  tags: string[]
  date: string
  duration: string
  onClick?: () => void
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

export function MeetingCard({ id, title, tags, date, duration, onClick }: MeetingCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group flex items-center justify-between p-4 bg-zinc-900 border border-half border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-medium text-zinc-100">{title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {tags.map((tag) => (
                <span 
                  key={tag} 
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${tagColors[tag]?.bg || 'bg-zinc-800'} ${tagColors[tag]?.text || 'text-zinc-400'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-zinc-500 text-[12px]">{date}</span>
            <span className="text-zinc-500 text-[12px]">{duration}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
          className="text-[13px] text-zinc-400 hover:text-zinc-100 px-3 h-8 rounded-lg transition-colors"
        >
          View
        </button>
        <button className="text-zinc-400 hover:text-zinc-100 p-2 rounded-lg transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
