import { Layout as AntLayout } from 'antd'
import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import Footer from '../Footer'
import Header from '../Header'
import Loader from '../Loader'

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
    return <Loader />
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
