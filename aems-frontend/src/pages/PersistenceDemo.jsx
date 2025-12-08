/**
 * PersistenceDemo.jsx
 * Interactive demo and testing page for the persistence system
 * 
 * Add this to your routing to test the persistence system:
 * <Route path="/demo/persistence" element={<PersistenceDemo />} />
 */

import React, { useState } from 'react'
import { useApp } from '../state/AppContext'
import { storageManager } from '../utils/StorageManager'
import styles from '../styles/demo.module.css'

export default function PersistenceDemo() {
  const { studentProfile, enrolledIds, reservedIds, logout, getStorageDebugInfo, storageAvailable } = useApp()
  const [testData, setTestData] = useState('')
  const [actionLog, setActionLog] = useState([])
  const [selectedTab, setSelectedTab] = useState('status')

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    setActionLog(prev => [
      { message, type, timestamp },
      ...prev.slice(0, 19) // Keep last 20 items
    ])
  }

  const handleTest = (action) => {
    try {
      switch (action) {
        case 'save':
          storageManager.save('testData', { value: testData, timestamp: Date.now() })
          addLog(`Saved test data: "${testData}"`, 'success')
          break

        case 'load':
          const loaded = storageManager.get('testData')
          if (loaded) {
            addLog(`Loaded test data: ${JSON.stringify(loaded)}`, 'success')
            setTestData(loaded.value || '')
          } else {
            addLog('No test data found in storage', 'warning')
          }
          break

        case 'clear':
          storageManager.remove('testData')
          setTestData('')
          addLog('Cleared test data from storage', 'success')
          break

        case 'clearAll':
          storageManager.clearUserData()
          addLog('Cleared ALL user data from storage', 'warning')
          break

        case 'debugLog':
          console.clear()
          storageManager.debugLog()
          addLog('Debug log printed to console (F12)', 'info')
          break

        default:
          addLog('Unknown action', 'error')
      }
    } catch (e) {
      addLog(`Error: ${e.message}`, 'error')
    }
  }

  const debugInfo = getStorageDebugInfo()

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <h1>🧪 Data Persistence System - Demo</h1>
        <p>Test and debug user-specific data persistence</p>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        {[
          { id: 'status', label: '📊 Status' },
          { id: 'storage', label: '💾 Storage' },
          { id: 'test', label: '🧪 Test' },
          { id: 'logs', label: '📝 Logs' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${selectedTab === tab.id ? styles.active : ''}`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {/* Status Tab */}
        {selectedTab === 'status' && (
          <section className={styles.section}>
            <h2>Current Status</h2>

            <div className={styles.statusGrid}>
              <div className={styles.statusCard}>
                <h3>User Session</h3>
                <p><strong>Student ID:</strong> {studentProfile?.studentId || 'Not set'}</p>
                <p><strong>Full Name:</strong> {studentProfile?.fullName || 'Unknown'}</p>
                <p><strong>Email:</strong> {studentProfile?.email || 'Unknown'}</p>
                <p><strong>Program:</strong> {studentProfile?.program || 'Not selected'}</p>
              </div>

              <div className={styles.statusCard}>
                <h3>Enrollment Status</h3>
                <p><strong>Enrolled Courses:</strong> {enrolledIds.length}</p>
                <p><strong>Reserved Courses:</strong> {reservedIds.length}</p>
                <p><strong>Total Selected:</strong> {enrolledIds.length + reservedIds.length}</p>
              </div>

              <div className={styles.statusCard}>
                <h3>Storage Status</h3>
                <p>
                  <strong>Available:</strong> 
                  <span style={{ color: storageAvailable ? 'green' : 'red' }}>
                    {storageAvailable ? '✓ Yes' : '✗ No'}
                  </span>
                </p>
                <p><strong>Current User ID:</strong> {storageManager.getCurrentUser() || 'None'}</p>
                <p><strong>Storage Type:</strong> localStorage</p>
              </div>
            </div>

            {!storageAvailable && (
              <div style={{
                padding: 15,
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: 4,
                marginTop: 15,
                color: '#856404'
              }}>
                ⚠️ <strong>Storage Unavailable:</strong> The browser's localStorage is not available. 
                This usually happens in private browsing mode. The app will work normally, but data 
                will not persist across page refreshes.
              </div>
            )}
          </section>
        )}

        {/* Storage Tab */}
        {selectedTab === 'storage' && (
          <section className={styles.section}>
            <h2>Storage Information</h2>

            <div className={styles.storageInfo}>
              <div className={styles.infoBlock}>
                <h3>Storage Details</h3>
                <p><strong>Is Available:</strong> {debugInfo.isAvailable ? 'Yes' : 'No'}</p>
                <p><strong>Current User ID:</strong> {debugInfo.currentUserId || 'None'}</p>
                <p><strong>Usage Size:</strong> {debugInfo.usageSize.toLocaleString()} characters</p>
                {debugInfo.usageSize > 0 && (
                  <p style={{ fontSize: 12, color: '#666' }}>
                    (~{Math.round(debugInfo.usageSize / 1024 * 10) / 10} KB)
                  </p>
                )}
              </div>

              <div className={styles.infoBlock}>
                <h3>Stored Keys ({debugInfo.keys?.length || 0})</h3>
                {debugInfo.keys && debugInfo.keys.length > 0 ? (
                  <div className={styles.keyList}>
                    {debugInfo.keys.map((key, idx) => (
                      <div key={idx} className={styles.keyItem}>
                        <code>{key}</code>
                        <button
                          onClick={() => {
                            const val = storageManager.get(key)
                            addLog(`Key "${key}": ${JSON.stringify(val).substring(0, 100)}...`, 'info')
                          }}
                          style={{ marginLeft: 10, padding: '2px 8px', fontSize: 11 }}
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666' }}>No stored keys for current user</p>
                )}
              </div>
            </div>

            <div className={styles.infoBlock}>
              <h3>Raw Storage Data</h3>
              <pre style={{
                padding: 10,
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: 4,
                overflow: 'auto',
                maxHeight: 300,
                fontSize: 12
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </section>
        )}

        {/* Test Tab */}
        {selectedTab === 'test' && (
          <section className={styles.section}>
            <h2>Test Storage Operations</h2>

            <div className={styles.testSection}>
              <h3>Manual Data Test</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                <input
                  type="text"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  placeholder="Enter test data..."
                  style={{
                    padding: 10,
                    border: '1px solid #ccc',
                    borderRadius: 4,
                    fontSize: 14
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <button onClick={() => handleTest('save')} style={{ ...buttonStyle('primary') }}>
                    💾 Save Test Data
                  </button>
                  <button onClick={() => handleTest('load')} style={{ ...buttonStyle('success') }}>
                    📂 Load Test Data
                  </button>
                  <button onClick={() => handleTest('clear')} style={{ ...buttonStyle('warning') }}>
                    🗑️ Clear Test Data
                  </button>
                  <button onClick={() => handleTest('debugLog')} style={{ ...buttonStyle('info') }}>
                    🔍 Debug Log
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.testSection}>
              <h3>All Data Operations</h3>
              <button
                onClick={() => handleTest('clearAll')}
                style={{
                  width: '100%',
                  padding: 12,
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🗑️ Clear ALL User Data
              </button>
              <p style={{ fontSize: 12, color: '#666', marginTop: 10 }}>
                ⚠️ This will remove all stored data for the current user. Cannot be undone without re-enrolling in courses.
              </p>
            </div>

            <div className={styles.testSection}>
              <h3>Account Operations</h3>
              <button
                onClick={() => {
                  logout()
                  addLog('Logout performed - clearing user data and state', 'warning')
                }}
                style={{
                  width: '100%',
                  padding: 12,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                👤 Logout
              </button>
            </div>
          </section>
        )}

        {/* Logs Tab */}
        {selectedTab === 'logs' && (
          <section className={styles.section}>
            <h2>Action Log</h2>
            <button
              onClick={() => setActionLog([])}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e9ecef',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                marginBottom: 15
              }}
            >
              Clear Log
            </button>

            <div className={styles.logList}>
              {actionLog.length > 0 ? (
                actionLog.map((log, idx) => (
                  <div key={idx} className={`${styles.logItem} ${styles[`log-${log.type}`]}`}>
                    <span className={styles.timestamp}>{log.timestamp}</span>
                    <span className={styles.message}>{log.message}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>
                  No actions logged yet. Try the Test tab!
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function buttonStyle(variant) {
  const variants = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    success: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    warning: {
      backgroundColor: '#ffc107',
      color: 'black'
    },
    info: {
      backgroundColor: '#17a2b8',
      color: 'white'
    }
  }

  return {
    padding: 10,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    ...variants[variant]
  }
}
