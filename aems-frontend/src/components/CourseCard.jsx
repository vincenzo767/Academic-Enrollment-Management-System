import React from 'react'
import styles from '../styles/coursecard.module.css'

export default function CourseCard({course, onEnroll}){
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
        </ul>
      </div>
      <div className={styles.right}>
        {course.enrolled ? (
          <span className={styles.badgeGreen}>Enrolled</span>
        ) : course.conflict ? (
          <span className={styles.badgeYellow}>Conflict</span>
        ) : null}

        {!course.enrolled && (
          <button className="btn" onClick={onEnroll}>
            {course.conflict ? 'Enroll Anyway' : 'Enroll'}
          </button>
        )}
      </div>
    </div>
  )
}
