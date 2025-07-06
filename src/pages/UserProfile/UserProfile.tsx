import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Row, Col, Typography, Avatar, Space, Empty, Skeleton } from 'antd'
import { UserOutlined, ProjectOutlined, EyeOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { ProjectStatus } from '../../types/project.type'
import { useProjectsOfUser } from '../../queries/useProjects'

const { Title, Text } = Typography
const { Meta } = Card

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: projects = [], isLoading, error } = useProjectsOfUser()

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

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`)
  }

  const handleEditProject = (projectId: string) => {
    // Navigate to slide generator with the project loaded for editing
    navigate(`/slide-generator-demo?edit=${projectId}`)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* User Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row align='middle' gutter={16}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {user?.fullName || 'User'}
            </Title>
            <Text type='secondary'>{user?.email}</Text>
          </Col>
        </Row>
      </Card>

      {/* Projects Section */}
      <Card
        title={
          <Space>
            <ProjectOutlined />
            <span>My Projects</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        {isLoading ? (
          <div>
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ) : error ? (
          <Empty description='Failed to load projects' />
        ) : projects.length === 0 ? (
          <Empty description='No projects found' />
        ) : (
          <Row gutter={[16, 16]}>
            {projects.map((project) => (
              <Col xs={24} sm={12} lg={8} key={project.id}>
                <Card
                  hoverable
                  actions={[
                    <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewProject(project.id)}>
                      View
                    </Button>,
                    <Button type='link' icon={<FileTextOutlined />} onClick={() => handleEditProject(project.id)}>
                      Edit
                    </Button>
                  ]}
                >
                  <Meta
                    title={
                      <div>
                        <Text strong>{project.title}</Text>
                        <div style={{ marginTop: '8px' }}>
                          <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
                        </div>
                      </div>
                    }
                    description={
                      <Space direction='vertical' size='small' style={{ width: '100%' }}>
                        <Text type='secondary'>
                          <BookOutlined /> Lesson ID: {project.lessonId}
                        </Text>
                        {project.slideNum && (
                          <Text type='secondary'>
                            <FileTextOutlined /> {project.slideNum} slides
                          </Text>
                        )}
                        {project.customInstructions && (
                          <Text type='secondary' ellipsis={{ tooltip: project.customInstructions }}>
                            Instructions: {project.customInstructions}
                          </Text>
                        )}
                        {project.templateId && <Text type='secondary'>Template: {project.templateId}</Text>}
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Project Statistics */}
      <Card title='Project Statistics'>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {projects.length}
              </Title>
              <Text type='secondary'>Total Projects</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {projects.filter((p) => p.status === 'COMPLETED').length}
              </Title>
              <Text type='secondary'>Completed</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                {projects.filter((p) => p.status === 'IN_PROGRESS').length}
              </Title>
              <Text type='secondary'>In Progress</Text>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#f5222d' }}>
                {projects.filter((p) => p.status === 'DRAFT').length}
              </Title>
              <Text type='secondary'>Draft</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

export default UserProfile
