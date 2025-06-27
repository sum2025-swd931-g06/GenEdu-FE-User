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
import type { Project, ProjectDetail } from '../../types/auth.type'
import { ProjectStatus, AudioProjectStatus } from '../../types/auth.type'
import { DraftProjectService } from '../../services/savedSlidesService'

const { Title, Text } = Typography
const { Meta } = Card

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading, error, getProjectStats } = useProjects()
  const [draftProjects, setDraftProjects] = useState<ProjectDetail[]>([])
  const [draftsLoading, setDraftsLoading] = useState(true)

  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalSlides: 0,
    totalAudioMinutes: 0,
    draftProjects: 0 // Draft projects count
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load draft projects
        const drafts = DraftProjectService.getAllDraftProjects()
        setDraftProjects(drafts)
        setDraftsLoading(false)

        // Load project stats
        const projectStats = await getProjectStats()

        // Update stats
        setStats({
          ...projectStats,
          draftProjects: drafts.length
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        const drafts = DraftProjectService.getAllDraftProjects()
        setDraftProjects(drafts)

        setStats({
          totalProjects: 0,
          completedProjects: 0,
          totalSlides: 0,
          totalAudioMinutes: 0,
          draftProjects: drafts.length
        })
        setDraftsLoading(false)
      }
    }

    loadStats()
  }, [getProjectStats])

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
    navigate(`/project/${projectId}`)
  }

  const handleWatchVideo = (projectId: string) => {
    console.log('handleWatchVideo called with projectId:', projectId)
    navigate(`/video/${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    // Navigate to slide generator with the project loaded for editing
    navigate(`/slide-generator-demo?edit=${projectId}`)
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
              <Text strong>{stats.totalProjects}</Text>
              <Text type='secondary'>Projects</Text>
            </Space>
          </Col>
          <Col>
            <Space direction='vertical' align='center'>
              <Text strong>{stats.draftProjects}</Text>
              <Text type='secondary'>Draft Slides</Text>
            </Space>
          </Col>
          <Col>
            <Space direction='vertical' align='center'>
              <Text strong>{stats.completedProjects}</Text>
              <Text type='secondary'>Completed</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Projects Section */}
      <Title level={3} style={{ marginBottom: '16px' }}>
        <ProjectOutlined /> My Projects
      </Title>

      {(loading && projects.length === 0) || (draftsLoading && draftProjects.length === 0) ? (
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
      ) : projects.length === 0 && draftProjects.length === 0 ? (
        <Card>
          <Empty description='No projects found' image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type='primary' onClick={() => navigate('/slide-generator-demo')}>
              Create Your First Project
            </Button>
          </Empty>
        </Card>
      ) : (
        <div>
          {/* Real Projects Section */}
          {projects.length > 0 && (
            <div style={{ marginBottom: draftProjects.length > 0 ? '32px' : '0' }}>
              <Row gutter={[16, 16]}>
                {projects.map((project) => (
                  <Col xs={24} sm={12} lg={8} key={project.id}>
                    <Card
                      hoverable
                      actions={[
                        <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewProject(project.id)}>
                          View Details
                        </Button>,
                        ...(project.status === 'COMPLETED'
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
                            <Tag color={getStatusColor(project.status)}>{project.status.replace('_', ' ')}</Tag>
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
                            {project.audioProject && (
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
                                Progress:
                              </Text>
                              <Progress
                                percent={getProjectProgress(project)}
                                size='small'
                                strokeColor={getStatusColor(project.status)}
                              />
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Draft Projects Section */}
          {draftProjects.length > 0 && (
            <div>
              <Title level={4} style={{ marginBottom: '16px', color: '#faad14' }}>
                <FileTextOutlined /> Draft Projects ({draftProjects.length})
                <Text type='secondary' style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '8px' }}>
                  - Ready to add audio and complete
                </Text>
              </Title>
              <Row gutter={[16, 16]}>
                {draftProjects.map((project) => (
                  <Col xs={24} sm={12} lg={8} key={project.id}>
                    <Card
                      hoverable
                      actions={[
                        <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewProject(project.id)}>
                          View Details
                        </Button>,
                        <Button type='link' icon={<BookOutlined />} onClick={() => handleEditProject(project.id)}>
                          Edit
                        </Button>,
                        <Button type='link' icon={<SoundOutlined />}>
                          Add Audio
                        </Button>
                      ]}
                      style={{ height: '100%' }}
                    >
                      <Meta
                        title={
                          <Space direction='vertical' size='small' style={{ width: '100%' }}>
                            <Text strong>{project.title}</Text>
                            <Tag color='orange'>DRAFT</Tag>
                          </Space>
                        }
                        description={
                          <Space direction='vertical' size='small' style={{ width: '100%' }}>
                            <div>
                              <CalendarOutlined />{' '}
                              {new Date(project.creationTime).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div>
                              <FileTextOutlined /> {project.slideNum || 0} slides
                            </div>
                            <div>
                              <Text type='secondary' style={{ fontSize: '12px' }}>
                                Topic: {project.metadata?.topic || 'N/A'}
                              </Text>
                            </div>
                            {project.metadata?.description && (
                              <div>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                  {project.metadata.description.length > 50
                                    ? `${project.metadata.description.substring(0, 50)}...`
                                    : project.metadata.description}
                                </Text>
                              </div>
                            )}
                            <Divider style={{ margin: '8px 0' }} />
                            <div>
                              <Text type='secondary' style={{ fontSize: '12px' }}>
                                Status: Slides ready, add audio to complete project
                              </Text>
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
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
