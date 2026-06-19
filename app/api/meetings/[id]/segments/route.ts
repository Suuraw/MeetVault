import { NextRequest, NextResponse } from 'next/server'
import { updateSegmentHighlight } from '@/lib/meetings'

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json()
    const { segmentId, highlight } = data

    if (!segmentId) {
      return NextResponse.json(
        { error: 'segmentId is required' },
        { status: 400 }
      )
    }

    await updateSegmentHighlight(segmentId, highlight)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update segment highlight:', error)
    return NextResponse.json(
      { error: 'Failed to update segment' },
      { status: 500 }
    )
  }
}
