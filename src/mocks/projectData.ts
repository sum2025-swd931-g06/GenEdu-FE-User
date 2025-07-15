// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { UserData } from '../types/auth.type'
import { Project, ProjectDetail, ProjectResponseDTO } from '../types/project.type'

// Generate consistent UUIDs for mock data
const generateConsistentUUID = (seed: string): string => {
  // For demo purposes, create predictable UUIDs based on seed
  const hash = seed.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-a${hex.slice(1, 4)}-${hex.slice(0, 12)}`
}

const MOCK_USER_ID = generateConsistentUUID('john-doe-user')

export const mockUser: UserData = {
  id: MOCK_USER_ID,
  name: 'John Doe',
  email: 'john.doe@example.com',
  idNumber: 'ID123456789'
}

export const mockProjects: Project[] = [
  {
    id: generateConsistentUUID('project-1'),
    userId: MOCK_USER_ID,
    lessonId: 101, // "What is Programming?" lesson
    title: 'AI in Education Presentation',
    customInstructions: 'Focus on practical applications and real-world examples of AI in educational settings.',
    status: 'COMPLETED',
    slideNum: 8,
    templateId: 1,
    lessonPlanFileId: 1001,
    createdOn: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    lastModifiedOn: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deleted: false
  },
  {
    id: generateConsistentUUID('project-2'),
    userId: MOCK_USER_ID,
    lessonId: 201, // "Understanding Variables" lesson
    title: 'Climate Change Awareness',
    customInstructions: 'Include interactive elements and visual data representations.',
    status: 'IN_PROGRESS',
    slideNum: 5,
    templateId: 2,
    lessonPlanFileId: 1002,
    createdOn: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    lastModifiedOn: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    deleted: false
  },
  {
    id: generateConsistentUUID('project-3'),
    userId: MOCK_USER_ID,
    lessonId: 301, // "Conditional Statements" lesson
    title: 'Space Exploration History',
    status: 'DRAFT',
    slideNum: 3,
    templateId: 1,
    createdOn: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    lastModifiedOn: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: generateConsistentUUID('project-4'),
    userId: MOCK_USER_ID,
    lessonId: 401, // "Introduction to Functions" lesson
    title: 'Renewable Energy Solutions',
    customInstructions: 'Emphasize sustainability and economic benefits.',
    status: 'COMPLETED',
    slideNum: 12,
    templateId: 3,
    lessonPlanFileId: 1003,
    createdOn: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    lastModifiedOn: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
]

export const mockProjectDetails: { [key: string]: ProjectDetail } = {
  [generateConsistentUUID('project-1')]: {
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
  [generateConsistentUUID('project-2')]: {
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

// Helper functions for project creation and DTO conversion
export const createProjectFromRequest = (
  request: { lessonId: number; title: string; customInstructions?: string; slideNumber?: number },
  userId: string = MOCK_USER_ID
): Project => {
  const projectId = generateConsistentUUID(`project-${Date.now()}-${request.title}`)
  const now = new Date()

  return {
    id: projectId,
    userId,
    lessonId: request.lessonId,
    title: request.title,
    customInstructions: request.customInstructions,
    status: 'DRAFT',
    slideNum: request.slideNumber || 10, // Default to 10 as per backend
    templateId: Math.floor(Math.random() * 3) + 1, // Random template ID 1-3
    createdOn: now.toISOString(),
    lastModifiedOn: now.toISOString(),
    deleted: false
  }
}

export const projectToResponseDTO = (project: Project): ProjectResponseDTO => ({
  id: project.id,
  userId: project.userId,
  lessonId: project.lessonId,
  title: project.title,
  lessonPlanFileId: project.lessonPlanFileId,
  customInstructions: project.customInstructions,
  status: project.status,
  slideNum: project.slideNum,
  templateId: project.templateId,
  createdOn: project.createdOn,
  lastModifiedOn: project.lastModifiedOn,
  deleted: project.deleted
})

// Utility functions for handling file URLs
export const getFileUrlFromId = (fileId?: number): string | undefined => {
  if (!fileId) return undefined
  return `http://localhost:8222/api/v1/files/${fileId}`
}

// Convert backend project to frontend-compatible format
export const normalizeProject = (backendProject: ProjectResponseDTO): Project => ({
  id: backendProject.id,
  userId: backendProject.userId,
  lessonId: backendProject.lessonId,
  title: backendProject.title,
  lessonPlanFileId: backendProject.lessonPlanFileId,
  customInstructions: backendProject.customInstructions,
  status: backendProject.status,
  slideNum: backendProject.slideNum,
  templateId: backendProject.templateId,
  createdOn: backendProject.createdOn,
  lastModifiedOn: backendProject.lastModifiedOn,
  deleted: backendProject.deleted
})

// Export the project IDs for easy reference
export const mockProjectIds = {
  project1: generateConsistentUUID('project-1'),
  project2: generateConsistentUUID('project-2'),
  project3: generateConsistentUUID('project-3'),
  project4: generateConsistentUUID('project-4')
}
