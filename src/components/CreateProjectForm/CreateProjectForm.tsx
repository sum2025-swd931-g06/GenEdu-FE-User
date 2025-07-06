import React, { useState } from 'react'
import { Card, Form, Input, InputNumber, Button, message, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCreateProject } from '../../hooks/useCreateProject'
import { ProjectRequestDTO } from '../../types/project.type'

const { TextArea } = Input

const CreateProjectForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const createProjectMutation = useCreateProject()

  const handleSubmit = async (values: ProjectRequestDTO) => {
    setLoading(true)
    try {
      const result = await createProjectMutation.mutateAsync(values)
      message.success(`Project "${result.title}" created successfully!`)
      form.resetFields()
    } catch (error) {
      message.error('Failed to create project. Please try again.')
      console.error('Project creation error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      title={
        <Space>
          <PlusOutlined />
          <span>Create New Project</span>
        </Space>
      }
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          name='lessonId'
          label='Lesson ID'
          rules={[
            { required: true, message: 'Please enter a lesson ID' },
            { type: 'number', min: 1, message: 'Lesson ID must be a positive number' }
          ]}
        >
          <InputNumber placeholder='Enter lesson ID (e.g., 101)' style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item
          name='title'
          label='Project Title'
          rules={[
            { required: true, message: 'Please enter a project title' },
            { max: 255, message: 'Title must be less than 255 characters' }
          ]}
        >
          <Input placeholder='Enter project title' />
        </Form.Item>

        <Form.Item
          name='customInstructions'
          label='Custom Instructions (Optional)'
          rules={[{ max: 1000, message: 'Custom instructions must be less than 1000 characters' }]}
        >
          <TextArea
            placeholder='Enter any specific instructions for the project...'
            rows={4}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          name='slideNumber'
          label='Number of Slides (Optional)'
          rules={[{ type: 'number', min: 1, message: 'Slide number must be at least 1' }]}
        >
          <InputNumber placeholder='Default: 10' style={{ width: '100%' }} min={1} />
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' loading={loading} block size='large'>
            Create Project
          </Button>
        </Form.Item>
      </Form>

      {/* Usage Example */}
      <Card size='small' style={{ marginTop: '16px', backgroundColor: '#f6f8fa' }}>
        <h4>Example Values:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>Lesson ID:</strong> 101 (What is Programming?)
          </li>
          <li>
            <strong>Lesson ID:</strong> 201 (Understanding Variables)
          </li>
          <li>
            <strong>Lesson ID:</strong> 301 (Conditional Statements)
          </li>
          <li>
            <strong>Lesson ID:</strong> 401 (Introduction to Functions)
          </li>
        </ul>
      </Card>
    </Card>
  )
}

export default CreateProjectForm
