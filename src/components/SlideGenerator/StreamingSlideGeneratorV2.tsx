import { ClearOutlined, PlayCircleOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons'
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, Progress, Space, Typography, notification, Tabs, Switch } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import SlideGeneratorForm, { SlideGenerationParams } from './SlideGeneratorForm'

const { Text } = Typography
const { TabPane } = Tabs

interface SlideData {
  slideId: string
  slideType: string
  words: string[]
}

interface StreamingSlideGeneratorProps {
  onSlidesGenerated?: (slides: SlideData[]) => void
  projectId?: string
}

const StreamingSlideGeneratorV2: React.FC<StreamingSlideGeneratorProps> = ({ onSlidesGenerated, projectId }) => {
  const { user } = useAuth()
  const { keycloak } = useKeycloak()
  const [isStreaming, setIsStreaming] = useState(false)
  const [slideMap, setSlideMap] = useState<Record<string, SlideData>>({})
  const [progress, setProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [generationParams, setGenerationParams] = useState<SlideGenerationParams | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(true)

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

  const startStreaming = async (params?: SlideGenerationParams) => {
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

      let url = 'http://localhost:8222/api/v1/projects/stream/slide-content'
      let requestOptions: RequestInit = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream;charset=UTF-8'
        },
        signal: abortControllerRef.current.signal
      }

      // If we have generation parameters and not in demo mode, prepare POST request
      if (params && !isDemoMode) {
        console.log('Starting slide generation with parameters:', params)
        url = 'http://localhost:8222/api/v1/projects/stream/slide-content'
        requestOptions = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'text/event-stream;charset=UTF-8'
          },
          body: JSON.stringify({
            topic: params.topic,
            description: params.description,
            slideCount: params.slideCount,
            difficulty: params.difficulty,
            slideTypes: params.slideTypes,
            includeAudio: params.includeAudio,
            language: params.language,
            additionalRequirements: params.additionalRequirements,
            keywords: params.keywords,
            projectId: projectId
          }),
          signal: abortControllerRef.current.signal
        }
      } else {
        console.log('Starting slide generation demo...')
      }

      console.log('Request URL:', url)
      console.log('Request method:', requestOptions.method)
      console.log('Token length:', token.length)

      const response = await fetch(url, requestOptions)

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
              const expectedSlides = params?.slideCount || 6
              const progressPercent = (parseInt(parsed.slideId) / expectedSlides) * 100
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
    } catch (error: unknown) {
      console.error('Streaming error details:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorName = error instanceof Error ? error.name : ''

      if (errorName === 'AbortError') {
        notification.info({
          message: 'Generation Stopped',
          description: 'Slide generation has been stopped by user'
        })
      } else if (errorMessage.includes('CORS')) {
        notification.error({
          message: 'CORS Error',
          description: 'Backend server needs to allow requests from this domain. Please contact your administrator.'
        })
      } else if (errorMessage.includes('Failed to fetch')) {
        notification.error({
          message: 'Network Error',
          description: 'Cannot connect to the backend server. Please check if the server is running and accessible.'
        })
      } else {
        notification.error({
          message: 'Generation Error',
          description: errorMessage || 'Failed to generate slides'
        })
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
      streamReaderRef.current = null
    }
  }

  const handleFormSubmit = (params: SlideGenerationParams) => {
    setGenerationParams(params)
    startStreaming(params)
  }

  const startDemoGeneration = () => {
    setGenerationParams(null)
    startStreaming()
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
    setGenerationParams(null)
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

  const renderDebugInfo = () => {
    const token = getAuthToken()

    return (
      <Card size='small' style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
        <Typography.Text type='secondary'>
          <strong>Debug Info:</strong>
          <br />
          Mode: {isDemoMode ? 'Demo' : 'Production'}
          <br />
          Keycloak Authenticated: {keycloak.authenticated ? 'Yes' : 'No'}
          <br />
          Token Available: {token ? `Yes (${token.length} chars)` : 'No'}
          <br />
          User: {user?.fullName || keycloak.tokenParsed?.name || 'N/A'}
          <br />
          Request URL: http://localhost:8222/api/v1/projects/stream/slide-content
          <br />
          Method: {isDemoMode ? 'GET (Demo)' : 'POST (Production)'}
          {generationParams && (
            <>
              <br />
              <strong>Generation Parameters:</strong>
              <br />
              Topic: {generationParams.topic}
              <br />
              Slides: {generationParams.slideCount}
              <br />
              Difficulty: {generationParams.difficulty}
              <br />
              Language: {generationParams.language}
              <br />
              Include Audio: {generationParams.includeAudio ? 'Yes' : 'No'}
            </>
          )}
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

      {/* Mode Switcher */}
      <Card style={{ marginBottom: 24 }}>
        <Space align='center'>
          <Text strong>Mode:</Text>
          <Switch
            checked={!isDemoMode}
            onChange={(checked) => setIsDemoMode(!checked)}
            checkedChildren='Production'
            unCheckedChildren='Demo'
            disabled={isStreaming}
          />
          <Text type='secondary'>
            {isDemoMode
              ? 'Demo mode - uses hardcoded demo data'
              : 'Production mode - ready for backend API integration'}
          </Text>
        </Space>
      </Card>

      <Tabs defaultActiveKey='generator' type='card'>
        <TabPane tab='Slide Generator' key='generator'>
          {isDemoMode ? (
            <Card title='AI Slide Generator (Demo)' style={{ marginBottom: 24 }}>
              <Space direction='vertical' style={{ width: '100%' }} size='large'>
                <div
                  style={{
                    backgroundColor: '#e6f7ff',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #91d5ff'
                  }}
                >
                  <Typography.Text>
                    <strong>Demo Mode:</strong> This will generate sample slides about "Spring AI Framework" using the
                    streaming API. No topic input needed - the backend provides demo content.
                  </Typography.Text>
                </div>

                <div>
                  <Space>
                    {!isStreaming ? (
                      <Button
                        type='primary'
                        icon={<PlayCircleOutlined />}
                        onClick={startDemoGeneration}
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

                    <Button
                      icon={<ClearOutlined />}
                      onClick={clearSlides}
                      disabled={Object.keys(slideMap).length === 0}
                    >
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
          ) : (
            <SlideGeneratorForm onGenerate={handleFormSubmit} loading={isStreaming} disabled={isStreaming} />
          )}
        </TabPane>

        <TabPane tab={`Live Preview (${Object.keys(slideMap).length})`} key='preview'>
          {/* Live Slides Display */}
          {Object.keys(slideMap).length > 0 ? (
            <Card
              title={`Live Slides Preview (${Object.keys(slideMap).length} slides)`}
              extra={
                <Space>
                  <Button icon={<SaveOutlined />} onClick={saveSlides} type='primary'>
                    Save Slides
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={clearSlides}>
                    Clear
                  </Button>
                </Space>
              }
            >
              {renderSlides()}
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Text type='secondary'>No slides generated yet. Start generation to see live preview.</Text>
              </div>
            </Card>
          )}
        </TabPane>
      </Tabs>

      {/* Generation Progress (Fixed at bottom when streaming) */}
      {isStreaming && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 300,
            zIndex: 1000
          }}
        >
          <Card size='small'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Text strong>Generating Slides...</Text>
              <Progress
                percent={Math.round(progress)}
                status='active'
                format={() => `${Object.keys(slideMap).length} slides`}
              />
              <Button danger icon={<StopOutlined />} onClick={stopStreaming} size='small' block>
                Stop Generation
              </Button>
            </Space>
          </Card>
        </div>
      )}
    </div>
  )
}

export default StreamingSlideGeneratorV2
