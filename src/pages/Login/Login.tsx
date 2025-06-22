import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, message, Space, Divider } from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import Layout from '../../components/Layout'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      await login(values.email, values.password)
      message.success('Login successful!')
      // Redirect to the page they were trying to access, or profile as default
      const from = location.state?.from?.pathname as string || '/profile'
      navigate(from, { replace: true })
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
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
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
              Welcome Back
            </Title>
            <Text type='secondary'>Sign in to your GenEdu account</Text>
          </div>

          <Form name='login' onFinish={handleSubmit} layout='vertical' requiredMark={false}>
            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder='Enter your email' size='large' />
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='Enter your password' size='large' />
            </Form.Item>

            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                size='large'
                block
                style={{ marginTop: '16px' }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ color: '#ccc' }}>Or sign in with</Divider>

          <Space direction='vertical' style={{ width: '100%' }}>
            <Button icon={<GoogleOutlined />} size='large' block style={{ marginBottom: '8px' }}>
              Continue with Google
            </Button>
            <Button icon={<GithubOutlined />} size='large' block>
              Continue with GitHub
            </Button>
          </Space>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Text type='secondary'>
              Don't have an account? <Link to='/register'>Sign up here</Link>
            </Text>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f6f6f6', borderRadius: '8px' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Demo Credentials:
            </Text>
            <Text type='secondary' style={{ fontSize: '12px', display: 'block' }}>
              Email: john.doe@example.com
              <br />
              Password: password123
            </Text>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default Login
