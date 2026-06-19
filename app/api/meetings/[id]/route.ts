import { NextRequest, NextResponse } from 'next/server'
import { getMeetingById, updateMeeting, deleteMeeting } from '@/lib/meetings'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const meeting = await getMeetingById(id)
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Failed to fetch meeting:', error)
    return NextResponse.json({ error: 'Failed to fetch meeting' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await request.json()
    const meeting = await updateMeeting(id, data)
    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
    }
    return NextResponse.json(meeting)
  } catch (error) {
    console.error('Failed to update meeting:', error)
    return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteMeeting(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete meeting:', error)
    return NextResponse.json({ error: 'Failed to delete meeting' }, { status: 500 })
  }
}
