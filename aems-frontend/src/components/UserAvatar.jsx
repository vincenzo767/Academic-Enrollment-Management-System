import React from 'react'
import styles from '../styles/avatar.module.css'

export default function UserAvatar({name, id}){
  const initials = name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.meta}>
        <div className={styles.name}>{name}</div>
        <div className={styles.id}>{id}</div>
      </div>
    </div>
  )
}
