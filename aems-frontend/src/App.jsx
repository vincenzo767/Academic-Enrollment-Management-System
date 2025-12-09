import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Starter from './pages/Starter.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PortalLayout from './layouts/PortalLayout.jsx'
import BrowseCourses from './pages/BrowseCourses.jsx'
import MyCourses from './pages/MyCourses.jsx'
import Schedule from './pages/Schedule.jsx'
import Payments from './pages/Payments.jsx'
import FacultyLogin from './pages/FacultyLogin.jsx'
import FacultyDashboard from './pages/FacultyDashboard.jsx'
import FacultyPortalLayout from './layouts/FacultyPortalLayout.jsx'
import FacultyCourses from './pages/FacultyCourses.jsx'
import FacultyStudents from './pages/FacultyStudents.jsx'
import FacultyReports from './pages/FacultyReports.jsx'
import { AppProvider } from './state/AppContext.jsx'
import Notifications from './components/Notifications.jsx'

function AppRoutes() {
  const location = useLocation()
  const isLogin = location && location.pathname === '/login'
  const isRoot = location && (location.pathname === '/' || location.pathname === '')
  const isRegister = location && location.pathname === '/register'
  const isFacultyLogin = location && location.pathname === '/faculty-login'

  // Disable dark mode on Starter, Login, Register, and Faculty Login pages
  React.useEffect(() => {
    if (isRoot || isLogin || isRegister || isFacultyLogin) {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isRoot, isLogin, isRegister, isFacultyLogin])

  return (
    <>
      {!(isLogin || isRoot || isRegister || isFacultyLogin) && <Notifications />}
      <Routes>
      <Route path="/" element={<Starter />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="payments" element={<Payments />} />
      </Route>

      <Route path="/faculty-login" element={<FacultyLogin />} />
      <Route path="/faculty" element={<FacultyPortalLayout />}>
        <Route index element={<FacultyDashboard />} />
        <Route path="courses" element={<FacultyCourses />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="reports" element={<FacultyReports />} />
      </Route>

      <Route path="*" element={<div style={{padding: 24}}>Not Found</div>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
