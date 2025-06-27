import type { SlideLayout } from './layout.type'
import type { Theme } from './theme.type'

// Enhanced slide data structures for layout/theme integration
export interface SlideContent {
  id: string
  type: 'text' | 'image' | 'chart' | 'list' | 'video' | 'code' | 'quote' | 'title' | 'subtitle'
  content: string
  formatting?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    textAlign?: 'left' | 'center' | 'right' | 'justify'
  }
  position?: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface SlideGenerationParams {
  topic: string
  slideCount: number
  projectId?: string
  complexity?: string
  includeImages?: boolean
}

export interface GeneratedSlide {
  slideId: string
  slideType: string
  title?: string
  content: SlideContent[]
  layout: SlideLayout
  theme?: Theme
  words: string[]
  metadata?: {
    generatedAt: string
    generationParams?: SlideGenerationParams
    isComplete: boolean
  }
}

export interface SlideGenerationResult {
  slides: GeneratedSlide[]
  totalSlides: number
  generationParams: SlideGenerationParams
  completedAt?: string
}

// Original streaming interfaces
export interface StreamingSlideRequest {
  topic: string
  slideCount: number
  projectId?: string
}

export interface StreamingSlideResponse {
  slideId: string
  slideType: string
  content: string
}

export class StreamingApiService {
  private static readonly BASE_URL = 'http://localhost:8222/api/v1'

  static async streamSlideGeneration(
    request: StreamingSlideRequest,
    token: string,
    onSlideUpdate: (data: StreamingSlideResponse) => void,
    onComplete: () => void,
    onError: (error: Error) => void,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/projects/stream/slide-content`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
        signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get response reader')
      }

      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() || ''

        for (const chunk of chunks) {
          const lines = chunk.split('\n')
          let eventType = null
          let data = ''

          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
              data += line.slice(5).trim()
            }
          }

          if (eventType === 'slide-content' && data) {
            try {
              const parsed = JSON.parse(data)
              onSlideUpdate(parsed)
            } catch (err) {
              console.error('Invalid JSON:', data, err)
            }
          } else if (eventType === 'complete') {
            onComplete()
            break
          }
        }
      }
    } catch (error: unknown) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'))
    }
  }
}
