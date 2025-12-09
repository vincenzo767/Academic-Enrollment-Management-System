import React from 'react'
import { useApp } from '../state/AppContext.js'
import styles from '../styles/nightmode.module.css'

export default function NightModeToggle() {
  const { isDarkMode, toggleDarkMode } = useApp()

  return (
    <div className={styles.container}>
      <button 
        onClick={toggleDarkMode} 
        className={styles.toggleButton}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
        aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
