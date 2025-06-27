import type { GeneratedSlide, SlideGenerationParams } from '../types/slide.type'
import type { ProjectDetail, Slide } from '../types/auth.type'

/**
 * Service for managing draft projects (projects without audio)
 * Uses the unified Project model - draft projects are just projects with status 'DRAFT'
 */
export class DraftProjectService {
  private static readonly STORAGE_KEY = 'genedu_draft_projects'

  /**
   * Convert GeneratedSlide[] to Slide[] format
   */
  private static convertGeneratedSlidesToSlides(generatedSlides: GeneratedSlide[]): Slide[] {
    return generatedSlides.map((slide, index) => ({
      id: slide.slideId,
      title: slide.title || `Slide ${index + 1}`,
      content: slide.content.map((c) => c.content).join('\n'),
      order: index
    }))
  }

  /**
   * Save generated slides as a draft project
   */
  static saveDraftProject(
    title: string,
    generatedSlides: GeneratedSlide[],
    topic: string,
    description?: string,
    generationParams?: SlideGenerationParams
  ): ProjectDetail {
    const slides = this.convertGeneratedSlidesToSlides(generatedSlides)

    const draftProject: ProjectDetail = {
      id: this.generateId(),
      title,
      status: 'DRAFT',
      creationTime: Date.now(),
      slideNum: slides.length,
      slides,
      // Store additional metadata for draft projects
      metadata: {
        topic,
        description,
        generationParams,
        totalWords: generatedSlides.reduce((total, slide) => total + slide.words.length, 0),
        layoutDistribution: this.calculateLayoutDistribution(generatedSlides),
        themes: [
          ...new Set(generatedSlides.map((slide) => slide.theme?.name).filter((name): name is string => Boolean(name)))
        ]
      }
    }

    // Save to localStorage
    const existingProjects = this.getAllDraftProjects()
    existingProjects.push(draftProject)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingProjects))

    return draftProject
  }

  /**
   * Get all draft projects from localStorage
   */
  static getAllDraftProjects(): ProjectDetail[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const projects = JSON.parse(stored) as ProjectDetail[]
      // Ensure all projects have DRAFT status
      return projects.filter((p) => p.status === 'DRAFT')
    } catch (error) {
      console.error('Error loading draft projects:', error)
      return []
    }
  }

  /**
   * Get a specific draft project by ID
   */
  static getDraftProjectById(id: string): ProjectDetail | null {
    const projects = this.getAllDraftProjects()
    return projects.find((p) => p.id === id) || null
  }

  /**
   * Delete a draft project
   */
  static deleteDraftProject(id: string): boolean {
    try {
      const projects = this.getAllDraftProjects()
      const filteredProjects = projects.filter((p) => p.id !== id)

      if (filteredProjects.length === projects.length) {
        return false // Project not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects))
      return true
    } catch (error) {
      console.error('Error deleting draft project:', error)
      return false
    }
  }

  /**
   * Update a draft project
   */
  static updateDraftProject(id: string, updates: Partial<ProjectDetail>): ProjectDetail | null {
    try {
      const projects = this.getAllDraftProjects()
      const projectIndex = projects.findIndex((p) => p.id === id)

      if (projectIndex === -1) return null

      // Ensure status remains DRAFT
      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
        status: 'DRAFT' as const,
        // Update timestamp if content changed
        ...(updates.slides && { updatedAt: Date.now() })
      }

      projects[projectIndex] = updatedProject
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))

      return updatedProject
    } catch (error) {
      console.error('Error updating draft project:', error)
      return null
    }
  }

  /**
   * Search draft projects by title, topic, or description
   */
  static searchDraftProjects(query: string): ProjectDetail[] {
    const projects = this.getAllDraftProjects()
    const lowerQuery = query.toLowerCase()

    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        (p.metadata?.topic && p.metadata.topic.toLowerCase().includes(lowerQuery)) ||
        (p.metadata?.description && p.metadata.description.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Convert a draft project to a full project (when audio is added)
   * This would typically involve API calls to create the actual project
   */
  static convertToFullProject(draftId: string): Promise<ProjectDetail> {
    // This would typically make API calls to create the actual project
    // For now, we'll just mark it as IN_PROGRESS and remove from draft storage
    const draftProject = this.getDraftProjectById(draftId)
    if (!draftProject) {
      throw new Error('Draft project not found')
    }

    // In a real implementation, this would:
    // 1. Call API to create project with slides
    // 2. Remove from local draft storage
    // 3. Return the created project

    // For now, simulate the conversion
    const fullProject: ProjectDetail = {
      ...draftProject,
      status: 'IN_PROGRESS',
      creationTime: Date.now() // Update creation time when converting
    }

    // Remove from drafts
    this.deleteDraftProject(draftId)

    return Promise.resolve(fullProject)
  }

  /**
   * Export a draft project as JSON
   */
  static exportDraftProject(id: string): string | null {
    const project = this.getDraftProjectById(id)
    if (!project) return null

    return JSON.stringify(project, null, 2)
  }

  /**
   * Import a draft project from JSON
   */
  static importDraftProject(data: string): ProjectDetail | null {
    try {
      const project = JSON.parse(data) as ProjectDetail

      // Validate the imported data
      if (!project.id || !project.title || !project.slides) {
        throw new Error('Invalid project data')
      }

      // Ensure it's marked as draft and has a new ID to avoid conflicts
      const importedProject: ProjectDetail = {
        ...project,
        id: this.generateId(),
        status: 'DRAFT',
        creationTime: Date.now()
      }

      // Save the imported project
      const projects = this.getAllDraftProjects()
      projects.push(importedProject)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects))

      return importedProject
    } catch (error) {
      console.error('Error importing draft project:', error)
      return null
    }
  }

  /**
   * Generate a unique ID for projects
   */
  private static generateId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Calculate layout distribution from generated slides
   */
  private static calculateLayoutDistribution(slides: GeneratedSlide[]): Record<string, number> {
    const distribution: Record<string, number> = {}

    slides.forEach((slide) => {
      const layoutName = slide.layout?.name || 'unknown'
      distribution[layoutName] = (distribution[layoutName] || 0) + 1
    })

    return distribution
  }

  /**
   * Clear all draft projects (for testing/development)
   */
  static clearAllDraftProjects(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  /**
   * Get statistics about draft projects
   */
  static getDraftProjectStats(): {
    totalDrafts: number
    totalSlides: number
    averageSlidesPerDraft: number
    themes: string[]
  } {
    const projects = this.getAllDraftProjects()
    const totalSlides = projects.reduce((sum, p) => sum + (p.slideNum || 0), 0)
    const allThemes = projects.flatMap((p) => p.metadata?.themes || [])
    const uniqueThemes = [...new Set(allThemes)]

    return {
      totalDrafts: projects.length,
      totalSlides,
      averageSlidesPerDraft: projects.length > 0 ? Math.round(totalSlides / projects.length) : 0,
      themes: uniqueThemes
    }
  }
}

// Export backward compatibility type alias
export type SavedSlidePresentation = ProjectDetail
export { DraftProjectService as SavedSlidesService }
