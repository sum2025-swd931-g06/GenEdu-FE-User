import React, { useState } from 'react'
import { Card, Form, Input, Button, Typography, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useLocalAuth } from '../hooks/useLocalAuth'
import type { RegisterData } from '../types/local-auth.type'

const { Title, Text } = Typography

const LocalRegister: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { register } = useLocalAuth()
  const navigate = useNavigate()

  const onFinish = async (values: RegisterData) => {
    try {
      setLoading(true)
      await register(values)
      message.success('Registration successful!')
      navigate('/profile')
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
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
            Create Account
          </Title>
          <Text type='secondary'>Join GenEdu today</Text>
        </div>

        <Form form={form} name='register' onFinish={onFinish} layout='vertical' size='large'>
          <Form.Item
            name='fullName'
            label='Full Name'
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder='Enter your full name' />
          </Form.Item>

          <Form.Item
            name='username'
            label='Username'
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores!'
              }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder='Choose a username' />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Choose a password' />
          </Form.Item>

          <Form.Item
            name='confirmPassword'
            label='Confirm Password'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match!'))
                }
              })
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Confirm your password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading} style={{ width: '100%' }}>
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Text>
            Already have an account? <Link to='/login'>Sign in here</Link>
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

export default LocalRegister
