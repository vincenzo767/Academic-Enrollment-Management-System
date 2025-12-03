import React, { useState } from 'react'
import { useApp } from '../state/AppContext.js'
import EditProfile from '../components/EditProfile.jsx'
import styles from '../styles/dashboard.module.css'

export default function Dashboard() {
  const { courses, enrolledIds, notifications, role, studentProfile } = useApp()
  const [showEditProfile, setShowEditProfile] = useState(false)

  const enrolledCourses = courses.filter(c => enrolledIds.includes(c.id))
  const recentNotifications = notifications.slice(0, 5)

  const getProfileInitials = () => {
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
            <div className={styles.statusValue}>{studentProfile.program}</div>
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
    </div>
  )
}
