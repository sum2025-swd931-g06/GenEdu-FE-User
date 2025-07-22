import {
  ExperimentOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusOutlined,
  ProjectOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Button, Drawer, Dropdown, Layout, Menu, Space } from 'antd'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import path from '../../constants/path'
import { useAuth } from '../../hooks/useAuth'
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown'

const { Header: AntHeader } = Layout

const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false)

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'home':
        navigate('/')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'logout':
        logout()
        navigate('/')
        break
      case 'slide-generator-demo':
        navigate(path.slideGeneratorDemo)
        break
      case 'settings':
        // Navigate to settings page when implemented
        break
      default:
        break
    }
    setMobileMenuVisible(false)
  }

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: 'slide-generator-demo',
      icon: <ExperimentOutlined />,
      label: 'AI Slide Generator'
    },
    // Only show profile and saved slides menu items for authenticated users
    ...(isAuthenticated
      ? [
          {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile'
          }
        ]
      : [])
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true
    }
  ]

  const currentPath = location.pathname
  const selectedKeys =
    currentPath === path.home
      ? ['home']
      : currentPath === path.profile
        ? ['profile']
        : currentPath === path.slideGeneratorDemo
          ? ['slide-generator-demo']
          : []

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}
    >
      {/* Logo and Brand */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          <ProjectOutlined style={{ marginRight: '8px' }} />
          GenEdu
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className='desktop-nav' style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Menu
          theme='light'
          mode='horizontal'
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ border: 'none', minWidth: '200px' }}
        />
      </div>

      {/* User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            {/* Create New Project Button */}
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => navigate(path.slideGeneratorDemo)}
              className='hidden-mobile'
            >
              New Project
            </Button>
            <NotificationDropdown />

            {/* User Avatar and Dropdown */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: ({ key }) => handleMenuClick(key)
              }}
              placement='bottomRight'
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user?.avatar}`}
                  icon={<UserOutlined />}
                  size='default'
                />
                {/* <Text strong className='hidden-mobile'>
                  {user?.fullName}
                </Text> */}
              </Space>
            </Dropdown>

            {/* Mobile Menu Button */}
            <Button
              type='text'
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className='mobile-only'
            />
          </>
        ) : (
          <Space>
            <Button type='primary' onClick={() => navigate('/login')}>
              Login
            </Button>
            {/* <Button type='primary' onClick={() => navigate('/register')}>
              Register
            </Button> */}
          </Space>
        )}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title='Menu'
        placement='right'
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={250}
      >
        <Menu
          mode='vertical'
          selectedKeys={selectedKeys}
          items={[
            ...menuItems,
            // Only show project-related items for authenticated users
            ...(isAuthenticated
              ? [
                  { type: 'divider' as const },
                  {
                    key: 'new-project',
                    icon: <PlusOutlined />,
                    label: 'New Project'
                  },
                  { type: 'divider' as const },
                  ...userMenuItems
                ]
              : [])
          ]}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Drawer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </AntHeader>
  )
}

export default Header
