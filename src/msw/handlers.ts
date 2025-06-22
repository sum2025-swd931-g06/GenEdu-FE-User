import { HttpHandler, http, HttpResponse } from 'msw'
import { mockUser, mockProjects, mockProjectDetails } from '../mocks/projectData'

export const handlers: HttpHandler[] = [
  // Get user profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json(mockUser)
  }),

  // Get user projects
  http.get('/api/user/projects', () => {
    return HttpResponse.json(mockProjects)
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
        ...newProject,
        creationTime: Date.now(),
        status: 'DRAFT'
      },
      { status: 201 }
    )
  }),

  // Update project
  http.put('/api/projects/:id', async ({ params, request }) => {
    const { id } = params
    const updates = await request.json()

    return HttpResponse.json({
      id,
      ...updates,
      updatedTime: Date.now()
    })
  }),

  // Delete project
  http.delete('/api/projects/:id', ({ params }) => {
    const { id } = params
    return HttpResponse.json({ message: `Project ${id} deleted successfully` })
  })
]
