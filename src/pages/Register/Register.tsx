import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, Form, Input, Button, Typography, message, Space, Divider, Select } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons'
import Layout from '../../components/Layout'

const { Title, Text } = Typography
const { Option } = Select

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: {
    name: string
    email: string
    role: string
    password: string
    confirmPassword: string
  }) => {
    try {
      setLoading(true)
      // Mock registration
      console.log('Registration data:', values)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success('Registration successful! Please login with your credentials.')
      navigate('/login')
    } catch {
      message.error('Registration failed')
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
              Join GenEdu
            </Title>
            <Text type='secondary'>Create your account to get started</Text>
          </div>

          <Form name='register' onFinish={handleSubmit} layout='vertical' requiredMark={false}>
            <Form.Item
              name='name'
              label='Full Name'
              rules={[{ required: true, message: 'Please input your full name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder='Enter your full name' size='large' />
            </Form.Item>

            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder='Enter your email' size='large' />
            </Form.Item>

            <Form.Item name='role' label='I am a' rules={[{ required: true, message: 'Please select your role!' }]}>
              <Select placeholder='Select your role' size='large'>
                <Option value='STUDENT'>Student</Option>
                <Option value='TEACHER'>Teacher</Option>
                <Option value='ADMIN'>Administrator</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder='Create a password' size='large' />
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
              <Input.Password prefix={<LockOutlined />} placeholder='Confirm your password' size='large' />
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
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ color: '#ccc' }}>Or sign up with</Divider>

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
              Already have an account? <Link to='/login'>Sign in here</Link>
            </Text>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default Register
