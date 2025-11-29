import React, { useState } from 'react'
import Modal from './Modal.jsx'
import styles from '../styles/forgotpassword.module.css'

export default function ForgotPasswordModal({onClose, onResetRequest}){
  const [schoolId, setSchoolId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setSuccess('')

    if(!schoolId.trim() || !email.trim()){
      setError('School ID and email are required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId: schoolId,
          email: email
        })
      })

      if(response.ok){
        setSuccess('Password reset instructions sent to your email!')
        setTimeout(() => {
          onResetRequest()
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'No account found with those credentials')
      }
    } catch(err){
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <h2>Forgot Password?</h2>
        <p>We'll send you reset instructions on your email.</p>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="School ID"
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'SEND RESET LINK'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
