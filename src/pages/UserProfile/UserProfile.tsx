import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tag,
  Row,
  Col,
  Typography,
  Avatar,
  Space,
  Empty,
  Skeleton,
  Modal,
  notification,
  Tabs,
  Spin
} from 'antd'
import {
  UserOutlined,
  ProjectOutlined,
  EyeOutlined,
  BookOutlined,
  FileTextOutlined,
  DownloadOutlined,
  AudioFilled,
  VideoCameraOutlined,
  FileImageOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import { ProjectStatus } from '../../types/project.type'
import { useProjectsOfUser } from '../../queries/useProjects'
import api from '../../apis/api.config'

// Add types for finalized lectures
interface FinalizedLecture {
  id: string
  lectureContentId: string
  audioFileUrl: string
  presentationFileUrl: string
  videoFileUrl: string
  thumbnailFileUrl: string
  publishedStatus: string
}

const { Title, Text } = Typography
const { Meta } = Card
const { TabPane } = Tabs

const UserProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: projects = [], isLoading, error } = useProjectsOfUser()

  // State for finalized lectures
  const [finalizedLectures, setFinalizedLectures] = useState<FinalizedLecture[]>([])
  const [loadingFinalized, setLoadingFinalized] = useState<Record<string, boolean>>({})
  const [finalizedModalVisible, setFinalizedModalVisible] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Fetch finalized lectures for a project
  const fetchFinalizedLectures = async (projectId: string) => {
    if (loadingFinalized[projectId]) return

    setLoadingFinalized((prev) => ({ ...prev, [projectId]: true }))
    try {
      const response = await api.get(`/projects/${projectId}/finalized-lectures`)
      const lectures: FinalizedLecture[] = response.data

      setFinalizedLectures((prev) => {
        // Remove existing lectures for this project and add new ones
        const filtered = prev.filter(
          (lecture) => !lectures.some((newLecture) => newLecture.lectureContentId === lecture.lectureContentId)
        )
        return [...filtered, ...lectures]
      })

      notification.success({
        message: 'Finalized Content Loaded',
        description: `Found ${lectures.length} finalized lecture(s) for this project.`
      })
    } catch (error) {
      console.error('Failed to fetch finalized lectures:', error)
      notification.error({
        message: 'Failed to Load',
        description: 'Could not load finalized content for this project.'
      })
    } finally {
      setLoadingFinalized((prev) => ({ ...prev, [projectId]: false }))
    }
  }

  // Handle downloading files
  const handleDownload = (url: string, filename: string) => {
    if (!url || url === 'string') {
      notification.warning({
        message: 'File Not Available',
        description: 'This file is not yet ready for download.'
      })
      return
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // View finalized content modal
  const viewFinalizedContent = (projectId: string) => {
    setSelectedProjectId(projectId)
    setFinalizedModalVisible(true)
    fetchFinalizedLectures(projectId)
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
                    <Button type='link' icon={<EyeOutlined />} onClick={() => handleViewProject(project.id)} key='view'>
                      View
                    </Button>,
                    <Button
                      type='link'
                      icon={<FileTextOutlined />}
                      onClick={() => handleEditProject(project.id)}
                      key='edit'
                    >
                      Edit
                    </Button>,
                    <Button
                      type='link'
                      icon={<PlayCircleOutlined />}
                      onClick={() => viewFinalizedContent(project.id)}
                      loading={loadingFinalized[project.id]}
                      key='finalized'
                    >
                      Finalized
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

      {/* Finalized Content Modal */}
      <Modal
        title={`Finalized Content - ${selectedProjectId ? projects.find((p) => p.id === selectedProjectId)?.title : ''}`}
        open={finalizedModalVisible}
        onCancel={() => setFinalizedModalVisible(false)}
        footer={null}
        width={800}
      >
        <Tabs defaultActiveKey='1'>
          <TabPane
            tab={
              <span>
                <AudioFilled /> Audio
              </span>
            }
            key='1'
          >
            {loadingFinalized[selectedProjectId || ''] ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size='large' />
                <div style={{ marginTop: '16px' }}>
                  <Text>Loading finalized content...</Text>
                </div>
              </div>
            ) : (
              <div>
                {finalizedLectures.length === 0 ? (
                  <Empty description='No finalized content available yet' />
                ) : (
                  finalizedLectures.map((lecture) => (
                    <Card
                      key={lecture.id}
                      style={{ marginBottom: '16px' }}
                      actions={[
                        <Button
                          type='primary'
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(lecture.audioFileUrl, `audio_${lecture.lectureContentId}.mp3`)}
                          disabled={!lecture.audioFileUrl || lecture.audioFileUrl === 'string'}
                          key='download'
                        >
                          Download Audio
                        </Button>
                      ]}
                    >
                      <Meta
                        avatar={<AudioFilled style={{ fontSize: '24px', color: '#1890ff' }} />}
                        title={`Audio Content - ${lecture.lectureContentId}`}
                        description={
                          <Space direction='vertical' size='small' style={{ width: '100%' }}>
                            <Text type='secondary'>
                              Status:{' '}
                              <Tag color={lecture.publishedStatus === 'PUBLISHED' ? 'green' : 'orange'}>
                                {lecture.publishedStatus}
                              </Tag>
                            </Text>
                            {lecture.audioFileUrl && lecture.audioFileUrl !== 'string' && (
                              <Text type='secondary'>🎵 Audio file ready for download</Text>
                            )}
                          </Space>
                        }
                      />
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <VideoCameraOutlined /> Video
              </span>
            }
            key='2'
          >
            {loadingFinalized[selectedProjectId || ''] ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size='large' />
              </div>
            ) : (
              <div>
                {finalizedLectures.length === 0 ? (
                  <Empty description='No finalized content available yet' />
                ) : (
                  finalizedLectures.map((lecture) => (
                    <Card
                      key={lecture.id}
                      style={{ marginBottom: '16px' }}
                      actions={[
                        <Button
                          type='primary'
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(lecture.videoFileUrl, `video_${lecture.lectureContentId}.mp4`)}
                          disabled={!lecture.videoFileUrl || lecture.videoFileUrl === 'string'}
                          key='download'
                        >
                          Download Video
                        </Button>
                      ]}
                    >
                      <Meta
                        avatar={<VideoCameraOutlined style={{ fontSize: '24px', color: '#722ed1' }} />}
                        title={`Video Content - ${lecture.lectureContentId}`}
                        description={
                          <Space direction='vertical' size='small' style={{ width: '100%' }}>
                            <Text type='secondary'>
                              Status:{' '}
                              <Tag color={lecture.publishedStatus === 'PUBLISHED' ? 'green' : 'orange'}>
                                {lecture.publishedStatus}
                              </Tag>
                            </Text>
                            {lecture.videoFileUrl && lecture.videoFileUrl !== 'string' ? (
                              <Text type='secondary'>🎬 Video file ready for download</Text>
                            ) : (
                              <Text type='secondary' style={{ color: '#faad14' }}>
                                📹 Video is being processed...
                              </Text>
                            )}
                          </Space>
                        }
                      />
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileImageOutlined /> Presentation
              </span>
            }
            key='3'
          >
            {loadingFinalized[selectedProjectId || ''] ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size='large' />
              </div>
            ) : (
              <div>
                {finalizedLectures.length === 0 ? (
                  <Empty description='No finalized content available yet' />
                ) : (
                  finalizedLectures.map((lecture) => (
                    <Card
                      key={lecture.id}
                      style={{ marginBottom: '16px' }}
                      actions={[
                        <Button
                          type='primary'
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            handleDownload(lecture.presentationFileUrl, `slides_${lecture.lectureContentId}.pptx`)
                          }
                          disabled={!lecture.presentationFileUrl || lecture.presentationFileUrl === 'string'}
                          key='download'
                        >
                          Download Slides
                        </Button>
                      ]}
                    >
                      <Meta
                        avatar={<FileImageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
                        title={`Presentation - ${lecture.lectureContentId}`}
                        description={
                          <Space direction='vertical' size='small' style={{ width: '100%' }}>
                            <Text type='secondary'>
                              Status:{' '}
                              <Tag color={lecture.publishedStatus === 'PUBLISHED' ? 'green' : 'orange'}>
                                {lecture.publishedStatus}
                              </Tag>
                            </Text>
                            {lecture.presentationFileUrl && lecture.presentationFileUrl !== 'string' && (
                              <Text type='secondary'>📊 Presentation slides ready for download</Text>
                            )}
                            {lecture.thumbnailFileUrl && lecture.thumbnailFileUrl !== 'string' && (
                              <div style={{ marginTop: '8px' }}>
                                <img
                                  src={lecture.thumbnailFileUrl}
                                  alt='Presentation thumbnail'
                                  style={{
                                    maxWidth: '100px',
                                    maxHeight: '60px',
                                    borderRadius: '4px',
                                    border: '1px solid #d9d9d9'
                                  }}
                                />
                              </div>
                            )}
                          </Space>
                        }
                      />
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default UserProfile
