import { NextRequest, NextResponse } from 'next/server'
import { createMeeting } from '@/lib/meetings'
import { transcribeAudio, extractDateFromFile, getDurationFromFile } from '@/lib/transcription'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null
    const title = formData.get('title') as string
    const tags = JSON.parse(formData.get('tags') as string || '[]')
    const dateOverride = formData.get('date') as string | null

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Transcribe audio
    const segments = await transcribeAudio(audioFile)

    // Convert segments to continuous paragraph transcript
    const transcript = segments.map(s => s.text).join(' ')

    // Extract metadata
    const date = dateOverride || extractDateFromFile(audioFile)
    const duration = getDurationFromFile(audioFile)

    // Create meeting with transcript
    const meeting = await createMeeting({
      title,
      date,
      tags,
      transcript,
      segments, // Keep segments for backward compatibility
    })

    return NextResponse.json(meeting, { status: 201 })
  } catch (error) {
    console.error('Transcription failed:', error)
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    )
  }
}
