import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../state/AppContext.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/login.module.css'
import registerStyles from '../styles/register.module.css'

export default function Register(){
  const [fullName, setFullName] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const validateForm = () => {
    if(!fullName.trim()){
      setError('Full name is required')
      return false
    }
    if(!schoolId.trim()){
      setError('School ID is required')
      return false
    }
    if(!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      setError('Valid email is required')
      return false
    }
    if(!password || password.length < 6){
      setError('Password must be at least 6 characters')
      return false
    }
    if(password !== confirmPassword){
      setError('Passwords do not match')
      return false
    }
    if(!selectedRole){
      setError('Please select a role')
      return false
    }
    return true
  }

  async function handleRegister(e){
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if(!validateForm()){
      return
    }

    setLoading(true)
    try {
      let url = 'http://localhost:8080/api/user/register'
      let payload = {
        firstname: fullName.split(' ')[0],
        lastname: fullName.split(' ').slice(1).join(' ') || '',
        role: selectedRole,
        email: email,
        password: password
      }
      if(selectedRole === 'Student'){
        url = 'http://localhost:8080/api/student/register'
        // student expects additional fields; keep minimal
        payload = {
          firstname: fullName.split(' ')[0],
          lastname: fullName.split(' ').slice(1).join(' ') || '',
          email: email,
          password: password,
          phone: '',
          address: '',
          dateOfBirth: '2000-01-01'
        }
      }

      const response = await fetch(url, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      })

      if(response.ok){
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => { navigate('/login') }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Registration failed. Please try again.')
      }
    } catch(err){
      setError('Network error. Please check your connection.')
      console.error(err)
    } finally { setLoading(false) }
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setShowRoleModal(false)
  }

  return (
    <div className={styles.hero}>
      <div className={styles.centerBox}>
        <form onSubmit={handleRegister} className={styles.card}>
          <h2 className={registerStyles.title}>Register</h2>
          
          {error && <div className={registerStyles.error}>{error}</div>}
          {success && <div className={registerStyles.success}>{success}</div>}
          
          <input 
            value={fullName} 
            onChange={e=>setFullName(e.target.value)} 
            placeholder="Full Name"
            disabled={loading}
          />
          
          <input 
            value={schoolId} 
            onChange={e=>setSchoolId(e.target.value)} 
            placeholder="School ID"
            disabled={loading}
          />
          
          <input 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            type="email"
            placeholder="Email address/Institutional address"
            disabled={loading}
          />
          
          <div className={registerStyles.roleSelect}>
            <button 
              type="button"
              onClick={() => setShowRoleModal(true)}
              className={registerStyles.roleButton}
              disabled={loading}
            >
              {selectedRole ? `Role: ${selectedRole}` : 'Select Role'}
            </button>
          </div>
          
          <input 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            type="password"
            placeholder="Enter Password"
            disabled={loading}
          />
          
          <input 
            value={confirmPassword} 
            onChange={e=>setConfirmPassword(e.target.value)} 
            type="password"
            placeholder="Confirm Password"
            disabled={loading}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
          
          <div className={styles.facultyNote}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>

      {showRoleModal && (
        <Modal onClose={() => setShowRoleModal(false)}>
          <div className={registerStyles.roleModal}>
            <h3>Select Your Role</h3>
            <div className={registerStyles.roleOptions}>
              <button 
                className={registerStyles.roleOption}
                onClick={() => handleRoleSelect('Student')}
              >
                <div className={registerStyles.roleIcon}>👨‍🎓</div>
                Student
              </button>
              <button 
                className={registerStyles.roleOption}
                onClick={() => handleRoleSelect('Educator')}
              >
                <div className={registerStyles.roleIcon}>👨‍🏫</div>
                Educator
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
