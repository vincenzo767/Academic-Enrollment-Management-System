import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import PortalLayout from './layouts/PortalLayout.jsx'
import BrowseCourses from './pages/BrowseCourses.jsx'
import MyCourses from './pages/MyCourses.jsx'
import Schedule from './pages/Schedule.jsx'
import Payments from './pages/Payments.jsx'
import FacultyLogin from './pages/FacultyLogin.jsx'
import FacultyPortalLayout from './layouts/FacultyPortalLayout.jsx'
import FacultyCourses from './pages/FacultyCourses.jsx'
import FacultyStudents from './pages/FacultyStudents.jsx'
import FacultyReports from './pages/FacultyReports.jsx'

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

      <Route path="/faculty-login" element={<FacultyLogin />} />
      <Route path="/faculty" element={<FacultyPortalLayout />}>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<FacultyCourses />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="reports" element={<FacultyReports />} />
      </Route>

      <Route path="*" element={<div style={{padding: 24}}>Not Found</div>} />
    </Routes>
  )
}
