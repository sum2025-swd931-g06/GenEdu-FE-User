import React from 'react'
import { Typography, Breadcrumb } from 'antd'
import { HomeOutlined, ExperimentOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import StreamingSlideGenerator from '../../components/SlideGenerator'

const { Title } = Typography

const SlideGenerator: React.FC = () => {
  const handleSlidesGenerated = (slides: any[]) => {
    console.log('Generated slides:', slides)
    // Here you can save slides to your project or redirect to project detail
    // For example: navigate to project detail page or show success message
  }

  return (
    <div style={{ padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <Link to='/'>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <ExperimentOutlined />
          AI Slide Generator
        </Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 24 }}>
        <Title level={2}>AI-Powered Slide Generator</Title>
        <Typography.Paragraph type='secondary'>
          Generate professional presentation slides in real-time using AI. Simply enter your topic and watch as the AI
          creates comprehensive slides with content.
        </Typography.Paragraph>
      </div>

      <StreamingSlideGenerator onSlidesGenerated={handleSlidesGenerated} />
    </div>
  )
}

export default SlideGenerator
