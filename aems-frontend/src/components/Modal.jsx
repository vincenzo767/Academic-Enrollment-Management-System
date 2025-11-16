import React from 'react'
import styles from '../styles/modal.module.css'

export default function Modal({children, onClose}){
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
