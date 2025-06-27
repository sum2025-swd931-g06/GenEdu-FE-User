import React, { useState } from 'react'
import { Card, Button, Space, Typography, Divider, Tag } from 'antd'
import { SlideLayoutAssignmentService } from '../../services/slideLayoutAssignment'
import { predefinedLayouts } from '../../layouts/predefinedLayouts'
import { predefinedThemes } from '../../themes/predefinedThemes'
import { GeneratedSlide } from '../../types/slide.type'
import SlidePreview from './SlidePreview'

const { Text, Title } = Typography

// Demo slide data
const demoSlides = [
  {
    slideId: '1',
    slideType: 'title',
    words: ['Introduction', 'to', 'React', 'Development', 'A', 'comprehensive', 'guide', 'for', 'beginners']
  },
  {
    slideId: '2',
    slideType: 'content',
    words: [
      'React',
      'is',
      'a',
      'JavaScript',
      'library',
      'for',
      'building',
      'user',
      'interfaces.',
      'It',
      'was',
      'created',
      'by',
      'Facebook',
      'and',
      'is',
      'now',
      'maintained',
      'by',
      'the',
      'community.'
    ]
  },
  {
    slideId: '3',
    slideType: 'list',
    words: [
      'Key',
      'features',
      'of',
      'React:',
      '1.',
      'Component-based',
      'architecture',
      '2.',
      'Virtual',
      'DOM',
      '3.',
      'Reusable',
      'components',
      '4.',
      'Strong',
      'ecosystem'
    ]
  },
  {
    slideId: '4',
    slideType: 'comparison',
    words: [
      'React',
      'vs',
      'Vue:',
      'React',
      'has',
      'a',
      'larger',
      'ecosystem',
      'while',
      'Vue',
      'has',
      'easier',
      'learning',
      'curve.',
      'Both',
      'are',
      'excellent',
      'choices.'
    ]
  },
  {
    slideId: '5',
    slideType: 'quote',
    words: [
      '"The',
      'best',
      'way',
      'to',
      'learn',
      'React',
      'is',
      'by',
      'building',
      'projects"',
      '-',
      'React',
      'Community'
    ]
  }
]

const SlideLayoutDemo: React.FC = () => {
  const [enhancedSlides, setEnhancedSlides] = useState<GeneratedSlide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateEnhancedSlides = () => {
    setIsGenerating(true)
    const topic = 'React Development'

    const enhanced = demoSlides.map((slide) =>
      SlideLayoutAssignmentService.enhanceSlideWithLayout(slide.slideId, slide.slideType, slide.words, topic)
    )

    setTimeout(() => {
      setEnhancedSlides(enhanced)
      setIsGenerating(false)
    }, 1000) // Simulate processing time
  }

  const clearSlides = () => {
    setEnhancedSlides([])
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <Title level={3}>🧪 Slide Layout Assignment Demo</Title>
        <Text type='secondary'>
          This demo shows how the layout assignment service automatically assigns layouts and themes to generated slides
          based on their content and type.
        </Text>

        <Divider />

        <Space style={{ marginBottom: '24px' }}>
          <Button type='primary' onClick={generateEnhancedSlides} loading={isGenerating}>
            Generate Enhanced Slides
          </Button>
          <Button onClick={clearSlides} disabled={enhancedSlides.length === 0}>
            Clear
          </Button>
        </Space>

        <div style={{ marginBottom: '16px' }}>
          <Text>
            <strong>Available Layouts:</strong> {predefinedLayouts.length} |<strong> Available Themes:</strong>{' '}
            {predefinedThemes.length}
          </Text>
        </div>

        {enhancedSlides.length > 0 && (
          <>
            <Title level={4}>Generated Slides with Auto-Assigned Layouts</Title>
            <Space wrap style={{ marginBottom: '16px' }}>
              {enhancedSlides.map((slide) => (
                <Tag key={slide.slideId} color='blue'>
                  Slide {slide.slideId}: {slide.layout.name}
                </Tag>
              ))}
            </Space>

            <div>
              {enhancedSlides.map((slide) => (
                <SlidePreview key={slide.slideId} slide={slide} showLayoutDetails={true} />
              ))}
            </div>
          </>
        )}

        {enhancedSlides.length === 0 && !isGenerating && (
          <Card style={{ textAlign: 'center', padding: '48px' }}>
            <Text type='secondary'>Click "Generate Enhanced Slides" to see the layout assignment in action</Text>
          </Card>
        )}
      </Card>
    </div>
  )
}

export default SlideLayoutDemo
