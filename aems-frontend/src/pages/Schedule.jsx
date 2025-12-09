import React from 'react'
import styles from '../styles/schedule.module.css'
import { useApp } from '../state/AppContext.js'

export default function Schedule(){
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
  const { courses, reservedIds, enrolledIds } = useApp()

  // Time slots from 7:30 AM to 9:30 PM
  const timeSlots = [
    '07:30 AM', '08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM',
    '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM',
    '07:30 PM', '08:30 PM', '09:30 PM'
  ]

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

  const getBlockHeight = (startTime, endTime) => {
    // Calculate the height of the block based on time duration
    const timeToIndex = (time) => {
      const [t, period] = time.split(' ')
      let [h, m] = t.split(':').map(Number)
      if(period === 'PM' && h !== 12) h += 12
      if(period === 'AM' && h === 12) h = 0
      return (h - 7) * 60 + (m - 30)
    }
    const startIdx = timeToIndex(startTime)
    const endIdx = timeToIndex(endTime)
    const minutes = endIdx - startIdx
    return Math.max(60, (minutes / 60) * 100)
  }

  const getBlockPosition = (startTime) => {
    const timeToIndex = (time) => {
      const [t, period] = time.split(' ')
      let [h, m] = t.split(':').map(Number)
      if(period === 'PM' && h !== 12) h += 12
      if(period === 'AM' && h === 12) h = 0
      return (h - 7) * 60 + (m - 30)
    }
    const startIdx = timeToIndex(startTime)
    return (startIdx / 60) * 100
  }

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.scheduleWrapper}>
        <div className={styles.table}>
          {/* Header with days */}
          <div className={styles.headerRow}>
            <div className={styles.timeHeader}></div>
            {days.map(d => (
              <div key={d} className={styles.dayHeader}>{d}</div>
            ))}
          </div>

          {/* Time slots and cells */}
          {timeSlots.map((time, i) => (
            <div key={`row-${i}`} className={styles.row}>
              <div className={styles.timeCell}>
                <div className={styles.timePrimary}>{time}</div>
                <div className={styles.timeSecondary}>{parseInt(time) + 1}:{time.includes('30') ? '00' : '59'}</div>
              </div>
              {days.map(d => (
                <div key={`${d}-${i}`} className={styles.cell}>
                  {blocks.filter(b => b.day === d && b.time).map(b => {
                    const [start, end] = b.time.split('-')
                    return (
                      <div 
                        key={`${b.id}-${d}`} 
                        className={styles.block}
                        style={{
                          background: b.conflict ? '#d4e8f7' : '#c8e6c9',
                          border: b.conflict ? '2px solid #ff6b6b' : '1px solid #81c784',
                          minHeight: getBlockHeight(start, end) + 'px'
                        }}
                      >
                        <div className={styles.blockCode}>{b.code}</div>
                        <div className={styles.blockTitle}>{b.title}</div>
                        <div className={styles.blockTime}>{b.time}</div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
