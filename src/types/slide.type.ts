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
          let id = null
          let eventType = null
          let data = ''

          for (const line of lines) {
            if (line.startsWith('id:')) {
              id = line.slice(3).trim()
            } else if (line.startsWith('event:')) {
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
    } catch (error: any) {
      onError(error)
    }
  }
}
