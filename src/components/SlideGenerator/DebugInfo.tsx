import React, { useState } from 'react'
import { Card, Typography, Button, Space } from 'antd'
import { BugOutlined, CloseOutlined, ExpandAltOutlined, CompressOutlined, MinusOutlined } from '@ant-design/icons'
import { useKeycloak } from '@react-keycloak/web'
import { useAuth } from '../../hooks/useAuth'
import { SlideGenerationParams } from './SlideGeneratorForm'
import { GeneratedSlide } from '../../types/slide.type'
import { predefinedLayouts } from '../../layouts/predefinedLayouts'
import { predefinedThemes } from '../../themes/predefinedThemes'

const { Text } = Typography

interface DebugInfoProps {
  isDemoMode: boolean
  generationParams: SlideGenerationParams | null
  initialTopic?: string
  enhancedSlideMap?: Record<string, GeneratedSlide>
  useLayoutAssignment?: boolean
  selectedTheme?: { id: string; name: string }
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  isDemoMode,
  generationParams,
  initialTopic,
  enhancedSlideMap = {},
  useLayoutAssignment = true,
  selectedTheme
}) => {
  const { user } = useAuth()
  const { keycloak } = useKeycloak()
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const getAuthToken = (): string | null => {
    // Try to get token from Keycloak first
    if (keycloak.authenticated && keycloak.token) {
      return keycloak.token
    }

    // Fallback to localStorage
    const localToken = localStorage.getItem('token')
    if (localToken) {
      return localToken
    }

    return null
  }

  if (!isVisible) {
    return (
      <Button
        type='primary'
        size='small'
        icon={<BugOutlined />}
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        Debug
      </Button>
    )
  }

  const token = getAuthToken()

  // Always floating style
  const floatingStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    width: isMinimized ? '200px' : isExpanded ? '450px' : '320px',
    maxHeight: isMinimized ? '60px' : isExpanded ? '70vh' : '400px',
    overflowY: 'auto',
    zIndex: 1000,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    transition: 'all 0.3s ease-in-out',
    backgroundColor: '#fff'
  }

  return (
    <Card
      size='small'
      style={floatingStyle}
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <BugOutlined />
            <Text strong style={{ fontSize: '12px' }}>
              Debug Info
            </Text>
          </Space>
          <Space>
            <Button
              type='text'
              size='small'
              icon={<MinusOutlined />}
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Restore' : 'Minimize'}
            />
            {!isMinimized && (
              <Button
                type='text'
                size='small'
                icon={isExpanded ? <CompressOutlined /> : <ExpandAltOutlined />}
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
              />
            )}
            <Button
              type='text'
              size='small'
              icon={<CloseOutlined />}
              onClick={() => setIsVisible(false)}
              title='Close'
            />
          </Space>
        </Space>
      }
      bodyStyle={{
        padding: isMinimized ? '0' : '12px',
        display: isMinimized ? 'none' : 'block'
      }}
    >
      <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
        <Text type='secondary'>
          <strong>Mode:</strong> {isDemoMode ? 'Demo' : 'Production'}
          <br />
          <strong>Auth:</strong> {keycloak.authenticated ? '✅ Yes' : '❌ No'}
          <br />
          <strong>Token:</strong> {token ? `✅ ${token.length} chars` : '❌ None'}
          <br />
          <strong>User:</strong> {user?.fullName || keycloak.tokenParsed?.name || 'N/A'}
          <br />
          <strong>Method:</strong> {isDemoMode ? 'GET (Demo)' : 'POST (Production)'}
          <br />
          <strong>Endpoint:</strong>
          <div style={{ fontSize: '9px', wordBreak: 'break-all', marginTop: '2px', color: '#666' }}>
            localhost:8222/api/v1/projects/stream/slide-content
          </div>
          {initialTopic && (
            <>
              <br />
              <strong>URL Topic:</strong>
              <div style={{ fontSize: '10px', color: '#1890ff', marginTop: '2px' }}>"{initialTopic}"</div>
            </>
          )}
          {generationParams && (
            <>
              <br />
              <br />
              <strong>🎯 Generation Parameters:</strong>
              <div style={{ marginLeft: '8px', marginTop: '4px', fontSize: '10px' }}>
                <strong>Topic:</strong> <span style={{ color: '#1890ff' }}>{generationParams.topic}</span>
                <br />
                <strong>Slides:</strong> <span style={{ color: '#52c41a' }}>{generationParams.slideCount}</span>
                <br />
                <strong>Difficulty:</strong> <span style={{ color: '#722ed1' }}>{generationParams.difficulty}</span>
                <br />
                <strong>Language:</strong> {generationParams.language}
                <br />
                <strong>Audio:</strong> {generationParams.includeAudio ? '🔊 Yes' : '🔇 No'}
                {isExpanded && generationParams.slideTypes && generationParams.slideTypes.length > 0 && (
                  <>
                    <br />
                    <strong>Types:</strong>
                    <div style={{ fontSize: '9px', marginTop: '2px' }}>{generationParams.slideTypes.join(', ')}</div>
                  </>
                )}
                {isExpanded && generationParams.keywords && generationParams.keywords.length > 0 && (
                  <>
                    <br />
                    <strong>Keywords:</strong>
                    <div style={{ fontSize: '9px', marginTop: '2px' }}>{generationParams.keywords.join(', ')}</div>
                  </>
                )}
                {isExpanded && generationParams.description && (
                  <>
                    <br />
                    <strong>Description:</strong>
                    <div style={{ fontSize: '9px', marginTop: '2px', maxHeight: '40px', overflowY: 'auto' }}>
                      {generationParams.description}
                    </div>
                  </>
                )}
                {isExpanded && generationParams.additionalRequirements && (
                  <>
                    <br />
                    <strong>Requirements:</strong>
                    <div style={{ fontSize: '9px', marginTop: '2px', maxHeight: '40px', overflowY: 'auto' }}>
                      {generationParams.additionalRequirements}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
          {generationParams && !isExpanded && (
            <>
              <br />
              <Text style={{ fontSize: '9px', color: '#999' }}>💡 Click expand (⤢) for full details</Text>
            </>
          )}
          {/* Layout & Theme Integration Info */}
          <br />
          <Text style={{ fontSize: '10px', color: '#1890ff' }}>
            <strong>🎨 Layout Integration:</strong>
            <br />
            <strong>Auto-assignment:</strong> {useLayoutAssignment ? '✅ Enabled' : '❌ Disabled'}
            <br />
            <strong>Available Layouts:</strong> {predefinedLayouts.length}
            <br />
            <strong>Available Themes:</strong> {predefinedThemes.length}
            {selectedTheme && (
              <>
                <br />
                <strong>Selected Theme:</strong> {selectedTheme.name}
              </>
            )}
            <br />
            <strong>Enhanced Slides:</strong> {Object.keys(enhancedSlideMap).length}
            {isExpanded && Object.keys(enhancedSlideMap).length > 0 && (
              <>
                <br />
                <strong>Layout Distribution:</strong>
                <div style={{ fontSize: '9px', marginTop: '2px' }}>
                  {Object.values(enhancedSlideMap).reduce(
                    (acc, slide) => {
                      const layoutName = slide.layout.name
                      acc[layoutName] = (acc[layoutName] || 0) + 1
                      return acc
                    },
                    {} as Record<string, number>
                  )
                    ? Object.entries(
                        Object.values(enhancedSlideMap).reduce(
                          (acc, slide) => {
                            const layoutName = slide.layout.name
                            acc[layoutName] = (acc[layoutName] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>
                        )
                      )
                        .map(([layout, count]) => `${layout}: ${count}`)
                        .join(', ')
                    : 'None'}
                </div>
              </>
            )}
          </Text>
        </Text>
      </div>
    </Card>
  )
}

export default DebugInfo
