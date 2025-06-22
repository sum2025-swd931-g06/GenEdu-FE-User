import React from 'react'
import { Layout as AntLayout, Spin } from 'antd'
import Header from '../Header'
import Footer from '../Footer'
import { useAuth } from '../../hooks/useAuth'

const { Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showFooter = true, className }) => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <Spin size='large' />
        <div>Loading GenEdu...</div>
      </div>
    )
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }} className={className}>
      {showHeader && <Header />}

      <Content
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
      </Content>

      {showFooter && <Footer />}
    </AntLayout>
  )
}

export default Layout
