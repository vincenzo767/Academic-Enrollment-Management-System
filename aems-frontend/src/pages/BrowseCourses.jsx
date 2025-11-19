import React, { useMemo, useState } from 'react'
import CourseCard from '../components/CourseCard.jsx'
import Modal from '../components/Modal.jsx'
import styles from '../styles/browse.module.css'
import { useApp } from '../state/AppContext.js'

export default function BrowseCourses(){
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null) // {type: 'success'|'conflict', course}
  const { filteredCourses, departments, department, setDepartment, toggleReserve, enrollCourse } = useApp()

  function enroll(course){
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
      <div className={styles.searchRow} style={{display:'flex', gap:12, alignItems:'center'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by course, name, code or department..." />
        <select value={department} onChange={e=>setDepartment(e.target.value)}>
          {departments.map(d=> <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className={styles.grid}>
        {filtered.map(c => (
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
    </div>
  )
}
