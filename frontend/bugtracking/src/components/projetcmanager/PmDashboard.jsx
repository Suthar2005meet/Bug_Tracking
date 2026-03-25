import React from 'react'
import UserChart from '../charts/UserChart'
import BugChart from '../charts/BugChart'
import ProjectChart from '../charts/ProjectChart'

export const PmDashboard = () => {
  return (
    <div>
      <h1>Project Manager Dashboard</h1>
      <UserChart/>
      <BugChart/>
      <ProjectChart/>
    </div>
    
  )
}
