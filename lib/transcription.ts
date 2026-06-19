// Mock transcription service - replace with actual Whisper API call
export async function transcribeAudio(
  audioFile: File
): Promise<Array<{ timestamp: string; text: string }>> {
  // In production, this would call the local Whisper API
  // For now, return mock segments
  
  const mockTranscript = [
    { timestamp: '0:00', text: 'Welcome to the meeting.' },
    { timestamp: '0:05', text: 'Today we\'ll discuss the quarterly roadmap.' },
    { timestamp: '0:15', text: 'First, let\'s review what we accomplished last sprint.' },
    { timestamp: '0:30', text: 'We shipped the new dashboard design.' },
    { timestamp: '0:45', text: 'Performance improved by 40 percent.' },
    { timestamp: '1:00', text: 'Let\'s talk about next quarter priorities.' },
    { timestamp: '1:20', text: 'We need to focus on mobile optimization.' },
    { timestamp: '1:35', text: 'Also improving the API response times.' },
    { timestamp: '1:50', text: 'Any questions or concerns?' },
    { timestamp: '2:05', text: 'Great, let\'s move forward with this plan.' },
  ]

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500))

  return mockTranscript
}

export function extractDateFromFile(file: File): string {
  // Try to extract date from file metadata
  // Most modern systems don't provide this, so we'll use current date
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export function getDurationFromFile(file: File): string {
  // In production, you'd parse the actual audio metadata
  // For now, return a default
  return '2:05'
}
