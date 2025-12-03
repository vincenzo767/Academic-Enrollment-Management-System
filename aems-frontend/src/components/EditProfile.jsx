import React, { useState } from 'react'
import { useApp } from '../state/AppContext.js'
import styles from '../styles/dashboard.module.css'

export default function EditProfile({ onClose }) {
  const { studentProfile, setStudentProfile } = useApp()
  const [formData, setFormData] = useState({
    fullName: studentProfile.fullName,
    email: studentProfile.email,
    phone: studentProfile.phone,
    yearLevel: studentProfile.yearLevel,
    semester: studentProfile.semester,
    profilePicture: studentProfile.profilePicture
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePictureUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStudentProfile(prev => ({
      ...prev,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      yearLevel: formData.yearLevel,
      semester: formData.semester,
      profilePicture: formData.profilePicture
    }))
    onClose()
  }

  const getInitials = (name) => {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Profile</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {/* Profile Picture Section */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Profile Picture</label>
              <div className={styles.pictureUploadSection}>
                <div className={styles.picturePreview}>
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" />
                  ) : (
                    <span className={styles.profileInitials}>{getInitials(formData.fullName)}</span>
                  )}
                </div>
                <div className={styles.fileInputWrapper}>
                  <input
                    type="file"
                    id="profilePicInput"
                    className={styles.fileInput}
                    accept="image/*"
                    onChange={handlePictureUpload}
                  />
                  <label htmlFor="profilePicInput" className={styles.fileInputLabel}>
                    📁 Click to upload or drag and drop
                  </label>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Full Name</label>
              <input
                type="text"
                name="fullName"
                className={styles.formInput}
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                name="email"
                className={styles.formInput}
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className={styles.formInput}
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            {/* Year Level */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Year Level</label>
              <select
                name="yearLevel"
                className={styles.formSelect}
                value={formData.yearLevel}
                onChange={handleInputChange}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Semester */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Current Semester</label>
              <select
                name="semester"
                className={styles.formSelect}
                value={formData.semester}
                onChange={handleInputChange}
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.btnPrimary}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
