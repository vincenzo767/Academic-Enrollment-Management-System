import React from 'react'
import { useApp } from '../state/AppContext.js'
import styles from '../styles/coursecard.module.css'

export default function CourseCard({course, onEnroll}){
  const {enrolledIds, studentProfile} = useApp()
  const enrolled = enrolledIds.includes(course.id) || course.enrolled
  // Only allow enroll if course.semester matches student's chosen semester (if set)
  const semesterLocked = studentProfile && studentProfile.semester
  const semesterMismatch = semesterLocked && course.semester && course.semester !== studentProfile.semester

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <h3>{course.code} {course.title}</h3>
        <p className={styles.subtitle}>{course.subtitle}</p>
        <ul className={styles.meta}>
          <li>🕒 {course.schedule}</li>
          <li>👨‍🏫 Instructor: {course.instructor}</li>
          <li>📘 {course.units} Units</li>
          <li>📍 Available: {course.available}</li>
          {course.semester && <li>📅 Semester: {course.semester}</li>}
        </ul>
      </div>
      <div className={styles.right}>
        {enrolled ? (
          <span className={styles.badgeGreen}>Enrolled</span>
        ) : course.conflict ? (
          <span className={styles.badgeYellow}>Conflict</span>
        ) : null}

        <div style={{display:'flex', gap:8, flexDirection:'column', alignItems:'flex-end'}}>
          <button
            className="btn"
            onClick={onEnroll}
            disabled={semesterMismatch}
            title={semesterMismatch ? `You can only enroll in courses for ${studentProfile.semester}` : ''}
          >
            {course.conflict ? 'Enroll Anyway' : 'Enroll'}
          </button>
        </div>
      </div>
    </div>
  )
}
