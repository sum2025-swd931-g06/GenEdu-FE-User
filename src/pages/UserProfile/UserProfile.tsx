import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Row, Col, Typography, Avatar, Space, Divider, Progress, Spin, Empty } from 'antd'
import {
  UserOutlined,
  ProjectOutlined,
  EyeOutlined,
  CalendarOutlined,
  SoundOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { useProjects } from '../../hooks/useProjects'
import type { Project } from '../../types/auth.type'
import { ProjectStatus, AudioProjectStatus } from '../../types/auth.type'

const { Title, Text } = Typography
const { Meta } = Card

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, loading, error, getProjectStats } = useProjects()

  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalSlides: 0,
    totalAudioMinutes: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      const projectStats = await getProjectStats()
      setStats(projectStats)
    }
    loadStats()
  }, [projects, getProjectStats])

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
              <Text type='secondary'>Total Projects</Text>
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size='large' />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <Empty description='No projects found' image={Empty.PRESENTED_IMAGE_SIMPLE}>
            <Button type='primary'>Create Your First Project</Button>
          </Empty>
        </Card>
      ) : (
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
                        <Button type='link' icon={<PlayCircleOutlined />} onClick={() => handleWatchVideo(project.id)}>
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
      )}

      {/* Quick Actions */}
      <Card title='Quick Actions' style={{ marginTop: '24px' }}>
        <Space size='middle'>
          <Button type='primary' size='large'>
            Create New Project
          </Button>
          <Button size='large'>Generate AI Slides</Button>
          <Button size='large'>Create Audio Project</Button>
        </Space>
      </Card>
    </div>
  )
}

export default UserProfile
