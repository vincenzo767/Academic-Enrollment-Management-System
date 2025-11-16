import React, { useMemo, useState } from 'react'
import CourseCard from '../components/CourseCard.jsx'
import Modal from '../components/Modal.jsx'
import { courses as initialCourses } from '../state/mockData.js'
import styles from '../styles/browse.module.css'

export default function BrowseCourses(){
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState(initialCourses)
  const [modal, setModal] = useState(null) // {type: 'success'|'conflict', course}

  function enroll(course){
    if(course.conflict){
      setModal({type:'conflict', course})
    } else {
      setModal({type:'success', course})
      setCourses(prev => prev.map(c => c.id===course.id ? {...c, enrolled:true} : c))
    }
  }

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    if(!q) return courses
    return courses.filter(c=>
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q)
    )
  },[query, courses])

  return (
    <div>
      <div className={styles.searchRow}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by course, name, code or department..." />
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
