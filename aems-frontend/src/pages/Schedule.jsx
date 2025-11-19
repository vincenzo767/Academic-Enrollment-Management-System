import React from 'react'
import styles from '../styles/schedule.module.css'
import { useApp } from '../state/AppContext.js'

export default function Schedule(){
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const { courses, reservedIds, enrolledIds } = useApp()

  // derive blocks from selected/enrolled courses
  const blocks = []
  courses.forEach(c=>{
    if(!(reservedIds.includes(c.id) || enrolledIds.includes(c.id))) return
    const [daysPart, timePart] = c.schedule.split(' ',2)
    const parseDays = (d)=>{
      if(!d) return []
      if(d==='MWF') return ['Monday','Wednesday','Friday']
      if(d==='TTh') return ['Tuesday','Thursday']
      if(d.toLowerCase().startsWith('sat')) return ['Saturday']
      return d.split('').map(ch=> ({M:'Monday',T:'Tuesday',W:'Wednesday',F:'Friday'}[ch]||ch))
    }
    const parseTime = (t)=>{
      if(!t) return {start:'', end:''}
      const [s,e] = t.split('-')
      return {start:s, end:e}
    }
    const ds = parseDays(daysPart)
    const tm = parseTime(timePart)
    ds.forEach(d=> blocks.push({id:c.id, day:d, code:c.code, title:c.title, time: `${tm.start}-${tm.end}`, conflict: c.conflict}))
  })

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.timeCol}></div>
        {days.map(d => <div key={d} className={styles.headerCell}>{d}</div>)}
      </div>
      {[...Array(10)].map((_,i)=>{
        const t = `${9+i}:30AM`
        return (
          <div key={i} className={styles.row}>
            <div className={styles.timeCol}>{t}</div>
            {days.map(d => (
              <div key={d} className={styles.cell}>
                {blocks.filter(b=>b.day===d).map(b => (
                  <div key={`${b.id}-${d}`} className={styles.block} style={{background: b.conflict ? '#ffd9d9' : '#d1e8ff', border: b.conflict ? '2px solid #ff6b6b' : undefined}}>
                    <div className={styles.blockTitle}>{b.code}</div>
                    <div className={styles.blockSub}>{b.title}</div>
                    <div className={styles.blockTime}>{b.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
