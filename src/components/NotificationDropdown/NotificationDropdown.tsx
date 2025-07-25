import { BellOutlined } from '@ant-design/icons'
import { Badge, Button, Dropdown, List, Typography } from 'antd'

const { Text } = Typography

// Dummy notifications
const notifications = [
  {
    id: 1,
    title: 'New comment on your post',
    time: '2m ago'
  },
  {
    id: 2,
    title: 'You have a new follower',
    time: '10m ago'
  },
  {
    id: 3,
    title: 'Weekly report is ready',
    time: '1h ago'
  }
]

// Notification list content
const NotificationDropdownContent = (
  <div
    style={{
      width: 300,
      maxHeight: 400,
      overflowY: 'auto',
      background: '#fff', // solid background
      borderRadius: 8, // rounded corners
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // subtle shadow
      padding: '8px 0' // spacing around list items
    }}
  >
    <List
      size='small'
      itemLayout='vertical'
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <div>
            <Text strong>{item.title}</Text>
            <br />
            <Text type='secondary' style={{ fontSize: 12 }}>
              {item.time}
            </Text>
          </div>
        </List.Item>
      )}
    />
    {notifications.length === 0 && (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <Text type='secondary'>No notifications</Text>
      </div>
    )}
  </div>
)

// Notification Dropdown Component
const NotificationDropdown = () => {
  return (
    <Dropdown overlay={NotificationDropdownContent} trigger={['click']} placement='bottomRight' arrow>
      <Badge count={notifications.length} offset={[-2, 2]}>
        <Button type='text' icon={<BellOutlined />} className='hidden-mobile' />
      </Badge>
    </Dropdown>
  )
}

export default NotificationDropdown
