import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx'
import ResetPasswordModal from '../components/ResetPasswordModal.jsx'
import styles from '../styles/login.module.css'

export default function Login(){
  const [schoolId, setSchoolId] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const navigate = useNavigate()

  function submit(e){
    e.preventDefault()
    // Mock authentication
    if(schoolId && password){
      navigate('/portal')
    }
  }

  return (
    <div className={styles.hero}>      
      <header className={styles.topbar}>
        <div className={styles.brand}>AEMS: Academic Enrollment Management System</div>
        <a className={styles.about} href="#about">About us</a>
      </header>
      <div className={styles.centerBox}>
        <form onSubmit={submit} className={styles.card}>
          <input value={schoolId} onChange={e=>setSchoolId(e.target.value)} placeholder="Enter school ID" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter Password" />
          <button type="submit">Login</button>
          <div className={styles.links}>
            <button type="button" onClick={() => setShowForgotModal(true)} className={styles.linkButton}>
              Forgot Password?
            </button>
            <span>|</span>
            <button type="button" onClick={() => setShowResetModal(true)} className={styles.linkButton}>
              Click Here
            </button>
          </div>
          <div className={styles.facultyNote}>Faculty member? Sign in here <Link to="/faculty-login">Faculty Sign-in</Link></div>
        </form>
      </div>

      {showForgotModal && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotModal(false)}
          onResetRequest={() => {
            setShowForgotModal(false)
            setShowResetModal(true)
          }}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal 
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  )
}
