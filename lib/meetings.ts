'use server'

import { getDb } from '@/lib/db'
import { Meeting, Highlight } from '@/lib/types'

export async function getMeetings(): Promise<Meeting[]> {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM meetings ORDER BY createdAt DESC').all()
  
  return (rows as any[]).map(row => ({
    ...row,
    tags: JSON.parse(row.tags),
    highlights: row.highlights ? JSON.parse(row.highlights) : [],
  })) as Meeting[]
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
  const db = getDb()
  const meeting = db.prepare('SELECT * FROM meetings WHERE id = ?').get(id) as any
  
  if (!meeting) return null
  
  return {
    ...meeting,
    tags: JSON.parse(meeting.tags),
    highlights: meeting.highlights ? JSON.parse(meeting.highlights) : [],
  } as Meeting
}

export async function createMeeting(data: {
  title: string
  date: string
  tags: string[]
  transcript?: string
  segments?: Array<{
    timestamp: string
    text: string
  }>
}): Promise<Meeting> {
  const db = getDb()
  const id = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString()
  
  // Use transcript if provided, otherwise build from segments
  const transcript = data.transcript || (data.segments?.map(s => s.text).join(' ') || '')
  
  const meeting: Meeting = {
    id,
    title: data.title,
    date: data.date,
    duration: '0:00',
    tags: data.tags,
    transcript,
    highlights: [],
    createdAt: now,
    updatedAt: now,
  }
  
  const insertMeeting = db.prepare(
    'INSERT INTO meetings (id, title, date, duration, tags, transcript, highlights, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  )
  
  insertMeeting.run(
    id,
    data.title,
    data.date,
    '0:00',
    JSON.stringify(data.tags),
    transcript,
    JSON.stringify([]),
    now,
    now
  )
  
  // Insert segments for backward compatibility
  if (data.segments && data.segments.length > 0) {
    const insertSegment = db.prepare(
      'INSERT INTO segments (id, meetingId, timestamp, text, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
    )
    
    for (const seg of data.segments) {
      insertSegment.run(
        `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        id,
        seg.timestamp,
        seg.text,
        now,
        now
      )
    }
  }
  
  return meeting
}

export async function updateHighlights(
  meetingId: string,
  highlights: Highlight[]
): Promise<void> {
  const db = getDb()
  const now = new Date().toISOString()
  
  db.prepare('UPDATE meetings SET highlights = ?, updatedAt = ? WHERE id = ?')
    .run(JSON.stringify(highlights), now, meetingId)
}

export async function updateSegmentHighlight(
  segmentId: string,
  highlight: string | null
): Promise<void> {
  const db = getDb()
  const now = new Date().toISOString()
  
  db.prepare('UPDATE segments SET highlight = ?, updatedAt = ? WHERE id = ?')
    .run(highlight, now, segmentId)
}

export async function updateMeeting(
  id: string,
  data: Partial<{ title: string; date: string; tags: string[] }>
): Promise<Meeting | null> {
  const db = getDb()
  const now = new Date().toISOString()
  
  const updates: string[] = []
  const values: any[] = []
  
  if (data.title !== undefined) {
    updates.push('title = ?')
    values.push(data.title)
  }
  if (data.date !== undefined) {
    updates.push('date = ?')
    values.push(data.date)
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?')
    values.push(JSON.stringify(data.tags))
  }
  
  if (updates.length === 0) return getMeetingById(id)
  
  updates.push('updatedAt = ?')
  values.push(now)
  values.push(id)
  
  const query = `UPDATE meetings SET ${updates.join(', ')} WHERE id = ?`
  db.prepare(query).run(...values)
  
  return getMeetingById(id)
}

export async function deleteMeeting(id: string): Promise<void> {
  const db = getDb()
  db.prepare('DELETE FROM meetings WHERE id = ?').run(id)
}
