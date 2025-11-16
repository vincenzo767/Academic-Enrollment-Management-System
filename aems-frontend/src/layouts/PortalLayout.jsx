import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import styles from '../styles/layout.module.css'
import UserAvatar from '../components/UserAvatar.jsx'

export default function PortalLayout(){
  const navigate = useNavigate()
  const logout = () => navigate('/login')

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.profileBox}>
          <UserAvatar name="John Michael Doe Doe" id="03-9000-000" />
        </div>
        <nav className={styles.nav}>
          <NavLink to="/portal/browse" className={({isActive}) => isActive ? styles.active : ''}>Browse</NavLink>
          <NavLink to="/portal/my-courses" className={({isActive}) => isActive ? styles.active : ''}>My Courses</NavLink>
          <NavLink to="/portal/schedule" className={({isActive}) => isActive ? styles.active : ''}>Schedule</NavLink>
          <NavLink to="/portal/payments" className={({isActive}) => isActive ? styles.active : ''}>Payments</NavLink>
        </nav>
        <button onClick={logout} className={styles.logout}>Logout</button>
      </aside>
      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <h2>Student Portal</h2>
            <p>Browse courses and manage your enrollment</p>
          </div>
          <div className={styles.tabs}>
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
