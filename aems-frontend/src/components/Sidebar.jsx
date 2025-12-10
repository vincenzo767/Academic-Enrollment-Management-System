import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../styles/sidebar.module.css'
import UserAvatar from './UserAvatar.jsx'

export default function Sidebar({ userInfo, navLinks, onLogout, portalType = 'student' }) {
  const [isExpanded, setIsExpanded] = useState(true)

  const fallbackIcon = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23cfe2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/></svg>'

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <aside className={`${styles.sidebar} ${!isExpanded ? styles.collapsed : ''}`}>
      <div className={styles.topBar}>
        <img src="/assets/aems-logo.png" alt="AEMS Logo" className={styles.logo} />
        <button
          className={styles.toggleBtn}
          onClick={toggleSidebar}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label="Toggle sidebar"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isExpanded ? (
              <>
                <polyline points="15 18 9 12 15 6"></polyline>
                <line x1="6" y1="4" x2="6" y2="20"></line>
              </>
            ) : (
              <>
                <polyline points="9 18 15 12 9 6"></polyline>
                <line x1="18" y1="4" x2="18" y2="20"></line>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      {isExpanded && (
        <div className={styles.profileBox}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{userInfo?.name || 'User'}</p>
            <p className={styles.userRole}>{userInfo?.role || portalType}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            title={!isExpanded ? link.label : ''}
          >
            <span className={styles.icon}>
              {link.icon
                ? (typeof link.icon === 'string'
                    ? <img
                        src={link.icon}
                        alt={link.iconAlt || `${link.label} icon`}
                        className={styles.iconImg}
                        onError={(e) => { e.currentTarget.src = fallbackIcon }}
                      />
                    : link.icon)
                : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"></circle>
                  </svg>
                )}
            </span>
            {isExpanded && <span className={styles.label}>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className={styles.logout}
        title={!isExpanded ? 'Logout' : ''}
      >
        <span className={styles.logoutIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </span>
        {isExpanded && <span>Logout</span>}
      </button>
    </aside>
  )
}
