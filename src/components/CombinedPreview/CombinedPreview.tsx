import React, { useState } from 'react'
import { Card, Row, Col, Button, Typography, Space, Tabs, Modal, message } from 'antd'
import { useTheme } from '../../hooks/useTheme'
import ThemePreviewContent from '../ThemePreview/ThemePreviewContent'
import LayoutPreviewContent from '../LayoutPreview/LayoutPreviewContent'
import { getLayoutsByCategory } from '../../layouts/predefinedLayouts'
import type { Theme } from '../../types/theme.type'
import type { SlideLayout } from '../../types/layout.type'

const { Title } = Typography
const { TabPane } = Tabs

interface CombinedPreviewProps {
  theme?: Theme
  layout?: SlideLayout
  visible: boolean
  onClose: () => void
  onApplyTheme?: (theme: Theme) => void
  onApplyLayout?: (layout: SlideLayout) => void
}

const CombinedPreview: React.FC<CombinedPreviewProps> = ({
  theme,
  layout,
  visible,
  onClose,
  onApplyTheme,
  onApplyLayout
}) => {
  const { currentTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('combined')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const selectedTheme = theme || currentTheme
  const selectedLayout = layout || getLayoutsByCategory('content')[0]

  const handleApplyTheme = () => {
    if (theme && onApplyTheme) {
      onApplyTheme(theme)
      message.success(`Applied theme: ${theme.name}`)
    }
  }

  const handleApplyLayout = () => {
    if (layout && onApplyLayout) {
      onApplyLayout(layout)
      message.success(`Applied layout: ${layout.name}`)
    }
  }

  const handleApplyBoth = () => {
    if (theme && onApplyTheme) {
      onApplyTheme(theme)
    }
    if (layout && onApplyLayout) {
      onApplyLayout(layout)
    }
    message.success('Applied theme and layout!')
    onClose()
  }

  const getPreviewContainerStyle = () => {
    const baseStyle = {
      transition: 'all 0.3s ease',
      border: '1px solid #e8e8e8',
      borderRadius: '8px',
      overflow: 'hidden'
    }

    switch (previewMode) {
      case 'mobile':
        return {
          ...baseStyle,
          width: '375px',
          height: '667px',
          margin: '0 auto'
        }
      case 'tablet':
        return {
          ...baseStyle,
          width: '768px',
          height: '1024px',
          margin: '0 auto'
        }
      default:
        return {
          ...baseStyle,
          width: '100%',
          height: '600px'
        }
    }
  }

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Live Preview</span>
          <Space>
            <Button.Group>
              <Button
                size='small'
                type={previewMode === 'desktop' ? 'primary' : 'default'}
                onClick={() => setPreviewMode('desktop')}
              >
                Desktop
              </Button>
              <Button
                size='small'
                type={previewMode === 'tablet' ? 'primary' : 'default'}
                onClick={() => setPreviewMode('tablet')}
              >
                Tablet
              </Button>
              <Button
                size='small'
                type={previewMode === 'mobile' ? 'primary' : 'default'}
                onClick={() => setPreviewMode('mobile')}
              >
                Mobile
              </Button>
            </Button.Group>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={previewMode === 'mobile' ? 500 : previewMode === 'tablet' ? 900 : 1200}
      footer={[
        <Button key='close' onClick={onClose}>
          Close
        </Button>,
        ...(theme
          ? [
              <Button key='apply-theme' onClick={handleApplyTheme}>
                Apply Theme Only
              </Button>
            ]
          : []),
        ...(layout
          ? [
              <Button key='apply-layout' onClick={handleApplyLayout}>
                Apply Layout Only
              </Button>
            ]
          : []),
        ...(theme && layout
          ? [
              <Button key='apply-both' type='primary' onClick={handleApplyBoth}>
                Apply Both
              </Button>
            ]
          : [])
      ]}
      destroyOnClose
    >
      <div style={{ padding: '16px 0' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab='Combined Preview' key='combined'>
            <div style={getPreviewContainerStyle()}>
              {/* Apply theme CSS variables to the preview container */}
              <div
                style={
                  {
                    '--theme-primary': selectedTheme.colors.primary,
                    '--theme-secondary': selectedTheme.colors.secondary,
                    '--theme-accent': selectedTheme.colors.accent,
                    '--theme-background': selectedTheme.colors.background,
                    '--theme-surface': selectedTheme.colors.surface,
                    '--theme-text-primary': selectedTheme.colors.text.primary,
                    '--theme-text-secondary': selectedTheme.colors.text.secondary,
                    '--theme-font-heading': selectedTheme.typography.headingFont,
                    '--theme-font-body': selectedTheme.typography.bodyFont,
                    height: '100%',
                    background: selectedTheme.colors.background,
                    padding: '16px'
                  } as React.CSSProperties
                }
              >
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <Title level={4} style={{ margin: 0, color: selectedTheme.colors.text.primary }}>
                    Preview: {selectedTheme.name} + {selectedLayout.name}
                  </Title>
                </div>
                <LayoutPreviewContent layout={selectedLayout} showInteractiveElements={true} />
              </div>
            </div>
          </TabPane>

          {theme && (
            <TabPane tab='Theme Details' key='theme'>
              <ThemePreviewContent theme={selectedTheme} />
            </TabPane>
          )}

          {layout && (
            <TabPane tab='Layout Details' key='layout'>
              <LayoutPreviewContent layout={selectedLayout} showInteractiveElements={false} />
            </TabPane>
          )}

          <TabPane tab='Comparison' key='comparison'>
            <Row gutter={16}>
              <Col span={12}>
                <Card title='Current' size='small'>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      {currentTheme.name}
                    </div>
                    <small>{currentTheme.description}</small>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title='Preview' size='small'>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${selectedTheme.colors.primary}, ${selectedTheme.colors.secondary})`,
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      {selectedTheme.name}
                    </div>
                    <small>{selectedTheme.description}</small>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  )
}

export default CombinedPreview
