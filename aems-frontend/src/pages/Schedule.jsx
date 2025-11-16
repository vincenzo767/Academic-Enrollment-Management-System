import React from 'react'
import { scheduleBlocks } from '../state/mockData.js'
import styles from '../styles/schedule.module.css'

export default function Schedule(){
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
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
                {scheduleBlocks.filter(b=>b.day===d && b.row===i).map(b => (
                  <div key={b.id} className={styles.block} style={{background:b.color}}>
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
