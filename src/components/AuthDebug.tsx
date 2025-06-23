import React from 'react'
import { Card, Typography, Tag, Space } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useAuth } from '../hooks/useAuth'

const { Text, Paragraph } = Typography

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, token } = useAuth()

  if (import.meta.env.PROD) {
    return null // Don't show in production
  }

  return (
    <Card
      size='small'
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        maxWidth: '300px',
        opacity: 0.9
      }}
      title={
        <Space>
          <InfoCircleOutlined />
          Auth Debug Info
        </Space>
      }
    >
      <Space direction='vertical' size='small' style={{ width: '100%' }}>
        <div>
          <Text strong>Provider: </Text>
          <Tag color='blue'>KEYCLOAK</Tag>
        </div>

        <div>
          <Text strong>Status: </Text>
          <Tag color={isAuthenticated ? 'success' : 'default'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Tag>
        </div>

        {user && (
          <div>
            <Text strong>User: </Text>
            <Paragraph style={{ margin: 0, fontSize: '12px' }}>{user.fullName || user.username}</Paragraph>
          </div>
        )}

        {token && (
          <div>
            <Text strong>Token: </Text>
            <Paragraph copyable style={{ margin: 0, fontSize: '10px', wordBreak: 'break-all' }}>
              {token.substring(0, 20)}...
            </Paragraph>
          </div>
        )}
      </Space>
    </Card>
  )
}

export default AuthDebug
