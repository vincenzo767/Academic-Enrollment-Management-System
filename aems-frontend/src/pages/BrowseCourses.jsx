import React, { useMemo, useState, useEffect } from 'react'
import CourseCard from '../components/CourseCard.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/browse.module.css'
import { useApp } from '../state/AppContext.js'
import { programList } from '../state/mockData.js'

export default function BrowseCourses(){
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // {type: 'success'|'conflict', course}
  const [confirmProgram, setConfirmProgram] = useState(null) // program object waiting confirmation
  const [selectedProgram, setSelectedProgram] = useState(null) // chosen program after confirmation
  const [programCourses, setProgramCourses] = useState(null)
  const [lockedModal, setLockedModal] = useState(null) // {type:'needProgram'|'locked', message}

  const { filteredCourses, departments, department, setDepartment, toggleReserve, enrollCourse, courses, studentProfile, setStudentProfile, registrationSubmitted } = useApp()

  // initialize selection from persisted profile
  useEffect(()=>{
    if(studentProfile && studentProfile.program){
      const p = programList.find(x=> x.name === studentProfile.program)
      if(p){
        setSelectedProgram(p)
        const prefixes = p.prefixes || []
        const list = courses.filter(c=> prefixes.some(pf => c.code.toUpperCase().startsWith(pf)))
        setProgramCourses(list)
      }
    }
  },[studentProfile, courses])

  function enroll(course){
    // validation: check if registration is submitted
    if(registrationSubmitted){
      setLockedModal({type:'registrationLocked', message:'Your registration has been submitted. You can no longer enroll in courses.'})
      return
    }

    // validation: student must choose a program before enrolling
    if(!studentProfile || !studentProfile.program){
      setLockedModal({type:'needProgram', message:'You must choose a program first before enrolling. Go to Browse Courses to select your program.'})
      return
    }

    // ensure course belongs to student's program
    const p = programList.find(x=> x.name === studentProfile.program)
    const prefixes = p ? p.prefixes : []
    const matches = prefixes.some(pf => course.code.toUpperCase().startsWith(pf))
    if(!matches){
      setLockedModal({type:'locked', message:`This course is not part of your chosen program (${studentProfile.program}).`})
      return
    }

    if(course.conflict){
      setModal({type:'conflict', course})
    } else {
      setModal({type:'success', course})
      enrollCourse(course.id)
    }
  }

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    let list = filteredCourses
    if(q) list = list.filter(c=> c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q))
    return list
  },[query, filteredCourses])

  return (
    <div>
      {registrationSubmitted && (
        <div style={{padding: '12px 16px', marginBottom: '16px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#991b1b', fontWeight: '600', textAlign: 'center'}}>
          🔒 Your registration has been submitted. Course enrollment is locked.
        </div>
      )}
      <div className={styles.searchRow} style={{display:'flex', gap:12, alignItems:'center'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by course, name, code or department..." disabled={registrationSubmitted} />
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label style={{fontWeight:600}}>Choose Program:</label>
          <select disabled={!!(studentProfile && studentProfile.program) || registrationSubmitted} value={selectedProgram ? selectedProgram.name : (studentProfile && studentProfile.program ? studentProfile.program : 'none')} onChange={e=>{
            const val = e.target.value
            if(val === 'none'){
              setConfirmProgram(null); setSelectedProgram(null); setProgramCourses(null)
              return
            }
            const p = programList.find(x=> x.name === val)
            if(p) setConfirmProgram(p)
          }}>
            <option value="none">-- Select --</option>
            {programList.map(p=> <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className={styles.grid}>
        {(programCourses || filtered).map(c => (
          <CourseCard key={c.id} course={c} onEnroll={()=>enroll(c)} />
        ))}
      </div>

      {modal && (
        <Modal onClose={()=>setModal(null)}>
          <h3>{modal.type === 'success' ? 'You have successfully enrolled in this course!' : 'You have conflicted enrolled in this course!'}</h3>
          <p style={{marginTop:6,fontWeight:600}}>{modal.course.title}</p>
          <p style={{opacity:.7}}>{modal.course.subtitle}</p>
          <div style={{marginTop:16, textAlign:'center'}}>
            <button className="btn" onClick={()=>setModal(null)}>Continue</button>
          </div>
        </Modal>
      )}

      {lockedModal && (
        <Modal onClose={()=>setLockedModal(null)}>
          <h3>
            {lockedModal.type === 'needProgram' ? 'Choose a Program First' : 
             lockedModal.type === 'registrationLocked' ? 'Registration Locked' : 
             'Program Locked'}
          </h3>
          <p style={{marginTop:8}}>{lockedModal.message}</p>
          <div style={{marginTop:16, textAlign:'center'}}>
            <button className="btn" onClick={()=>setLockedModal(null)}>OK</button>
          </div>
        </Modal>
      )}

      {/* Confirmation modal for program selection */}
      {confirmProgram && (
        <Modal onClose={()=>setConfirmProgram(null)}>
          <h3>Confirm Program Selection</h3>
          <p style={{marginTop:8}}>Are you sure you want to choose <strong>{confirmProgram.name}</strong>?</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:16}}>
            <button className="btn" onClick={()=>{
              // confirm: filter courses by prefixes and set programCourses
              const prefixes = confirmProgram.prefixes || []
              const list = courses.filter(c=> prefixes.some(pf => c.code.toUpperCase().startsWith(pf)))
              setProgramCourses(list)
              setSelectedProgram(confirmProgram)
              // update global student profile's program and persist via AppContext
              setStudentProfile(prev => ({ ...prev, program: confirmProgram.name }))
              setConfirmProgram(null)
            }}>Yes, choose</button>
            <button className="btn btn-ghost" onClick={()=>{ setConfirmProgram(null); /* keep previous selection */ }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
