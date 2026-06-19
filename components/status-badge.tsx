'use client'

import { useState } from 'react'

export function StatusBadge() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-zinc-900 border border-half border-zinc-800 px-4 py-3 rounded-xl shadow-2xl z-[60]">
      <div className="w-2 h-2 rounded-full bg-green-500" />
      <span className="text-[13px] text-zinc-200">MeetVault is ready.</span>
      <button
        onClick={() => setVisible(false)}
        className="text-zinc-500 hover:text-zinc-300"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
