import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Row, Col, Typography, Avatar, Space, Divider, Progress, Empty, Skeleton } from 'antd'
import {
  UserOutlined,
  ProjectOutlined,
  EyeOutlined,
  CalendarOutlined,
  SoundOutlined,
  PlayCircleOutlined,
  BookOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import type { Project } from '../../types/auth.type'
import { ProjectStatus, AudioProjectStatus } from '../../types/auth.type'
import { SavedSlidesService, type SavedSlidePresentation } from '../../services/savedSlidesService'

const { Title, Text } = Typography
const { Meta } = Card

// Extended project type to handle both regular projects and slide-only presentations
interface CombinedProject extends Project {
  isSlideOnly?: boolean
  topic?: string
  description?: string
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading, error, getProjectStats } = useProjects()
  const [savedPresentations, setSavedPresentations] = useState<SavedSlidePresentation[]>([])
  const [presentationsLoading, setPresentationsLoading] = useState(true) // Start as true to show loading initially

  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalSlides: 0,
    totalAudioMinutes: 0,
    totalPresentations: 0,
    totalSlidesInPresentations: 0
  })

  // Combine regular projects and slide presentations into one unified list
  const allProjects = React.useMemo(() => {
    const combinedProjects: CombinedProject[] = [...projects]

    // Convert saved presentations to project-like objects
    const presentationProjects: CombinedProject[] = savedPresentations.map((presentation) => ({
      id: presentation.id,
      title: presentation.title,
      status: 'IN_PROGRESS' as const, // Show as processing since they don't have audio
      creationTime: new Date(presentation.createdAt).getTime(),
      slideNum: presentation.slideCount,
      isSlideOnly: true, // Flag to identify slide-only projects
      topic: presentation.topic,
      description: presentation.description
      // No audioProject - this indicates it's slides without audio
    }))

    return [...combinedProjects, ...presentationProjects]
  }, [projects, savedPresentations])

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load saved presentations first (they're synchronous from localStorage)
        const presentations = SavedSlidesService.getAllPresentations()
        setSavedPresentations(presentations)
        setPresentationsLoading(false) // Presentations are loaded immediately

        // Calculate presentation stats
        const totalSlidesInPresentations = presentations.reduce((sum, p) => sum + p.slideCount, 0)

        // Load project stats (these are async and may have delays)
        const projectStats = await getProjectStats()

        // Update combined stats
        setStats({
          ...projectStats,
          totalPresentations: presentations.length,
          totalSlidesInPresentations
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        // Set default stats if loading fails
        const presentations = SavedSlidesService.getAllPresentations()
        setSavedPresentations(presentations)
        const totalSlidesInPresentations = presentations.reduce((sum, p) => sum + p.slideCount, 0)

        setStats({
          totalProjects: 0,
          completedProjects: 0,
          totalSlides: 0,
          totalAudioMinutes: 0,
          totalPresentations: presentations.length,
          totalSlidesInPresentations
        })
        setPresentationsLoading(false)
      }
    }

    loadStats()
  }, [getProjectStats]) // Now getProjectStats is memoized and won't cause infinite re-renders

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

  const getAudioStatusColor = (status: AudioProjectStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'green'
      case 'PROCESSING':
        return 'blue'
      case 'DRAFT':
        return 'orange'
      default:
        return 'default'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProjectProgress = (project: Project) => {
    switch (project.status) {
      case 'COMPLETED':
        return 100
      case 'IN_PROGRESS':
        return 60
      case 'DRAFT':
        return 20
      default:
        return 0
    }
  }

  const handleViewProject = (projectId: string) => {
    // Check if it's a slide-only project (presentation)
    const isSlideOnlyProject = savedPresentations.some((p) => p.id === projectId)

    if (isSlideOnlyProject) {
      // Navigate to saved slides viewer
      navigate(`/saved-slides?id=${projectId}`)
    } else {
      // Navigate to regular project details
      navigate(`/project/${projectId}`)
    }
  }

  const handleWatchVideo = (projectId: string) => {
    console.log('handleWatchVideo called with projectId:', projectId)
    navigate(`/video/${projectId}`)
  }

  const handleEditPresentation = (presentationId: string) => {
    // Navigate to slide generator with the presentation loaded for editing
    navigate(`/slide-generator-demo?edit=${presentationId}`)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {error && (
        <Card style={{ marginBottom: '24px', borderColor: '#ff4d4f' }}>
          <Text type='danger'>Error loading projects: {error}</Text>
        </Card>
      )}

      {/* User Profile Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align='middle'>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>
          <Col flex='auto'>
            <Title level={2} style={{ margin: 0 }}>
              {user?.fullName || 'User'}
            </Title>
            <Text type='secondary'>{user?.email || 'N/A'}</Text>
            <br />
            <Text type='secondary'>ID: {user?.username || 'N/A'}</Text>
          </Col>
          <Col>
            <Space direction='vertical' align='center'>
              <Text strong>{stats.totalProjects + stats.totalPresentations}</Text>
              <Text type='secondary'>Total Projects</Text>
            </Space>
          </Col>
          <Col>
            <Space direction='vertical' align='center'>
              <Text strong>{stats.totalPresentations}</Text>
              <Text type='secondary'>Processing (Slides Only)</Text>
            </Space>
          </Col>
          <Col>
            <Space direction='vertical' align='center'>
              <Text strong>{stats.completedProjects}</Text>
              <Text type='secondary'>Completed (With Audio)</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Projects Section */}
      <Title level={3} style={{ marginBottom: '16px' }}>
        <ProjectOutlined /> My Projects
      </Title>

      {(loading && projects.length === 0) || (presentationsLoading && savedPresentations.length === 0) ? (
        <div>
          <Text type='secondary' style={{ marginBottom: '16px', display: 'block' }}>
            Loading your projects...
          </Text>
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map((key) => (
              <Col xs={24} sm={12} lg={8} key={key}>
                <Card>
                  <Skeleton loading={true} avatar active>
                    <Card.Meta title='Loading project...' description='Please wait while we load your projects' />
                  </Skeleton>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : allProjects.length === 0 ? (
        <Card>
          <Empty description='No projects found' image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type='primary' onClick={() => navigate('/slide-generator-demo')}>
              Create Your First Project
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {allProjects.map((project: CombinedProject) => {
            const isSlideOnly = project.isSlideOnly
            return (
              <Col xs={24} sm={12} lg={8} key={project.id}>
                <Card
                  hoverable
                  actions={[
                    <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewProject(project.id)}>
                      {isSlideOnly ? 'View Slides' : 'View Details'}
                    </Button>,
                    ...(isSlideOnly
                      ? [
                          <Button
                            type='link'
                            icon={<BookOutlined />}
                            onClick={() => handleEditPresentation(project.id)}
                          >
                            Edit
                          </Button>
                        ]
                      : project.status === 'COMPLETED'
                        ? [
                            <Button
                              type='link'
                              icon={<PlayCircleOutlined />}
                              onClick={() => handleWatchVideo(project.id)}
                            >
                              Watch Video
                            </Button>
                          ]
                        : [])
                  ]}
                  style={{ height: '100%' }}
                >
                  <Meta
                    title={
                      <Space direction='vertical' size='small' style={{ width: '100%' }}>
                        <Text strong>{project.title}</Text>
                        <Tag color={isSlideOnly ? 'orange' : getStatusColor(project.status)}>
                          {isSlideOnly ? 'PROCESSING (SLIDES ONLY)' : project.status.replace('_', ' ')}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction='vertical' size='small' style={{ width: '100%' }}>
                        <div>
                          <CalendarOutlined /> {formatDate(project.creationTime)}
                        </div>
                        <div>
                          <ProjectOutlined /> {project.slideNum || 0} slides
                        </div>
                        {isSlideOnly && (
                          <>
                            <div>
                              <Text type='secondary' style={{ fontSize: '12px' }}>
                                Topic: {project.topic}
                              </Text>
                            </div>
                            {project.description && (
                              <div>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                  {project.description.length > 50
                                    ? `${project.description.substring(0, 50)}...`
                                    : project.description}
                                </Text>
                              </div>
                            )}
                          </>
                        )}
                        {!isSlideOnly && project.audioProject && (
                          <div>
                            <SoundOutlined /> Audio:{' '}
                            <Tag color={getAudioStatusColor(project.audioProject.status)}>
                              {project.audioProject.status}
                            </Tag>
                            {project.audioProject.durationSeconds && (
                              <Text type='secondary'>({formatDuration(project.audioProject.durationSeconds)})</Text>
                            )}
                          </div>
                        )}
                        <Divider style={{ margin: '8px 0' }} />
                        <div>
                          <Text type='secondary' style={{ fontSize: '12px' }}>
                            {isSlideOnly ? 'Status: Processing Slides (No Audio)' : 'Progress:'}
                          </Text>
                          <Progress
                            percent={isSlideOnly ? 70 : getProjectProgress(project)}
                            size='small'
                            strokeColor={isSlideOnly ? '#faad14' : getStatusColor(project.status)}
                            showInfo={!isSlideOnly}
                          />
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      {/* Quick Actions */}
      <Card title='Quick Actions' style={{ marginTop: '24px' }}>
        <Space size='middle' wrap>
          <Button
            type='primary'
            size='large'
            icon={<FileTextOutlined />}
            onClick={() => navigate('/slide-generator-demo')}
          >
            Generate AI Slides
          </Button>
          <Button size='large'>Create Full Project (Slides + Audio)</Button>
          <Button size='large' icon={<BookOutlined />} onClick={() => navigate('/saved-slides')}>
            View All Slides
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default UserProfile
