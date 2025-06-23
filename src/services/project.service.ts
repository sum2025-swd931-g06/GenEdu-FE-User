import { Project, ProjectDetail, AudioProject, UserData } from '../types/auth.type'
import { hoangUser, hoangProjects, hoangAudioProjects, hoangProjectDetails } from '../mocks/hoangMockData'

/**
 * Mock Project Service for managing user projects and audio content
 * This service simulates backend API calls with comprehensive mock data
 */
export class MockProjectService {
  private static instance: MockProjectService
  private currentUser: UserData | null = null
  private projects: Project[] = []
  private projectDetails: { [key: string]: ProjectDetail } = {}
  private audioProjects: AudioProject[] = []

  private constructor() {
    this.initializeData()
  }

  public static getInstance(): MockProjectService {
    if (!MockProjectService.instance) {
      MockProjectService.instance = new MockProjectService()
    }
    return MockProjectService.instance
  }

  private initializeData() {
    // Initialize with Hoang's comprehensive data
    this.currentUser = hoangUser
    this.projects = [...hoangProjects]
    this.projectDetails = { ...hoangProjectDetails }
    this.audioProjects = [...hoangAudioProjects]
  }

  /**
   * Simulate user authentication and data loading
   */
  public async loginUser(email: string): Promise<UserData | null> {
    // Simulate API delay
    await this.delay(500)

    if (email === 'hoangclw@gmail.com') {
      this.currentUser = hoangUser
      return this.currentUser
    }

    return null
  }

  /**
   * Get current user data
   */
  public getCurrentUser(): UserData | null {
    return this.currentUser
  }

  /**
   * Get all projects for the current user
   */
  public async getUserProjects(): Promise<Project[]> {
    await this.delay(300)
    return [...this.projects]
  }

  /**
   * Get project details including slides
   */
  public async getProjectDetails(projectId: string): Promise<ProjectDetail | null> {
    await this.delay(400)
    return this.projectDetails[projectId] || null
  }

  /**
   * Get all audio projects for the current user
   */
  public async getUserAudioProjects(): Promise<AudioProject[]> {
    await this.delay(250)
    return [...this.audioProjects]
  }

  /**
   * Get specific audio project
   */
  public async getAudioProject(audioId: string): Promise<AudioProject | null> {
    await this.delay(200)
    return this.audioProjects.find((audio) => audio.id === audioId) || null
  }

  /**
   * Create a new project (simulation)
   */
  public async createProject(title: string, topic: string): Promise<Project> {
    await this.delay(800)

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      status: 'DRAFT',
      creationTime: Date.now(),
      slideNum: 0
    }

