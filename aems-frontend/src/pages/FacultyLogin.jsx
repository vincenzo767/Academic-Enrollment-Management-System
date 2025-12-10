import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext.jsx'
import ForgotPasswordModal from '../components/ForgotPasswordModal.jsx'
import ResetPasswordModal from '../components/ResetPasswordModal.jsx'
import styles from '../styles/login.module.css'

export default function FacultyLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const navigate = useNavigate()

  const { setRole } = useApp()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await fetch('http://localhost:8080/api/user/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
      if(!res.ok){ return alert('Login failed') }
      const u = await res.json()
      setRole(u.role || 'faculty')
      navigate('/faculty')
    } catch(e){ console.error(e); alert('Network error') }
  }

  return (
    <div className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.logoContainer}>
            <img src="/assets/aems-logo.png" alt="AEMS Logo" className={styles.logo} />
          </div>
          <h1 className={styles.leftTitle}>AEMS: Academic Enrollment Management System</h1>
          <p className={styles.leftDescription}>
            Discover how AEMS transforms your school's enrollment process using smart automation, intuitive workflows, and an easy-to-use interface designed for both students and administrators.
          </p>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.formContainer}>
            <h2 className={styles.loginTitle}>LOGIN</h2>
            <form onSubmit={submit} className={styles.card}>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter email" />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter Password" />
              <button type="submit">EPO Staff Login</button>
              <div className={styles.links}>
                <button type="button" onClick={() => setShowForgotModal(true)} className={styles.linkButton}>
                  Forgot Password?
                </button>
                <span>|</span>
                <button type="button" onClick={() => setShowResetModal(true)} className={styles.linkButton}>
                  Click Here
                </button>
              </div>
              <div className={styles.facultyNote}>Student? <Link to="/login">Student Sign-in</Link></div>
            </form>
          </div>
        </div>
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
