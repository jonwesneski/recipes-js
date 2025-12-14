import React from 'react'

export interface ITabProps {
  label: string
  children: React.ReactNode
}
const Tab = ({ children }: ITabProps) => {
  return <>{children}</>
}

export default Tab
