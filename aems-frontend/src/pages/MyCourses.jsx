import React, { useState } from 'react'
import { myCourses as initial } from '../state/mockData.js'
import styles from '../styles/mycourses.module.css'

export default function MyCourses(){
  const [list, setList] = useState(initial)
  const drop = (id) => setList(prev => prev.filter(c => c.id !== id))

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
            <button className="btn-outline" onClick={()=>drop(c.id)}>Drop Course</button>
          </div>
        </div>
      ))}
      {list.length === 0 && <div className={styles.empty}>No courses yet.</div>}
    </div>
  )
}
