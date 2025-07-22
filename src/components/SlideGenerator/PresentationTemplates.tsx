import React, { useState } from 'react'
import { Card, Button, Row, Col, Space, Typography, Tag } from 'antd'
import { CheckCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { PresentationTemplate, presentationTemplates } from './templateConstants'

const { Text, Title } = Typography

interface PresentationTemplatesProps {
  selectedTemplate: PresentationTemplate | null
  onTemplateSelect: (template: PresentationTemplate) => void
  onPreview: (template: PresentationTemplate) => void
}

const PresentationTemplates: React.FC<PresentationTemplatesProps> = ({
  selectedTemplate,
  onTemplateSelect,
  onPreview
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return '#1890ff'
      case 'academic':
        return '#389e0d'
      case 'creative':
        return '#722ed1'
      default:
        return '#666666'
    }
  }

  const getShadowStyle = (shadowLevel: string) => {
    switch (shadowLevel) {
      case 'none':
        return 'none'
      case 'light':
        return '0 2px 4px rgba(0, 0, 0, 0.1)'
      case 'medium':
        return '0 4px 8px rgba(0, 0, 0, 0.12)'
      case 'strong':
        return '0 8px 16px rgba(0, 0, 0, 0.15)'
      default:
        return '0 4px 8px rgba(0, 0, 0, 0.12)'
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <Title level={4} style={{ marginBottom: '16px' }}>
        Choose Presentation Template
      </Title>
      <Text type='secondary' style={{ marginBottom: '16px', display: 'block' }}>
        Select a template to customize the visual appearance of your presentation
      </Text>

      <Row gutter={[16, 16]}>
        {presentationTemplates.map((template) => (
          <Col xs={24} md={8} key={template.id}>
            <Card
              hoverable
              style={{
                borderRadius: template.styles.borderRadius,
                border:
                  selectedTemplate?.id === template.id
                    ? `2px solid ${template.colorPalette.primary}`
                    : '1px solid #d9d9d9',
                boxShadow:
                  hoveredTemplate === template.id
                    ? getShadowStyle(template.styles.shadowLevel)
                    : getShadowStyle('light'),
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              bodyStyle={{ padding: '16px' }}
            >
              {/* Template Preview */}
              <div
                style={{
                  height: '120px',
                  marginBottom: '12px',
                  borderRadius: template.styles.borderRadius,
                  background: `linear-gradient(135deg, ${template.colorPalette.primary} 0%, ${template.colorPalette.secondary} 100%)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Sample slide preview */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontFamily: template.fonts.heading
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Sample Slide</div>
                  <div style={{ fontSize: '10px', opacity: 0.8 }}>Preview Content</div>
                </div>

                {/* Color palette preview */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '2px'
                  }}
                >
                  {[template.colorPalette.primary, template.colorPalette.secondary, template.colorPalette.accent].map(
                    (color, index) => (
                      <div
                        key={index}
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: color,
                          borderRadius: '2px',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Template Info */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}
                >
                  <Text strong style={{ fontSize: '16px' }}>
                    {template.name}
                  </Text>
                  <Tag color={getCategoryColor(template.category)} style={{ margin: 0 }}>
                    {template.category}
                  </Tag>
                </div>
                <Text type='secondary' style={{ fontSize: '12px', lineHeight: '1.4' }}>
                  {template.description}
                </Text>
              </div>

              {/* Font Preview */}
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '10px', color: '#999', display: 'block' }}>Fonts:</Text>
                <div style={{ fontSize: '11px', fontFamily: template.fonts.heading, fontWeight: 'bold' }}>
                  Heading Font
                </div>
                <div style={{ fontSize: '10px', fontFamily: template.fonts.body }}>Body Text Font</div>
              </div>

              {/* Action Buttons */}
              <Space size='small' style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button
                  type='link'
                  icon={<EyeOutlined />}
                  onClick={() => onPreview(template)}
                  style={{ padding: '4px 8px', height: 'auto' }}
                >
                  Preview
                </Button>
                <Button
                  type={selectedTemplate?.id === template.id ? 'primary' : 'default'}
                  icon={selectedTemplate?.id === template.id ? <CheckCircleOutlined /> : undefined}
                  onClick={() => onTemplateSelect(template)}
                  style={{
                    backgroundColor: selectedTemplate?.id === template.id ? template.colorPalette.primary : undefined,
                    borderColor: selectedTemplate?.id === template.id ? template.colorPalette.primary : undefined
                  }}
                >
                  {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default PresentationTemplates
