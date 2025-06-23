import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography, Space } from 'antd'
import { UserAddOutlined, ContactsOutlined } from '@ant-design/icons'
import Layout from '../../components/Layout'

const { Title, Text } = Typography

const Register: React.FC = () => {
  const navigate = useNavigate()

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
            <UserAddOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
              Join GenEdu
            </Title>
            <Text type='secondary'>Get access to AI-powered presentation tools</Text>
          </div>

          <Space direction='vertical' style={{ width: '100%' }} size='large'>
            <div style={{ padding: '24px', backgroundColor: '#f6f6f6', borderRadius: '8px' }}>
              <ContactsOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4} style={{ marginBottom: '8px' }}>
                Contact Administrator
              </Title>
              <Text type='secondary' style={{ display: 'block', marginBottom: '16px' }}>
                GenEdu uses enterprise authentication through Keycloak. To get access, please contact your system
                administrator.
              </Text>

              <Space direction='vertical' style={{ width: '100%' }}>
                <Text strong>What you'll get:</Text>
                <ul style={{ textAlign: 'left', margin: '8px 0' }}>
                  <li>AI-powered slide generation</li>
                  <li>Speech-to-text conversion</li>
                  <li>Project management tools</li>
                  <li>Secure cloud storage</li>
                </ul>
              </Space>
            </div>

            <Button
              type='primary'
              size='large'
              block
              onClick={() => navigate('/login')}
              style={{ height: '48px', fontSize: '16px' }}
            >
              Already have an account? Sign in
            </Button>

            <Text type='secondary' style={{ fontSize: '12px' }}>
              Need help? Contact support at <a href='mailto:support@genedu.com'>support@genedu.com</a>
            </Text>
          </Space>
        </Card>
      </div>
    </Layout>
  )
}

export default Register
