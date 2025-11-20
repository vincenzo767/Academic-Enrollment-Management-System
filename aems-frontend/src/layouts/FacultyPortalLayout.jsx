import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styles from '../styles/layout.module.css'
import UserAvatar from '../components/UserAvatar.jsx'
import { useApp } from '../state/AppContext.js'
import { useEffect } from 'react'

export default function FacultyPortalLayout(){
  const navigate = useNavigate()
  const { setRole } = useApp()
  useEffect(()=>{ setRole && setRole('faculty') }, [setRole])
  const logout = () => { setRole && setRole(null); navigate('/faculty-login') }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.profileBox}>
          <UserAvatar name="Dr. Sarah Johnson" id="20-2000-200" />
        </div>
        <nav className={styles.nav}>
          <NavLink to="/faculty/courses" className={({isActive}) => isActive ? styles.active : ''}>Courses</NavLink>
          <NavLink to="/faculty/students" className={({isActive}) => isActive ? styles.active : ''}>Students</NavLink>
          <NavLink to="/faculty/reports" className={({isActive}) => isActive ? styles.active : ''}>Reports</NavLink>
        </nav>
        <button onClick={logout} className={styles.logout}>Logout</button>
      </aside>
      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>Faculty Portal</h2>
            <p>Browse courses and manage your enrollment</p>
          </div>
          <div className={styles.tabs}>
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
