import React from 'react'
import { Layout, Row, Col, Typography, Space, Divider } from 'antd'
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'

const { Footer: AntFooter } = Layout
const { Title, Text, Link } = Typography

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <AntFooter style={{ backgroundColor: '#001529', color: 'white', padding: '40px 24px 20px' }}>
      <Row gutter={[32, 32]}>
        {/* Brand Section */}
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: 'white', marginBottom: '16px' }}>
            GenEdu
          </Title>
          <Text style={{ color: '#ccc' }}>
            Empowering education through AI-powered presentation generation and speech-to-text technology.
          </Text>
          <div style={{ marginTop: '16px' }}>
            <Space size='large'>
              <GithubOutlined style={{ fontSize: '20px', color: '#ccc', cursor: 'pointer' }} />
              <TwitterOutlined style={{ fontSize: '20px', color: '#ccc', cursor: 'pointer' }} />
              <LinkedinOutlined style={{ fontSize: '20px', color: '#ccc', cursor: 'pointer' }} />
            </Space>
          </div>
        </Col>

        {/* Quick Links */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
            Quick Links
          </Title>
          <Space direction='vertical' size='small'>
            <Link style={{ color: '#ccc' }} href='/'>
              Home
            </Link>
            <Link style={{ color: '#ccc' }} href='/profile'>
              My Projects
            </Link>
            <Link style={{ color: '#ccc' }} href='/features'>
              Features
            </Link>
            <Link style={{ color: '#ccc' }} href='/pricing'>
              Pricing
            </Link>
            <Link style={{ color: '#ccc' }} href='/help'>
              Help Center
            </Link>
          </Space>
        </Col>

        {/* Features */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
            Features
          </Title>
          <Space direction='vertical' size='small'>
            <Text style={{ color: '#ccc' }}>AI Slide Generation</Text>
            <Text style={{ color: '#ccc' }}>Speech-to-Text</Text>
            <Text style={{ color: '#ccc' }}>Audio Narration</Text>
            <Text style={{ color: '#ccc' }}>Project Management</Text>
            <Text style={{ color: '#ccc' }}>Export & Share</Text>
          </Space>
        </Col>

        {/* Contact Info */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: 'white', marginBottom: '16px' }}>
            Contact
          </Title>
          <Space direction='vertical' size='small'>
            <Space>
              <MailOutlined style={{ color: '#ccc' }} />
              <Text style={{ color: '#ccc' }}>support@genedu.com</Text>
            </Space>
            <Space>
              <PhoneOutlined style={{ color: '#ccc' }} />
              <Text style={{ color: '#ccc' }}>+1 (555) 123-4567</Text>
            </Space>
            <Space>
              <EnvironmentOutlined style={{ color: '#ccc' }} />
              <Text style={{ color: '#ccc' }}>San Francisco, CA</Text>
            </Space>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: '#434343', margin: '32px 0 16px' }} />

      {/* Bottom Section */}
      <Row justify='space-between' align='middle'>
        <Col xs={24} md={12}>
          <Text style={{ color: '#ccc' }}>© {currentYear} GenEdu. All rights reserved.</Text>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space split={<span style={{ color: '#434343' }}>|</span>}>
            <Link style={{ color: '#ccc' }} href='/privacy'>
              Privacy Policy
            </Link>
            <Link style={{ color: '#ccc' }} href='/terms'>
              Terms of Service
            </Link>
            <Link style={{ color: '#ccc' }} href='/cookies'>
              Cookie Policy
            </Link>
          </Space>
        </Col>
      </Row>
    </AntFooter>
  )
}

export default Footer
