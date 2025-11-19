import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/starter.module.css'

export default function Starter(){
  const navigate = useNavigate()
  return (
    <div className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>AEMS: Academic Enrollment<br/>Management System</h1>
        <p className={styles.lead}>Discover how AEMS transforms your school's enrollment process using smart automation, organized workflows, and an easy-to-use interface designed for both students and administrators.</p>
        <button className={styles.signin} onClick={()=>navigate('/login')}>Sign in</button>

        <div className={styles.featuresWrap}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.icon}>🎓</div>
              <div>
                <strong>A centralized and secure database</strong>
                <div className={styles.small}>Maintains student info, enrollment history and easy access for users and staff.</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.icon}>📚</div>
              <div>
                <strong>A searchable list of subjects and programs</strong>
                <div className={styles.small}>Includes course descriptions, prerequisites, credit units and schedules.</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.icon}>🔖</div>
              <div>
                <strong>A guided enrollment flow</strong>
                <div className={styles.small}>Helps students plot schedules, select courses, and reserve slots without confusion.</div>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.icon}>📅</div>
              <div>
                <strong>A dynamic calendar</strong>
                <div className={styles.small}>Instantly updates as students add or drop subjects; visual indicators highlight conflicts.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
