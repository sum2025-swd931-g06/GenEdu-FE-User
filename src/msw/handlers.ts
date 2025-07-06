import { HttpHandler, http, HttpResponse, passthrough } from 'msw'
import {
  mockUser,
  mockProjects,
  mockProjectDetails,
  createProjectFromRequest,
  projectToResponseDTO
} from '../mocks/projectData'
import { mockLessons } from '../mocks/lessonData'

export const handlers: HttpHandler[] = [
  // Get user profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUser)
  }),
  // Get user projects
  http.get('/api/user/projects', () => {
    return HttpResponse.json(mockProjects)
  }),

  // Get lessons
  http.get('http://localhost:8222/api/v1/contents/lessons', () => {
    return HttpResponse.json(mockLessons)
  }),

  // Get project detail by ID
  http.get('/api/projects/:id', ({ params }) => {
    const { id } = params
    const project = mockProjectDetails[id as string]

    if (!project) {
      return new HttpResponse(null, { status: 404 })
    }

    return HttpResponse.json(project)
  }),
  // Create new project
  http.post('/api/projects', async ({ request }) => {
    const newProject = await request.json()
    return HttpResponse.json(
      {
        id: Date.now().toString(),
        ...(newProject && typeof newProject === 'object' && !Array.isArray(newProject) ? newProject : {}),
        creationTime: Date.now(),
        status: 'DRAFT'
      },
      { status: 201 }
    )
  }),

  // Create new project (Backend API format)
  http.post('http://localhost:8222/api/v1/projects', async ({ request }) => {
    try {
      const projectRequest = (await request.json()) as {
        lessonId: number
        title: string
        customInstructions?: string
        slideNumber?: number
      }

      // Validate request
      if (!projectRequest.lessonId || projectRequest.lessonId <= 0) {
        return new HttpResponse(JSON.stringify({ message: 'Lesson ID must be a positive number.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (!projectRequest.title || projectRequest.title.trim().length === 0 || projectRequest.title.length > 255) {
        return new HttpResponse(
          JSON.stringify({ message: 'Title must not be blank and must be less than 255 characters.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      if (projectRequest.customInstructions && projectRequest.customInstructions.length > 1000) {
        return new HttpResponse(JSON.stringify({ message: 'Custom instructions must be less than 1000 characters.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (projectRequest.slideNumber && projectRequest.slideNumber < 1) {
        return new HttpResponse(JSON.stringify({ message: 'Slide number must be at least 1.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const newProject = createProjectFromRequest(projectRequest)
      const responseDTO = projectToResponseDTO(newProject)
      return HttpResponse.json(responseDTO, { status: 201 })
    } catch {
      return new HttpResponse(JSON.stringify({ message: 'Invalid request format.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }),

  // Update project
  http.put('/api/projects/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json()

    // Ensure updates is an object before spreading
    const safeUpdates = updates && typeof updates === 'object' && !Array.isArray(updates) ? updates : {}

    return HttpResponse.json({
      id,
      ...safeUpdates,
      updatedTime: Date.now()
    })
  }),

  // Delete project
  http.delete('/api/projects/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: `Project ${id} deleted successfully` })
  }),

  http.get('http://localhost:8222/api/v1/projects/stream/*', () => {
    return passthrough()
  }),

  http.options('http://localhost:8222/api/v1/projects/stream/*', () => {
    return passthrough()
  }),

  // Bypass all Gateway requests
  http.all('http://localhost:8222/*', () => {
    return passthrough()
  })
]
