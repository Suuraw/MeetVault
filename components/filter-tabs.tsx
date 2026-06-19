'use client'

interface FilterTabsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  tags: string[]
}

export function FilterTabs({ activeFilter, onFilterChange, tags }: FilterTabsProps) {
  const filters = ['All', ...tags]

  return (
    <div className="px-8 py-4 flex items-center gap-2 overflow-x-auto border-b border-half border-zinc-800 no-scrollbar bg-zinc-950">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`text-[12px] px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? 'bg-zinc-100 text-zinc-950'
              : 'border border-half border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
