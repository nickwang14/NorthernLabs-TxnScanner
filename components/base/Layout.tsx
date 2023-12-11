import React from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: JSX.Element
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ height: '100%', minHeight: '100vh' }}>
      <div style={{ flex: '1 1 auto' }}>
        <Header />
        <>{children}</>
      </div>
    </div>
  )
}
