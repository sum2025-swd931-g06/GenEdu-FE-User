import React, { useState } from 'react'
import { Card, Row, Col, Button, Tag, Typography, Space, Radio, RadioChangeEvent, Modal } from 'antd'
import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { useTheme } from '../../hooks/useTheme'
import ThemePreviewContent from '../ThemePreview/ThemePreviewContent'
import type { Theme } from '../../types/theme.type'

const { Title, Text, Paragraph } = Typography
const { Meta } = Card

interface ThemeCardProps {
  theme: Theme
  isSelected: boolean
  onSelect: () => void
  onPreview: () => void
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isSelected, onSelect, onPreview }) => {
  return (
    <Card
      hoverable
      className={`theme-card ${isSelected ? 'selected' : ''}`}
      cover={
        <div
          className='theme-preview'
          style={{
            height: '120px',
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: theme.typography.headingFont,
            fontSize: '18px',
            fontWeight: theme.typography.weights.bold
          }}
        >
          {theme.name}
        </div>
      }
      actions={[
        <Button key='preview' type='text' icon={<EyeOutlined />} onClick={onPreview}>
          Preview
        </Button>,
        <Button
          key='select'
          type={isSelected ? 'default' : 'primary'}
          icon={isSelected ? <CheckOutlined /> : undefined}
          onClick={onSelect}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      ]}
      style={{
        border: isSelected ? `2px solid ${theme.colors.accent}` : '1px solid #f0f0f0'
      }}
    >
      <Meta
        title={
          <Space>
            {theme.name}
            <Tag color={getCategoryColor(theme.category)}>{theme.category}</Tag>
          </Space>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>{theme.description}</Paragraph>
            <div className='theme-colors' style={{ marginTop: '8px' }}>
              <Space size='small'>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    border: '1px solid #d9d9d9'
                  }}
                />
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.secondary,
                    border: '1px solid #d9d9d9'
                  }}
                />
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.accent,
                    border: '1px solid #d9d9d9'
                  }}
                />
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
    business: 'blue',
    creative: 'purple',
    education: 'green',
    minimal: 'default',
    corporate: 'cyan',
    modern: 'magenta'
  }
  return colors[category] || 'default'
}

const ThemeGallery: React.FC = () => {
  const { currentTheme, availableThemes, setTheme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  const handleCategoryChange = (e: RadioChangeEvent) => {
    setSelectedCategory(e.target.value)
  }

  const filteredThemes =
    selectedCategory === 'all'
      ? availableThemes
      : availableThemes.filter((theme) => theme.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(availableThemes.map((theme) => theme.category)))]

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme)
    setIsPreviewVisible(false)
  }

  const handleThemePreview = (theme: Theme) => {
    setPreviewTheme(theme)
    setIsPreviewVisible(true)
  }

  return (
    <div className='theme-gallery' style={{ padding: '24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>Choose Your Theme</Title>
        <Paragraph>Select a theme that matches your presentation style. You can always change it later.</Paragraph>
      </div>

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

      {/* Theme Grid */}
      <Row gutter={[16, 16]}>
        {filteredThemes.map((theme) => (
          <Col xs={24} sm={12} md={8} lg={6} key={theme.id}>
            <ThemeCard
              theme={theme}
              isSelected={currentTheme.id === theme.id}
              onSelect={() => handleThemeSelect(theme)}
              onPreview={() => handleThemePreview(theme)}
            />
          </Col>
        ))}
      </Row>

      {/* Preview Modal */}
      <Modal
        title={`Preview: ${previewTheme?.name}`}
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setIsPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button
            key='apply'
            type='primary'
            onClick={() => {
              if (previewTheme) {
                handleThemeSelect(previewTheme)
              }
            }}
          >
            Apply Theme
          </Button>
        ]}
        width={900}
        destroyOnClose
      >
        {previewTheme && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <Tag color={getCategoryColor(previewTheme.category)}>{previewTheme.category}</Tag>
                <Text type='secondary'>{previewTheme.description}</Text>
              </Space>
            </div>
            <ThemePreviewContent theme={previewTheme} />
          </div>
        )}
      </Modal>

      <style>{`
        .theme-card.selected {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .theme-preview {
          position: relative;
          overflow: hidden;
        }
        
        .theme-preview::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .theme-card:hover .theme-preview::before {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default ThemeGallery
