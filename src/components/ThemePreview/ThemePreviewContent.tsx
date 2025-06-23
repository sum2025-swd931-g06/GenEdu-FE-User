import React from 'react'
import { Card, Typography, Button, Space, Tag, Progress, Avatar } from 'antd'
import { UserOutlined, StarFilled, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import type { Theme } from '../../types/theme.type'

const { Title, Paragraph, Text } = Typography

interface ThemePreviewContentProps {
  theme: Theme
}

const ThemePreviewContent: React.FC<ThemePreviewContentProps> = ({ theme }) => {
  const previewStyles = {
    container: {
      fontFamily: theme.typography.bodyFont,
      backgroundColor: theme.colors.background,
      color: theme.colors.text.primary,
      padding: '24px',
      borderRadius: theme.borderRadius.lg,
      minHeight: '400px'
    },
    heading: {
      fontFamily: theme.typography.headingFont,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text.primary,
      marginBottom: '16px'
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.colors.primary}20`
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      color: '#fff',
      borderRadius: theme.borderRadius.sm
    },
    accentButton: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
      color: '#fff',
      borderRadius: theme.borderRadius.sm
    },
    gradientHeader: theme.colors.gradient
      ? {
          background: `linear-gradient(${theme.colors.gradient.direction}, ${theme.colors.gradient.start}, ${theme.colors.gradient.end})`,
          color: '#fff',
          padding: '20px',
          borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
          marginBottom: '16px'
        }
      : {
          background: theme.colors.primary,
          color: '#fff',
          padding: '20px',
          borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
          marginBottom: '16px'
        }
  }

  return (
    <div style={previewStyles.container}>
      {/* Header Section */}
      <div style={previewStyles.gradientHeader}>
        <Title level={2} style={{ ...previewStyles.heading, color: '#fff', margin: 0 }}>
          Presentation Title
        </Title>
        <Text style={{ color: '#fff', opacity: 0.9 }}>Theme Preview - {theme.name}</Text>
      </div>

      {/* Content Cards */}
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        {/* Key Points Card */}
        <Card style={previewStyles.card} title='Key Points'>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Text strong style={{ color: theme.colors.text.primary }}>
                • First important point
              </Text>
            </div>
            <div>
              <Text strong style={{ color: theme.colors.text.primary }}>
                • Second key insight
              </Text>
            </div>
            <div>
              <Text strong style={{ color: theme.colors.text.primary }}>
                • Third crucial element
              </Text>
            </div>
          </Space>
        </Card>

        {/* Stats and Progress */}
        <Card style={previewStyles.card} title='Progress Overview'>
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <div>
              <Text style={{ color: theme.colors.text.secondary }}>Project Completion</Text>
              <Progress percent={75} strokeColor={theme.colors.accent} trailColor={theme.colors.surface} />
            </div>
            <div>
              <Text style={{ color: theme.colors.text.secondary }}>User Engagement</Text>
              <Progress percent={90} strokeColor={theme.colors.primary} trailColor={theme.colors.surface} />
            </div>
          </Space>
        </Card>

        {/* User Profile Section */}
        <Card style={previewStyles.card}>
          <Space align='center'>
            <Avatar size={48} icon={<UserOutlined />} style={{ backgroundColor: theme.colors.secondary }} />
            <div>
              <Text strong style={{ color: theme.colors.text.primary, display: 'block' }}>
                John Doe
              </Text>
              <Text style={{ color: theme.colors.text.secondary }}>Senior Designer</Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Space>
                <StarFilled style={{ color: theme.colors.accent }} />
                <StarFilled style={{ color: theme.colors.accent }} />
                <StarFilled style={{ color: theme.colors.accent }} />
                <StarFilled style={{ color: theme.colors.accent }} />
                <StarFilled style={{ color: theme.colors.surface }} />
              </Space>
            </div>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Space size='middle'>
          <Button type='primary' style={previewStyles.primaryButton} icon={<PlayCircleOutlined />}>
            Start Presentation
          </Button>
          <Button style={previewStyles.accentButton} icon={<FileTextOutlined />}>
            View Details
          </Button>
          <Button style={{ borderColor: theme.colors.secondary, color: theme.colors.secondary }}>Cancel</Button>
        </Space>

        {/* Tags */}
        <div>
          <Space wrap>
            <Tag color={theme.colors.primary}>Design</Tag>
            <Tag color={theme.colors.secondary}>Presentation</Tag>
            <Tag color={theme.colors.accent}>Creative</Tag>
          </Space>
        </div>
      </Space>
    </div>
  )
}

export default ThemePreviewContent
