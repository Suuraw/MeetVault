import { createMeeting } from '@/lib/meetings'

async function seedDatabase() {
  try {
    console.log('Seeding database with sample meetings...')

    const meeting = await createMeeting({
      title: 'Q3 Planning Standup',
      date: '2023-10-12',
      tags: ['sprint', 'standup'],
      segments: [
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
      ],
    })

    console.log('Database seeded successfully!')
    console.log('Meeting created:', meeting.id)
  } catch (error) {
    console.error('Failed to seed database:', error)
  }
}

seedDatabase()
