import { BookOutlined, NumberOutlined, PlusOutlined } from '@ant-design/icons'
import { Card, Form, Input, Select, InputNumber, Button, Space, Typography, Divider, Tag, Row, Col, Switch } from 'antd'
import React, { useState, useEffect } from 'react'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

export interface SlideGenerationParams {
  topic: string
  description?: string
  slideCount: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  slideTypes: string[]
  includeAudio: boolean
  language: string
  additionalRequirements?: string
  keywords?: string[]
}

interface FormValues {
  topic: string
  description?: string
  slideCount: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  slideTypes?: string[]
  includeAudio?: boolean
  language?: string
  additionalRequirements?: string
  keywords?: string[]
}

interface SlideGeneratorFormProps {
  onGenerate: (params: SlideGenerationParams) => void
  loading?: boolean
  disabled?: boolean
  initialTopic?: string
}

const SLIDE_TYPES = [
  { value: 'title', label: 'Title Slide', description: 'Introduction and main topic' },
  { value: 'content', label: 'Content Slide', description: 'Main content with bullet points' },
  { value: 'image', label: 'Image Slide', description: 'Visual content with descriptions' },
  { value: 'code', label: 'Code Slide', description: 'Code examples and snippets' },
  { value: 'diagram', label: 'Diagram Slide', description: 'Flowcharts and technical diagrams' },
  { value: 'summary', label: 'Summary Slide', description: 'Key takeaways and conclusions' }
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
]

