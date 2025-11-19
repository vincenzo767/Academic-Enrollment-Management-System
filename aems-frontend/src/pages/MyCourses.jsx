import React from 'react'
import styles from '../styles/mycourses.module.css'
import { useApp } from '../state/AppContext.js'

export default function MyCourses(){
  const { courses, enrolledIds, dropCourse } = useApp()
  const list = courses.filter(c=> enrolledIds.includes(c.id))

  return (
    <div className={styles.wrap}>
      {list.map(c => (
        <div className={styles.item} key={c.id}>
          <div>
            <h3>{c.code} {c.title}</h3>
            <p className={styles.muted}>{c.subtitle}</p>
            <ul className={styles.meta}>
              <li>🕒 {c.schedule}</li>
              <li>👨‍🏫 {c.instructor}</li>
              <li>📘 {c.units} Units</li>
            </ul>
          </div>
          <div className={styles.actions}>
            <span className={styles.badge}>Enrolled</span>
            <button className="btn-outline" onClick={()=>dropCourse(c.id)}>Drop Course</button>
          </div>
        </div>
      ))}
      {list.length === 0 && <div className={styles.empty}>No courses yet.</div>}
    </div>
  )
}
