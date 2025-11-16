import React from 'react'
import { payments, paymentSummary } from '../state/mockData.js'
import styles from '../styles/payments.module.css'

export default function Payments(){
  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <div>
          <div className={styles.kpiLabel}>Total Due</div>
          <div className={styles.kpiValue}>{paymentSummary.totalDue.toLocaleString()}</div>
          <div className={styles.kpiSub}>Outstanding balance</div>
        </div>
        <div>
          <div className={styles.kpiLabel}>Paid this year</div>
          <div className={styles.kpiValue}>{paymentSummary.paidThisYear.toLocaleString()}</div>
          <div className={styles.kpiSub}>Completed payments</div>
        </div>
        <div>
          <div className={styles.kpiLabel}>Upcoming Payments</div>
          <div className={styles.kpiValue}>{paymentSummary.upcoming}</div>
          <div className={styles.kpiSub}>Pending items</div>
        </div>
        <div>
          <div className={styles.kpiLabel}>Capacity Used</div>
          <div className={styles.kpiValue}>{paymentSummary.capacity}%</div>
          <div className={styles.kpiSub}>Optimal enrollment</div>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>Payment History</h3>
      <div className={styles.table}>
        <div className={`${styles.row} ${styles.head}`}>
          <div>Description</div>
          <div>Amount</div>
          <div>Due Date</div>
          <div>Status</div>
        </div>
        {payments.map(p => (
          <div key={p.id} className={styles.row}>
            <div>{p.description}</div>
            <div>${p.amount.toFixed(2)}</div>
            <div>{p.dueDate}</div>
            <div><span className={`${styles.status} ${styles[p.status]}`}>{p.status}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
