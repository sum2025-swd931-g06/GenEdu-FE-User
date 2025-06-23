import React from 'react'
import { Typography, Space, Button, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import type { SlideLayout, LayoutRegion } from '../../types/layout.type'

const { Title, Text, Paragraph } = Typography

interface LayoutPreviewContentProps {
  layout: SlideLayout
  showInteractiveElements?: boolean
}

const LayoutPreviewContent: React.FC<LayoutPreviewContentProps> = ({ layout, showInteractiveElements = true }) => {
  const containerStyle = {
    width: '100%',
    height: '400px',
    border: '2px solid var(--theme-primary)',
    borderRadius: '12px',
    position: 'relative' as const,
    background: 'var(--theme-background)',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  }

  const renderRegion = (region: LayoutRegion) => {
    const regionStyle = {
      position: 'absolute' as const,
      left: `${region.position.x}%`,
      top: `${region.position.y}%`,
      width: `${region.position.width}%`,
      height: `${region.position.height}%`,
      border: '2px dashed var(--theme-accent)',
      background: 'rgba(59, 130, 246, 0.05)',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: 'var(--theme-text-secondary)',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      cursor: showInteractiveElements ? 'pointer' : 'default',
      ...region.style
    }

    return (
      <div
        key={region.id}
        style={regionStyle}
        className='layout-region'
        onMouseEnter={(e) => {
          if (showInteractiveElements) {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
            e.currentTarget.style.borderColor = 'var(--theme-primary)'
          }
        }}
        onMouseLeave={(e) => {
          if (showInteractiveElements) {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'
            e.currentTarget.style.borderColor = 'var(--theme-accent)'
          }
        }}
      >
        {/* Region Type Badge */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            background: 'var(--theme-primary)',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {region.type.toUpperCase()}
        </div>

        {/* Interactive Controls */}
        {showInteractiveElements && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              display: 'flex',
              gap: '4px'
            }}
          >
            <Button
              size='small'
              type='text'
              icon={<EditOutlined />}
              style={{
                padding: '0 4px',
                height: '20px',
                fontSize: '10px',
                background: 'rgba(255,255,255,0.9)'
              }}
            />
            <Button
              size='small'
              type='text'
              icon={<DeleteOutlined />}
              style={{
                padding: '0 4px',
                height: '20px',
                fontSize: '10px',
                background: 'rgba(255,255,255,0.9)'
              }}
            />
          </div>
        )}

        {/* Content Preview */}
        <div style={{ textAlign: 'center', padding: '8px' }}>
          {region.type === 'title' && (
            <div>
              <Title level={4} style={{ margin: 0, fontSize: '14px', color: 'var(--theme-text-primary)' }}>
                {region.defaultContent?.text || 'Slide Title'}
              </Title>
            </div>
          )}

          {region.type === 'text' && (
            <div>
              <Paragraph style={{ margin: 0, fontSize: '11px', color: 'var(--theme-text-secondary)' }}>
                {region.defaultContent?.text || 'Your content here...'}
              </Paragraph>
            </div>
          )}

          {region.type === 'image' && (
            <div
              style={{
                width: '100%',
                height: '60%',
                background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999'
              }}
            >
              📷 Image
            </div>
          )}

          {region.type === 'list' && (
            <div style={{ textAlign: 'left', fontSize: '10px' }}>
              <div>• Point 1</div>
              <div>• Point 2</div>
              <div>• Point 3</div>
            </div>
          )}

          {region.type === 'chart' && (
            <div
              style={{
                width: '100%',
                height: '60%',
                background: 'linear-gradient(135deg, var(--theme-accent), var(--theme-secondary))',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '10px'
              }}
            >
              📊 Chart
            </div>
          )}

          {region.type === 'quote' && (
            <div style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--theme-text-primary)' }}>
              "{region.defaultContent?.text || 'Inspirational quote goes here'}"
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Layout Info */}
      <div style={{ marginBottom: '16px' }}>
        <Space wrap>
          <Tag color='blue'>{layout.metadata.difficulty}</Tag>
          <Tag color='green'>{layout.metadata.aspectRatio}</Tag>
          <Text type='secondary'>
            {layout.structure.regions.length} region{layout.structure.regions.length !== 1 ? 's' : ''}
          </Text>
        </Space>
      </div>

      {/* Layout Preview Container */}
      <div style={containerStyle}>
        {layout.structure.regions.length > 0 ? (
          layout.structure.regions.map((region) => renderRegion(region))
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--theme-text-secondary)',
              fontSize: '16px'
            }}
          >
            <PlusOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <Text style={{ fontSize: '16px', color: 'var(--theme-text-secondary)' }}>
              Blank Canvas - Add your own elements
            </Text>
            {showInteractiveElements && (
              <Button type='dashed' style={{ marginTop: '16px' }} icon={<PlusOutlined />}>
                Add Element
              </Button>
            )}
          </div>
        )}

        {/* Grid overlay for better visual guidance */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '10% 10%',
            pointerEvents: 'none',
            opacity: 0.3
          }}
        />
      </div>

      {/* Layout Metadata */}
      <div style={{ marginTop: '16px' }}>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Text strong>Tags:</Text>
          <Space wrap>
            {layout.metadata.tags.map((tag) => (
              <Tag key={tag} color='default'>
                {tag}
              </Tag>
            ))}
          </Space>
        </Space>
      </div>

      <style>{`
        .layout-region:hover {
          z-index: 10;
        }
      `}</style>
    </div>
  )
}

export default LayoutPreviewContent
