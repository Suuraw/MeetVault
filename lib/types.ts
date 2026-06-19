export interface Segment {
  id: string
  meetingId: string
  timestamp: string
  text: string
  highlight: string | null
  createdAt: string
  updatedAt: string
}

export interface Highlight {
  start: number
  end: number
  color: string
  note?: string
}

export interface Meeting {
  id: string
  title: string
  tags: string[]

  audio_path: string

  transcript: string

  highlights: Highlight[]

  recorded_at: string

  segments?: Segment[]

  // Optional fields if some endpoints return them
  date?: string
  updatedAt?: string
}

export interface NewMeetingData {
  title: string
  date: string
  tags: string[]
  audioFile: File
}
