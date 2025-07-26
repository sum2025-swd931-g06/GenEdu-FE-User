import {
  BookOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  ProjectOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Modal,
  notification,
  Pagination,
  Row,
  Skeleton,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography
} from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../apis/api.config'
import { useAuth } from '../../hooks/useAuth'
import { useProjectsOfUser } from '../../queries/useProjects'
import { ProjectStatus } from '../../types/project.type'

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  // Fetch projects with pagination
  const {
    data: projectsResponse,
    isLoading,
    error
  } = useProjectsOfUser({
    page: currentPage - 1, // API uses 0-based indexing
    size: pageSize,
    sort: 'id'
  })

  const projects = projectsResponse?.content || []
  const totalElements = projectsResponse?.totalElements || 0
  //const totalPages = projectsResponse?.totalPages || 0

  // State for finalized lectures
  const [finalizedLectures, setFinalizedLectures] = useState<FinalizedLecture[]>([])
  const [loadingFinalized, setLoadingFinalized] = useState<Record<string, boolean>>({})
  const [finalizedModalVisible, setFinalizedModalVisible] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Handle pagination change
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(size)
    }
  }

  // Fetch finalized lectures for a project
  const fetchFinalizedLectures = async (projectId: string) => {
    if (loadingFinalized[projectId]) return

    setLoadingFinalized((prev) => ({ ...prev, [projectId]: true }))
    try {
      // First, get all lecture contents for this project
      const lectureContentsResponse = await api.get(`/projects/${projectId}/lecture-contents`)
      const lectureContents = lectureContentsResponse.data

      if (!lectureContents || lectureContents.length === 0) {
        setFinalizedLectures([])
        notification.info({
          message: 'No Content Found',
          description: 'No lecture contents found for this project.'
        })
        return
      }

      // Then fetch finalized lectures for each lecture content
      const allFinalizedLectures: FinalizedLecture[] = []

      for (const content of lectureContents) {
        try {
          const finalizedResponse = await api.get(`/projects/lecture-contents/${content.id}/finalized-lectures`)
          const finalizedLectures = finalizedResponse.data
          allFinalizedLectures.push(...finalizedLectures)
        } catch (error) {
          console.warn(`Failed to fetch finalized lectures for content ${content.id}:`, error)
          // Continue with other contents even if one fails
        }
      }

      setFinalizedLectures((prev) => {
        // Remove existing lectures for this project and add new ones
        const filtered = prev.filter(
          (lecture) =>
            !allFinalizedLectures.some((newLecture) => newLecture.lectureContentId === lecture.lectureContentId)
        )
        return [...filtered, ...allFinalizedLectures]
      })

      notification.success({
        message: 'Finalized Content Loaded',
        description: `Found ${allFinalizedLectures.length} finalized lecture(s) for this project.`
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

  //const handleEditProject = (projectId: string) => {
  // Navigate to slide generator with the project loaded for editing
  //  navigate(`/slide-generator-demo?edit=${projectId}`)
  //}

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
            <Text type='secondary'>({totalElements} total)</Text>
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
          <>
            <Row gutter={[16, 16]}>
              {projects.map((project) => (
                <Col xs={24} sm={12} lg={8} key={project.id}>
                  <Card
                    hoverable
                    actions={[
                      <Button
                        type='link'
                        icon={<EyeOutlined />}
                        onClick={() => handleViewProject(project.id)}
                        key='view'
                      >
                        View
                      </Button>,
                      // <Button
                      //   type='link'
                      //   icon={<FileTextOutlined />}
                      //   onClick={() => handleEditProject(project.id)}
                      //   key='edit'
                      // >
                      //   Edit
                      // </Button>,
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

            {/* Pagination */}
            {totalElements > 0 && (
              <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <Pagination
                  current={currentPage}
                  total={totalElements}
                  pageSize={pageSize}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} projects`}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  pageSizeOptions={['6', '12', '24', '48']}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Project Statistics */}
      <Card title='Project Statistics'>
        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {totalElements}
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
                <VideoCameraOutlined /> Video
              </span>
            }
            key='1'
          >
            {loadingFinalized[selectedProjectId || ''] ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size='large' />
                <div style={{ marginTop: '16px' }}>
                  <Text>Loading video content...</Text>
                </div>
              </div>
            ) : (
              <div>
                {finalizedLectures.length === 0 ? (
                  <Empty description='No finalized video content available yet' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                ) : (
                  <Row gutter={[16, 16]}>
                    {finalizedLectures.map((lecture) => (
                      <Col xs={24} lg={12} key={lecture.id}>
                        <Card
                          style={{
                            marginBottom: '16px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          cover={
                            lecture.videoFileUrl && lecture.videoFileUrl !== 'string' ? (
                              <div style={{ position: 'relative', backgroundColor: '#000' }}>
                                <video
                                  controls
                                  style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover'
                                  }}
                                  poster={lecture.thumbnailFileUrl !== 'string' ? lecture.thumbnailFileUrl : undefined}
                                >
                                  <source src={lecture.videoFileUrl} type='video/mp4' />
                                  Your browser does not support the video tag.
                                </video>
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px'
                                  }}
                                >
                                  <VideoCameraOutlined /> Video Ready
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  height: '200px',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column',
                                  color: 'white'
                                }}
                              >
                                <VideoCameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                <Text style={{ color: 'white', fontSize: '16px' }}>Video Processing...</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                                  Your video is being generated
                                </Text>
                              </div>
                            )
                          }
                          actions={[
                            <Button
                              type='primary'
                              icon={<DownloadOutlined />}
                              onClick={() =>
                                handleDownload(lecture.videoFileUrl, `video_${lecture.lectureContentId}.mp4`)
                              }
                              disabled={!lecture.videoFileUrl || lecture.videoFileUrl === 'string'}
                              key='download'
                              style={{ borderRadius: '6px' }}
                            >
                              Download Video
                            </Button>,
                            lecture.videoFileUrl && lecture.videoFileUrl !== 'string' && (
                              <Button
                                type='default'
                                icon={<EyeOutlined />}
                                onClick={() => window.open(lecture.videoFileUrl, '_blank')}
                                key='view'
                                style={{ borderRadius: '6px' }}
                              >
                                View Full Screen
                              </Button>
                            )
                          ].filter(Boolean)}
                        >
                          <Meta
                            avatar={
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #722ed1, #9254de)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <VideoCameraOutlined style={{ fontSize: '24px', color: 'white' }} />
                              </div>
                            }
                            title={
                              <div>
                                <Text strong style={{ fontSize: '16px' }}>
                                  Lecture Video
                                </Text>
                                <div style={{ marginTop: '4px' }}>
                                  <Tag
                                    color={lecture.publishedStatus === 'PUBLISHED' ? 'green' : 'orange'}
                                    style={{ borderRadius: '12px' }}
                                  >
                                    {lecture.publishedStatus}
                                  </Tag>
                                </div>
                              </div>
                            }
                            description={
                              <Space direction='vertical' size='small' style={{ width: '100%' }}>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                  Content ID: {lecture.lectureContentId}
                                </Text>
                                {lecture.videoFileUrl && lecture.videoFileUrl !== 'string' ? (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      background: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#52c41a'
                                      }}
                                    ></div>
                                    <Text style={{ color: '#389e0d', fontSize: '12px', fontWeight: 500 }}>
                                      🎬 Video ready for viewing and download
                                    </Text>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      background: '#fffbe6',
                                      border: '1px solid #ffe58f',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <Spin size='small' />
                                    <Text style={{ color: '#d48806', fontSize: '12px', fontWeight: 500 }}>
                                      📹 Video is being processed...
                                    </Text>
                                  </div>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
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
            key='2'
          >
            {loadingFinalized[selectedProjectId || ''] ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <Spin size='large' />
                <div style={{ marginTop: '16px' }}>
                  <Text>Loading presentation content...</Text>
                </div>
              </div>
            ) : (
              <div>
                {finalizedLectures.length === 0 ? (
                  <Empty
                    description='No finalized presentation content available yet'
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <Row gutter={[16, 16]}>
                    {finalizedLectures.map((lecture) => (
                      <Col xs={24} lg={12} key={lecture.id}>
                        <Card
                          style={{
                            marginBottom: '16px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          cover={
                            <div
                              style={{
                                height: '160px',
                                background: 'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                color: 'white',
                                position: 'relative'
                              }}
                            >
                              <FileImageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                              <Text style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                                PowerPoint Presentation
                              </Text>
                              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                                Ready for download
                              </Text>
                              {lecture.thumbnailFileUrl && lecture.thumbnailFileUrl !== 'string' && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    width: '60px',
                                    height: '40px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: '2px solid white'
                                  }}
                                >
                                  <img
                                    src={lecture.thumbnailFileUrl}
                                    alt='Presentation thumbnail'
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover'
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          }
                          actions={[
                            <Button
                              type='primary'
                              icon={<DownloadOutlined />}
                              onClick={() =>
                                handleDownload(lecture.presentationFileUrl, `slides_${lecture.lectureContentId}.pptx`)
                              }
                              disabled={!lecture.presentationFileUrl || lecture.presentationFileUrl === 'string'}
                              key='download'
                              style={{ borderRadius: '6px' }}
                            >
                              Download Slides
                            </Button>,
                            lecture.presentationFileUrl && lecture.presentationFileUrl !== 'string' && (
                              <Button
                                type='default'
                                icon={<EyeOutlined />}
                                onClick={() => window.open(lecture.presentationFileUrl, '_blank')}
                                key='view'
                                style={{ borderRadius: '6px' }}
                              >
                                View Online
                              </Button>
                            )
                          ].filter(Boolean)}
                        >
                          <Meta
                            avatar={
                              <div
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <FileImageOutlined style={{ fontSize: '24px', color: 'white' }} />
                              </div>
                            }
                            title={
                              <div>
                                <Text strong style={{ fontSize: '16px' }}>
                                  Lecture Slides
                                </Text>
                                <div style={{ marginTop: '4px' }}>
                                  <Tag
                                    color={lecture.publishedStatus === 'PUBLISHED' ? 'green' : 'orange'}
                                    style={{ borderRadius: '12px' }}
                                  >
                                    {lecture.publishedStatus}
                                  </Tag>
                                </div>
                              </div>
                            }
                            description={
                              <Space direction='vertical' size='small' style={{ width: '100%' }}>
                                <Text type='secondary' style={{ fontSize: '12px' }}>
                                  Content ID: {lecture.lectureContentId}
                                </Text>
                                {lecture.presentationFileUrl && lecture.presentationFileUrl !== 'string' ? (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      background: '#f6ffed',
                                      border: '1px solid #b7eb8f',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#52c41a'
                                      }}
                                    ></div>
                                    <Text style={{ color: '#389e0d', fontSize: '12px', fontWeight: 500 }}>
                                      📊 Presentation slides ready for download
                                    </Text>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      background: '#fffbe6',
                                      border: '1px solid #ffe58f',
                                      borderRadius: '6px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                  >
                                    <Spin size='small' />
                                    <Text style={{ color: '#d48806', fontSize: '12px', fontWeight: 500 }}>
                                      📄 Presentation is being processed...
                                    </Text>
                                  </div>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
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
