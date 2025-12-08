import React, { useState, useEffect } from 'react'
import { useApp } from '../state/AppContext.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/dashboard.module.css'
import axiosInstance from '../api/axiosInstance.js'

export default function FacultyDashboard() {
  const { setRole } = useApp()
  const [facultyProfile, setFacultyProfile] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState('1st Semester')
  const [enrollmentStats, setEnrollmentStats] = useState({
    pendingEnrollments: 0,
    approvedToday: 0,
    totalStudents: 0,
    requiresAttention: 0
  })
  const [studentRecords, setStudentRecords] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    officeLocation: '',
    officeHours: ''
  })

  const semesters = ['1st Semester', '2nd Semester', 'Summer']

  // Load faculty profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('facultyProfile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setFacultyProfile(profile)
      setEditFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        department: profile.department || '',
        officeLocation: profile.officeLocation || '',
        officeHours: profile.officeHours || ''
      })
    } else {
      // Demo profile
      const demoProfile = {
        facultyId: 1,
        firstName: 'Dr.',
        lastName: 'Faculty Member',
        email: 'faculty@university.edu',
        phone: '+1 (555) 987-6543',
        department: 'Registrar Office',
        officeLocation: 'Admin Building, Room 101',
        officeHours: 'Mon-Fri: 9:00 AM - 5:00 PM',
        currentSemester: '1st Semester',
        profilePicture: null,
        role: 'Enrollment Manager'
      }
      setFacultyProfile(demoProfile)
      setEditFormData({
        firstName: demoProfile.firstName,
        lastName: demoProfile.lastName,
        email: demoProfile.email,
        phone: demoProfile.phone,
        department: demoProfile.department,
        officeLocation: demoProfile.officeLocation,
        officeHours: demoProfile.officeHours
      })
    }
  }, [])

  // Fetch enrollment data by semester
  useEffect(() => {
    let intervalId = null

    const fetchEnrollmentData = async () => {
      try {
        // Fetch all students and enrollments (semester filter is for demo)
        const [sres, eres] = await Promise.all([
          fetch('/api/student'),
          fetch('/api/enrollments')
        ])

        if (!sres.ok || !eres.ok) {
          console.error('Failed to fetch:', sres.status, eres.status)
          return
        }

        const students = await sres.json() || []
        const enrollments = await eres.json() || []

        // Calculate stats
        const enrolled = enrollments.filter(e => e.status && e.status.toLowerCase() === 'enrolled').length
        const pending = enrollments.filter(e => e.status && e.status.toLowerCase() === 'pending').length
        const uniqueStudents = new Set(students.map(s => s.studentId)).size

        setEnrollmentStats({
          pendingEnrollments: pending,
          approvedToday: enrolled,
          totalStudents: uniqueStudents,
          requiresAttention: 0 // would require status field
        })

        // Fetch courses so we can derive program from course codes if student.program is missing
        const cres = await fetch('/api/courses')
        const courses = cres.ok ? (await cres.json()) : []

        // Map students to enrollment records
        const studentEnrollmentMap = new Map()
        enrollments.forEach(e => {
          if (!studentEnrollmentMap.has(e.studentId)) {
            studentEnrollmentMap.set(e.studentId, [])
          }
          studentEnrollmentMap.get(e.studentId).push(e)
        })

        // Create student records from backend data
        const records = students.slice(0, 10).map(s => {
          const enrs = studentEnrollmentMap.get(s.studentId) || []
          const latestEnrollment = enrs.length > 0 ? enrs[0] : null
          // Prefer program coming from backend student record if available
          let program = s.program || s.programName || s.degree || null
          if(!program){
            // derive program heuristically from student's enrollments and course codes
            if(enrs.length > 0 && Array.isArray(courses)){
              const firstCourseId = enrs[0].courseId
              const course = courses.find(c => (c.courseId === firstCourseId || c.id === firstCourseId || String(c.courseId) === String(firstCourseId)))
              const code = course ? (course.courseCode || course.code || '') : ''
              if(code.startsWith('CS')) program = 'BS in Computer Science'
              else if(code.startsWith('IT')) program = 'BS Information Technology'
              else if(code.startsWith('MATH')) program = 'BS in Mathematics'
              else if(code.startsWith('ENG')) program = 'BS in English'
            }
          }
          if(!program) program = 'Unknown'
          return {
            studentId: `${s.studentId}`,
            name: `${s.firstname || ''} ${s.lastname || ''}`.trim(),
            program: program,
            course: latestEnrollment ? `Course ${latestEnrollment.courseId}` : 'No enrollment',
            date: latestEnrollment ? latestEnrollment.enrollmentDate : new Date().toISOString().split('T')[0],
            status: latestEnrollment ? (latestEnrollment.status || 'Pending') : 'No enrollment'
          }
        })

        setStudentRecords(records)

        // Create activity feed from recent enrollments
        const recentEnrollments = enrollments.slice(0, 6).map((e, idx) => {
          const student = students.find(s => s.studentId === e.studentId)
          const studentName = student ? `${student.firstname} ${student.lastname}` : `Student ${e.studentId}`
          const action = e.status || 'unknown'
          return {
            id: e.enrollmentId || idx,
            type: action === 'enrolled' ? 'success' : 'info',
            text: `${action === 'enrolled' ? 'Approved' : 'Requested'} enrollment for ${studentName}`,
            time: e.enrollmentDate || 'just now'
          }
        })

        setRecentActivity(recentEnrollments)
      } catch (e) {
        console.error('Failed to fetch enrollment data:', e)
      }
    }

    // initial load
    fetchEnrollmentData()

    // poll every 5 seconds to pick up live changes (e.g., student profile updates)
    intervalId = setInterval(fetchEnrollmentData, 5000)

    // also refresh when window/tab gains focus
    const onFocus = () => fetchEnrollmentData()
    window.addEventListener('focus', onFocus)

    return () => {
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
    }
  }, [selectedSemester])

  const handleProfileUpdate = async () => {
    try {
      const updatedProfile = {
        ...facultyProfile,
        ...editFormData,
        currentSemester: selectedSemester
      }

      // Persist to localStorage
      localStorage.setItem('facultyProfile', JSON.stringify(updatedProfile))
      setFacultyProfile(updatedProfile)

      // Attempt to persist to backend
      if (facultyProfile.facultyId) {
        await axiosInstance.put(`/faculty/${facultyProfile.facultyId}`, {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          phone: editFormData.phone,
          department: editFormData.department,
          officeLocation: editFormData.officeLocation,
          officeHours: editFormData.officeHours,
          currentSemester: selectedSemester
        })
      }

      setShowEditProfile(false)
    } catch (e) {
      console.error('Failed to update profile:', e)
      alert('Profile updated locally but could not sync with server')
    }
  }

  const handleEnrollmentAction = (status, studentId) => {
    alert(`Enrollment ${status}: ${studentId}`)
  }

  const getProfileInitials = () => {
    if (!facultyProfile) return 'F'
    return `${facultyProfile.firstName[0]}${facultyProfile.lastName[0]}`.toUpperCase()
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Profile Card Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileLeft}>
          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePicture}>
              {facultyProfile?.profilePicture ? (
                <img src={facultyProfile.profilePicture} alt="Profile" />
              ) : (
                <span className={styles.profileInitials}>{getProfileInitials()}</span>
              )}
            </div>
          </div>
          <div>
            <h1 className={styles.profileName}>{facultyProfile ? `${facultyProfile.firstName} ${facultyProfile.lastName}` : 'Faculty Member'}</h1>
            <p className={styles.profileId}>{facultyProfile?.email || 'faculty@university.edu'}</p>
          </div>
          <button
            className={styles.editProfileBtn}
            onClick={() => setShowEditProfile(true)}
          >
            ✎ EDIT PROFILE
          </button>
        </div>

        <div className={styles.profileRight}>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Department</span>
            <div className={styles.statusValue}>{facultyProfile?.department || 'Registrar Office'}</div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Role</span>
            <div className={styles.statusValue}>{facultyProfile?.role || 'Enrollment Manager'}</div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Select Sem</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              style={{
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {semesters.map(sem => (
                <option key={sem} value={sem} style={{ background: '#1e40af', color: 'white' }}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Status</span>
            <div className={styles.statusValue}>
              <span className={styles.statusBadge} style={{ background: '#10b981' }}>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏱️</div>
          <div className={styles.statNumber}>{enrollmentStats.pendingEnrollments}</div>
          <div className={styles.statLabel}>Pending Enrollments</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
          <div className={styles.statNumber}>{enrollmentStats.approvedToday}</div>
          <div className={styles.statLabel}>Approved Today</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
          <div className={styles.statNumber}>{enrollmentStats.totalStudents}</div>
          <div className={styles.statLabel}>Total Students</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div className={styles.statNumber}>{enrollmentStats.requiresAttention}</div>
          <div className={styles.statLabel}>Requires Attention</div>
        </div>
      </div>

      {/* Pending Enrollment Requests Section */}
      <div className={styles.enrolledCoursesSection}>
        <h2 className={styles.sectionTitle}>📋 Pending Enrollment Requests</h2>
        
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input placeholder="Search by student name, ID, program, or course..." style={{ flex: 1, padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', marginRight: '12px' }} />
          <button style={{ padding: '10px 16px', background: '#0b5fff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>View All</button>
        </div>

        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Student</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Program</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Course</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Date</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Status</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: '#6b7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((record, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600' }}>{record.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.studentId}</div>
                  </td>
                  <td style={{ padding: '12px' }}>{record.program}</td>
                  <td style={{ padding: '12px' }}>{record.course}</td>
                  <td style={{ padding: '12px' }}>{record.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {record.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEnrollmentAction('Approved', record.studentId)} style={{ marginRight: '8px', padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✓</button>
                    <button onClick={() => handleEnrollmentAction('Rejected', record.studentId)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className={styles.notificationsSection}>
        <h2 className={styles.sectionTitle}>🔔 Recent Activity</h2>
        
        {recentActivity.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📭</span>
            <p>No recent activities yet. Stay tuned for updates!</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {recentActivity.map(activity => (
              <div key={activity.id} style={{ padding: '12px', borderRadius: '6px', borderLeft: '4px solid', background: activity.type === 'success' ? '#ecfdf5' : activity.type === 'error' ? '#fef2f2' : '#eef6ff', borderColor: activity.type === 'success' ? '#10b981' : activity.type === 'error' ? '#ef4444' : '#0b5fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827' }}>{activity.text}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <Modal onClose={() => setShowEditProfile(false)}>
          <h3>Edit Faculty Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>First Name</label>
              <input
                type="text"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Last Name</label>
              <input
                type="text"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Email</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Phone</label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Department</label>
              <input
                type="text"
                value={editFormData.department}
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Office Location</label>
              <input
                type="text"
                value={editFormData.officeLocation}
                onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#111827' }}>Office Hours</label>
              <input
                type="text"
                value={editFormData.officeHours}
                onChange={(e) => setEditFormData({ ...editFormData, officeHours: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowEditProfile(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleProfileUpdate} style={{ padding: '10px 20px', background: '#0b5fff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
