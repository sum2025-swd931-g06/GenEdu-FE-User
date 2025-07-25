import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Row, Col, Space, Tag, Divider, Progress, message, Slider, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  FullscreenOutlined,
  SoundOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  ProjectOutlined,
  BookOutlined
} from '@ant-design/icons'
import { DraftProjectService } from '../../services/savedSlidesService'
import RevealSlideViewer, { RevealSlideViewerRef } from '../../components/SlideViewer'
import { ProjectDetail, ProjectStatus } from '../../types/project.type'
import { useProjectDetail } from '../../queries/useProjects'

const { Title, Text, Paragraph } = Typography

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const audioRef = useRef<HTMLAudioElement>(null)
  const slideViewerRef = useRef<RevealSlideViewerRef>(null)

  // Use the useProjectDetail hook for loading project details from server
  const { data: project, isLoading: projectLoading, error: projectError } = useProjectDetail(id || '')

  // State for handling draft projects (projects without audio)
  const [draftProject, setDraftProject] = useState<ProjectDetail | null>(null)
  const [isDraftProject, setIsDraftProject] = useState(false)
  const [loading, setLoading] = useState(true)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Check if this is a draft project or regular project
  useEffect(() => {
    if (id) {
      // Try to load as draft project first
      const draft = DraftProjectService.getDraftProjectById(id)
      if (draft) {
        setDraftProject(draft)
        setIsDraftProject(true)
        setLoading(false)
      } else {
        // If not found as draft project, set state based on project query
        setIsDraftProject(false)
        setLoading(projectLoading)
      }
    }
  }, [id, projectLoading])

  useEffect(() => {
    if (projectError && !isDraftProject) {
      message.error('Project not found')
      navigate('/profile')
    }
  }, [projectError, navigate, isDraftProject])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setAudioCurrentTime(audio.currentTime)
    const updateDuration = () => setAudioDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handlePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value
    setAudioCurrentTime(value)
  }

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = value
    setVolume(value)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'green'
      case 'IN_PROGRESS':
        return 'blue'
      case 'DRAFT':
        return 'orange'
      default:
        return 'default'
    }
  }

  const getAudioStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green'
      case 'PROCESSING':
        return 'blue'
      case 'DRAFT':
        return 'orange'
      case 'ERROR':
        return 'red'
      default:
        return 'default'
    }
  }
  // Determine what data to use - we now have only one Project type
  const projectData = isDraftProject ? draftProject : project
  const slides = projectData?.slides || []

  // Reset slide index when slides change or are empty
  useEffect(() => {
    const slideCount = slides.length
    if (slideCount === 0) {
      setCurrentSlideIndex(0)
    } else if (currentSlideIndex >= slideCount) {
      setCurrentSlideIndex(slideCount - 1)
    }
  }, [slides.length, currentSlideIndex])

  // Navigation functions with useCallback to prevent dependency issues
  const nextSlide = useCallback(() => {
    if (slideViewerRef.current) {
      slideViewerRef.current.nextSlide()
    } else {
      // Fallback for when reveal viewer is not available
      if (projectData && currentSlideIndex < projectData.slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1)
      }
    }
  }, [slideViewerRef, projectData, currentSlideIndex])

  const prevSlide = useCallback(() => {
    if (slideViewerRef.current) {
      slideViewerRef.current.prevSlide()
    } else {
      // Fallback for when reveal viewer is not available
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1)
      }
    }
  }, [slideViewerRef, currentSlideIndex])

  const handleSlideChange = useCallback((slideIndex: number) => {
    setCurrentSlideIndex(slideIndex)
  }, [])

  const enterFullscreen = useCallback(() => {
    // Find the reveal container within our component
    const revealContainer = document.querySelector('.reveal')
    if (revealContainer && revealContainer.requestFullscreen) {
      revealContainer.requestFullscreen()
    }
  }, [])

  // Keyboard navigation for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events when in fullscreen mode
      if (!isFullscreen) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          prevSlide()
          break
        case 'ArrowRight': {
          event.preventDefault()
          nextSlide()
          break
        }
        case 'Escape':
          event.preventDefault()
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, nextSlide, prevSlide])

  if (loading || (projectLoading && !isDraftProject)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size='large' />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading project details...</Text>
        </div>
      </div>
    )
  }

  if (!project && !draftProject) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type='secondary'>Project not found</Text>
      </div>
    )
  }
  const currentSlide = slides.length > 0 && currentSlideIndex < slides.length ? slides[currentSlideIndex] : null

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Row justify='space-between' align='middle' style={{ marginBottom: '24px' }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/profile')}>
              Back to Profile
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {projectData?.title}
            </Title>
            <Tag color={getStatusColor(projectData?.status || 'DRAFT')}>
              {projectData?.status?.replace('_', ' ') || 'DRAFT'}
            </Tag>
          </Space>
        </Col>
        <Col>
          <Space>
            <Text type='secondary'>
              <CalendarOutlined /> {new Date(projectData?.creationTime || Date.now()).toLocaleDateString()}
            </Text>
            <Text type='secondary'>
              <ProjectOutlined /> {projectData?.slides?.length || 0} slides
            </Text>
          </Space>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* Slide Viewer */}
        <Col xs={24} lg={16}>
          {' '}
          <Card
            title={
              <Row justify='space-between' align='middle' style={{ width: '100%' }}>
                <Col>
                  <Text strong>
                    {slides.length > 0 ? `Slide ${currentSlideIndex + 1} of ${slides.length}` : 'No slides available'}
                  </Text>
                </Col>
                <Col>
                  <Space>
                    <Button
                      icon={<LeftOutlined />}
                      onClick={prevSlide}
                      disabled={currentSlideIndex === 0 || slides.length === 0}
                    />
                    <Button
                      icon={<RightOutlined />}
                      onClick={nextSlide}
                      disabled={currentSlideIndex === slides.length - 1 || slides.length === 0}
                    />
                    <Button icon={<FullscreenOutlined />} onClick={enterFullscreen} disabled={slides.length === 0} />
                  </Space>
                </Col>
              </Row>
            }
          >
            {slides.length > 0 ? (
              <RevealSlideViewer
                ref={slideViewerRef}
                slides={slides}
                currentSlideIndex={currentSlideIndex}
                onSlideChange={handleSlideChange}
                height='400px'
                embedded={true}
                showControls={false}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                <Text type='secondary'>No slides available for this project</Text>
              </div>
            )}
          </Card>
          {/* Slide Navigation */}
          <Card style={{ marginTop: '16px' }}>
            <Progress
              percent={slides.length > 0 ? ((currentSlideIndex + 1) / slides.length) * 100 : 0}
              showInfo={false}
              strokeColor='#1890ff'
            />{' '}
            <div style={{ marginTop: '16px' }}>
              <Text strong>Current Slide: </Text>
              <Text>{currentSlide ? currentSlide.title : 'No slide selected'}</Text>
            </div>
          </Card>
        </Col>

        {/* Audio Player & Project Info */}
        <Col xs={24} lg={8}>
          {/* Project Info */}
          <Card
            title={
              <>
                <InfoCircleOutlined /> Project Information
              </>
            }
            style={{ marginBottom: '16px' }}
          >
            <Space direction='vertical' style={{ width: '100%' }}>
              <div>
                <Text strong>Status: </Text>
                <Tag color={getStatusColor(projectData?.status || 'DRAFT')}>
                  {projectData?.status?.replace('_', ' ') || 'DRAFT'}
                </Tag>
              </div>
              <div>
                <Text strong>Created: </Text>
                <Text>{new Date(projectData?.creationTime || Date.now()).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text strong>Total Slides: </Text>
                <Text>{slides.length}</Text>
              </div>
              {isDraftProject && projectData?.metadata?.topic && (
                <div>
                  <Text strong>Topic: </Text>
                  <Text>{projectData.metadata.topic}</Text>
                </div>
              )}
              {isDraftProject && projectData?.metadata?.description && (
                <div>
                  <Text strong>Description: </Text>
                  <Text>{projectData.metadata.description}</Text>
                </div>
              )}
            </Space>
          </Card>

          {/* Audio Player - Only show for non-draft projects */}
          {!isDraftProject && projectData?.audioProject && (
            <Card
              title={
                <>
                  <SoundOutlined /> Audio Narration
                </>
              }
            >
              <Space direction='vertical' style={{ width: '100%' }}>
                <div>
                  <Text strong>{projectData?.audioProject?.title}</Text>
                  <br />
                  <Tag color={getAudioStatusColor(projectData?.audioProject?.status || 'DRAFT')}>
                    {projectData?.audioProject?.status || 'DRAFT'}
                  </Tag>
                </div>

                {projectData?.audioProject?.status === 'COMPLETED' && projectData.audioProject.audioUrl && (
                  <>
                    <audio ref={audioRef} src={projectData.audioProject.audioUrl} />

                    {/* Play/Pause Button */}
                    <Button
                      type='primary'
                      icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={handlePlayPause}
                      block
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>

                    {/* Progress Bar */}
                    <div>
                      <Slider
                        min={0}
                        max={audioDuration}
                        value={audioCurrentTime}
                        onChange={handleSeek}
                        tooltip={{
                          formatter: (value) => formatTime(value || 0)
                        }}
                      />
                      <Row justify='space-between'>
                        <Text type='secondary'>{formatTime(audioCurrentTime)}</Text>
                        <Text type='secondary'>{formatTime(audioDuration)}</Text>
                      </Row>
                    </div>

                    {/* Volume Control */}
                    <div>
                      <Text strong>Volume: </Text>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{ width: '120px' }}
                      />
                    </div>
                  </>
                )}

                {projectData?.audioProject?.status === 'PROCESSING' && (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Text type='secondary'>Audio is being processed...</Text>
                  </div>
                )}

                {projectData?.audioProject?.textContent && (
                  <div>
                    <Divider />
                    <Text strong>Script:</Text>
                    <Paragraph style={{ marginTop: '8px', fontSize: '14px' }}>
                      {projectData.audioProject.textContent}
                    </Paragraph>
                  </div>
                )}
              </Space>
            </Card>
          )}

          {/* Slide List */}
          <Card title='All Slides' style={{ marginTop: '16px' }} size='small'>
            <Space direction='vertical' style={{ width: '100%' }}>
              {slides.map((slide, index) => (
                <Button
                  key={slide.id}
                  type={index === currentSlideIndex ? 'primary' : 'text'}
                  onClick={() => setCurrentSlideIndex(index)}
                  block
                  style={{ textAlign: 'left' }}
                >
                  {index + 1}. {slide.title}
                </Button>
              ))}
            </Space>
          </Card>

          {/* Draft Project Actions */}
          {isDraftProject && (
            <Card title='Draft Actions' style={{ marginTop: '16px' }} size='small'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Button type='primary' icon={<SoundOutlined />} block>
                  Add Audio to Complete Project
                </Button>
                <Button
                  icon={<BookOutlined />}
                  block
                  onClick={() => navigate(`/slide-generator-demo?edit=${projectData?.id}`)}
                >
                  Edit Slides
                </Button>
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default ProjectDetailPage
