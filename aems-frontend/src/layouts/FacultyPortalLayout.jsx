import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styles from '../styles/layout.module.css'
import Sidebar from '../components/Sidebar.jsx'
import { useApp } from '../state/AppContext.js'
import { useEffect } from 'react'

export default function FacultyPortalLayout(){
  const navigate = useNavigate()
  const { setRole } = useApp()
  useEffect(()=>{ setRole && setRole('faculty') }, [setRole])
  const logout = () => { setRole && setRole(null); navigate('/faculty-login') }

  const facultyNavLinks = [
    { label: 'Dashboard', path: '/faculty', icon: '/assets/dashboard.png' },
    { label: 'Courses', path: '/faculty/courses', icon: '/assets/my_course.png' },
    { label: 'Students', path: '/faculty/students', icon: '/assets/students.png' },
    { label: 'Reports', path: '/faculty/reports', icon: '/assets/reports.png' }
  ]

  const userInfo = {
    name: 'Dr. Sarah Johnson',
    id: 'FACULTY-001',
    role: 'Faculty'
  }

  return (
    <div className={styles.shell}>
      <Sidebar
        userInfo={userInfo}
        navLinks={facultyNavLinks}
        onLogout={logout}
        portalType="faculty"
      />
      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>LTO Admin Portal</h2>
            <p>Manage student enrollments and courses</p>
          </div>
          <div className={styles.tabs}>
            <NavLink to="/faculty" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Dashboard</NavLink>
            <NavLink to="/faculty/courses" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Courses</NavLink>
            <NavLink to="/faculty/students" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Students</NavLink>
            <NavLink to="/faculty/reports" className={({isActive}) => isActive ? styles.tabActive : styles.tab}>Reports</NavLink>
          </div>
        </header>
        <section className={styles.body}>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
