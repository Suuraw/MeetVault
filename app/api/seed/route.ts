import { NextRequest, NextResponse } from 'next/server'
import { createMeeting } from '@/lib/meetings'

export async function POST(request: NextRequest) {
  try {
    // Create sample meetings with continuous transcripts
    const meeting1Segments = [
      { timestamp: '0:00', text: 'Welcome to the Q3 planning standup. We\'ll be discussing our progress and next steps.' },
      { timestamp: '0:15', text: 'Let\'s start with the completed items from last sprint.' },
      { timestamp: '0:30', text: 'We successfully shipped the new dashboard design ahead of schedule.' },
      { timestamp: '0:45', text: 'Performance test results show a 40% improvement in load times.' },
      { timestamp: '1:00', text: 'Now let\'s discuss the roadmap for Q3.' },
      { timestamp: '1:20', text: 'Priority one is mobile app optimization. The team should focus on iOS and Android platforms.' },
      { timestamp: '1:40', text: 'Action item: Assign mobile development team, estimated 2 weeks.' },
      { timestamp: '2:00', text: 'Second priority is API stability improvements.' },
      { timestamp: '2:15', text: 'Decision: We\'ll implement rate limiting and monitoring.' },
      { timestamp: '2:35', text: 'Any questions before we wrap up?' },
      { timestamp: '2:50', text: 'Great, let\'s move forward with this plan. Meeting adjourned.' },
    ]

    const meeting1 = await createMeeting({
      title: 'Q3 Planning Standup',
      date: '2023-10-12',
      tags: ['sprint', 'standup'],
      transcript: meeting1Segments.map(s => s.text).join(' '),
      segments: meeting1Segments,
    })

    const meeting2Segments = [
      { timestamp: '0:00', text: 'Discussion on current API architecture and scaling concerns.' },
      { timestamp: '0:30', text: 'Current bottleneck is the database layer. We need to implement read replicas.' },
      { timestamp: '1:05', text: 'Follow-up: Database team to create replication strategy by next week.' },
      { timestamp: '1:45', text: 'Load balancing across regions will help with latency.' },
      { timestamp: '2:20', text: 'Key decision: Implement geo-routing for user requests.' },
      { timestamp: '3:00', text: 'Implementation timeline: 3 weeks for full rollout.' },
      { timestamp: '3:30', text: 'Monitoring setup is critical. Who\'s taking point on that?' },
      { timestamp: '4:10', text: 'Action items: Assign monitoring setup and schedule weekly check-ins.' },
    ]

    const meeting2 = await createMeeting({
      title: 'API Architecture & Load Balancing',
      date: '2023-10-11',
      tags: ['backend'],
      transcript: meeting2Segments.map(s => s.text).join(' '),
      segments: meeting2Segments,
    })

    const meeting3Segments = [
      { timestamp: '0:00', text: 'Thank you for taking the time to speak with us today, Sarah.' },
      { timestamp: '0:15', text: 'How has your experience been with our product over the past 3 months?' },
      { timestamp: '1:00', text: 'Sarah: Overall positive, but there are some workflow issues we\'re facing.' },
      { timestamp: '1:45', text: 'Key issue: The export feature is too slow for large datasets.' },
      { timestamp: '2:30', text: 'Action item: Optimize export performance for accounts over 10GB.' },
      { timestamp: '3:15', text: 'She mentioned collaboration features are needed for her team.' },
      { timestamp: '4:00', text: 'Decision: Add team collaboration to Q4 roadmap.' },
      { timestamp: '4:45', text: 'Follow-up meeting scheduled for next month to review progress.' },
    ]

    const meeting3 = await createMeeting({
      title: 'Customer Interview: Sarah Jenkins (Acme)',
      date: '2023-10-10',
      tags: ['interview', 'client'],
      transcript: meeting3Segments.map(s => s.text).join(' '),
      segments: meeting3Segments,
    })

    return NextResponse.json({
      success: true,
      meetings: [meeting1, meeting2, meeting3],
    })
  } catch (error) {
    console.error('Seeding failed:', error)
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}
