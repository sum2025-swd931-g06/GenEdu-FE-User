import { ClearOutlined, PlayCircleOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons'
import { useKeycloak } from '@react-keycloak/web'
import { Button, Card, Progress, Space, Typography, notification, Tabs, Switch, Select, Modal, Input, Form } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SlideGeneratorForm, { SlideGenerationParams } from './SlideGeneratorForm'
import DebugInfo from './DebugInfo'
import { SlideLayoutAssignmentService } from '../../services/slideLayoutAssignment'
import { GeneratedSlide } from '../../types/slide.type'
import { predefinedThemes } from '../../themes/predefinedThemes'
import { predefinedLayouts } from '../../layouts/predefinedLayouts'
import { SavedSlidesService } from '../../services/savedSlidesService'

const { Text } = Typography
const { TabPane } = Tabs

interface SlideData {
  slideId: string
  slideType: string
  words: string[]
}

interface StreamingSlideGeneratorProps {
  onSlidesGenerated?: (slides: GeneratedSlide[]) => void
  projectId?: string
}

const StreamingSlideGeneratorV2: React.FC<StreamingSlideGeneratorProps> = ({ onSlidesGenerated, projectId }) => {
  const { keycloak } = useKeycloak()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isStreaming, setIsStreaming] = useState(false)
  const [slideMap, setSlideMap] = useState<Record<string, SlideData>>({})
  const [enhancedSlideMap, setEnhancedSlideMap] = useState<Record<string, GeneratedSlide>>({})
  const [progress, setProgress] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [generationParams, setGenerationParams] = useState<SlideGenerationParams | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(true)
  const [initialTopic, setInitialTopic] = useState<string>('')
  const [selectedTheme, setSelectedTheme] = useState(predefinedThemes[0])
  const [useLayoutAssignment, setUseLayoutAssignment] = useState(true)

  // Save modal states
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [saveForm] = Form.useForm()
  const [saving, setSaving] = useState(false)

  // Read topic from URL parameters on component mount
  useEffect(() => {
    const topicFromUrl = searchParams.get('topic')
    if (topicFromUrl) {
      setInitialTopic(topicFromUrl)
      setIsDemoMode(false) // Switch to production mode when topic is provided

      // Show notification that topic was auto-filled
      notification.info({
        message: 'Topic Auto-filled',
        description: `Topic "${topicFromUrl}" has been loaded from your search. You can modify it or start generation directly.`,
        placement: 'topRight',
        duration: 4
      })
    }
  }, [searchParams])

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

    // Create or update enhanced slide with layout assignment
    setEnhancedSlideMap((prev) => {
      const updated = { ...prev }
      const currentSlide = prev[slideId]
      const words = currentSlide ? [...currentSlide.words, word] : [word]

      // Use layout assignment service to create enhanced slide
      const topic = generationParams?.topic || initialTopic || 'General Topic'
      const enhancedSlide = SlideLayoutAssignmentService.enhanceSlideWithLayout(
        slideId,
        slideType,
        words,
        topic,
        generationParams
      )

      // Override theme if user has selected one
      if (selectedTheme) {
        enhancedSlide.theme = selectedTheme
      }

      updated[slideId] = enhancedSlide
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
      setEnhancedSlideMap({})
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
    if (Object.keys(enhancedSlideMap).length === 0) {
      notification.warning({
        message: 'No Slides to Save',
        description: 'Please generate some slides first before saving.'
      })
      return
    }

    // Pre-fill form with current data
    const topic = generationParams?.topic || initialTopic || 'Generated Slides'
    saveForm.setFieldsValue({
      title: `${topic} - Presentation`,
      description: `Auto-generated presentation about ${topic}`,
      topic: topic
    })

    setSaveModalVisible(true)
  }

  const handleSavePresentation = async (values: { title: string; description?: string; topic?: string }) => {
    setSaving(true)

    try {
      const slides = Object.values(enhancedSlideMap)
      const topic = values.topic || generationParams?.topic || initialTopic || 'Generated Slides'

      const savedPresentation = SavedSlidesService.savePresentation(
        values.title,
        slides,
        topic,
        values.description,
        generationParams || undefined
      )

      // Also call the original callback if provided
      if (onSlidesGenerated) {
        onSlidesGenerated(slides)
      }

      notification.success({
        message: 'Presentation Saved Successfully!',
        description: (
          <div>
            <div>{`"${values.title}" with ${slides.length} slides has been saved to your profile.`}</div>
            <div style={{ marginTop: '8px' }}>
              <Button
                type='link'
                size='small'
                onClick={() => {
                  navigate('/profile')
                  notification.destroy()
                }}
              >
                View in Profile →
              </Button>
            </div>
          </div>
        ),
        duration: 6,
        placement: 'topRight'
      })

      setSaveModalVisible(false)
      saveForm.resetFields()

      console.log('Saved presentation:', savedPresentation)
    } catch (error) {
      console.error('Error saving presentation:', error)
      notification.error({
        message: 'Save Failed',
        description: 'Failed to save the presentation. Please try again.'
      })
    } finally {
      setSaving(false)
    }
  }

  const clearSlides = () => {
    setSlideMap({})
    setEnhancedSlideMap({})
    setProgress(0)
    setCurrentSlide(0)
    setTotalWords(0)
    setGenerationParams(null)
  }

  const renderSlides = () => {
    const sortedSlides = Object.values(slideMap).sort((a, b) => parseInt(a.slideId) - parseInt(b.slideId))

    return sortedSlides.map((slide) => {
      const enhancedSlide = enhancedSlideMap[slide.slideId]
      const layoutInfo = enhancedSlide?.layout
      const themeInfo = enhancedSlide?.theme

      return (
        <Card
          key={slide.slideId}
          title={
            <Space>
              <span>{`Slide ${slide.slideId} (${slide.slideType})`}</span>
              {layoutInfo && <span style={{ fontSize: '12px', color: '#666' }}>Layout: {layoutInfo.name}</span>}
              {themeInfo && <span style={{ fontSize: '12px', color: '#666' }}>Theme: {themeInfo.name}</span>}
            </Space>
          }
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
          extra={
            layoutInfo && (
              <Space>
                <span style={{ fontSize: '11px', color: '#999' }}>Category: {layoutInfo.category}</span>
                {useLayoutAssignment && <span style={{ fontSize: '11px', color: '#52c41a' }}>Auto-assigned</span>}
              </Space>
            )
          }
        >
          {slide.words.join(' ')}

          {/* Show layout regions if available */}
          {layoutInfo && layoutInfo.structure.regions.length > 0 && (
            <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Text style={{ fontSize: '11px', color: '#666' }}>
                Layout regions: {layoutInfo.structure.regions.map((r) => r.type).join(', ')}
              </Text>
            </div>
          )}
        </Card>
      )
    })
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
      {/* Floating Debug Info - Always visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugInfo
          isDemoMode={isDemoMode}
          generationParams={generationParams}
          initialTopic={initialTopic}
          enhancedSlideMap={enhancedSlideMap}
          useLayoutAssignment={useLayoutAssignment}
          selectedTheme={selectedTheme}
        />
      )}

      {/* Mode Switcher */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction='vertical' style={{ width: '100%' }}>
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

          {initialTopic && (
            <div
              style={{
                backgroundColor: '#e6f7ff',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #91d5ff'
              }}
            >
              <Text>
                <strong>Topic from URL:</strong> "{initialTopic}"
                <Text type='secondary'> - Form has been pre-filled and switched to Production mode</Text>
              </Text>
            </div>
          )}
        </Space>
      </Card>

      {/* Layout & Theme Configuration */}
      <Card title='Layout & Theme Settings' style={{ marginBottom: 24 }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Space align='center' wrap>
            <Text strong>Layout Assignment:</Text>
            <Switch
              checked={useLayoutAssignment}
              onChange={setUseLayoutAssignment}
              checkedChildren='Auto'
              unCheckedChildren='Manual'
              disabled={isStreaming}
            />
            <Text type='secondary'>
              {useLayoutAssignment
                ? 'Automatically assign layouts based on content type'
                : 'Use default layout for all slides'}
            </Text>
          </Space>

          <Space align='center' wrap>
            <Text strong>Theme:</Text>
            <Select
              value={selectedTheme?.id}
              onChange={(themeId) => {
                const theme = predefinedThemes.find((t) => t.id === themeId)
                if (theme) setSelectedTheme(theme)
              }}
              style={{ width: 200 }}
              disabled={isStreaming}
            >
              {predefinedThemes.map((theme) => (
                <Select.Option key={theme.id} value={theme.id}>
                  {theme.name} ({theme.category})
                </Select.Option>
              ))}
            </Select>
            <Text type='secondary'>Selected: {selectedTheme?.name}</Text>
          </Space>

          <div
            style={{
              backgroundColor: '#f0f8ff',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d6f7ff'
            }}
          >
            <Text style={{ fontSize: '12px' }}>
              <strong>Layout Integration:</strong> Generated slides will be automatically assigned appropriate layouts (
              {predefinedLayouts.length} available) and themes ({predefinedThemes.length} available) based on content
              analysis.
            </Text>
          </div>
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
            <SlideGeneratorForm
              onGenerate={handleFormSubmit}
              loading={isStreaming}
              disabled={isStreaming}
              initialTopic={initialTopic}
            />
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

        <TabPane tab={`Layout View (${Object.keys(enhancedSlideMap).length})`} key='layout-view'>
          {/* Enhanced Slides with Layout Information */}
          {Object.keys(enhancedSlideMap).length > 0 ? (
            <Card
              title={`Layout-Enhanced Slides (${Object.keys(enhancedSlideMap).length} slides)`}
              extra={
                <Space>
                  <Button icon={<SaveOutlined />} onClick={saveSlides} type='primary'>
                    Save Enhanced Slides
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={clearSlides}>
                    Clear
                  </Button>
                </Space>
              }
            >
              {Object.values(enhancedSlideMap)
                .sort((a, b) => parseInt(a.slideId) - parseInt(b.slideId))
                .map((slide) => (
                  <Card
                    key={slide.slideId}
                    title={
                      <Space direction='vertical' size={0}>
                        <span>{`Slide ${slide.slideId}: ${slide.title || slide.slideType}`}</span>
                        <Space size={0}>
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            Layout: {slide.layout.name} ({slide.layout.category})
                          </span>
                          {slide.theme && (
                            <span style={{ fontSize: '12px', color: '#666', marginLeft: '16px' }}>
                              Theme: {slide.theme.name}
                            </span>
                          )}
                        </Space>
                      </Space>
                    }
                    size='small'
                    style={{
                      marginBottom: 16,
                      border: parseInt(slide.slideId) === currentSlide ? '2px solid #1890ff' : undefined
                    }}
                  >
                    <Space direction='vertical' style={{ width: '100%' }}>
                      {/* Slide Content */}
                      <div
                        style={{
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          padding: '8px',
                          backgroundColor: '#fafafa',
                          borderRadius: '4px'
                        }}
                      >
                        {slide.words.join(' ')}
                      </div>

                      {/* Layout Information */}
                      <div style={{ padding: '8px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
                        <Text strong style={{ fontSize: '12px' }}>
                          Layout Details:
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text style={{ fontSize: '11px', color: '#666' }}>
                            Description: {slide.layout.description}
                          </Text>
                        </div>
                        <div>
                          <Text style={{ fontSize: '11px', color: '#666' }}>
                            Regions: {slide.layout.structure.regions.map((r) => `${r.type} (${r.id})`).join(', ')}
                          </Text>
                        </div>
                        {slide.layout.metadata.tags && (
                          <div>
                            <Text style={{ fontSize: '11px', color: '#666' }}>
                              Tags: {slide.layout.metadata.tags.join(', ')}
                            </Text>
                          </div>
                        )}
                      </div>

                      {/* Content Mapping */}
                      {slide.content && slide.content.length > 0 && (
                        <div style={{ padding: '8px', backgroundColor: '#f6fff6', borderRadius: '4px' }}>
                          <Text strong style={{ fontSize: '12px' }}>
                            Content Mapping:
                          </Text>
                          {slide.content.map((content) => (
                            <div key={content.id} style={{ marginTop: '4px', marginLeft: '8px' }}>
                              <Text style={{ fontSize: '11px' }}>
                                <strong>{content.type}:</strong> {content.content.substring(0, 100)}
                                {content.content.length > 100 ? '...' : ''}
                              </Text>
                            </div>
                          ))}
                        </div>
                      )}
                    </Space>
                  </Card>
                ))}
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Text type='secondary'>
                  No enhanced slides yet. Generate slides to see layout assignments and content mapping.
                </Text>
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

      {/* Save Presentation Modal */}
      <Modal
        title='Save Presentation'
        open={saveModalVisible}
        onCancel={() => {
          setSaveModalVisible(false)
          saveForm.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={saveForm} layout='vertical' onFinish={handleSavePresentation}>
          <Form.Item
            name='title'
            label='Presentation Title'
            rules={[{ required: true, message: 'Please enter a presentation title' }]}
          >
            <Input placeholder='Enter a descriptive title for your presentation' />
          </Form.Item>

          <Form.Item name='topic' label='Topic'>
            <Input placeholder='Main topic or subject' />
          </Form.Item>

          <Form.Item name='description' label='Description (Optional)'>
            <Input.TextArea rows={3} placeholder='Brief description of your presentation content' />
          </Form.Item>

          {/* Preview Info */}
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              marginBottom: '16px'
            }}
          >
            <Text style={{ fontSize: '12px', color: '#666' }}>
              <strong>Preview:</strong>
              <br />• <strong>Slides:</strong> {Object.keys(enhancedSlideMap).length}
              <br />• <strong>Layouts:</strong>{' '}
              {[...new Set(Object.values(enhancedSlideMap).map((s) => s.layout.name))].join(', ')}
              <br />• <strong>Theme:</strong> {selectedTheme?.name}
              <br />• <strong>Total Words:</strong>{' '}
              {Object.values(enhancedSlideMap).reduce((total, slide) => total + slide.words.length, 0)}
            </Text>
          </div>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save to Profile
              </Button>
              <Button
                onClick={() => {
                  setSaveModalVisible(false)
                  saveForm.resetFields()
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default StreamingSlideGeneratorV2
