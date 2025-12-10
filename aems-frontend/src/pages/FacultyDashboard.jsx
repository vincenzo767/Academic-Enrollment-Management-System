import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../state/AppContext.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/dashboard.module.css'
import axiosInstance from '../api/axiosInstance.js'

export default function FacultyDashboard() {
  const { setRole } = useApp()
  const [facultyProfile, setFacultyProfile] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState('1st Semester')
  const [semesterFilter, setSemesterFilter] = useState('All Semesters')
  const [selectedProgram, setSelectedProgram] = useState('All Programs')
  const [searchTerm, setSearchTerm] = useState('')
  const [enrollmentStats, setEnrollmentStats] = useState({
    pendingEnrollments: 0,
    approvedToday: 0,
    totalStudents: 0,
    requiresAttention: 0
  })
  const [studentRecords, setStudentRecords] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [localSync, setLocalSync] = useState({})
  const [approvedStudentIds, setApprovedStudentIds] = useState({})
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    officeLocation: '',
    officeHours: ''
  })

  const localSyncRef = useRef({})

  const FACULTY_SYNC_KEY = 'aems:facultySync'
  const FACULTY_APPROVALS_KEY = 'aems:facultyApprovals'

  const semesters = ['1st Semester', '2nd Semester', 'Summer']

  const normalizeSemester = (value) => {
    const s = (value || '').toString().toLowerCase().trim()
    if (!s) return ''
    if (s.startsWith('1')) return '1st semester'
    if (s.startsWith('first')) return '1st semester'
    if (s.startsWith('2')) return '2nd semester'
    if (s.startsWith('second')) return '2nd semester'
    if (s.includes('summer')) return 'summer'
    if (s.includes('midyear')) return 'summer'
    return s
  }

  const mergeWithLocalOverrides = (records, overrides) => {
    if (!overrides || typeof overrides !== 'object') return records
    const map = new Map(records.map(r => [String(r.studentId), r]))
    Object.values(overrides).forEach((o) => {
      if (!o || !o.studentId) return
      const sid = String(o.studentId)
      const existing = map.get(sid)
      const base = existing || {
        studentId: sid,
        name: o.name || `Student ${sid}`,
        program: o.program || '—',
        semester: o.semester || 'Unspecified',
        date: new Date().toISOString().split('T')[0]
      }
      map.set(sid, {
        ...base,
        name: o.name || base.name,
        program: o.program || base.program,
        semester: o.semester || base.semester || 'Unspecified',
        courseCount: o.courseCount !== undefined ? o.courseCount : (base.courseCount || 0),
        status: o.status || base.status || 'Pending'
      })
    })
    return Array.from(map.values())
  }

  const computeStats = (records) => {
    const pending = records.filter(r => r.status === 'Pending').length
    const registered = records.filter(r => r.status === 'Registered').length
    return {
      pendingEnrollments: pending,
      approvedToday: registered,
      totalStudents: records.length,
      requiresAttention: pending
    }
  }

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

    const loadLocalSync = () => {
      try {
        const raw = localStorage.getItem(FACULTY_SYNC_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        localSyncRef.current = parsed
        setLocalSync(parsed)
        return parsed
      } catch (e) {
        console.error('Failed to read faculty sync cache', e)
        return {}
      }
    }

    const loadApprovals = () => {
      try {
        const raw = localStorage.getItem(FACULTY_APPROVALS_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        setApprovedStudentIds(parsed)
        return parsed
      } catch (e) {
        console.error('Failed to read approvals', e)
        return {}
      }
    }

    const applyLocalOverrides = (records, overrides) => {
      const merged = mergeWithLocalOverrides(records, overrides)
      setStudentRecords(merged)
      setEnrollmentStats(computeStats(merged))
      return merged
    }

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
        const uniqueStudents = new Set(students.map(s => s.studentId)).size

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
          const normalized = enrs.map(e => (e.status || '').toLowerCase())
          // Count all enrollments except dropped and cancelled, deduping by course code/id
          const dedupSet = new Set()
          enrs.forEach(e => {
            const status = (e.status || '').toLowerCase()
            if(status === 'dropped' || status === 'cancelled') return
            // find course code for better dedupe if available
            const course = courses.find(c => c.courseId === e.courseId || String(c.courseId) === String(e.courseId))
            const key = (course && (course.courseCode || course.code)) || e.courseId
            dedupSet.add(key)
          })
          const courseCount = dedupSet.size
          const hasRegistered = normalized.some(st => st === 'registered' || st === 'enrolled' || st === 'approved' || st === 'submitted')
          const status = hasRegistered ? 'Registered' : 'Pending'
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
          const semester = s.semester || s.sem || s.currentSemester || latestEnrollment?.semester || 'Unspecified'
          return {
            studentId: `${s.studentId}`,
            name: `${s.firstname || ''} ${s.lastname || ''}`.trim(),
            program: program,
            semester,
            courseCount,
            date: latestEnrollment ? latestEnrollment.enrollmentDate : new Date().toISOString().split('T')[0],
            status
          }
        })

        // merge with any local overrides coming from the student portal for instant updates
        const overrides = localSyncRef.current || {}
        let merged = mergeWithLocalOverrides(records, overrides)
        
        // Load latest approvals before filtering
        const latestApprovals = loadApprovals()
        
        // filter out already-approved students from pending view
        merged = merged.filter(r => !latestApprovals[String(r.studentId)])
        
        applyLocalOverrides(merged, overrides)

        // Update stats based on merged records
        const mergedStats = computeStats(mergeWithLocalOverrides(records, overrides))
        setEnrollmentStats({ ...mergedStats, totalStudents: uniqueStudents || mergedStats.totalStudents })

        // Create activity feed from recent enrollments (sorted by date, most recent first)
        const sortedEnrollments = [...enrollments].sort((a, b) => {
          const dateA = new Date(a.enrollmentDate || 0).getTime()
          const dateB = new Date(b.enrollmentDate || 0).getTime()
          return dateB - dateA
        })
        
        // Filter for recent enrollments (last 10 records by date)
        const recentEnrollments = sortedEnrollments.slice(0, 10).map((e, idx) => {
          const student = students.find(s => s.studentId === e.studentId)
          const studentName = student ? `${student.firstname} ${student.lastname}` : `Student ${e.studentId}`
          const action = (e.status || '').toLowerCase()
          return {
            id: e.enrollmentId || idx,
            type: action === 'enrolled' || action === 'enrolled' ? 'success' : 'info',
            text: `${action === 'enrolled' || action === 'approved' ? 'Approved' : 'Requested'} enrollment for ${studentName}`,
            time: e.enrollmentDate || 'just now'
          }
        })

        setRecentActivity(recentEnrollments)
      } catch (e) {
        console.error('Failed to fetch enrollment data:', e)
      }
    }

    // initial load (includes any local overrides)
    loadLocalSync()
    loadApprovals()
    fetchEnrollmentData()

    // poll every 5 seconds to pick up live changes (e.g., student profile updates)
    intervalId = setInterval(fetchEnrollmentData, 5000)

    // also refresh when window/tab gains focus
    const onFocus = () => fetchEnrollmentData()
    window.addEventListener('focus', onFocus)

    // listen for cross-tab updates when students submit or enroll
    const onStorage = (evt) => {
      if (evt.key !== FACULTY_SYNC_KEY) return
      try {
        const parsed = evt.newValue ? JSON.parse(evt.newValue) : {}
        localSyncRef.current = parsed
        setLocalSync(parsed)
        setStudentRecords(prev => {
          const merged = mergeWithLocalOverrides(prev, parsed)
          setEnrollmentStats(computeStats(merged))
          return merged
        })
      } catch (e) {
        console.error('Failed to apply storage sync update', e)
      }
    }

    const onLocalSyncEvent = (evt) => {
      if (!evt.detail || !evt.detail.studentId) return
      const current = { ...localSyncRef.current, [evt.detail.studentId]: evt.detail }
      localSyncRef.current = current
      setLocalSync(current)
      setStudentRecords(prev => {
        const merged = mergeWithLocalOverrides(prev, current)
        setEnrollmentStats(computeStats(merged))
        return merged
      })
    }

    const onApprovalEvent = (evt) => {
      if (!evt.detail || !evt.detail.studentId) return
      const sid = String(evt.detail.studentId)
      const updated = { ...approvedStudentIds, [sid]: true }
      setApprovedStudentIds(updated)
      // remove from pending view
      setStudentRecords(prev => prev.filter(r => !updated[String(r.studentId)]))
      setEnrollmentStats(prev => ({ ...prev, pendingEnrollments: Math.max(0, prev.pendingEnrollments - 1), requiresAttention: Math.max(0, prev.requiresAttention - 1) }))
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('aems:facultySync', onLocalSyncEvent)
    window.addEventListener('aems:facultyApproval', onApprovalEvent)

    return () => {
      if (intervalId) clearInterval(intervalId)
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('aems:facultySync', onLocalSyncEvent)
      window.removeEventListener('aems:facultyApproval', onApprovalEvent)
    }
  }, [selectedSemester])

  const programOptions = useMemo(() => {
    const values = Array.from(new Set(studentRecords.map(r => r.program).filter(Boolean)))
    return ['All Programs', ...values]
  }, [studentRecords])

  const filteredStudentRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const normalizedFilter = normalizeSemester(semesterFilter)
    return studentRecords.filter(r => {
      const matchesProgram = selectedProgram === 'All Programs' || r.program === selectedProgram
      const matchesSemester = semesterFilter === 'All Semesters'
        || normalizeSemester(r.semester) === normalizedFilter
      const matchesSearch = term.length === 0 || `${r.name} ${r.studentId} ${r.program}`.toLowerCase().includes(term)
      return matchesProgram && matchesSemester && matchesSearch
    })
  }, [studentRecords, selectedProgram, semesterFilter, searchTerm])

  const filteredStats = useMemo(() => computeStats(filteredStudentRecords), [filteredStudentRecords])
  const statsToShow = useMemo(() => ({
    ...enrollmentStats,
    ...filteredStats,
    totalStudents: filteredStudentRecords.length
  }), [enrollmentStats, filteredStats, filteredStudentRecords.length])

  // Re-filter pending students whenever approvals change
  useEffect(() => {
    if (studentRecords.length === 0) return
    const filtered = studentRecords.filter(r => !approvedStudentIds[String(r.studentId)])
    if (filtered.length !== studentRecords.length) {
      setStudentRecords(filtered)
      setEnrollmentStats(prev => ({
        ...prev,
        pendingEnrollments: filtered.filter(r => r.status === 'Pending').length,
        requiresAttention: filtered.filter(r => r.status === 'Pending').length
      }))
    }
  }, [approvedStudentIds])

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
    if (status === 'Approved') {
      setConfirmDialog({
        type: 'approve',
        studentId,
        message: 'Enroll This Student?'
      })
    } else if (status === 'Rejected') {
      setConfirmDialog({
        type: 'reject',
        studentId,
        message: 'Cancel Enrollment?'
      })
    }
  }

  const confirmEnrollmentAction = async () => {
    if (!confirmDialog) return

    if (confirmDialog.type === 'approve') {
      try {
        const raw = localStorage.getItem(FACULTY_APPROVALS_KEY)
        const approvals = raw ? JSON.parse(raw) : {}
        approvals[String(confirmDialog.studentId)] = true
        localStorage.setItem(FACULTY_APPROVALS_KEY, JSON.stringify(approvals))
        
        // update local state immediately
        const updated = { ...approvedStudentIds, [String(confirmDialog.studentId)]: true }
        setApprovedStudentIds(updated)
        
        // remove from pending view
        setStudentRecords(prev => prev.filter(r => !updated[String(r.studentId)]))
        setEnrollmentStats(prev => ({ ...prev, pendingEnrollments: Math.max(0, prev.pendingEnrollments - 1), requiresAttention: Math.max(0, prev.requiresAttention - 1) }))
        
        // notify other listeners
        window.dispatchEvent(new CustomEvent('aems:facultyApproval', { detail: { studentId: String(confirmDialog.studentId) } }))
      } catch (e) {
        console.error('Failed to approve student', e)
        alert('Failed to approve student. Please try again.')
      }
    } else if (confirmDialog.type === 'reject') {
      // Placeholder for rejection logic
      alert(`Enrollment cancelled for student: ${confirmDialog.studentId}`)
    }

    setConfirmDialog(null)
  }

  const cancelConfirmDialog = () => {
    setConfirmDialog(null)
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
              onChange={(e) => {
                setSelectedSemester(e.target.value)
                setSemesterFilter(e.target.value)
              }}
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
          <div className={styles.statNumber}>{statsToShow.pendingEnrollments}</div>
          <div className={styles.statLabel}>Pending Enrollments</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
          <div className={styles.statNumber}>{statsToShow.approvedToday}</div>
          <div className={styles.statLabel}>Approved Today</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
          <div className={styles.statNumber}>{statsToShow.totalStudents}</div>
          <div className={styles.statLabel}>Total Students</div>
        </div>
        <div className={styles.statBox}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div className={styles.statNumber}>{statsToShow.requiresAttention}</div>
          <div className={styles.statLabel}>Requires Attention</div>
        </div>
      </div>

      {/* Pending Enrollment Requests Section */}
      <div className={styles.enrolledCoursesSection}>
        <h2 className={styles.sectionTitle}>📋 Pending Enrollment Requests</h2>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            placeholder="Search by student name, ID, program, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, minWidth: '240px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--card)', color: 'var(--text)' }}
          />
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--card)', color: 'var(--text)', minWidth: '180px' }}
          >
            {programOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--card)', color: 'var(--text)', minWidth: '150px' }}
          >
            {['All Semesters', ...semesters].map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedProgram('All Programs')
              setSemesterFilter('All Semesters')
            }}
            style={{ padding: '10px 16px', background: 'var(--accent-2)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            View All
          </button>
        </div>

        <div style={{ background: 'var(--card)', borderRadius: '12px', padding: '16px', overflowX: 'auto', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Student</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Program</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Enrolled Courses</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Date</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Status</th>
                <th align="left" style={{ padding: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudentRecords.map((record, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text)' }}>{record.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{record.studentId}</div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text)' }}>
                    <div>{record.program}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{record.semester || 'Unspecified'}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: '700', color: 'var(--text)' }}>{record.courseCount ?? 0}</td>
                  <td style={{ padding: '12px', color: 'var(--text)' }}>{record.date}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: record.status === 'Registered' ? 'var(--success)' : 'var(--warning)', color: record.status === 'Registered' ? '#fff' : '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {record.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => handleEnrollmentAction('Approved', record.studentId)} style={{ marginRight: '8px', padding: '6px 12px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✓</button>
                    <button onClick={() => handleEnrollmentAction('Rejected', record.studentId)} style={{ padding: '6px 12px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✕</button>
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
              <div key={activity.id} style={{ padding: '12px', borderRadius: '6px', borderLeft: '4px solid', background: activity.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : activity.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', borderColor: activity.type === 'success' ? 'var(--success)' : activity.type === 'error' ? 'var(--danger)' : 'var(--accent-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>{activity.text}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <Modal onClose={() => setShowEditProfile(false)}>
          <h3 style={{color: 'var(--text)'}}>Edit Faculty Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>First Name</label>
              <input
                type="text"
                value={editFormData.firstName}
                onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Last Name</label>
              <input
                type="text"
                value={editFormData.lastName}
                onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Email</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Phone</label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Department</label>
              <input
                type="text"
                value={editFormData.department}
                onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Office Location</label>
              <input
                type="text"
                value={editFormData.officeLocation}
                onChange={(e) => setEditFormData({ ...editFormData, officeLocation: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text)' }}>Office Hours</label>
              <input
                type="text"
                value={editFormData.officeHours}
                onChange={(e) => setEditFormData({ ...editFormData, officeHours: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '14px', background: 'var(--card)', color: 'var(--text)' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setShowEditProfile(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', color: 'var(--text)' }}>Cancel</button>
              <button onClick={handleProfileUpdate} style={{ padding: '10px 20px', background: 'var(--accent-2)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{background:'var(--card)',padding:24,borderRadius:12,minWidth:400,boxShadow:'0 10px 40px rgba(0,0,0,0.2)',color:'var(--text)'}}>
            <h3 style={{marginTop:0,marginBottom:16,fontSize:18,fontWeight:700,color:'var(--text)'}}>{confirmDialog.message}</h3>
            <p style={{marginBottom:24,color:'var(--text-secondary)',fontSize:14}}>
              {confirmDialog.type === 'approve' ? 'Once enrolled, this student will be moved to the approved list.' : 'This will cancel the enrollment request for this student.'}
            </p>
            <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
              <button onClick={cancelConfirmDialog} style={{padding:'10px 20px',background:'transparent',border:'1px solid var(--border)',borderRadius:'6px',cursor:'pointer',fontWeight:'600',color:'var(--text)'}}>
                Cancel
              </button>
              <button onClick={confirmEnrollmentAction} style={{padding:'10px 20px',background:confirmDialog.type === 'approve' ? 'var(--success)' : 'var(--danger)',color:'white',border:'none',borderRadius:'6px',cursor:'pointer',fontWeight:'600'}}>
                {confirmDialog.type === 'approve' ? '✓ Enroll' : '✕ Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
