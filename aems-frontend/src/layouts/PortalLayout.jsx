import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styles from '../styles/layout.module.css'
import Sidebar from '../components/Sidebar.jsx'
import NightModeToggle from '../components/NightModeToggle.jsx'
import { useApp } from '../state/AppContext.js'

export default function PortalLayout(){
  const navigate = useNavigate()
  const { setRole, studentProfile } = useApp()
  useEffect(()=>{ setRole && setRole('student') }, [setRole])
  const logout = () => { setRole && setRole(null); navigate('/login') }

  const studentNavLinks = [
    { label: 'Dashboard', path: '/portal/dashboard', icon: '/assets/dashboard.png' },
    { label: 'Browse Courses', path: '/portal/browse', icon: '/assets/browse_course.png' },
    { label: 'My Courses', path: '/portal/my-courses', icon: '/assets/my_course.png' },
    { label: 'Schedule', path: '/portal/schedule', icon: '/assets/schedule.png' },
    { label: 'Payments', path: '/portal/payments', icon: '/assets/payments.png' }
  ]

  const userInfo = {
    name: studentProfile?.fullName || 'Student',
    id: studentProfile?.schoolId || '',
    role: 'Student'
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        userInfo={userInfo}
        navLinks={studentNavLinks}
        onLogout={logout}
        portalType="student"
      />
      <main className={styles.content}>
        <NightModeToggle />
        <header className={styles.header}>
          <div>
            <h2>Student Portal</h2>
            <p>View your dashboard and manage your enrollment</p>
          </div>
          <div className={styles.tabs}>
            <NavLink to="/portal/dashboard" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Dashboard</NavLink>
            <NavLink to="/portal/browse" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Browse Courses</NavLink>
            <NavLink to="/portal/my-courses" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>My Courses</NavLink>
            <NavLink to="/portal/schedule" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Schedule</NavLink>
            <NavLink to="/portal/payments" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Payments</NavLink>
          </div>
        </header>
        <section className={styles.body}>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
