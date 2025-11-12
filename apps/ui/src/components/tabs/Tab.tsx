import React from 'react'

export interface TabProps {
  label: string
  children: React.ReactNode
}

const Tab = ({ children }: TabProps) => {
  return <>{children}</>
}

export default Tab
