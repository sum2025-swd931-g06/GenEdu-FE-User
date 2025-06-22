import { AudioProject, Project, ProjectDetail, UserData } from '../types/auth.type'

export const mockUser: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  idNumber: 'ID123456789'
}

export const mockAudioProjects: AudioProject[] = [
  {
    id: 'audio-1',
    title: 'Introduction Speech',
    status: 'COMPLETED',
    creationTime: Date.now() - 86400000, // 1 day ago
    durationSeconds: 180,
    textContent:
      'Welcome to our presentation about artificial intelligence and its applications in modern education...',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    voiceType: 'Professional Female'
  },
  {
    id: 'audio-2',
    title: 'Conclusion Speech',
    status: 'PROCESSING',
    creationTime: Date.now() - 3600000, // 1 hour ago
    durationSeconds: 120,
    textContent: 'In conclusion, AI technology will continue to revolutionize how we learn and teach...',
    voiceType: 'Professional Male'
  }
]

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI in Education Presentation',
    status: 'COMPLETED',
    creationTime: Date.now() - 172800000, // 2 days ago
    slideNum: 8,
    audioProject: mockAudioProjects[0]
  },
  {
    id: '2',
    title: 'Climate Change Awareness',
    status: 'IN_PROGRESS',
    creationTime: Date.now() - 86400000, // 1 day ago
    slideNum: 5,
    audioProject: mockAudioProjects[1]
  },
  {
    id: '3',
    title: 'Space Exploration History',
    status: 'DRAFT',
    creationTime: Date.now() - 3600000, // 1 hour ago
    slideNum: 3
  },
  {
    id: '4',
    title: 'Renewable Energy Solutions',
    status: 'COMPLETED',
    creationTime: Date.now() - 259200000, // 3 days ago
    slideNum: 12
  }
]

export const mockProjectDetails: { [key: string]: ProjectDetail } = {
  '1': {
    ...mockProjects[0],
    slides: [
      {
        id: 'slide-1',
        title: 'Introduction to AI in Education',
        content: '<h1>AI in Education</h1><p>Transforming the way we learn and teach</p>',
        order: 1
      },
      {
        id: 'slide-2',
        title: 'Current Applications',
        content:
          '<h2>Current Applications</h2><ul><li>Personalized Learning</li><li>Automated Grading</li><li>Virtual Tutors</li></ul>',
        order: 2
      },
      {
        id: 'slide-3',
        title: 'Machine Learning in Classrooms',
        content: '<h2>Machine Learning</h2><p>Adaptive learning systems that adjust to student needs</p>',
        order: 3
      },
      {
        id: 'slide-4',
        title: 'Natural Language Processing',
        content: '<h2>NLP Applications</h2><p>Language learning assistants and content analysis</p>',
        order: 4
      },
      {
        id: 'slide-5',
        title: 'Benefits',
        content:
          '<h2>Benefits</h2><ul><li>Improved Engagement</li><li>Better Assessment</li><li>Accessibility</li></ul>',
        order: 5
      },
      {
        id: 'slide-6',
        title: 'Challenges',
        content:
          '<h2>Challenges</h2><ul><li>Privacy Concerns</li><li>Digital Divide</li><li>Teacher Training</li></ul>',
        order: 6
      },
      {
        id: 'slide-7',
        title: 'Future Outlook',
        content: '<h2>The Future</h2><p>AI will continue to enhance educational experiences worldwide</p>',
        order: 7
      },
      {
        id: 'slide-8',
        title: 'Thank You',
        content: '<h1>Thank You</h1><p>Questions & Discussion</p>',
        order: 8
      }
    ]
  },
  '2': {
    ...mockProjects[1],
    slides: [
      {
        id: 'slide-9',
        title: 'Climate Change Overview',
        content: '<h1>Climate Change</h1><p>Understanding our changing planet</p>',
        order: 1
      },
      {
        id: 'slide-10',
        title: 'Global Temperature Rise',
        content: '<h2>Temperature Trends</h2><p>Average global temperatures have risen by 1.1°C since 1880</p>',
        order: 2
      },
      {
        id: 'slide-11',
        title: 'Carbon Emissions',
        content: '<h2>CO2 Levels</h2><p>Atmospheric CO2 has reached 420 ppm in 2023</p>',
        order: 3
      },
      {
        id: 'slide-12',
        title: 'Impact on Ecosystems',
        content:
          '<h2>Environmental Impact</h2><ul><li>Sea Level Rise</li><li>Extreme Weather</li><li>Biodiversity Loss</li></ul>',
        order: 4
      },
      {
        id: 'slide-13',
        title: 'Solutions',
        content:
          '<h2>What We Can Do</h2><ul><li>Renewable Energy</li><li>Sustainable Transportation</li><li>Conservation</li></ul>',
        order: 5
      }
    ]
  }
}
