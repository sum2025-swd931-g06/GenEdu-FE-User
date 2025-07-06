import { BookOutlined, NumberOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Typography } from 'antd'
import React, { useEffect } from 'react'
import { Lesson } from '../../types/lesson.type'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

export interface SlideGenerationParams {
  topic: string
  description?: string
  slideCount: number
  lesson: Lesson
}

interface FormValues {
  topic: string
  description?: string
  slideCount: number
  lesson?: number
}

interface SlideGeneratorFormProps {
  onGenerate: (params: SlideGenerationParams) => void
  loading?: boolean
  disabled?: boolean
  initialTopic?: string
  lessons: Lesson[]
  buttonText?: string
}

const SlideGeneratorForm: React.FC<SlideGeneratorFormProps> = ({
  onGenerate,
  loading = false,
  disabled = false,
  initialTopic = '',
  lessons = [],
  buttonText = 'Generate Slides'
}) => {
  const [form] = Form.useForm()

  // Set initial topic when component mounts or initialTopic changes
  useEffect(() => {
    if (initialTopic) {
      form.setFieldsValue({ topic: initialTopic })
    }
  }, [initialTopic, form])
  const groupedLessons = lessons.reduce(
    (acc, lesson) => {
      const chapterId = lesson.chapterId
      if (!acc[chapterId]) {
        acc[chapterId] = {
          chapter: {
            id: lesson.chapterId,
            title: lesson.chapterTitle,
            orderNumber: lesson.chapterOrderNumber
          },
          lessons: []
        }
      }
      acc[chapterId].lessons.push(lesson)
      return acc
    },
    {} as Record<
      number,
      {
        chapter: {
          id: number
          title: string
          orderNumber: number
        }
        lessons: Lesson[]
      }
    >
  )

  const handleSubmit = (values: FormValues) => {
    const selectedLesson = lessons.find((lesson) => lesson.lessonId === values.lesson)

    if (!selectedLesson) {
      // Optionally, show a message or validation error here
      return
    }

    const params: SlideGenerationParams = {
      topic: values.topic,
      description: values.description,
      slideCount: values.slideCount,
      lesson: selectedLesson // Pass single lesson object
    }
    onGenerate(params)
  }

  const handleReset = () => {
    form.resetFields()
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
          lesson: undefined,
          includeAudio: true
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
          </Col>

          {/* Advanced Options */}
          <Col xs={24} lg={12}>
            <Title level={4}>Advanced Options</Title>

            <Form.Item name='lesson' label='Related Lesson' tooltip='Select a lesson to base the slides on'>
              <Select
                size='large'
                placeholder='Select a lesson'
                optionLabelProp='label'
                loading={!lessons.length}
                notFoundContent={!lessons.length ? 'Loading lessons...' : 'No lessons found'}
                allowClear // Add this to allow clearing the selection
              >
                {Object.values(groupedLessons)
                  .sort((a, b) => a.chapter.orderNumber - b.chapter.orderNumber)
                  .map(({ chapter, lessons: chapterLessons }) => (
                    <Select.OptGroup key={chapter.id} label={`Chapter ${chapter.orderNumber}: ${chapter.title}`}>
                      {chapterLessons
                        .sort((a, b) => a.lessonOrderNumber - b.lessonOrderNumber)
                        .map((lesson) => (
                          <Option key={lesson.lessonId} value={lesson.lessonId} label={lesson.lessonTitle}>
                            <div>
                              <strong>{lesson.lessonTitle}</strong>
                              <br />
                              <Text type='secondary' style={{ fontSize: '12px' }}>
                                {lesson.lessonDescription}
                              </Text>
                            </div>
                          </Option>
                        ))}
                    </Select.OptGroup>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider /> {/* Action Buttons */}
        <Form.Item>
          <Space size='middle'>
            <Button type='primary' htmlType='submit' size='large' loading={loading} disabled={disabled}>
              {loading ? 'Processing...' : buttonText}
            </Button>

            <Button onClick={handleReset} disabled={loading}>
              Reset Form
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SlideGeneratorForm
