import {
  AppstoreOutlined,
  BgColorsOutlined,
  BulbOutlined,
  EyeOutlined,
  RocketOutlined,
  SoundOutlined
} from '@ant-design/icons'
import { Button, Card, Col, Input, Row, Space, Tabs, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CombinedPreview from '../../components/CombinedPreview'
import LayoutPicker from '../../components/LayoutPicker'
import ThemeGallery from '../../components/ThemeGallery'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { getLayoutsByCategory } from '../../layouts/predefinedLayouts'

const { Title, Paragraph } = Typography

export default function Home() {
  const [topic, setTopic] = useState('')
  const [showCombinedPreview, setShowCombinedPreview] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { availableThemes } = useTheme()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      navigate(`/presentation?topic=${encodeURIComponent(topic.trim())}`)
    }
  }

  const handleShowPreview = () => {
    setShowCombinedPreview(true)
  }

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <Title level={1} style={{ fontSize: '3rem', marginBottom: '24px' }}>
          Create Amazing Presentations with AI
        </Title>
        <Paragraph style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto 40px' }}>
          Transform your ideas into stunning presentations with AI-powered slide generation and speech-to-text
          technology.
        </Paragraph>

        <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            <Title level={4} style={{ marginBottom: '16px' }}>
              Get Started Now
            </Title>
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='Enter your topic (e.g., "AI in Education", "Climate Change")'
                size='large'
                style={{ flex: 1 }}
              />
              <Button type='primary' htmlType='submit' size='large' disabled={!topic.trim()}>
                Generate Slides
              </Button>
            </Space.Compact>
          </form>
        </Card>
      </div>

      {/* Features Section */}
      <Row gutter={[32, 32]} style={{ marginBottom: '60px' }}>
        <Col xs={24} md={8}>
          <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
            <BulbOutlined style={{ fontSize: '3rem', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={3}>AI-Powered Generation</Title>
            <Paragraph>
              Our advanced AI creates engaging slides tailored to your topic, saving you hours of work.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
            <SoundOutlined style={{ fontSize: '3rem', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={3}>Audio Narration</Title>
            <Paragraph>
              Convert your text to professional audio narration with multiple voice options and natural speech.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
            <RocketOutlined style={{ fontSize: '3rem', color: '#722ed1', marginBottom: '16px' }} />
            <Title level={3}>Easy Management</Title>
            <Paragraph>
              Organize, edit, and share your presentations with our intuitive project management system.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Themes and Layouts Demo Section */}
      <div style={{ marginBottom: '60px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
          Customize Your Presentations
        </Title>
        <Paragraph
          style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px'
          }}
        >
          Choose from beautiful themes and professional layouts to make your presentations stand out.
        </Paragraph>

        <Tabs
          defaultActiveKey='themes'
          centered
          items={[
            {
              key: 'themes',
              label: (
                <span>
                  <BgColorsOutlined />
                  Themes
                </span>
              ),
              children: <ThemeGallery />
            },
            {
              key: 'layouts',
              label: (
                <span>
                  <AppstoreOutlined />
                  Layouts
                </span>
              ),
              children: <LayoutPicker />
            }
          ]}
        />
      </div>

      {/* Live Preview Demo Section */}
      <div style={{ marginBottom: '60px' }}>
        <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Title level={2} style={{ marginBottom: '16px' }}>
            See Themes and Layouts in Action
          </Title>
          <Paragraph style={{ fontSize: '1.1rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Experience how our themes and layouts work together to create stunning presentations.
          </Paragraph>
          <Button
            type='primary'
            size='large'
            icon={<EyeOutlined />}
            onClick={handleShowPreview}
            style={{ marginBottom: '16px' }}
          >
            Live Preview Demo
          </Button>
        </Card>
      </div>

      {/* Combined Preview Modal */}
      <CombinedPreview
        theme={availableThemes[0]} // Show first theme as demo
        layout={getLayoutsByCategory('content')[0]} // Show first content layout as demo
        visible={showCombinedPreview}
        onClose={() => setShowCombinedPreview(false)}
      />

      {/* CTA Section */}
      <Card
        style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
      >
        <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
          Ready to revolutionize your presentations?
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '1.1rem', marginBottom: '24px' }}>
          Join thousands of educators and professionals using GenEdu.
        </Paragraph>
        <Space>
          {!isAuthenticated ? (
            <>
              <Button size='large' style={{ marginRight: '16px' }} onClick={() => navigate('/register')}>
                Get Started Free
              </Button>
              <Button size='large' type='default' ghost onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Button size='large' style={{ marginRight: '16px' }} onClick={() => navigate('/profile')}>
                My Projects
              </Button>
              <Button size='large' type='default' ghost onClick={() => navigate('/presentation')}>
                Create Presentation
              </Button>
            </>
          )}
        </Space>
      </Card>
    </div>
  )
}
