import { OpenSidebar } from '@/components/openapi/sidebar'
import React from 'react'

const layout = ({children}:{
  children: React.ReactNode
}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout