import {
  ClearOutlined,
  SaveOutlined,
  StopOutlined,
  UploadOutlined,
  FileOutlined,
  DownloadOutlined,
  CloudUploadOutlined
} from '@ant-design/icons'
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  notification,
  Progress,
  Space,
  Spin,
  Tabs,
  Typography,
  Upload,
  UploadProps
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../apis/api.config'
import { useTokenManager } from '../../hooks/useTokenManager'
import useLessons from '../../queries/useLesson'
import { ProjectRequestDTO, ProjectResponseDTO, UploadLessonPlanFileResponseDTO } from '../../types/project.type'
import { TypedSlideData } from '../../types/slideStream.type'
import RevealPresentation from '../RevealSlides/RevealPresentation'
import SlideGeneratorForm, { SlideGenerationParams } from './SlideGeneratorForm'
import { FileService, GeneratedFile } from '../../services/fileService'
import { PowerPointGenerationOptions } from '../../utils/powerpointGenerator'

// Add types for server API
interface SlideContentRequest {
  title: string
  slideType: string
  orderNumber: number
  subpoints: Record<string, unknown>
  narrationScript: string | null
}

interface LectureContentRequest {
  projectId: string
  title: string
  slideContents: SlideContentRequest[]
}

interface SlideContentResponse {
  lectureContentId: string
  title: string
  slideType: string
  orderNumber: number
  subpoints: Record<string, unknown>
  narrationScript: string | null
}

interface LectureContentResponse {
  id: string
  projectId: string
  title: string
  status: string
  slideContents: SlideContentResponse[]
}

const { Text } = Typography
const { TabPane } = Tabs

type UploadFile = {
  projectId: string
  mediaFile: File
}