const SlideGeneratorForm: React.FC<SlideGeneratorFormProps> = ({
  onGenerate,
  loading = false,
  disabled = false,
  initialTopic = ''
}) => {
  const [form] = Form.useForm()
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')

  // Set initial topic when component mounts or initialTopic changes
  useEffect(() => {
    if (initialTopic) {
      form.setFieldsValue({ topic: initialTopic })
    }
  }, [initialTopic, form])

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      const newKeywords = [...keywords, keywordInput.trim()]
      setKeywords(newKeywords)
      setKeywordInput('')
      form.setFieldValue('keywords', newKeywords)
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    const newKeywords = keywords.filter((k) => k !== keyword)
    setKeywords(newKeywords)
    form.setFieldValue('keywords', newKeywords)
  }

  const handleSubmit = (values: FormValues) => {
    const params: SlideGenerationParams = {
      topic: values.topic,
      description: values.description,
      slideCount: values.slideCount,
      difficulty: values.difficulty,
      slideTypes: values.slideTypes || ['title', 'content', 'summary'],
      includeAudio: values.includeAudio || false,
      language: values.language || 'en',
      additionalRequirements: values.additionalRequirements,
      keywords: keywords
    }
    onGenerate(params)
  }

  const handleReset = () => {
    form.resetFields()
    setKeywords([])
    setKeywordInput('')
  }

  return (
    <Card
      title={
        <Space>
          <BookOutlined />
          <span>AI Slide Generator</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          slideCount: 8,
          difficulty: 'intermediate',
          slideTypes: ['title', 'content', 'summary'],
          includeAudio: true,
          language: 'en'
        }}
        disabled={disabled}
      >
        <Row gutter={24}>
          {/* Basic Information */}
          <Col xs={24} lg={12}>
            <Title level={4}>Basic Information</Title>

            <Form.Item
              name='topic'
              label='Topic'
              rules={[{ required: true, message: 'Please enter a topic!' }]}
              tooltip='The main subject or theme for your slides'
            >
              <Input
                placeholder='e.g., Spring AI Framework, Machine Learning Basics, React Hooks'
                size='large'
                prefix={<BookOutlined />}
              />
            </Form.Item>

            <Form.Item
              name='description'
              label='Description (Optional)'
              tooltip='Additional context about what you want to cover'
            >
              <TextArea placeholder='Provide more details about the specific aspects you want to cover...' rows={3} />
            </Form.Item>

            <Form.Item
              name='slideCount'
              label='Number of Slides'
              rules={[{ required: true, message: 'Please specify slide count!' }]}
              tooltip='How many slides you want to generate (recommended: 6-12)'
            >
              <InputNumber min={3} max={20} size='large' style={{ width: '100%' }} prefix={<NumberOutlined />} />
            </Form.Item>

            <Form.Item
              name='difficulty'
              label='Difficulty Level'
              rules={[{ required: true, message: 'Please select difficulty!' }]}
            >
              <Select size='large' placeholder='Select difficulty level'>
                <Option value='beginner'>
                  <Space>
                    <span>🟢 Beginner</span>
                    <Text type='secondary'>- Basic concepts, simple explanations</Text>
                  </Space>
                </Option>
                <Option value='intermediate'>
                  <Space>
                    <span>🟡 Intermediate</span>
                    <Text type='secondary'>- Moderate depth, some technical details</Text>
                  </Space>
                </Option>
                <Option value='advanced'>
                  <Space>
                    <span>🔴 Advanced</span>
                    <Text type='secondary'>- In-depth analysis, complex concepts</Text>
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Advanced Options */}
          <Col xs={24} lg={12}>
            <Title level={4}>Advanced Options</Title>

            <Form.Item name='slideTypes' label='Slide Types' tooltip='Select which types of slides to include'>
              <Select mode='multiple' size='large' placeholder='Select slide types' optionLabelProp='label'>
                {SLIDE_TYPES.map((type) => (
                  <Option key={type.value} value={type.value} label={type.label}>
                    <div>
                      <div>{type.label}</div>
                      <Text type='secondary' style={{ fontSize: '12px' }}>
                        {type.description}
                      </Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='language'
              label='Language'
              rules={[{ required: true, message: 'Please select a language!' }]}
            >
              <Select size='large' placeholder='Select language'>
                {LANGUAGES.map((lang) => (
                  <Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name='includeAudio'
              label='Include Audio Generation'
              valuePropName='checked'
              tooltip='Generate audio narration for each slide'
            >
              <Switch checkedChildren='Yes' unCheckedChildren='No' size='default' />
            </Form.Item>

            {/* Keywords Section */}
            <Form.Item label='Keywords (Optional)' tooltip='Add specific keywords to focus on'>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder='Add keyword...'
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onPressEnter={handleAddKeyword}
                />
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={handleAddKeyword}
                  disabled={!keywordInput.trim()}
                >
                  Add
                </Button>
              </Space.Compact>

              {keywords.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {keywords.map((keyword) => (
                    <Tag
                      key={keyword}
                      closable
                      onClose={() => handleRemoveKeyword(keyword)}
                      color='blue'
                      style={{ marginBottom: 4 }}
                    >
                      {keyword}
                    </Tag>
                  ))}
                </div>
              )}
            </Form.Item>

            <Form.Item name='keywords' hidden>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* Additional Requirements */}
        <Form.Item
          name='additionalRequirements'
          label='Additional Requirements (Optional)'
          tooltip='Any specific instructions or requirements for the slides'
        >
          <TextArea
            placeholder='e.g., Include real-world examples, Focus on practical applications, Add code snippets...'
            rows={2}
          />
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item>
          <Space size='middle'>
            <Button type='primary' htmlType='submit' size='large' loading={loading} disabled={disabled}>
              {loading ? 'Generating Slides...' : 'Generate Slides'}
            </Button>

            <Button onClick={handleReset} disabled={loading}>
              Reset Form
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Preview Section */}
      <Divider orientation='left'>
        <Text type='secondary'>Preview</Text>
      </Divider>

      <Card size='small' style={{ backgroundColor: '#fafafa' }}>
        <Text type='secondary'>
          <strong>Ready for API Integration:</strong> This form collects all necessary parameters for slide generation.
          When your backend team updates the API, simply pass the form data to your streaming endpoint with the topic,
          slideCount, difficulty, and other parameters.
        </Text>
      </Card>
    </Card>
  )
}

export default SlideGeneratorForm
