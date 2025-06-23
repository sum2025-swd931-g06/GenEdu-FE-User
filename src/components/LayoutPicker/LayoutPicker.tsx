import React, { useState } from 'react'
import { Card, Row, Col, Button, Tag, Typography, Space, Radio, RadioChangeEvent, Modal } from 'antd'
import { PlusOutlined, EyeOutlined, LayoutOutlined } from '@ant-design/icons'
import { getLayoutsByCategory, getLayoutCategories } from '../../layouts/predefinedLayouts'
import LayoutPreviewContent from '../LayoutPreview/LayoutPreviewContent'
import type { SlideLayout } from '../../types/layout.type'

const { Title, Text, Paragraph } = Typography
const { Meta } = Card

interface LayoutCardProps {
  layout: SlideLayout
  onSelect: () => void
  onPreview: () => void
}

const LayoutCard: React.FC<LayoutCardProps> = ({ layout, onSelect, onPreview }) => {
  return (
    <Card
      hoverable
      className='layout-card'
      cover={
        <div
          className='layout-preview'
          style={{
            height: '120px',
            background: 'linear-gradient(135deg, var(--theme-surface), var(--theme-background))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            border: '1px solid var(--theme-primary)',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <LayoutOutlined style={{ fontSize: '24px', color: 'var(--theme-primary)' }} />
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'var(--theme-primary)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px'
            }}
          >
            {layout.metadata.aspectRatio}
          </div>
        </div>
      }
      actions={[
        <Button key='preview' type='text' icon={<EyeOutlined />} onClick={onPreview}>
          Preview
        </Button>,
        <Button key='select' type='primary' icon={<PlusOutlined />} onClick={onSelect}>
          Use Layout
        </Button>
      ]}
    >
      <Meta
        title={
          <Space>
            {layout.name}
            <Tag color={getCategoryColor(layout.category)}>{layout.category}</Tag>
          </Space>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>{layout.description}</Paragraph>
            <div style={{ marginTop: '8px' }}>
              <Space wrap>
                <Tag>{layout.metadata.difficulty}</Tag>
                {layout.metadata.tags.slice(0, 2).map((tag) => (
                  <Tag key={tag} color='default'>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        }
      />
    </Card>
  )
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    title: 'blue',
    content: 'green',
    image: 'orange',
    comparison: 'purple',
    timeline: 'cyan',
    list: 'geekblue',
    quote: 'magenta',
    blank: 'default'
  }
  return colors[category] || 'default'
}

interface LayoutPickerProps {
  onLayoutSelect?: (layout: SlideLayout) => void
  showInModal?: boolean
}

const LayoutPicker: React.FC<LayoutPickerProps> = ({ onLayoutSelect, showInModal = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewLayout, setPreviewLayout] = useState<SlideLayout | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  const handleCategoryChange = (e: RadioChangeEvent) => {
    setSelectedCategory(e.target.value)
  }

  const filteredLayouts = getLayoutsByCategory(selectedCategory)
  const categories = getLayoutCategories()

  const handleLayoutSelect = (layout: SlideLayout) => {
    if (onLayoutSelect) {
      onLayoutSelect(layout)
    }
    console.log('Selected layout:', layout.name)
  }

  const handleLayoutPreview = (layout: SlideLayout) => {
    setPreviewLayout(layout)
    setIsPreviewVisible(true)
  }

  const content = (
    <div className='layout-picker' style={{ padding: showInModal ? '0' : '24px' }}>
      {!showInModal && (
        <div style={{ marginBottom: '32px' }}>
          <Title level={2}>Choose Layout</Title>
          <Paragraph>Select a layout template to get started with your slide design.</Paragraph>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ marginBottom: '24px' }}>
        <Text strong style={{ marginRight: '16px' }}>
          Category:
        </Text>
        <Radio.Group value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category) => (
            <Radio.Button key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {/* Layout Grid */}
      <Row gutter={[16, 16]}>
        {filteredLayouts.map((layout) => (
          <Col xs={24} sm={12} md={8} lg={6} key={layout.id}>
            <LayoutCard
              layout={layout}
              onSelect={() => handleLayoutSelect(layout)}
              onPreview={() => handleLayoutPreview(layout)}
            />
          </Col>
        ))}
      </Row>

      {/* Preview Modal */}
      <Modal
        title={`Preview: ${previewLayout?.name}`}
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setIsPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button
            key='select'
            type='primary'
            onClick={() => {
              if (previewLayout) {
                handleLayoutSelect(previewLayout)
                setIsPreviewVisible(false)
              }
            }}
          >
            Use This Layout
          </Button>
        ]}
        width={1000}
        destroyOnClose
      >
        {previewLayout && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Typography.Paragraph>{previewLayout.description}</Typography.Paragraph>
            </div>
            <LayoutPreviewContent layout={previewLayout} showInteractiveElements={false} />
          </div>
        )}
      </Modal>

      <style>{`
        .layout-card {
          transition: all 0.3s ease;
        }
        
        .layout-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .layout-preview {
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  )

  return content
}

export default LayoutPicker
