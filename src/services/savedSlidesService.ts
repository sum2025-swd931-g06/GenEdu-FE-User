import type { GeneratedSlide, SlideGenerationParams } from '../types/slide.type'

export interface SavedSlidePresentation {
  id: string
  title: string
  description?: string
  slides: GeneratedSlide[]
  createdAt: string
  updatedAt: string
  topic: string
  slideCount: number
  userId?: string
  tags?: string[]
  metadata?: {
    generationParams?: SlideGenerationParams
    totalWords?: number
    layoutDistribution?: Record<string, number>
    themes?: string[]
  }
}

export class SavedSlidesService {
  private static readonly STORAGE_KEY = 'genedu_saved_slides'

  /**
   * Save a slide presentation to local storage
   */
  static savePresentation(
    title: string,
    slides: GeneratedSlide[],
    topic: string,
    description?: string,
    generationParams?: SlideGenerationParams
  ): SavedSlidePresentation {
    const presentation: SavedSlidePresentation = {
      id: this.generateId(),
      title,
      description,
      slides,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topic,
      slideCount: slides.length,
      metadata: {
        generationParams,
        totalWords: slides.reduce((total, slide) => total + slide.words.length, 0),
        layoutDistribution: this.calculateLayoutDistribution(slides),
        themes: [...new Set(slides.map((slide) => slide.theme?.name).filter(Boolean))]
      }
    }

    const savedPresentations = this.getAllPresentations()
    savedPresentations.push(presentation)

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedPresentations))

    return presentation
  }

  /**
   * Get all saved presentations
   */
  static getAllPresentations(): SavedSlidePresentation[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading saved presentations:', error)
      return []
    }
  }

  /**
   * Get a specific presentation by ID
   */
  static getPresentationById(id: string): SavedSlidePresentation | null {
    const presentations = this.getAllPresentations()
    return presentations.find((p) => p.id === id) || null
  }

  /**
   * Delete a presentation
   */
  static deletePresentation(id: string): boolean {
    const presentations = this.getAllPresentations()
    const filtered = presentations.filter((p) => p.id !== id)

    if (filtered.length !== presentations.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
      return true
    }

    return false
  }

  /**
   * Update a presentation
   */
  static updatePresentation(id: string, updates: Partial<SavedSlidePresentation>): SavedSlidePresentation | null {
    const presentations = this.getAllPresentations()
    const index = presentations.findIndex((p) => p.id === id)

    if (index !== -1) {
      presentations[index] = {
        ...presentations[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presentations))
      return presentations[index]
    }

    return null
  }

  /**
   * Get presentations stats
   */
  static getStats(): {
    totalPresentations: number
    totalSlides: number
    totalWords: number
    layoutDistribution: Record<string, number>
    themesUsed: string[]
  } {
    const presentations = this.getAllPresentations()

    return {
      totalPresentations: presentations.length,
      totalSlides: presentations.reduce((total, p) => total + p.slideCount, 0),
      totalWords: presentations.reduce((total, p) => total + (p.metadata?.totalWords || 0), 0),
      layoutDistribution: presentations.reduce(
        (acc, p) => {
          if (p.metadata?.layoutDistribution) {
            Object.entries(p.metadata.layoutDistribution).forEach(([layout, count]) => {
              acc[layout] = (acc[layout] || 0) + count
            })
          }
          return acc
        },
        {} as Record<string, number>
      ),
      themesUsed: [...new Set(presentations.flatMap((p) => p.metadata?.themes || []))]
    }
  }

  /**
   * Search presentations
   */
  static searchPresentations(query: string): SavedSlidePresentation[] {
    const presentations = this.getAllPresentations()
    const lowerQuery = query.toLowerCase()

    return presentations.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.topic.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Export presentation data
   */
  static exportPresentation(id: string): string | null {
    const presentation = this.getPresentationById(id)
    return presentation ? JSON.stringify(presentation, null, 2) : null
  }

  /**
   * Import presentation data
   */
  static importPresentation(data: string): SavedSlidePresentation | null {
    try {
      const presentation = JSON.parse(data) as SavedSlidePresentation

      // Validate the structure
      if (!presentation.id || !presentation.title || !presentation.slides) {
        throw new Error('Invalid presentation format')
      }

      // Generate new ID to avoid conflicts
      presentation.id = this.generateId()
      presentation.createdAt = new Date().toISOString()
      presentation.updatedAt = new Date().toISOString()

      const savedPresentations = this.getAllPresentations()
      savedPresentations.push(presentation)

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedPresentations))

      return presentation
    } catch (error) {
      console.error('Error importing presentation:', error)
      return null
    }
  }

  // Private helper methods
  private static generateId(): string {
    return `slide_presentation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private static calculateLayoutDistribution(slides: GeneratedSlide[]): Record<string, number> {
    return slides.reduce(
      (acc, slide) => {
        const layoutName = slide.layout.name
        acc[layoutName] = (acc[layoutName] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }
}
