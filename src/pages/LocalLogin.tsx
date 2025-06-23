import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLocalAuth } from '../hooks/useLocalAuth'
import type { LoginCredentials } from '../types/local-auth.type'

const { Title, Text } = Typography

const LocalLogin: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { login } = useLocalAuth()
  const navigate = useNavigate()

  const onFinish = async (values: LoginCredentials) => {
    try {
      setLoading(true)
      await login(values)
      message.success('Login successful!')
      navigate('/profile')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    form.setFieldsValue({
      email: 'demo@example.com',
      password: 'demo123'
    })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            Welcome Back
          </Title>
          <Text type='secondary'>Sign in to your account</Text>
        </div>

        <Form form={form} name='login' onFinish={onFinish} layout='vertical' size='large'>
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder='Enter your email' />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Enter your password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} style={{ width: '100%' }}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Demo Account</Divider>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Button type='dashed' onClick={fillDemoCredentials} style={{ width: '100%' }}>
            Fill Demo Credentials
          </Button>
          <Text type='secondary' style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
            Email: demo@example.com | Password: demo123
          </Text>
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text>
            Don't have an account? <Link to='/register'>Sign up now</Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to='/'>
            <Button type='link'>← Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default LocalLogin
