import React from 'react'
import { Card, Space, Typography, Tag } from 'antd'
import type { GeneratedSlide } from '../../types/slide.type'

const { Text, Title } = Typography

interface SlidePreviewProps {
  slide: GeneratedSlide
  isActive?: boolean
  showLayoutDetails?: boolean
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slide, isActive = false, showLayoutDetails = false }) => {
  const { slideId, slideType, title, layout, theme, words, content } = slide

  const getThemeStyles = () => {
    if (!theme) return {}

    return {
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      fontFamily: theme.typography.bodyFont,
      border: `1px solid ${theme.colors.primary}20`
    }
  }

  const renderContent = () => {
    if (content && content.length > 0) {
      return (
        <div style={{ padding: '16px' }}>
          {content.map((contentItem) => (
            <div
              key={contentItem.id}
              style={{
                position: 'relative',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: theme?.colors.surface || '#f9f9f9',
                borderRadius: '4px',
                border: `1px dashed ${theme?.colors.accent || '#ddd'}`
              }}
            >
              <Tag size='small' color={theme?.colors.accent || 'blue'}>
                {contentItem.type}
              </Tag>
              <div style={{ marginTop: '4px' }}>
                {contentItem.type === 'title' ? (
                  <Title level={4} style={{ margin: 0, color: theme?.colors.text.primary }}>
                    {contentItem.content}
                  </Title>
                ) : contentItem.type === 'subtitle' ? (
                  <Title level={5} style={{ margin: 0, color: theme?.colors.text.secondary }}>
                    {contentItem.content}
                  </Title>
                ) : (
                  <Text style={{ color: theme?.colors.text.primary }}>{contentItem.content}</Text>
                )}
              </div>
              {contentItem.position && showLayoutDetails && (
                <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
                  Position: {contentItem.position.x}%, {contentItem.position.y}% (size: {contentItem.position.width}% ×{' '}
                  {contentItem.position.height}%)
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }

    // Fallback to simple text display
    return (
      <div style={{ padding: '16px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5' }}>
        {words.join(' ')}
      </div>
    )
  }

  return (
    <Card
      size='small'
      style={{
        marginBottom: 16,
        border: isActive ? `2px solid ${theme?.colors.accent || '#1890ff'}` : undefined,
        ...getThemeStyles()
      }}
      title={
        <Space direction='vertical' size={0}>
          <Space>
            <span>{`Slide ${slideId}`}</span>
            <Tag color={theme?.colors.accent || 'blue'}>{slideType}</Tag>
            {title && <Text type='secondary'>"{title}"</Text>}
          </Space>
          {showLayoutDetails && (
            <Space size={0}>
              <Text style={{ fontSize: '12px', color: theme?.colors.text.secondary || '#666' }}>
                Layout: {layout.name} ({layout.category})
              </Text>
              {theme && (
                <Text style={{ fontSize: '12px', color: theme.colors.text.secondary, marginLeft: '16px' }}>
                  Theme: {theme.name}
                </Text>
              )}
            </Space>
          )}
        </Space>
      }
      extra={
        showLayoutDetails && (
          <Space>
            <Tag size='small'>{layout.metadata.difficulty}</Tag>
            <Tag size='small' color='green'>
              {layout.structure.regions.length} regions
            </Tag>
          </Space>
        )
      }
    >
      {renderContent()}

      {showLayoutDetails && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: theme?.colors.surface || '#f5f5f5',
            borderRadius: '4px',
            fontSize: '11px',
            color: theme?.colors.text.secondary || '#666'
          }}
        >
          <strong>Layout Description:</strong> {layout.description}
          <br />
          <strong>Regions:</strong> {layout.structure.regions.map((r) => r.type).join(', ')}
          <br />
          {layout.metadata.tags && (
            <>
              <strong>Tags:</strong> {layout.metadata.tags.join(', ')}
            </>
          )}
        </div>
      )}
    </Card>
  )
}

export default SlidePreview