const StreamingSlideGeneratorV2: React.FC = () => {
  const { getAuthToken } = useTokenManager()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [isStreaming, setIsStreaming] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generationParams, setGenerationParams] = useState<SlideGenerationParams | null>(null)
  const [initialTopic, setInitialTopic] = useState<string>('')

  // File upload states
  const [file, setFile] = useState<UploadFile>()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projectId, setProjectId] = useState<string | null>(null)

  // Save modal states
  const [saveModalVisible, setSaveModalVisible] = useState(false)
  const [saveForm] = Form.useForm()
  const [saving, setSaving] = useState(false)

  // Stream slide
  const [streamSlides, setStreamSlides] = useState<TypedSlideData[]>([])
  const [showRevealPresentation, setShowRevealPresentation] = useState(false)

  // PowerPoint generation states
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([])
  const [powerpointGenerating, setPowerpointGenerating] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([])

  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // All Lessons
  const { data: lessons, isLoading, error } = useLessons()

  // Read topic from URL parameters on component mount
  useEffect(() => {
    const topicFromUrl = searchParams.get('topic')
    if (topicFromUrl) {
      setInitialTopic(topicFromUrl)

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
  const formAbortControllerRef = useRef<AbortController | null>(null)

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setFile({ projectId: projectId || '', mediaFile: file })
      return false
    },
    onRemove: () => {
      setFile(undefined)
    },
    accept: '.md',
    multiple: false,
    maxCount: 1
  }

  const handleFileUpload = async (projectId: string | null): Promise<UploadLessonPlanFileResponseDTO | void> => {
    if (!file || !file.mediaFile) {
      notification.warning({
        message: 'No File Selected',
        description: 'Please select a file to upload.'
      })
      return
    }

    if (!projectId) {
      notification.error({
        message: 'No Project ID',
        description: 'Please generate slides first to create a project.'
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('projectId', projectId)
    formData.append('mediaFile', file.mediaFile)

    try {
      const response = await api.put(`/projects/lesson-plan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total !== undefined && progressEvent.total > 0) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        }
      })

      if (response.status === 200) {
        notification.success({
          message: 'File Uploaded',
          description: 'Your file has been uploaded successfully.'
        })
        return response.data as UploadLessonPlanFileResponseDTO
      } else {
        notification.error({
          message: 'Upload Failed',
          description: 'There was an error uploading your file. Please try again.'
        })
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      notification.error({
        message: 'Upload Error',
        description: 'An error occurred while uploading your file. Please try again.'
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }
  // Step 1: Create Project
  const handleCreateProject = async (params: SlideGenerationParams) => {
    setGenerationParams(params)
    console.log(`Creating project with params:`, params)

    const mappedParams: ProjectRequestDTO = {
      lessonId: params.lesson?.lessonId || 0,
      title: params.topic || initialTopic || 'Generated Slides',
      customInstructions: params.description || `Auto-generated presentation about ${params.topic || initialTopic}`,
      slideNumber: params.slideCount || 6
    }

    try {
      const response = await api.post<ProjectResponseDTO>('/projects', mappedParams)
      if (response.status === 201) {
        const projectData = response.data
        setProjectId(projectData.id)
        notification.success({
          message: 'Project Created Successfully',
          description: `Project "${projectData.title}" created! You can now upload a lesson plan file or generate slides directly.`,
          placement: 'topRight',
          duration: 4
        })
        return projectData
      }
    } catch (error) {
      console.error('Error creating project:', error)
      notification.error({
        message: 'Project Creation Failed',
        description: 'Failed to create project. Please try again.',
        placement: 'topRight',
        duration: 4
      })
      throw error
    }
  }

  // Step 2: Generate Slides
  const handleGenerateSlides = async () => {
    if (!projectId || !generationParams) {
      notification.error({
        message: 'Missing Requirements',
        description: 'Please create a project first before generating slides.',
        placement: 'topRight',
        duration: 4
      })
      return
    }

    try {
      setIsStreaming(true)
      setStreamSlides([]) // Clear existing stream slides
      setProgress(0)

      // Get auth token
      const token = getAuthToken()
      if (!token) {
        notification.error({
          message: 'Authentication Error',
          description: 'Please log in to generate slides',
          placement: 'topRight',
          duration: 4
        })
        return
      }

      const controller = new AbortController()
      formAbortControllerRef.current = controller

      notification.info({
        message: 'Starting Slide Generation',
        description: 'Connecting to AI service to generate your slides...',
        placement: 'topRight',
        duration: 3
      })

      // Make the streaming request directly
      const response = await fetch(
        `https://genedu-gateway.lch.id.vn/api/v1/lecture-contents/${projectId}/slide-content`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json;charset=UTF-8'
          },
          body: JSON.stringify({
            lessonId: generationParams.lesson?.lessonId.toString() || '',
            chapterId: generationParams.lesson?.chapterId.toString() || '',
            subjectId: '1',
            materialId: '1',
            schoolClassId: '1',
            lessonContentId: '1',
            CustomerInstructions:
              generationParams.description ||
              `Auto-generated presentation about ${generationParams.topic || initialTopic}`
          }),
          signal: controller.signal
        }
      )

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      // Check if response is actually a stream
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('text/event-stream')) {
        // Handle as stream
        await handleStreamResponse(response, generationParams)
      } else {
        // Handle as regular JSON response
        const jsonResponse = await response.json()
        console.log('JSON Response:', jsonResponse)
        notification.success({
          message: 'Slides Generated',
          description: 'Slides have been generated successfully!',
          placement: 'topRight',
          duration: 4
        })
      }
    } catch (error) {
      console.error('Error generating slides:', error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      const errorName = error instanceof Error ? error.name : ''

      if (errorName === 'AbortError') {
        notification.info({
          message: 'Generation Stopped',
          description: 'Slide generation has been stopped by user',
          placement: 'topRight',
          duration: 3
        })
      } else if (errorMessage.includes('CORS')) {
        notification.error({
          message: 'CORS Error',
          description: 'Backend server needs to allow requests from this domain. Please contact your administrator.',
          placement: 'topRight',
          duration: 5
        })
      } else if (errorMessage.includes('Failed to fetch')) {
        notification.error({
          message: 'Network Error',
          description: 'Cannot connect to the backend server. Please check if the server is running and accessible.',
          placement: 'topRight',
          duration: 5
        })
      } else {
        notification.error({
          message: 'Generation Error',
          description: errorMessage || 'Failed to generate slides',
          placement: 'topRight',
          duration: 5
        })
      }
    } finally {
      setIsStreaming(false)
      formAbortControllerRef.current = null
    }
  }

  // Legacy function for backwards compatibility (now just creates project)
  const handleFormSubmit = async (params: SlideGenerationParams) => {
    await handleCreateProject(params)
  }

  const handleStreamResponse = async (response: Response, params: SlideGenerationParams) => {
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let slideCount = 0

    console.log('Starting to read stream...')

    try {
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

          // Handle slide-generated events
          if (eventType === 'slide-generated' && data) {
            try {
              const parsed: TypedSlideData = JSON.parse(data)
              console.log('Slide generated:', parsed)

              // Add to stream slides
              setStreamSlides((prev) => [...prev, parsed])
              slideCount++ // Update progress
              const expectedSlides = params?.slideCount || 6
              const currentSlideNumber = id ? parseInt(id) : slideCount
              const progressPercent = (currentSlideNumber / expectedSlides) * 100
              setProgress(Math.min(progressPercent, 100))
            } catch (err) {
              console.error('Invalid JSON for slide-generated:', data, err)
            }
          } else if (eventType === 'complete' || eventType === 'end') {
            console.log('Generation complete event received')
            setProgress(100)
            setIsStreaming(false)
            notification.success({
              message: 'Generation Complete',
              description: `All ${slideCount} slides have been generated successfully!`
            })

            // Auto-generate PowerPoint after successful completion
            setTimeout(() => {
              generatePowerPoint()
            }, 1000)

            return // Exit the function
          } else if (eventType === 'error') {
            console.error('Server error:', data)
            throw new Error(data || 'Server error occurred')
          }
        }
      } // If we reach here without explicit completion event
      setProgress(100)
      setIsStreaming(false)
      notification.success({
        message: 'Generation Complete',
        description: `Generated ${slideCount} slides successfully!`
      })

      // Auto-generate PowerPoint after successful completion
      setTimeout(() => {
        generatePowerPoint()
      }, 1000)
    } finally {
      reader.releaseLock()
    }
  }

  const stopStreaming = () => {
    // Stop the main streaming
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (streamReaderRef.current) {
      streamReaderRef.current.cancel()
    }

    // Stop the form submission streaming
    if (formAbortControllerRef.current) {
      formAbortControllerRef.current.abort()
    }

    setIsStreaming(false)
  }

  // PowerPoint generation functions
  const generatePowerPoint = async () => {
    if (streamSlides.length === 0) {
      notification.warning({
        message: 'No Slides to Convert',
        description: 'Please generate some slides first before creating a PowerPoint.'
      })
      return
    }

    setPowerpointGenerating(true)
    try {
      const topic = generationParams?.topic || initialTopic || 'Generated Slides'
      const options: PowerPointGenerationOptions = {
        title: `${topic} - Presentation`,
        subtitle: `Generated on ${new Date().toLocaleDateString()}`,
        author: 'GenEdu AI',
        company: 'GenEdu Platform'
      }

      const file = await FileService.generateAndSavePowerPoint(streamSlides, projectId || 'temp', options)

      setGeneratedFiles((prev) => [file, ...prev])

      notification.success({
        message: 'PowerPoint Generated',
        description: `Successfully created ${file.filename}`
      })
    } catch (error) {
      console.error('PowerPoint generation failed:', error)
      notification.error({
        message: 'Generation Failed',
        description: 'Failed to generate PowerPoint file. Please try again.'
      })
    } finally {
      setPowerpointGenerating(false)
    }
  }
  const downloadFile = async (file: GeneratedFile) => {
    try {
      if (file.localPath) {
        const blob = await FileService.loadBlobFromLocalPath(file.localPath)
        if (blob) {
          FileService.downloadBlob(blob, file.filename)

          notification.success({
            message: 'Download Started',
            description: `${file.filename} is being downloaded to your Downloads folder.`
          })
        } else {
          throw new Error('File blob not found')
        }
      }
    } catch (error) {
      console.error('Download failed:', error)
      notification.error({
        message: 'Download Failed',
        description: 'Failed to download the file. Please try again.'
      })
    }
  }

  const uploadFileToServer = async (file: GeneratedFile) => {
    if (uploadingFiles.includes(file.id)) return

    setUploadingFiles((prev) => [...prev, file.id])
    try {
      const updatedFile = await FileService.uploadFileToServer(file, 'https://api.example.com/upload')

      setGeneratedFiles((prev) => prev.map((f) => (f.id === file.id ? updatedFile : f)))

      notification.success({
        message: 'Upload Complete',
        description: `${file.filename} has been uploaded to the server.`
      })
    } catch (error) {
      console.error('Upload failed:', error)
      notification.error({
        message: 'Upload Failed',
        description: 'Failed to upload the file to server. Please try again.'
      })
    } finally {
      setUploadingFiles((prev) => prev.filter((id) => id !== file.id))
    }
  }

  // Load existing files on component mount
  useEffect(() => {
    const files = FileService.getAllFiles()
    setGeneratedFiles(files)
  }, [])

  // Convert TypedSlideData to server format
  const convertToServerFormat = (slides: TypedSlideData[]): SlideContentRequest[] => {
    return slides.map((slide, index) => {
      let subpoints: Record<string, unknown> = {}

      // Convert slide data to subpoints based on slide type
      switch (slide.type) {
        case 'welcome':
          subpoints = {
            subtitle: slide.data.subtitle
          }
          break
        case 'content':
          subpoints = {
            body: slide.data.body
          }
          break
        case 'list':
          subpoints = {
            items: slide.data.items
          }
          break
        case 'compare':
          subpoints = {
            left_header: slide.data.left_header,
            left_points: slide.data.left_points,
            right_header: slide.data.right_header,
            right_points: slide.data.right_points
          }
          break
        case 'thanks':
          subpoints = {
            message: slide.data.message
          }
          break
      }

      return {
        title: slide.title,
        slideType: slide.type,
        orderNumber: index + 1,
        subpoints,
        narrationScript: slide.narrationScript || null
      }
    })
  }

  // Save slides to server
  const saveToServer = async (title: string, slides: TypedSlideData[]): Promise<LectureContentResponse> => {
    if (!projectId) {
      throw new Error('Project ID is required to save to server')
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error('Authentication token is required')
    }

    const slideContents = convertToServerFormat(slides)

    const requestBody: LectureContentRequest = {
      projectId,
      title,
      slideContents
    }

    console.log('Saving to server:', requestBody)

    try {
      const response = await fetch('https://genedu-gateway.lch.id.vn/api/v1/projects/lecture-content', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const result: LectureContentResponse = await response.json()
      console.log('Server save successful:', result)

      return result
    } catch (error) {
      console.error('Failed to save to server:', error)
      throw error
    }
  }

  const saveSlides = () => {
    if (streamSlides.length === 0) {
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
  } // Convert TypedSlideData[] to format compatible with save service
  const convertTypedSlidesToSaveFormat = (typedSlides: TypedSlideData[]) => {
    return typedSlides.map((slide, index) => ({
      id: `slide-${index + 1}`,
      title: slide.title,
      content: getSlideContent(slide),
      order: index
    }))
  } // Extract content from TypedSlideData based on slide type
  const getSlideContent = (slide: TypedSlideData): string => {
    switch (slide.type) {
      case 'welcome':
        return `${slide.title}\n${slide.data.subtitle}`
      case 'content':
        return `${slide.title}\n${slide.data.body}`
      case 'list':
        return `${slide.title}\n${slide.data.items.map((item) => `• ${item}`).join('\n')}`
      case 'compare':
        return `${slide.title}\n${slide.data.left_header}:\n${slide.data.left_points.map((p) => `• ${p}`).join('\n')}\n\n${slide.data.right_header}:\n${slide.data.right_points.map((p) => `• ${p}`).join('\n')}`
      case 'thanks':
        return `${slide.title}\n${slide.data.message}`
    }
  }
  const handleSavePresentation = async (values: {
    title: string
    description?: string
    topic?: string
    saveToServer?: boolean
  }) => {
    setSaving(true)

    try {
      const topic = values.topic || generationParams?.topic || initialTopic || 'Generated Slides'

      // Convert TypedSlideData to the format expected by DraftProjectService
      const convertedSlides = convertTypedSlidesToSaveFormat(streamSlides)

      // Create a project detail object
      const projectDetail = {
        id: `draft-${Date.now()}`,
        title: values.title,
        status: 'DRAFT' as const,
        creationTime: Date.now(),
        slideNum: convertedSlides.length,
        slides: convertedSlides,
        metadata: {
          topic,
          description: values.description,
          generationParams,
          totalSlides: streamSlides.length,
          createdFrom: 'ai-generator'
        }
      }

      // Always save to localStorage first
      const existingProjects = JSON.parse(localStorage.getItem('genedu_draft_projects') || '[]')
      existingProjects.push(projectDetail)
      localStorage.setItem('genedu_draft_projects', JSON.stringify(existingProjects))

      // If user wants to save to server and we have a projectId
      if (values.saveToServer && projectId) {
        try {
          await saveToServer(values.title, streamSlides)

          notification.success({
            message: 'Presentation Saved Successfully!',
            description: (
              <div>
                <div>
                  "{values.title}" with {streamSlides.length} slides has been saved to both your profile and the server.
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#52c41a' }}>
                  ✓ Local save complete ✓ Server save complete
                </div>
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
            duration: 8,
            placement: 'topRight'
          })
        } catch (serverError) {
          console.error('Server save failed:', serverError)
          notification.warning({
            message: 'Partial Save Success',
            description: (
              <div>
                <div>"{values.title}" has been saved locally, but server save failed.</div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#fa8c16' }}>
                  ✓ Local save complete ✗ Server save failed
                </div>
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
            duration: 8,
            placement: 'topRight'
          })
        }
      } else {
        // Local save only
        notification.success({
          message: 'Draft Saved Locally!',
          description: (
            <div>
              <div>
                "{values.title}" with {streamSlides.length} slides has been saved as a draft to your profile.
              </div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                💡 Enable "Save to Server" to persist slides on the server
              </div>
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
      }

      setSaveModalVisible(false)
      saveForm.resetFields()

      console.log('Saved draft project:', projectDetail)
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
  // Cleanup on unmount
  useEffect(() => {
    const currentAbortController = abortControllerRef.current
    const currentFormAbortController = formAbortControllerRef.current

    return () => {
      if (currentAbortController) {
        currentAbortController.abort()
      }
      if (currentFormAbortController) {
        currentFormAbortController.abort()
      }
    }
  }, [])

  if (isLoading) return <Spin tip='Loading lessons...' style={{ display: 'block', margin: '50px auto' }} />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Tabs defaultActiveKey='generator' type='card'>
        {' '}
        <TabPane tab='Slide Generator' key='generator'>
          <SlideGeneratorForm
            onGenerate={handleFormSubmit}
            loading={false}
            disabled={!!projectId}
            initialTopic={initialTopic}
            lessons={lessons ?? []}
            buttonText={projectId ? 'Project Created ✓' : 'Create Project'}
          />
        </TabPane>
        {/* Add new tab for Reveal.js presentation */}
        {/* Update the TabPane section in StreamingSlideGeneratorV2.tsx */}
        <TabPane tab={`Slide Preview (${streamSlides.length})`} key='reveal-presentation'>
          {streamSlides.length > 0 ? (
            <Card
              title={`Generated Presentation (${streamSlides.length} slides)`}
              extra={
                <Space>
                  <Button type='primary' onClick={() => setShowRevealPresentation(!showRevealPresentation)}>
                    {showRevealPresentation ? 'Hide' : 'Show'} Presentation
                  </Button>
                  <Button icon={<SaveOutlined />} onClick={saveSlides} type='default'>
                    Save Presentation
                  </Button>
                  <Button type='dashed' icon={<ClearOutlined />} onClick={() => setStreamSlides([])}>
                    Clear
                  </Button>
                </Space>
              }
              bodyStyle={{ padding: 0 }}
            >
              {showRevealPresentation ? (
                <>
                  {!isFullscreen ? (
                    <div
                      style={{
                        height: '600px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <RevealPresentation slides={streamSlides} height='600px' size='medium' />
                      <Button
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          zIndex: 1000,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #d9d9d9'
                        }}
                        onClick={toggleFullscreen}
                        size='small'
                        type='default'
                      >
                        🔍 Fullscreen
                      </Button>
                    </div>
                  ) : (
                    <Modal
                      title='Presentation - Fullscreen Mode'
                      open={isFullscreen}
                      onCancel={toggleFullscreen}
                      footer={null}
                      width='95vw'
                      style={{ top: 20 }}
                      bodyStyle={{ height: '85vh', padding: 0 }}
                      destroyOnClose={false}
                    >
                      <RevealPresentation slides={streamSlides} height='85vh' size='large' />
                    </Modal>
                  )}
                </>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  {/* Enhanced Preview of slides */}
                  <div style={{ marginTop: '20px', textAlign: 'left' }}>
                    <h4>Slide Preview:</h4>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {streamSlides.map((slide, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '12px',
                            margin: '8px 0',
                            border: '1px solid #e8e8e8',
                            borderRadius: '6px',
                            backgroundColor: '#fafafa'
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <strong>
                              Slide {index + 1} ({slide.type}):
                            </strong>{' '}
                            {slide.title}
                          </div>

                          {/* Show preview content based on type */}
                          {slide.type === 'content' && (
                            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                              {slide.data.body.substring(0, 150)}
                              {slide.data.body.length > 150 ? '...' : ''}
                            </div>
                          )}

                          {slide.type === 'list' && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              <div>Items: {slide.data.items.length}</div>
                              <div>
                                • {slide.data.items[0]?.substring(0, 100)}
                                {slide.data.items[0]?.length > 100 ? '...' : ''}
                              </div>
                              {slide.data.items.length > 1 && <div>• ...</div>}
                            </div>
                          )}

                          {slide.type === 'compare' && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              <div>
                                {slide.data.left_header} vs {slide.data.right_header}
                              </div>
                              <div>
                                {slide.data.left_points.length} vs {slide.data.right_points.length} points
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Text type='secondary'>No slides generated yet. Generate slides to see the slide preview.</Text>
              </div>
            </Card>
          )}
        </TabPane>
        {/* PowerPoint Generation Tab */}
        <TabPane tab={`PowerPoint Files (${generatedFiles.length})`} key='powerpoint-files'>
          <Card
            title={`PowerPoint Generation & Management`}
            extra={
              <Space>
                <Button
                  type='primary'
                  icon={<FileOutlined />}
                  onClick={generatePowerPoint}
                  loading={powerpointGenerating}
                  disabled={streamSlides.length === 0 || powerpointGenerating}
                >
                  {powerpointGenerating ? 'Generating...' : 'Generate PowerPoint'}
                </Button>
              </Space>
            }
          >
            {streamSlides.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Text type='secondary'>No slides generated yet. Generate slides first to create PowerPoint files.</Text>
              </div>
            ) : generatedFiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Text type='secondary'>
                  No PowerPoint files generated yet. Click "Generate PowerPoint" to create your first file.
                </Text>
              </div>
            ) : (
              <div>
                <Text strong style={{ marginBottom: 16, display: 'block' }}>
                  Generated Files ({generatedFiles.length}):
                </Text>
                <Space direction='vertical' style={{ width: '100%' }}>
                  {generatedFiles.map((file) => (
                    <Card
                      key={file.id}
                      size='small'
                      style={{ marginBottom: 8 }}
                      actions={[
                        <Button
                          key='download'
                          type='link'
                          icon={<DownloadOutlined />}
                          onClick={() => downloadFile(file)}
                          disabled={!file.localPath}
                        >
                          Download
                        </Button>,
                        <Button
                          key='upload'
                          type='link'
                          icon={<CloudUploadOutlined />}
                          onClick={() => uploadFileToServer(file)}
                          loading={uploadingFiles.includes(file.id)}
                          disabled={file.uploadStatus === 'uploaded' || uploadingFiles.includes(file.id)}
                        >
                          {file.uploadStatus === 'uploaded' ? 'Uploaded' : 'Select This File'}
                        </Button>
                      ]}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{file.filename}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Size: {(file.size / 1024).toFixed(1)} KB | Created:{' '}
                            {new Date(file.createdAt).toLocaleString()}
                          </div>
                          {file.uploadUrl && (
                            <div style={{ fontSize: '12px', color: '#1890ff', marginTop: 4 }}>
                              Server URL: {file.uploadUrl}
                            </div>
                          )}
                        </div>
                        <div>
                          {file.uploadStatus === 'uploaded' && (
                            <span style={{ color: '#52c41a', fontSize: '12px' }}>✓ Uploaded</span>
                          )}
                          {file.uploadStatus === 'pending' && (
                            <span style={{ color: '#faad14', fontSize: '12px' }}>⏳ Pending</span>
                          )}
                          {file.uploadStatus === 'failed' && (
                            <span style={{ color: '#ff4d4f', fontSize: '12px' }}>✗ Failed</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </Space>
              </div>
            )}

            {powerpointGenerating && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Spin size='large' />
                <div style={{ marginTop: 10 }}>
                  <Text type='secondary'>Generating PowerPoint file...</Text>
                </div>
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>{' '}
      <Card title='Lesson Plan File Upload' style={{ marginBottom: 24, marginTop: 24 }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text>Upload a lesson plan file (Markdown) to enhance slide generation:</Text>
          </div>

          {projectId && (
            <Space align='start' style={{ width: '100%' }}>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} disabled={uploading || isStreaming}>
                  Select File
                </Button>
              </Upload>

              <Button
                type='primary'
                onClick={() => handleFileUpload(projectId)}
                disabled={!file || uploading || isStreaming || !projectId}
                loading={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </Space>
          )}

          {/* Upload Progress */}
          {uploading && <Progress percent={uploadProgress} status='active' format={() => 'Uploading...'} />}

          {/* Project ID Status */}
          {/* <div
            style={{
              padding: '8px 12px',
              backgroundColor: projectId ? '#f6ffed' : '#fff2e8',
              border: `1px solid ${projectId ? '#b7eb8f' : '#ffbb96'}`,
              borderRadius: '6px'
            }}
          >
            <Text style={{ fontSize: '12px' }}>
              <strong>Project Status:</strong>{' '}
              {projectId ? `Project ID: ${projectId}` : 'No project created yet - generate slides first'}
            </Text>
          </div> */}

          {/* File Upload Info */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #d6f7ff',
              borderRadius: '6px'
            }}
          >
            <Text style={{ fontSize: '12px', color: '#666' }}>
              <strong>Supported formats:</strong> Markdown (.md)
              <br />
              <strong>Max file size:</strong> 10MB
            </Text>
          </div>
        </Space>
      </Card>
      {/* Workflow Steps */}
      <Card title='Slide Generation Workflow' style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          {/* Step 1: Create Project */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: projectId ? '#f6ffed' : '#e6f7ff',
              border: `1px solid ${projectId ? '#b7eb8f' : '#91d5ff'}`,
              flex: 1
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Step 1: Create Project {projectId && '✓'}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              {projectId ? `Project ID: ${projectId}` : 'Set up your project details'}
            </div>
            {!projectId && (
              <Text type='secondary' style={{ fontSize: '11px' }}>
                Fill the form below and click "Create Project"
              </Text>
            )}
          </div>

          {/* Step 2: Upload File (Optional) */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: file ? '#f6ffed' : projectId ? '#fffbe6' : '#f5f5f5',
              border: `1px solid ${file ? '#b7eb8f' : projectId ? '#ffe58f' : '#d9d9d9'}`,
              flex: 1
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Step 2: Upload File {file && '✓'}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              {file ? `File: ${file.mediaFile.name}` : 'Upload lesson plan file'}
            </div>
            {!file && projectId && (
              <Text type='secondary' style={{ fontSize: '11px' }}>
                Upload a .md file to enhance generation
              </Text>
            )}
          </div>

          {/* Step 3: Generate Slides */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: streamSlides.length > 0 ? '#f6ffed' : projectId ? '#e6f7ff' : '#f5f5f5',
              border: `1px solid ${streamSlides.length > 0 ? '#b7eb8f' : projectId ? '#91d5ff' : '#d9d9d9'}`,
              flex: 1
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
              Step 3: Generate Slides {streamSlides.length > 0 && '✓'}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              {streamSlides.length > 0 ? `Generated ${streamSlides.length} slides` : 'Generate AI slides'}
            </div>
            {projectId && streamSlides.length === 0 && (
              <Button
                type='primary'
                size='middle'
                onClick={handleGenerateSlides}
                loading={isStreaming}
                disabled={isStreaming}
              >
                {isStreaming ? 'Generating...' : 'Generate Slides'}
              </Button>
            )}
          </div>
        </div>
      </Card>
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
              <Text strong>Generating Slides...</Text>{' '}
              <Progress percent={Math.round(progress)} status='active' format={() => `${streamSlides.length} slides`} />
              <Button danger icon={<StopOutlined />} onClick={stopStreaming} size='small' block>
                Stop Generation
              </Button>
            </Space>
          </Card>
        </div>
      )}{' '}
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

          {/* Add server save option */}
          <Form.Item name='saveToServer' valuePropName='checked' label='Save Options'>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type='checkbox'
                  style={{ marginRight: '8px' }}
                  onChange={(e) => saveForm.setFieldValue('saveToServer', e.target.checked)}
                />
                <span>Save to server (persist slides permanently)</span>
              </label>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginLeft: '20px' }}>
                {projectId
                  ? '✓ Server save available with current project'
                  : '⚠️ Server save requires an active project'}
              </div>
            </div>
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
              <br />• <strong>Slides:</strong> {streamSlides.length}
              <br />• <strong>Types:</strong> {[...new Set(streamSlides.map((s) => s.type))].join(', ')}
              <br />• <strong>Project ID:</strong> {projectId || 'Not available'}
              <br />• <strong>Save Mode:</strong> Local {projectId ? '+ Server (optional)' : 'only'}
            </Text>
          </div>

          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={saving}>
                {saving ? 'Saving...' : 'Save Presentation'}
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
