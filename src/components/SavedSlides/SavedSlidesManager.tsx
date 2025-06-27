import React, { useState, useEffect } from 'react'
import {
  Card,
  List,
  Tag,
  Space,
  Button,
  Typography,
  Modal,
  Statistic,
  Row,
  Col,
  Empty,
  Dropdown,
  Menu,
  Input,
  message
} from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LayoutOutlined,
  BgColorsOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { SavedSlidesService, SavedSlidePresentation } from '../../services/savedSlidesService'
import type { ProjectDetail } from '../../types/auth.type'

const { Text } = Typography
const { Search } = Input

const SavedSlidesManager: React.FC = () => {
  const [presentations, setPresentations] = useState<ProjectDetail[]>([])
  const [filteredPresentations, setFilteredPresentations] = useState<ProjectDetail[]>([])
  const [selectedPresentation, setSelectedPresentation] = useState<ProjectDetail | null>(null)
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [stats, setStats] = useState({
    totalPresentations: 0,
    totalSlides: 0,
    totalWords: 0,
    layoutDistribution: {} as Record<string, number>,
    themesUsed: [] as string[]
  })

  useEffect(() => {
    loadPresentations()
    loadStats()
  }, [])

  const loadPresentations = () => {
    const saved = SavedSlidesService.getAllDraftProjects()
    setPresentations(saved)
    setFilteredPresentations(saved)
  }

  const loadStats = () => {
    const currentStats = SavedSlidesService.getDraftProjectStats()
    setStats({
      totalPresentations: currentStats.totalDrafts,
      totalSlides: currentStats.totalSlides,
      totalWords: 0, // Can calculate this later if needed
      layoutDistribution: {}, // Can add this later if needed
      themesUsed: currentStats.themes
    })
  }

  const handleSearch = (value: string) => {
    if (!value.trim()) {
      setFilteredPresentations(presentations)
    } else {
      const filtered = SavedSlidesService.searchDraftProjects(value)
      setFilteredPresentations(filtered)
    }
  }

  const handlePreview = (presentation: SavedSlidePresentation) => {
    setSelectedPresentation(presentation)
    setPreviewModalVisible(true)
  }

  const handleDelete = (presentationId: string) => {
    Modal.confirm({
      title: 'Delete Presentation',
      content: 'Are you sure you want to delete this presentation? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const success = SavedSlidesService.deleteDraftProject(presentationId)
        if (success) {
          message.success('Presentation deleted successfully')
          loadPresentations()
          loadStats()
        } else {
          message.error('Failed to delete presentation')
        }
      }
    })
  }

  const handleExport = (presentation: SavedSlidePresentation) => {
    const data = SavedSlidesService.exportDraftProject(presentation.id)
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${presentation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      message.success('Presentation exported successfully')
    } else {
      message.error('Failed to export presentation')
    }
  }

  const getActionMenu = (presentation: ProjectDetail) => (
    <Menu>
      <Menu.Item key='preview' icon={<EyeOutlined />} onClick={() => handlePreview(presentation)}>
        Preview Slides
      </Menu.Item>
      <Menu.Item key='export' icon={<DownloadOutlined />} onClick={() => handleExport(presentation)}>
        Export JSON
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='delete' icon={<DeleteOutlined />} onClick={() => handleDelete(presentation.id)} danger>
        Delete
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      {/* Stats Section */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title='Total Presentations' value={stats.totalPresentations} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title='Total Slides' value={stats.totalSlides} prefix={<LayoutOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title='Total Words' value={stats.totalWords} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title='Themes Used' value={stats.themesUsed.length} prefix={<BgColorsOutlined />} />
          </Col>
        </Row>

        {Object.keys(stats.layoutDistribution).length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Most Used Layouts: </Text>
            <Space wrap>
              {Object.entries(stats.layoutDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([layout, count]) => (
                  <Tag key={layout} color='blue'>
                    {layout}: {count}
                  </Tag>
                ))}
            </Space>
          </div>
        )}
      </Card>

      {/* Search and Filter */}
      <Card title='My Saved Presentations' style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder='Search presentations by title, topic, or description...'
            allowClear
            onSearch={handleSearch}
            style={{ width: 400 }}
            prefix={<SearchOutlined />}
          />
        </div>

        {filteredPresentations.length === 0 ? (
          <Empty
            description={
              presentations.length === 0
                ? 'No saved presentations yet. Generate some slides to get started!'
                : 'No presentations match your search criteria.'
            }
          />
        ) : (
          <List
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={filteredPresentations}
            renderItem={(presentation) => (
              <List.Item>
                <Card
                  size='small'
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: '14px' }} ellipsis>
                        {presentation.title}
                      </Text>
                      <Dropdown overlay={getActionMenu(presentation)} trigger={['click']}>
                        <Button type='text' icon={<MoreOutlined />} size='small' />
                      </Dropdown>
                    </div>
                  }
                  hoverable
                  onClick={() => handlePreview(presentation)}
                  style={{ cursor: 'pointer' }}
                >
                  <Space direction='vertical' size='small' style={{ width: '100%' }}>
                    <div>
                      <Tag color='blue'>{presentation.metadata?.topic || 'No topic'}</Tag>
                      <Tag>{presentation.slideNum || 0} slides</Tag>
                    </div>

                    {presentation.metadata?.description && (
                      <Text type='secondary' style={{ fontSize: '12px' }} ellipsis>
                        {presentation.metadata.description}
                      </Text>
                    )}

                    <div style={{ fontSize: '11px', color: '#999' }}>
                      <CalendarOutlined /> {new Date(presentation.creationTime).toLocaleDateString()}
                    </div>

                    {presentation.metadata?.layoutDistribution && (
                      <div>
                        <Text style={{ fontSize: '11px', color: '#666' }}>Layouts: </Text>
                        <Space size='small' wrap>
                          {Object.entries(presentation.metadata.layoutDistribution)
                            .slice(0, 3)
                            .map(([layout, count]) => (
                              <Tag key={layout} color='green'>
                                {layout} ({count})
                              </Tag>
                            ))}
                        </Space>
                      </div>
                    )}

                    {presentation.metadata?.themes && presentation.metadata.themes.length > 0 && (
                      <div>
                        <Text style={{ fontSize: '11px', color: '#666' }}>Theme: </Text>
                        <Tag color='purple'>{presentation.metadata.themes[0]}</Tag>
                      </div>
                    )}
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* Preview Modal */}
      <Modal
        title={
          <Space>
            <span>{selectedPresentation?.title}</span>
            <Tag color='blue'>{selectedPresentation?.slideNum || 0} slides</Tag>
          </Space>
        }
        open={previewModalVisible}
        onCancel={() => {
          setPreviewModalVisible(false)
          setSelectedPresentation(null)
        }}
        footer={[
          <Button key='export' onClick={() => selectedPresentation && handleExport(selectedPresentation)}>
            Export JSON
          </Button>,
          <Button key='close' type='primary' onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
        width='90%'
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {selectedPresentation && (
          <div>
            {/* Presentation Info */}
            <Card size='small' style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text>
                    <strong>Topic:</strong> {selectedPresentation.metadata?.topic || 'No topic'}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <strong>Created:</strong> {new Date(selectedPresentation.creationTime).toLocaleDateString()}
                  </Text>
                </Col>
              </Row>
              {selectedPresentation.metadata?.description && (
                <div style={{ marginTop: 8 }}>
                  <Text>
                    <strong>Description:</strong> {selectedPresentation.metadata.description}
                  </Text>
                </div>
              )}
            </Card>

            {/* Slides Preview */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {selectedPresentation.slides.map((slide) => (
                <Card key={slide.id} size='small' style={{ marginBottom: 8 }}>
                  <div>
                    <Text strong>{slide.title}</Text>
                    <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                      <div dangerouslySetInnerHTML={{ __html: slide.content }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SavedSlidesManager
