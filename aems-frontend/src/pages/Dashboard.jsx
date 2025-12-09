import React, { useState, useEffect } from 'react'
import { useApp } from '../state/AppContext.js'
import { programList } from '../state/mockData.js'
import EditProfile from '../components/EditProfile.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/dashboard.module.css'

export default function Dashboard() {
  const { courses, enrolledIds, notifications, role, studentProfile, setStudentProfile, registrationSubmitted, submitRegistration } = useApp()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangeProgram, setShowChangeProgram] = useState(false)
  const [pendingProgram, setPendingProgram] = useState(null)
  const [showConfirmChange, setShowConfirmChange] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  // Sync enrollments to backend on mount
  useEffect(() => {
    const syncEnrollments = async () => {
      if (!studentProfile?.studentId || !enrolledIds || enrolledIds.length === 0) return
      
      try {
        // Get backend courses to map frontend IDs
        const coursesRes = await fetch('/api/courses')
        const backendCourses = await coursesRes.json()
        
        // Get existing enrollments
        const existingRes = await fetch('/api/enrollments')
        const existing = await existingRes.json()
        const existingCourseIds = existing
          .filter(e => e.studentId === studentProfile.studentId)
          .map(e => e.courseId)
        
        // Sync each enrolled course
        for (const frontendCourseId of enrolledIds) {
          const frontendCourse = courses.find(c => c.id === frontendCourseId)
          if (!frontendCourse) continue
          
          const backendCourse = backendCourses.find(c => 
            c.courseCode === frontendCourse.code || c.title === frontendCourse.title
          )
          
          const courseIdToUse = backendCourse ? backendCourse.courseId : frontendCourseId
          
          if (!existingCourseIds.includes(courseIdToUse)) {
            await fetch('/api/enrollments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: studentProfile.studentId,
                courseId: courseIdToUse,
                enrollmentDate: new Date().toISOString().split('T')[0],
                status: 'pending'
              })
            })
            console.log('Synced enrollment:', frontendCourse.code, '->', courseIdToUse)
          }
        }
      } catch (e) {
        console.error('Failed to sync enrollments:', e)
      }
    }
    
    syncEnrollments()
  }, []) // Only run once on mount

  const enrolledCourses = courses.filter(c => enrolledIds.includes(c.id))
  const recentNotifications = notifications.slice(0, 5)

  const getProfileInitials = () => {
    if (!studentProfile.fullName) return '?'
    return studentProfile.fullName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
  }

  const getEnrollmentColor = (status) => {
    return status === 'Active' ? '#10b981' : '#6b7280'
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Profile Card Section */}
      <div className={styles.profileSection}>
        <div className={styles.profileLeft}>
          <div className={styles.profilePictureContainer}>
            <div className={styles.profilePicture}>
              {studentProfile.profilePicture ? (
                <img src={studentProfile.profilePicture} alt="Profile" />
              ) : (
                <span className={styles.profileInitials}>{getProfileInitials()}</span>
              )}
            </div>
          </div>
          <div>
            <h1 className={styles.profileName}>{studentProfile.fullName}</h1>
            <p className={styles.profileId}>{studentProfile.schoolId}</p>
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
            <span className={styles.statusLabel}>Program</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div className={styles.statusValue}>{studentProfile.program || '—'}</div>
                <button 
                  className={styles.changeProgramBtn} 
                  onClick={()=>{ setPendingProgram(null); setShowChangeProgram(true) }} 
                  style={{fontSize:12,padding:'4px 8px'}}
                  disabled={registrationSubmitted}
                  title={registrationSubmitted ? "Cannot change program after registration submission" : ""}
                >
                  Change Program
                </button>
              </div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Status</span>
            <div className={styles.statusValue}>
              <span className={styles.statusBadge} style={{ background: getEnrollmentColor(studentProfile.enrollmentStatus) }}>
                {studentProfile.enrollmentStatus}
              </span>
            </div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Year Level</span>
            <div className={styles.statusValue}>{studentProfile.yearLevel}</div>
          </div>
          <div className={styles.statusCard}>
            <span className={styles.statusLabel}>Semester</span>
            <div className={styles.statusValue}>{studentProfile.semester}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>{enrolledCourses.length}</div>
          <div className={styles.statLabel}>Enrolled Courses</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>{enrolledCourses.reduce((sum, c) => sum + (c.units || 0), 0)}</div>
          <div className={styles.statLabel}>Total Units</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>{recentNotifications.length}</div>
          <div className={styles.statLabel}>Recent Updates</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statNumber}>₱ {enrolledCourses.reduce((sum, c) => sum + ((c.units || 0) * 500), 0).toLocaleString()}</div>
          <div className={styles.statLabel}>Total Fees</div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className={styles.enrolledCoursesSection}>
        <h2 className={styles.sectionTitle}>
          📚 Enrolled Courses ({enrolledCourses.length})
        </h2>
        
        {enrolledCourses.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📖</span>
            <p>No courses enrolled yet. Browse and enroll in courses to get started!</p>
          </div>
        ) : (
          <>
            <div className={styles.courseGrid}>
              {enrolledCourses.map(course => (
                <div key={course.id} className={styles.enrolledCourseCard}>
                  <div className={styles.courseCode}>{course.code}</div>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <p className={styles.courseSubtitle}>{course.subtitle}</p>
                  
                  {course.schedule && (
                    <div className={styles.courseSchedule}>
                      <span>🕐 {course.schedule}</span>
                    </div>
                  )}
                  
                  <span className={styles.courseUnits}>{course.units} Units</span>
                  
                  {course.instructor && (
                    <div className={styles.courseInstructor}>
                      👨‍🏫 Instructor: {course.instructor}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Submit Registration Button - only visible if courses enrolled and not yet submitted */}
            {!registrationSubmitted && enrolledCourses.length > 0 && (
              <div style={{marginTop: 24}}>
                <div style={{marginBottom: 16, padding: '12px 16px', backgroundColor: '#d1fae5', border: '1px solid #10b981', borderRadius: '6px', color: '#047857', fontWeight: '600'}}>
                  ⓘ Please review your selected courses carefully. Once submitted, you cannot change your program, drop courses, or enroll in new courses.
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button 
                    className="btn"
                    style={{backgroundColor: '#10b981', color: 'white', padding: '10px 24px', fontSize: '14px', fontWeight: '600'}}
                    onClick={() => setShowSubmitConfirm(true)}
                  >
                    ✓ Submit Registration
                  </button>
                </div>
              </div>
            )}

            {/* Registration Submitted Badge */}
            {registrationSubmitted && (
              <div style={{marginTop: 24, padding: '12px 16px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', borderRadius: '6px', color: '#047857', fontWeight: '600', textAlign: 'center'}}>
                ✓ Registration Submitted - Your course selection is locked
              </div>
            )}
          </>
        )}
      </div>

      {/* Notifications Section */}
      <div className={styles.notificationsSection}>
        <h2 className={styles.sectionTitle}>
          🔔 Recent Notifications
        </h2>
        
        {recentNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📭</span>
            <p>No notifications yet. Stay tuned for updates!</p>
          </div>
        ) : (
          <div className={styles.notificationsList}>
            {recentNotifications.map(notification => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${styles[notification.type]}`}
              >
                <div className={styles.notificationContent}>
                  <div className={styles.notificationText}>{notification.text}</div>
                  <div className={styles.notificationTime}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} />
      )}

      {showChangeProgram && (
        <div className={styles.changeProgramOverlay}>
          <div className={styles.changeProgramModal} role="dialog" aria-modal="true">
            <div className={styles.changeProgramLeft}>
              <h3 style={{marginTop:0}}>Programs</h3>
              <div className={styles.changeProgramList}>
                {programList.map(p => (
                  <div key={p.name} className={styles.changeProgramItem} onClick={()=>setPendingProgram(p)}>
                    <div className={styles.changeProgramItemText}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.changeProgramRight}>
              <h3 style={{marginTop:0}}>Selection</h3>
              <div style={{minHeight:120,display:'flex',flexDirection:'column',justifyContent:'center',padding:12,border:'1px solid #eef2f7',borderRadius:6}}>
                {pendingProgram ? (
                  <div>
                    <div style={{fontWeight:700,marginBottom:6}}>{pendingProgram.name}</div>
                    <div style={{color:'#6b7280'}}>Prefixes: {pendingProgram.prefixes.join(', ')}</div>
                  </div>
                ) : (
                  <div style={{color:'#6b7280'}}>Select a program from the left to preview and confirm.</div>
                )}
              </div>

              <div className={styles.changeProgramActions}>
                <button className="btn btn-ghost" onClick={()=>{ setShowChangeProgram(false); setPendingProgram(null) }}>Cancel</button>
                <button className="btn" disabled={!pendingProgram} onClick={()=>{ if(!pendingProgram) return; setShowConfirmChange(true) }}>Confirm Change</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmChange && pendingProgram && (
        <Modal onClose={()=>setShowConfirmChange(false)}>
          <h3>Confirm Program Change</h3>
          <p style={{marginTop:8}}>Are you sure you want to change your program to <strong>{pendingProgram.name}</strong>? This will replace your current program.</p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
            <button className="btn btn-ghost" onClick={()=>setShowConfirmChange(false)}>Cancel</button>
            <button className={"btn"} onClick={()=>{
              console.log('[Dashboard] Confirming program change, pendingProgram=', pendingProgram)
              setStudentProfile(prev => ({ ...prev, program: pendingProgram.name }))
              console.log('[Dashboard] setStudentProfile called')
              setShowConfirmChange(false)
              setShowChangeProgram(false)
              setPendingProgram(null)
              console.log('[Dashboard] closed modals')
            }}>Confirm Change</button>
          </div>
        </Modal>
      )}

      {showSubmitConfirm && (
        <Modal onClose={()=>setShowSubmitConfirm(false)}>
          <h3>Submit Your Registration</h3>
          <p style={{marginTop:12, marginBottom:12}}>
            You are about to submit your course registration. Once submitted:
          </p>
          <ul style={{marginBottom:12, paddingLeft:20, lineHeight:1.8}}>
            <li>✗ You <strong>cannot change your program</strong></li>
            <li>✗ You <strong>cannot drop courses</strong></li>
            <li>✗ You <strong>cannot enroll in new courses</strong></li>
            <li>✓ Your course selection will be <strong>locked and finalized</strong></li>
          </ul>
          <p style={{marginBottom:16, color:'#666', fontSize:'14px'}}>
            This action is permanent. Please review your selections carefully before confirming.
          </p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:20}}>
            <button className="btn btn-ghost" onClick={()=>setShowSubmitConfirm(false)}>Cancel</button>
            <button 
              className="btn" 
              style={{backgroundColor: '#10b981'}}
              onClick={()=>{
                submitRegistration()
                setShowSubmitConfirm(false)
              }}
            >
              Confirm Submission
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
