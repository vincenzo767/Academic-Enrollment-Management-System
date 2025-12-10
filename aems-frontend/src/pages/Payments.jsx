import React, { useEffect, useState } from 'react'
import styles from '../styles/payments.module.css'
import { useApp } from '../state/AppContext.js'

export default function Payments(){
  const { billing, payments, loadPayments, studentProfile, createPayment, deletePayment } = useApp()
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    amount: '',
    paymentMethod: 'credit_card',
    description: ''
  })

  useEffect(() => {
    const fetchPayments = async () => {
      const studentId = studentProfile?.studentId || studentProfile?.schoolId
      if (studentId) {
        setLoading(true)
        await loadPayments(studentId)
        setLoading(false)
      }
    }
    fetchPayments()
  }, [studentProfile])

  // Calculate payment summary from actual data
  const paymentSummary = React.useMemo(() => {
    const paidPayments = payments.filter(p => p.status === 'completed' || p.status === 'paid')
    const pendingPayments = payments.filter(p => p.status === 'pending')
    const paidThisYear = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    
    return {
      paidThisYear,
      upcoming: pendingPayments.length,
      capacity: billing.units > 0 ? Math.min(100, Math.round((billing.units / 21) * 100)) : 0
    }
  }, [payments, billing])

  const handleCreatePayment = async (e) => {
    e.preventDefault()
    const studentId = studentProfile?.studentId || studentProfile?.schoolId
    if (!studentId) {
      alert('Student ID not found')
      return
    }

    try {
      await createPayment({
        studentId,
        amount: parseFloat(newPayment.amount),
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: newPayment.paymentMethod,
        status: 'pending',
        description: newPayment.description || `Payment for enrolled courses`
      })
      setNewPayment({ amount: '', paymentMethod: 'credit_card', description: '' })
      setShowPaymentForm(false)
      alert('Payment created successfully!')
    } catch (error) {
      alert('Failed to create payment: ' + error.message)
    }
  }

  const handleCancelPayment = async (paymentId, paymentDescription) => {
    if (!window.confirm(`Are you sure you want to cancel this payment: ${paymentDescription || 'Payment'}?`)) {
      return
    }

    try {
      await deletePayment(paymentId)
      alert('Payment cancelled successfully!')
    } catch (error) {
      alert('Failed to cancel payment: ' + error.message)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.summary}>
        <div>
          <div className={styles.kpiLabel}>Total Due (selected)</div>
          <div className={styles.kpiValue}>${billing.total.toLocaleString()}</div>
          <div className={styles.kpiSub}>{billing.units} units selected • ${billing.perUnit}/unit</div>
        </div>
        <div>
          <div className={styles.kpiLabel}>Paid this year</div>
          <div className={styles.kpiValue}>${paymentSummary.paidThisYear.toLocaleString()}</div>
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

      <div className={styles.headerRow}>
        <h3 className={styles.sectionTitle}>Payment History</h3>
        <button 
          className={styles.addButton}
          onClick={() => setShowPaymentForm(!showPaymentForm)}
        >
          {showPaymentForm ? 'Cancel' : '+ New Payment'}
        </button>
      </div>

      {showPaymentForm && (
        <form className={styles.paymentForm} onSubmit={handleCreatePayment}>
          <div className={styles.formGroup}>
            <label>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
              placeholder="0.00"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Payment Method</label>
            <select
              value={newPayment.paymentMethod}
              onChange={(e) => setNewPayment({...newPayment, paymentMethod: e.target.value})}
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <input
              type="text"
              value={newPayment.description}
              onChange={(e) => setNewPayment({...newPayment, description: e.target.value})}
              placeholder="Payment description"
            />
          </div>
          <button type="submit" className={styles.submitButton}>Create Payment</button>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>Loading payments...</div>
      ) : (
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.head}`}>
            <div>Description</div>
            <div>Amount</div>
            <div>Payment Date</div>
            <div>Method</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {payments.length === 0 ? (
            <div className={styles.emptyState}>No payment records found</div>
          ) : (
            payments.map(p => (
              <div key={p.paymentId} className={styles.row}>
                <div>{p.description || 'Payment'}</div>
                <div>${Number(p.amount || 0).toFixed(2)}</div>
                <div>{p.paymentDate || 'N/A'}</div>
                <div>{p.paymentMethod?.replace('_', ' ') || 'N/A'}</div>
                <div><span className={`${styles.status} ${styles[p.status]}`}>{p.status}</span></div>
                <div>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => handleCancelPayment(p.paymentId, p.description)}
                    title="Cancel/Delete payment"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
