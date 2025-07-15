import { LoginOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Space, Typography } from 'antd'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import Loader from '../../components/Loader'
import { useAuth } from '../../hooks/useAuth'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state?.from?.pathname as string) || '/profile'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location.state])

  const handleKeycloakLogin = () => {
    login()
  }

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <Loader />
        </div>
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
          padding: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}
        >
          <div style={{ marginBottom: '32px' }}>
            <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
              Welcome to GenEdu
            </Title>
            <Text type='secondary'>Sign in to access your projects and create presentations</Text>
          </div>

          <Space direction='vertical' style={{ width: '100%' }} size='large'>
            <Button
              type='primary'
              icon={<LoginOutlined />}
              size='large'
              block
              onClick={handleKeycloakLogin}
              style={{ height: '48px', fontSize: '16px' }}
            >
              Sign in here
            </Button>

            {/* <div style={{ padding: '16px', backgroundColor: '#f6f6f6', borderRadius: '8px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Secure Authentication
              </Text>
              <Text type='secondary' style={{ fontSize: '12px' }}>
                GenEdu uses Keycloak for secure, enterprise-grade authentication.
                <br />
                Your credentials are protected and never stored locally.
              </Text>
            </div>

            <Text type='secondary' style={{ fontSize: '14px' }}>
              Don't have an account? Contact your administrator to get access.
            </Text> */}
          </Space>
        </Card>
      </div>
    </Layout>
  )
}

export default Login
