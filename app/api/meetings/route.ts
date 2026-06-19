import { NextRequest, NextResponse } from 'next/server'
import { getMeetings, createMeeting } from '@/lib/meetings'

export async function GET(request: NextRequest) {
  try {
    const meetings = await getMeetings()
    return NextResponse.json(meetings)
  } catch (error) {
    console.error('Failed to fetch meetings:', error)
    return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const meeting = await createMeeting(data)
    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Failed to create meeting:', error)
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 })
  }
}