    this.projects.unshift(newProject)
    return newProject
  }

  /**
   * Update project status
   */
  public async updateProjectStatus(
    projectId: string,
    status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'
  ): Promise<Project | null> {
    await this.delay(300)

    const projectIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projectIndex !== -1) {
      this.projects[projectIndex].status = status
      return this.projects[projectIndex]
    }

    return null
  }

  /**
   * Delete a project
   */
  public async deleteProject(projectId: string): Promise<boolean> {
    await this.delay(400)

    const projectIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projectIndex !== -1) {
      this.projects.splice(projectIndex, 1)
      delete this.projectDetails[projectId]
      return true
    }

    return false
  }

  /**
   * Generate slides for a project (AI simulation)
   */
  public async generateSlides(projectId: string, topic: string): Promise<ProjectDetail | null> {
    await this.delay(2000) // Simulate AI processing time

    const project = this.projects.find((p) => p.id === projectId)
    if (!project) return null

    // Simulate AI-generated slides based on topic
    const generatedSlides = this.generateSlidesForTopic(topic)

    const projectDetail: ProjectDetail = {
      ...project,
      slideNum: generatedSlides.length,
      slides: generatedSlides
    }

    this.projectDetails[projectId] = projectDetail

    // Update the project in the projects array
    const projectIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projectIndex !== -1) {
      this.projects[projectIndex].slideNum = generatedSlides.length
      this.projects[projectIndex].status = 'IN_PROGRESS'
    }

    return projectDetail
  }

  /**
   * Generate audio narration for a project
   */
  public async generateAudioNarration(
    projectId: string,
    textContent: string,
    voiceType: string = 'Professional Female'
  ): Promise<AudioProject> {
    await this.delay(3000) // Simulate audio processing time

    const project = this.projects.find((p) => p.id === projectId)
    if (!project) throw new Error('Project not found')

    const audioProject: AudioProject = {
      id: `audio-${Date.now()}`,
      title: `${project.title} - Narration`,
      status: 'PROCESSING',
      creationTime: Date.now(),
      durationSeconds: Math.floor(textContent.length / 10), // Rough estimation
      textContent,
      voiceType,
      audioUrl: `https://example.com/audio/${projectId}-narration.mp3`
    }

    this.audioProjects.unshift(audioProject)

    // Update project to include audio
    const projectIndex = this.projects.findIndex((p) => p.id === projectId)
    if (projectIndex !== -1) {
      this.projects[projectIndex].audioProject = audioProject
    }

    // Simulate completion after a delay
    setTimeout(() => {
      audioProject.status = 'COMPLETED'
    }, 5000)

    return audioProject
  }

  /**
   * Get project statistics
   */
  public async getProjectStats(): Promise<{
    totalProjects: number
    completedProjects: number
    totalSlides: number
    totalAudioMinutes: number
  }> {
    await this.delay(200)

    const completedProjects = this.projects.filter((p) => p.status === 'COMPLETED').length
    const totalSlides = this.projects.reduce((sum, p) => sum + (p.slideNum || 0), 0)
    const totalAudioMinutes =
      this.audioProjects.filter((a) => a.status === 'COMPLETED').reduce((sum, a) => sum + (a.durationSeconds || 0), 0) /
      60

    return {
      totalProjects: this.projects.length,
      completedProjects,
      totalSlides,
      totalAudioMinutes: Math.round(totalAudioMinutes)
    }
  }

  /**
   * Search projects by title or content
   */
  public async searchProjects(query: string): Promise<Project[]> {
    await this.delay(300)

    const searchTerm = query.toLowerCase()
    return this.projects.filter((project) => project.title.toLowerCase().includes(searchTerm))
  }

  /**
   * Export project data (simulation)
   */
  public async exportProject(projectId: string, format: 'pdf' | 'pptx' | 'html'): Promise<string> {
    await this.delay(1500)

    const project = this.projectDetails[projectId]
    if (!project) throw new Error('Project not found')

    // Simulate file generation and return download URL
    return `https://example.com/exports/${projectId}.${format}`
  }

  // Helper methods
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private generateSlidesForTopic(topic: string): Array<{
    id: string
    title: string
    content: string
    order: number
  }> {
    // Simple AI simulation - generate slides based on topic keywords
    const topicLower = topic.toLowerCase()

    if (topicLower.includes('ai') || topicLower.includes('artificial intelligence')) {
      return [
        {
          id: `slide-${Date.now()}-1`,
          title: 'Introduction to AI',
          content: `<h1>Artificial Intelligence</h1><p>Understanding the fundamentals of AI technology</p>`,
          order: 1
        },
        {
          id: `slide-${Date.now()}-2`,
          title: 'AI Applications',
          content: `<h2>AI Applications</h2><ul><li>Machine Learning</li><li>Natural Language Processing</li><li>Computer Vision</li></ul>`,
          order: 2
        },
        {
          id: `slide-${Date.now()}-3`,
          title: 'Future of AI',
          content: `<h2>Future Prospects</h2><p>How AI will transform industries and society</p>`,
          order: 3
        }
      ]
    }

    // Default generic slides
    return [
      {
        id: `slide-${Date.now()}-1`,
        title: `Introduction to ${topic}`,
        content: `<h1>${topic}</h1><p>An overview of key concepts and principles</p>`,
        order: 1
      },
      {
        id: `slide-${Date.now()}-2`,
        title: 'Key Points',
        content: `<h2>Key Points</h2><ul><li>Important aspect 1</li><li>Important aspect 2</li><li>Important aspect 3</li></ul>`,
        order: 2
      },
      {
        id: `slide-${Date.now()}-3`,
        title: 'Conclusion',
        content: `<h2>Conclusion</h2><p>Summary of main findings and next steps</p>`,
        order: 3
      }
    ]
  }
}

// Export singleton instance
export const projectService = MockProjectService.getInstance()
