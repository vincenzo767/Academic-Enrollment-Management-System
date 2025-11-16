import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import PortalLayout from './layouts/PortalLayout.jsx'
import BrowseCourses from './pages/BrowseCourses.jsx'
import MyCourses from './pages/MyCourses.jsx'
import Schedule from './pages/Schedule.jsx'
import Payments from './pages/Payments.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<Navigate to="browse" replace />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="payments" element={<Payments />} />
      </Route>
      <Route path="*" element={<div style={{padding: 24}}>Not Found</div>} />
    </Routes>
  )
}
