/**
 * PersistentFormExample.jsx
 * Example component demonstrating how to use the persistent state system
 * 
 * This component shows:
 * - How to use usePersistentState hook
 * - How to persist form inputs
 * - How to handle form submission with persistent data
 * - How data persists across page refreshes
 */

import React, { useState } from 'react'
import { usePersistentState } from '../utils/usePersistentState'
import { useApp } from '../state/AppContext'

export default function PersistentFormExample() {
  const { addNotification } = useApp()
  
  // Example 1: Persist form input
  const [courseNotes, setCourseNotes, notesLoaded] = usePersistentState(
    'courseNotes',
    ''
  )

  // Example 2: Persist filter preferences
  const [filterSettings, setFilterSettings, filterLoaded] = usePersistentState(
    'filterSettings',
    {
      credits: 3,
      availability: 'any',
      difficulty: 'all'
    }
  )

  // Example 3: Persist progress/wizard state
  const [wizardStep, setWizardStep, wizardLoaded] = usePersistentState(
    'enrollmentWizardStep',
    1
  )

  // Example 4: Persist multi-select choices
  const [selectedCourses, setSelectedCourses, coursesLoaded] = usePersistentState(
    'selectedCoursesForCart',
    []
  )

  const isLoaded = notesLoaded && filterLoaded && wizardLoaded && coursesLoaded

  if (!isLoaded) {
    return <div style={{ padding: 20 }}>Loading your saved data...</div>
  }

  const handleNoteChange = (e) => {
    setCourseNotes(e.target.value)
  }

  const handleFilterChange = (key, value) => {
    setFilterSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAddCourse = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId)
      } else {
        return [...prev, courseId]
      }
    })
  }

  const handleNextStep = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Persistent Form Example</h2>
      <p style={{ color: '#666' }}>
        All inputs below automatically save to your browser storage. 
        Try refreshing the page to see your data restored!
      </p>

      {/* Section 1: Text Input */}
      <section style={{ marginBottom: 30, border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
        <h3>Course Notes (Auto-saved)</h3>
        <textarea
          value={courseNotes}
          onChange={handleNoteChange}
          placeholder="Write any notes about courses here... Changes auto-save!"
          style={{
            width: '100%',
            minHeight: 100,
            padding: 10,
            fontSize: 14,
            fontFamily: 'monospace'
          }}
        />
        <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
          ✓ This textarea content persists across page refreshes
        </p>
      </section>

      {/* Section 2: Filter Settings */}
      <section style={{ marginBottom: 30, border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
        <h3>Filter Preferences (Auto-saved)</h3>
        <div style={{ display: 'grid', gap: 15 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>
              Credits: {filterSettings.credits}
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={filterSettings.credits}
              onChange={(e) => handleFilterChange('credits', parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>
              Availability
            </label>
            <select
              value={filterSettings.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              style={{ padding: 8, fontSize: 14 }}
            >
              <option value="any">Any Time</option>
              <option value="morning">Morning Only</option>
              <option value="afternoon">Afternoon Only</option>
              <option value="online">Online Only</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 5, fontWeight: 600 }}>
              Difficulty
            </label>
            <select
              value={filterSettings.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              style={{ padding: 8, fontSize: 14 }}
            >
              <option value="all">All Levels</option>
              <option value="intro">Introductory</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
          ✓ These preferences persist across page refreshes
        </p>
      </section>

      {/* Section 3: Course Selection */}
      <section style={{ marginBottom: 30, border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
        <h3>Selected Courses for Cart ({selectedCourses.length})</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {['CS101', 'CS201', 'MATH301', 'ENG101', 'IT102', 'PHYS201'].map(courseId => (
            <label
              key={courseId}
              style={{
                padding: 10,
                border: '1px solid #ccc',
                borderRadius: 4,
                cursor: 'pointer',
                backgroundColor: selectedCourses.includes(courseId) ? '#e3f2fd' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={selectedCourses.includes(courseId)}
                onChange={() => handleAddCourse(courseId)}
                style={{ marginRight: 8 }}
              />
              {courseId}
            </label>
          ))}
        </div>
        <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
          ✓ Your cart selections persist across page refreshes
        </p>
      </section>

      {/* Section 4: Wizard/Stepper */}
      <section style={{ marginBottom: 30, border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
        <h3>Enrollment Wizard (Step {wizardStep} of 5)</h3>
        <div style={{
          padding: 20,
          backgroundColor: '#f5f5f5',
          borderRadius: 4,
          marginBottom: 15,
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 18, margin: 0 }}>
            Step {wizardStep}: {
              wizardStep === 1 ? 'Select Program' :
              wizardStep === 2 ? 'Choose Courses' :
              wizardStep === 3 ? 'Review Schedule' :
              wizardStep === 4 ? 'Confirm Payment' :
              'Complete Registration'
            }
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handlePreviousStep}
            disabled={wizardStep === 1}
            style={{
              padding: '10px 20px',
              backgroundColor: wizardStep === 1 ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: wizardStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNextStep}
            disabled={wizardStep === 5}
            style={{
              padding: '10px 20px',
              backgroundColor: wizardStep === 5 ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: wizardStep === 5 ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>
        <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
          ✓ Your current step persists across page refreshes
        </p>
      </section>

      {/* Debug Info */}
      <section style={{ marginBottom: 30, border: '1px dashed #999', padding: 15, borderRadius: 8, backgroundColor: '#f9f9f9' }}>
        <h3>Current State (Debug)</h3>
        <pre style={{ fontSize: 12, overflow: 'auto', maxHeight: 200 }}>
{JSON.stringify({
  courseNotes: courseNotes.substring(0, 50) + (courseNotes.length > 50 ? '...' : ''),
  filterSettings,
  wizardStep,
  selectedCourses,
  totalSelectedCourses: selectedCourses.length
}, null, 2)}
        </pre>
      </section>

      <p style={{ 
        padding: 15, 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb',
        borderRadius: 4,
        color: '#155724'
      }}>
        <strong>ℹ Tip:</strong> Open DevTools (F12) → Application → Local Storage to see your data stored as:<br/>
        <code>user_[studentId]_courseNotes</code>, <code>user_[studentId]_filterSettings</code>, etc.
      </p>
    </div>
  )
}
