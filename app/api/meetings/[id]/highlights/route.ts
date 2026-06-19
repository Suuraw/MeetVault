import { NextRequest, NextResponse } from 'next/server'
import { updateHighlights } from '@/lib/meetings'
import { Highlight } from '@/lib/types'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await request.json()
    const { highlights } = data

    if (!Array.isArray(highlights)) {
      return NextResponse.json(
        { error: 'highlights must be an array' },
        { status: 400 }
      )
    }

    await updateHighlights(id, highlights as Highlight[])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update highlights:', error)
    return NextResponse.json(
      { error: 'Failed to update highlights' },
      { status: 500 }
    )
  }
}
