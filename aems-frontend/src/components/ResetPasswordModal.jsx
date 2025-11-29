import React, { useState } from 'react'
import Modal from './Modal.jsx'
import styles from '../styles/resetpassword.module.css'

export default function ResetPasswordModal({onClose}){
  const [idNumber, setIdNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateForm = () => {
    if(!idNumber.trim()){
      setError('ID Number is required')
      return false
    }
    if(!birthDate.trim()){
      setError('Birth date is required')
      return false
    }
    if(!newPassword || newPassword.length < 6){
      setError('Password must be at least 6 characters')
      return false
    }
    if(newPassword !== confirmPassword){
      setError('Passwords do not match')
      return false
    }
    return true
  }

  async function handleResetPassword(e){
    e.preventDefault()
    setError('')
    setSuccess('')

    if(!validateForm()){
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId: idNumber,
          birthDate: birthDate,
          newPassword: newPassword
        })
      })

      if(response.ok){
        setSuccess('Password reset successfully! Redirecting to login...')
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Password reset failed. Please verify your information.')
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
        <h2>Reset Password</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <form onSubmit={handleResetPassword} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="idNumber">ID Number:</label>
            <input
              id="idNumber"
              type="text"
              placeholder="ID Number:"
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="birthDate">Birthdate:</label>
            <input
              id="birthDate"
              type="date"
              placeholder="MM/DD/YYYY"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'RESET PASSWORD'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
