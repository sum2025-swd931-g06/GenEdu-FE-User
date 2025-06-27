import { ClearOutlined, PlayCircleOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons'
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, Input, Progress, Select, Space, Typography, notification } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const { Title, Text } = Typography
const { Option } = Select

interface SlideData {
  slideId: string
  slideType: string
  words: string[]
}

interface StreamingSlideGeneratorProps {
  onSlidesGenerated?: (slides: SlideData[]) => void
  projectId?: string
}

const StreamingSlideGenerator: React.FC<StreamingSlideGeneratorProps> = ({ onSlidesGenerated, projectId }) => {
  const { user } = useAuth()
  const { keycloak } = useKeycloak()
  const [isStreaming, setIsStreaming] = useState(false)
  const [slideMap, setSlideMap] = useState<Record<string, SlideData>>({})
  const [topic, setTopic] = useState('Spring AI Framework') // Default topic for demo
  const [slideCount, setSlideCount] = useState(5)
  const [progress, setProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalWords, setTotalWords] = useState(0)

  const abortControllerRef = useRef<AbortController | null>(null)
  const streamReaderRef = useRef<ReadableStreamDefaultReader | null>(null)

  const appendWordToSlide = (slideId: string, slideType: string, word: string) => {
    if (!word || word.trim() === '') return

    setSlideMap((prev) => {
      const updated = { ...prev }
      if (!updated[slideId]) {
        updated[slideId] = {
          slideId,
          slideType,
          words: []
        }
      }
      updated[slideId].words.push(word)
      return updated
    })

    setTotalWords((prev) => prev + 1)
    setCurrentSlide(parseInt(slideId))
  }

  const getAuthToken = (): string | null => {
    // Try to get token from Keycloak first
    if (keycloak.authenticated && keycloak.token) {
      console.log('Using Keycloak token')
      return keycloak.token
    }

    // Fallback to localStorage
    const localToken = localStorage.getItem('token')
    if (localToken) {
      console.log('Using localStorage token')
      return localToken
    }

    console.log('No token available')
    return null
  }

  const startStreaming = async () => {
    // Check authentication
    const token = getAuthToken()
    if (!token) {
      notification.error({
        message: 'Authentication Error',
        description: 'Please log in to generate slides'
      })
      return
    }

    try {
      setIsStreaming(true)
      setSlideMap({})
      setProgress(0)
      setCurrentSlide(0)
      setTotalWords(0)

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()

      console.log('Starting slide generation demo...')
      console.log('Token length:', token.length)

      // Simple GET request matching your cURL example
      const response = await fetch('http://localhost:8222/api/v1/projects/stream/slide-content', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream;charset=UTF-8'
        },
        signal: abortControllerRef.current.signal
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get response reader')
      }

      streamReaderRef.current = reader
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      console.log('Starting to read stream...')

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log('Stream completed')
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const chunks = buffer.split('\n\n')
        buffer = chunks.pop() || ''

        for (const chunk of chunks) {
          if (!chunk.trim()) continue

          console.log('Processing chunk:', chunk)

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

          console.log('Parsed event:', { id, eventType, data })

          if (eventType === 'slide-content' && data) {
            try {
              const parsed = JSON.parse(data)
              console.log('Slide content received:', parsed)
              appendWordToSlide(parsed.slideId, parsed.slideType, parsed.content)

              // Update progress based on slide completion
              const progressPercent = (parseInt(parsed.slideId) / slideCount) * 100
              setProgress(Math.min(progressPercent, 100))
            } catch (err) {
              console.error('Invalid JSON:', data, err)
            }
          } else if (eventType === 'complete') {
            console.log('Generation complete event received')
            setProgress(100)
            setIsStreaming(false)
            notification.success({
              message: 'Generation Complete',
              description: 'All slides have been generated successfully!'
            })
            break
          } else if (eventType === 'error') {
            console.error('Server error:', data)
            throw new Error(data || 'Server error occurred')
          }
        }
      }
    } catch (error: any) {
      console.error('Streaming error details:', error)

      if (error.name === 'AbortError') {
        notification.info({
          message: 'Generation Stopped',
          description: 'Slide generation has been stopped by user'
        })
      } else if (error.message.includes('CORS')) {
        notification.error({
          message: 'CORS Error',
          description: 'Backend server needs to allow requests from this domain. Please contact your administrator.'
        })
      } else if (error.message.includes('Failed to fetch')) {
        notification.error({
          message: 'Network Error',
          description: 'Cannot connect to the backend server. Please check if the server is running and accessible.'
        })
      } else {
        notification.error({
          message: 'Generation Error',
          description: error.message || 'Failed to generate slides'
        })
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
      streamReaderRef.current = null
    }
  }

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (streamReaderRef.current) {
      streamReaderRef.current.cancel()
    }
    setIsStreaming(false)
  }

  const saveSlides = () => {
    const slides = Object.values(slideMap)
    if (onSlidesGenerated) {
      onSlidesGenerated(slides)
    }
    notification.success({
      message: 'Slides Saved',
      description: `${slides.length} slides have been saved successfully`
    })
  }

  const clearSlides = () => {
    setSlideMap({})
    setProgress(0)
    setCurrentSlide(0)
    setTotalWords(0)
  }

  const renderSlides = () => {
    const sortedSlides = Object.values(slideMap).sort((a, b) => parseInt(a.slideId) - parseInt(b.slideId))

    return sortedSlides.map((slide) => (
      <Card
        key={slide.slideId}
        title={`Slide ${slide.slideId} (${slide.slideType})`}
        size='small'
        style={{
          marginBottom: 16,
          border: parseInt(slide.slideId) === currentSlide ? '2px solid #1890ff' : undefined
        }}
        bodyStyle={{
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      >
        {slide.words.join(' ')}
      </Card>
    ))
  }

  // Add debug information
  const renderDebugInfo = () => {
    const token = getAuthToken()

    return (
      <Card size='small' style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
        <Typography.Text type='secondary'>
          <strong>Demo Debug Info:</strong>
          <br />
          Keycloak Authenticated: {keycloak.authenticated ? 'Yes' : 'No'}
          <br />
          Token Available: {token ? `Yes (${token.length} chars)` : 'No'}
          <br />
          User: {user?.fullName || keycloak.tokenParsed?.name || 'N/A'}
          <br />
          Request URL: http://localhost:8222/api/v1/projects/stream/slide-content
          <br />
          Method: GET (Demo - no parameters needed)
        </Typography.Text>
      </Card>
    )
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && renderDebugInfo()}

      <Card title='AI Slide Generator (Demo)' style={{ marginBottom: 24 }}>
        <Space direction='vertical' style={{ width: '100%' }} size='large'>
          {/* Demo Info */}
          <div
            style={{ backgroundColor: '#e6f7ff', padding: '12px', borderRadius: '6px', border: '1px solid #91d5ff' }}
          >
            <Typography.Text>
              <strong>Demo Mode:</strong> This will generate sample slides about "Spring AI Framework" using the
              streaming API. No topic input needed - the backend provides demo content.
            </Typography.Text>
          </div>

          {/* Controls - Simplified for demo */}
          <div>
            <Space wrap style={{ width: '100%' }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <Text strong>Demo Topic:</Text>
                <Input
                  value='Spring AI Framework (Demo)'
                  disabled
                  size='large'
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </div>
              <div>
                <Text strong>Expected Slides:</Text>
                <Select value={6} disabled style={{ width: 100 }}>
                  <Option value={6}>6 (Demo)</Option>
                </Select>
              </div>
            </Space>
          </div>

          {/* Action Buttons */}
          <div>
            <Space>
              {!isStreaming ? (
                <Button
                  type='primary'
                  icon={<PlayCircleOutlined />}
                  onClick={startStreaming}
                  size='large'
                  disabled={!getAuthToken()}
                >
                  Start Demo Generation
                </Button>
              ) : (
                <Button danger icon={<StopOutlined />} onClick={stopStreaming} size='large'>
                  Stop Generation
                </Button>
              )}

              <Button icon={<SaveOutlined />} onClick={saveSlides} disabled={Object.keys(slideMap).length === 0}>
                Save Slides
              </Button>

              <Button icon={<ClearOutlined />} onClick={clearSlides} disabled={Object.keys(slideMap).length === 0}>
                Clear
              </Button>
            </Space>
          </div>

          {/* Progress */}
          {isStreaming && (
            <div>
              <Text strong>Generation Progress:</Text>
              <Progress
                percent={Math.round(progress)}
                status={isStreaming ? 'active' : 'success'}
                format={() => `${Object.keys(slideMap).length} slides generated`}
              />
              <Text type='secondary'>
                Current slide: {currentSlide} | Total words: {totalWords}
              </Text>
            </div>
          )}
        </Space>
      </Card>

      {/* Live Slides Display */}
      {Object.keys(slideMap).length > 0 && (
        <Card title={`Live Slides Preview (${Object.keys(slideMap).length} slides)`}>{renderSlides()}</Card>
      )}
    </div>
  )
}

export default StreamingSlideGenerator
