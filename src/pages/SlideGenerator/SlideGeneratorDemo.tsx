import React from 'react'
import { Card, Typography, Space, Divider } from 'antd'
import { StreamingSlideGeneratorV2 } from '../../components/SlideGenerator'

const { Title, Paragraph, Text } = Typography

const SlideGeneratorDemo: React.FC = () => {
  const handleSlidesGenerated = (slides: Array<{ slideId: string; slideType: string; words: string[] }>) => {
    console.log('Slides generated:', slides)
    // Handle the generated slides - save to state, send to parent, etc.
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>AI Slide Generator - Improved Version</Title>
        <Paragraph>
          This is the enhanced version of the slide generator with a proper input form that's ready for backend API
          integration.
        </Paragraph>

        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <div>
            <Title level={4}>Features:</Title>
            <ul>
              <li>
                <Text strong>Demo Mode:</Text> Test with the current demo API (GET request)
              </li>
              <li>
                <Text strong>Production Mode:</Text> Full form with all parameters for backend integration (POST
                request)
              </li>
              <li>
                <Text strong>Comprehensive Form:</Text> Topic, description, slide count, difficulty, slide types,
                language, keywords
              </li>
              <li>
                <Text strong>Audio Generation:</Text> Toggle for including audio narration
              </li>
              <li>
                <Text strong>Live Preview:</Text> Real-time slide preview as they're generated
              </li>
              <li>
                <Text strong>Progress Tracking:</Text> Visual progress with slide count and word count
              </li>
              <li>
                <Text strong>Error Handling:</Text> Proper error messages and recovery
              </li>
            </ul>
          </div>

          <Divider />

          <div>
            <Title level={4}>API Integration Ready:</Title>
            <Paragraph>
              When your backend team updates the API, the form will send a POST request with this structure:
            </Paragraph>
            <Card size='small' style={{ backgroundColor: '#f5f5f5', fontFamily: 'monospace' }}>
              <pre>{`POST /api/v1/projects/stream/slide-content
Content-Type: application/json
Authorization: Bearer {token}

{
  "topic": "Spring AI Framework",
  "description": "Introduction to Spring AI...",
  "slideCount": 8,
  "difficulty": "intermediate",
  "slideTypes": ["title", "content", "code", "summary"],
  "includeAudio": true,
  "language": "en",
  "additionalRequirements": "Include practical examples",
  "keywords": ["AI", "Spring", "Framework"],
  "projectId": "optional-project-id"
}`}</pre>
            </Card>
          </div>
        </Space>
      </Card>

      <Divider style={{ margin: '48px 0' }} />

      {/* The actual generator component */}
      <StreamingSlideGeneratorV2 onSlidesGenerated={handleSlidesGenerated} projectId='demo-project-123' />
    </div>
  )
}

export default SlideGeneratorDemo
