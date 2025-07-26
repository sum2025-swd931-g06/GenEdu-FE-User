import React, { useState } from 'react'
import { Card, Tag, Typography, Space, Skeleton, Alert, Empty, Pagination } from 'antd'
import { ProjectOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons'
import { useProjectsOfUser } from '../../queries/useProjects'
import { ProjectStatus } from '../../types/project.type'

const { Title, Text } = Typography

const ProjectList: React.FC = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  
  // Fetch projects with pagination
  const { data: projectsResponse, isLoading, error } = useProjectsOfUser({
    page: currentPage - 1, // API uses 0-based indexing
    size: pageSize,
    sort: 'id'
  })

  const projects = projectsResponse?.content || []
  const totalElements = projectsResponse?.totalElements || 0

  // Handle pagination change
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(size)
    }
  }

  const getStatusColor = (status: ProjectStatus): string => {
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

  if (isLoading) {
    return (
      <Card title='My Projects'>
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    )
  }

  if (error) {
    return (
      <Card title='My Projects'>
        <Alert
          message='Error Loading Projects'
          description='Failed to load your projects. Please try again later.'
          type='error'
          showIcon
        />
      </Card>
    )
  }

  if (projects.length === 0 && totalElements === 0) {
    return (
      <Card title='My Projects'>
        <Empty description='No projects found' />
      </Card>
    )
  }

  return (
    <Card
      title={
        <Space>
          <ProjectOutlined />
          <span>My Projects ({totalElements} total)</span>
        </Space>
      }
    >
      <Space direction='vertical' size='middle' style={{ width: '100%' }}>
        {projects.map((project) => (
          <Card key={project.id} size='small' style={{ border: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                  {project.title}
                </Title>

                <Space direction='vertical' size='small'>
                  <Space>
                    <Tag color={getStatusColor(project.status)}>{project.status}</Tag>
                    <Text type='secondary'>
                      <BookOutlined /> Lesson ID: {project.lessonId}
                    </Text>
                  </Space>

                  {project.slideNum && (
                    <Text type='secondary'>
                      <FileTextOutlined /> {project.slideNum} slides
                    </Text>
                  )}

                  {project.customInstructions && (
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      <strong>Instructions:</strong> {project.customInstructions}
                    </Text>
                  )}

                  <Space>
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      ID: {project.id}
                    </Text>
                    {project.templateId && (
                      <Text type='secondary' style={{ fontSize: '12px' }}>
                        Template: {project.templateId}
                      </Text>
                    )}
                  </Space>
                </Space>
              </div>
            </div>
          </Card>
        ))}
      </Space>

      {/* Pagination */}
      {totalElements > 0 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            total={totalElements}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} projects`}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}

      {/* Summary Statistics */}
      <Card size='small' style={{ marginTop: '16px', backgroundColor: '#fafafa' }} title='Summary'>
        <Space>
          <Text>
            <strong>Total:</strong> {totalElements}
          </Text>
          <Text>
            <strong>Completed:</strong> {projects.filter((p) => p.status === 'COMPLETED').length}
          </Text>
          <Text>
            <strong>In Progress:</strong> {projects.filter((p) => p.status === 'IN_PROGRESS').length}
          </Text>
          <Text>
            <strong>Draft:</strong> {projects.filter((p) => p.status === 'DRAFT').length}
          </Text>
        </Space>
      </Card>
    </Card>
  )
}

export default ProjectList
