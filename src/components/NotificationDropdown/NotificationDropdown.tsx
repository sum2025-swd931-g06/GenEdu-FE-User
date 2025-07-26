import {
  BellOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { Badge, Button, Dropdown, List, Spin, Typography, message } from 'antd'
import { useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useMarkNotificationAsRead, useNotificationsByEmail } from '../../queries/useNotifications'
import { NotificationResponse } from '../../types/notification.type'

const { Text } = Typography

// Helper function to get icon based on notification type and icon name
const getNotificationIcon = (type: string) => {
  const iconStyle = { fontSize: 16, marginRight: 8 }

  switch (type) {
    case 'INFO':
      return <InfoCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />
    case 'WARNING':
      return <ExclamationCircleOutlined style={{ ...iconStyle, color: '#faad14' }} />
    case 'SUCCESS':
      return <CheckOutlined style={{ ...iconStyle, color: '#52c41a' }} />
    case 'ERROR':
      return <CloseCircleOutlined style={{ ...iconStyle, color: '#ff4d4f' }} />
  }
}

// Helper function to format time
const formatTime = (timeString: string) => {
  const time = new Date(timeString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  return time.toLocaleDateString()
}

// Notification list content component
const NotificationDropdownContent = ({
  notifications,
  isLoading,
  onMarkAsRead
}: {
  notifications: NotificationResponse[]
  isLoading: boolean
  onMarkAsRead: (id: number) => void
}) => (
  <div
    style={{
      width: 350,
      maxHeight: 400,
      overflowY: 'auto',
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      padding: '8px 0'
    }}
  >
    {isLoading ? (
      <div style={{ padding: 16, textAlign: 'center' }}>
        <Spin size='small' />
        <Text type='secondary' style={{ marginLeft: 8 }}>
          Loading notifications...
        </Text>
      </div>
    ) : (
      <>
        <List
          size='small'
          itemLayout='vertical'
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                backgroundColor: item.isRead ? 'transparent' : '#f6ffed',
                borderLeft: item.isRead ? 'none' : '3px solid #52c41a'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = item.isRead ? 'transparent' : '#f6ffed')}
              onClick={() => !item.isRead && onMarkAsRead(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {getNotificationIcon(item.type)}
                <div style={{ flex: 1 }}>
                  <Text strong={!item.isRead} style={{ fontSize: 14 }}>
                    {item.title}
                  </Text>
                  {item.description && (
                    <div style={{ marginTop: 4 }}>
                      <Text type='secondary' style={{ fontSize: 12 }}>
                        {item.description}
                      </Text>
                    </div>
                  )}
                  <div style={{ marginTop: 4 }}>
                    <Text type='secondary' style={{ fontSize: 11 }}>
                      {formatTime(item.time)}
                    </Text>
                    {!item.isRead && (
                      <Text type='secondary' style={{ fontSize: 11, marginLeft: 8 }}>
                        • Click to mark as read
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
        {notifications.length === 0 && (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <Text type='secondary'>No notifications</Text>
          </div>
        )}
      </>
    )}
  </div>
)

// Notification Dropdown Component
const NotificationDropdown = () => {
  const { user, isAuthenticated } = useAuth()
  const userEmail = user?.email

  // Fetch notifications for the current user
  const {
    data: notifications = [],
    isLoading,
    error
  } = useNotificationsByEmail(userEmail || '', isAuthenticated && !!userEmail)

  // Mark notification as read mutation
  const markAsReadMutation = useMarkNotificationAsRead()

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length
  }, [notifications])

  // Handle marking notification as read
  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync(id)
      message.success('Notification marked as read')
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      message.error('Failed to mark notification as read')
    }
  }

  // Show error message if there's an error fetching notifications
  if (error) {
    console.error('Failed to fetch notifications:', error)
  }

  // Don't render if user is not authenticated
  if (!isAuthenticated || !userEmail) {
    return null
  }

  return (
    <Dropdown
      overlay={
        <NotificationDropdownContent
          notifications={notifications}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
        />
      }
      trigger={['click']}
      placement='bottomRight'
      arrow
    >
      <Badge count={unreadCount} offset={[-2, 2]}>
        <Button type='text' icon={<BellOutlined />} className='hidden-mobile' />
      </Badge>
    </Dropdown>
  )
}

export default NotificationDropdown
