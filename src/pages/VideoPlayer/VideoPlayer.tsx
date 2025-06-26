import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Row, Col, Space, Tag, Progress, message, Slider, Tooltip, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons'
import ReactPlayer from 'react-player'
import { useProjects } from '../../hooks/useProjects'
import type { Project } from '../../types/auth.type'

const { Title, Text } = Typography

// Hardcoded video URLs for demonstration (in real app, this would come from the project data)
const PROJECT_VIDEOS: { [key: string]: string } = {
  'proj-hoang-1': 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // Digital Transformation in Healthcare
  'proj-hoang-2': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Sustainable Energy Solutions
  'proj-hoang-3': 'https://www.youtube.com/watch?v=ScMzIvxBSi4' // Cybersecurity Best Practices
}

const VideoPlayerPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const playerRef = useRef<ReactPlayer>(null)
  const { projects, loading } = useProjects()

  const [project, setProject] = useState<Project | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    console.log('VideoPlayer useEffect:', { projectId, projectsLength: projects.length, loading })

    // Only try to find project when we have projects loaded and not loading
    if (projectId && !loading && projects.length > 0) {
      const foundProject = projects.find((p) => p.id === projectId)
      console.log('Found project:', foundProject)

      if (foundProject) {
        setProject(foundProject)
      } else {
        console.log('Project not found, redirecting to profile')
        message.error('Project not found')
        navigate('/profile')
      }
    }
  }, [projectId, projects, loading, navigate])

  const videoUrl = projectId ? PROJECT_VIDEOS[projectId] : null

  // Show loading while projects are being fetched
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Space direction='vertical' align='center'>
          <Spin size='large' />
          <div>Loading project...</div>
        </Space>
      </div>
    )
  }

  // Show not found only after projects are loaded and project is still not found
  if (!loading && (!project || !videoUrl)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type='secondary'>Video not available for this project</Text>
        <br />
        <Button type='primary' onClick={() => navigate('/profile')} style={{ marginTop: '16px' }}>
          Back to Profile
        </Button>
      </div>
    )
  }

  // At this point, we know project and videoUrl are both available
  if (!project || !videoUrl) {
    return null // This should never happen, but satisfies TypeScript
  }

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleProgress = (state: { played: number; loaded: number; playedSeconds: number }) => {
    setPlayed(state.played)
    setLoaded(state.loaded)
    setCurrentTime(state.playedSeconds)
  }

  const handleSeekChange = (value: number) => {
    setPlayed(value / 100)
  }

  const handleSeekMouseUp = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value / 100)
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value / 100)
  }

  const handleFullscreen = () => {
    const videoContainer = document.getElementById('video-container')
    if (!fullscreen) {
      if (videoContainer?.requestFullscreen) {
        videoContainer.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setFullscreen(!fullscreen)
  }

  const handleReload = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0)
      setPlayed(0)
      setCurrentTime(0)
    }
  }

  const handleShare = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl).then(() => {
      message.success('Video link copied to clipboard!')
    })
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
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

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Row justify='space-between' align='middle' style={{ marginBottom: '24px' }}>
        <Col>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/profile')} size='large'>
              Back to Profile
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {project.title}
            </Title>
            <Tag color={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Tag>
          </Space>
        </Col>
        <Col>
          <Space>
            <Tooltip title='Share Video'>
              <Button icon={<ShareAltOutlined />} onClick={handleShare} />
            </Tooltip>
            <Tooltip title='Download'>
              <Button icon={<DownloadOutlined />} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Video Player */}
        <Col xs={24} lg={16}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div
              id='video-container'
              style={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 aspect ratio
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                width='100%'
                height='100%'
                style={{ position: 'absolute', top: 0, left: 0 }}
                playing={playing}
                volume={volume}
                onProgress={handleProgress}
                onDuration={setDuration}
                onReady={() => setReady(true)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                controls={false} // We'll use custom controls
              />

              {/* Custom Video Controls */}
              {showControls && ready && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '20px 16px 16px 16px',
                    color: 'white'
                  }}
                >
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <Slider
                      value={played * 100}
                      onChange={handleSeekChange}
                      onAfterChange={handleSeekMouseUp}
                      tooltip={{ open: false }}
                      trackStyle={{ backgroundColor: '#1890ff' }}
                      handleStyle={{ borderColor: '#1890ff', backgroundColor: '#1890ff' }}
                      railStyle={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <Row justify='space-between' align='middle'>
                    <Col>
                      <Space>
                        <Button
                          type='text'
                          icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                          onClick={handlePlayPause}
                          style={{ color: 'white', fontSize: '24px' }}
                          size='large'
                        />
                        <Button
                          type='text'
                          icon={<ReloadOutlined />}
                          onClick={handleReload}
                          style={{ color: 'white' }}
                        />
                        <Space align='center'>
                          <SoundOutlined style={{ color: 'white' }} />
                          <Slider
                            value={volume * 100}
                            onChange={handleVolumeChange}
                            style={{ width: '80px' }}
                            tooltip={{ open: false }}
                            trackStyle={{ backgroundColor: '#1890ff' }}
                            handleStyle={{ borderColor: '#1890ff', backgroundColor: '#1890ff' }}
                            railStyle={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                          />
                        </Space>
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        <Text style={{ color: 'white', fontSize: '14px' }}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </Text>
                        <Button
                          type='text'
                          icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                          onClick={handleFullscreen}
                          style={{ color: 'white' }}
                        />
                      </Space>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          </Card>

          {/* Video Progress Info */}
          <Card style={{ marginTop: '16px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Progress type='circle' percent={Math.round(played * 100)} size={80} strokeColor='#1890ff' />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Watch Progress</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Progress type='circle' percent={Math.round(loaded * 100)} size={80} strokeColor='#52c41a' />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Loaded</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f0f0f0',
                      borderRadius: '50%',
                      fontSize: '24px',
                      color: '#1890ff'
                    }}
                  >
                    <ClockCircleOutlined />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>{formatTime(duration)}</Text>
                    <br />
                    <Text type='secondary'>Total Duration</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Project Information Sidebar */}
        <Col xs={24} lg={8}>
          {/* Project Details */}
          <Card
            title={
              <Space>
                <EyeOutlined />
                Project Details
              </Space>
            }
            style={{ marginBottom: '16px' }}
          >
            <Space direction='vertical' style={{ width: '100%' }}>
              <div>
                <Text strong>Status: </Text>
                <Tag color={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Tag>
              </div>
              <div>
                <Text strong>Created: </Text>
                <Text>{new Date(project.creationTime).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text strong>Slides: </Text>
                <Text>{project.slideNum || 0}</Text>
              </div>
              {project.audioProject && (
                <div>
                  <Text strong>Audio: </Text>
                  <Tag color={project.audioProject.status === 'COMPLETED' ? 'green' : 'blue'}>
                    {project.audioProject.status}
                  </Tag>
                </div>
              )}
            </Space>
          </Card>

          {/* Project Actions */}
          <Card title='Actions'>
            <Space direction='vertical' style={{ width: '100%' }}>
              <Button type='primary' block onClick={() => navigate(`/project/${project.id}`)} icon={<EyeOutlined />}>
                View Slides
              </Button>
              <Button block icon={<ShareAltOutlined />} onClick={handleShare}>
                Share Video
              </Button>
              <Button block icon={<DownloadOutlined />}>
                Download Video
              </Button>
            </Space>
          </Card>

          {/* Video Statistics */}
          <Card title='Video Statistics' style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>Watch Time: </Text>
              <Text>{formatTime(currentTime)}</Text>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>Remaining: </Text>
              <Text>{formatTime(duration - currentTime)}</Text>
            </div>
            <div>
              <Text strong>Completion: </Text>
              <Text>{Math.round(played * 100)}%</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default VideoPlayerPage
