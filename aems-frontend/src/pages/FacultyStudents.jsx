import React, { useEffect, useMemo, useState } from 'react'

export default function FacultyStudents(){
  const [students, setStudents] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [error, setError] = useState(null)

  // fetch function extracted so we can retry from UI
  const fetchData = async (signal) => {
    setLoading(true)
    setError(null)
    try {
      // use relative endpoints so the app works when backend proxy or same-origin is configured
      const [sres, eres, cres] = await Promise.all([
        fetch('/api/student', { signal }),
        fetch('/api/enrollments', { signal }),
        fetch('/api/courses', { signal })
      ])

      if (!sres.ok || !eres.ok || !cres.ok) {
        const msg = `Fetch failed: ${sres.status}/${eres.status}/${cres.status}`
        throw new Error(msg)
      }

      const [sdata, edata, cdata] = await Promise.all([sres.json(), eres.json(), cres.json()])
      setStudents(Array.isArray(sdata) ? sdata : [])
      setEnrollments(Array.isArray(edata) ? edata : [])
      setCourses(Array.isArray(cdata) ? cdata : [])
    } catch (e) {
      // If fetch was aborted due to navigation or cleanup, do not treat as an error
      if (e && (e.name === 'AbortError' || (e.message && e.message.toLowerCase().includes('aborted')))) {
        console.debug('Fetch aborted, ignoring:', e.message || e)
        return
      }
      // surface other errors to UI so the user (or developer) knows why there are no records
      console.error('Could not load students/enrollments/courses', e)
      setError(e.message || 'Failed to load student records')
      setStudents([])
      setEnrollments([])
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    const controller = new AbortController()
    fetchData(controller.signal)
    return () => controller.abort()
  },[])

  // compute per-student enrollment counts and recent actions (with course names)
  const studentRows = useMemo(()=>{
    const courseMap = new Map()
    courses.forEach(c => {
      courseMap.set(c.courseId, c.title || c.name || `Course ${c.courseId}`)
    })

    const map = new Map()
    students.forEach(s => {
      const sid = String(s.studentId)
      map.set(sid, { student: s, enrolledCount: 0, actions: [] })
    })

    // accumulate enrollments
    enrollments.forEach(e => {
      const sid = String(e.studentId)
      const entry = map.get(sid) || { student: { studentId: e.studentId }, enrolledCount: 0, actions: [] }
      if(e.status && e.status.toLowerCase() === 'enrolled') entry.enrolledCount = (entry.enrolledCount || 0) + 1
      // record action with course name resolved
      entry.actions = entry.actions || []
      const courseName = courseMap.get(e.courseId) || `Course ${e.courseId}`
      entry.actions.push({ type: e.status || 'unknown', courseId: e.courseId, courseName, date: e.enrollmentDate })
      map.set(sid, entry)
    })

    const rows = []
    map.forEach((v,k) => rows.push({ student: v.student, enrolledCount: v.enrolledCount || 0, actions: (v.actions||[]).sort((a,b)=> new Date(b.date) - new Date(a.date)) }))
    return rows
  },[students,enrollments,courses])

  const filtered = studentRows.filter(r => {
    if(!query) return true
    const q = query.toLowerCase()
    const name = ((r.student.firstname || '') + ' ' + (r.student.lastname || '')).toString().toLowerCase()
    const email = (r.student.email || '').toString().toLowerCase()
    return name.includes(q) || email.includes(q) || String(r.student.studentId || '').includes(q)
  })

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Courses</div>
          <div style={{fontSize:32,fontWeight:700}}>{/* could fetch */}—</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Active Students</div>
          <div style={{fontSize:32,fontWeight:700}}>{students.length}</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>{enrollments.length}</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Students With Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>{studentRows.filter(r=>r.enrolledCount>0).length}</div>
        </div>
      </div>

      <div style={{margin:'16px 0'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search students.." style={{width:'100%',padding:12,border:'1px solid #ccc',borderRadius:8}} />
      </div>

      <div style={{background:'#f5f5f5',borderRadius:12,padding:16}}>
        <h3>Student Records</h3>
        {loading ? (
          <div>Loading students…</div>
        ) : error ? (
          <div style={{padding:16,border:'1px solid #f2dede',background:'#fff6f6',borderRadius:8}}>
            <div style={{color:'#a94442',fontWeight:600,marginBottom:8}}>Failed to load student records</div>
            <div style={{color:'#666',marginBottom:12}}>{error}</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>fetchData()}>Retry</button>
              <button onClick={()=>window.location.reload()}>Reload page</button>
            </div>
          </div>
        ) : (
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Enrolled Courses</th>
              <th align="left">Recent Actions</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx)=> (
              <tr key={idx}>
                <td>{(r.student.firstname || '') + ' ' + (r.student.lastname || '')}</td>
                <td>{r.student.email || '-'}</td>
                <td>{r.enrolledCount}</td>
                <td>
                  {r.actions && r.actions.length > 0 ? (
                    <div style={{display:'flex',flexDirection:'column'}}>
                      {r.actions.slice(0,3).map((a,i)=> (
                        <div key={i} style={{fontSize:12,color:'#333'}}>{a.type} — {a.courseName} — {a.date}</div>
                      ))}
                      {r.actions.length > 3 && <div style={{fontSize:12,color:'#666'}}>+{r.actions.length-3} more</div>}
                    </div>
                  ) : (
                    <div style={{color:'#999'}}>No recent actions</div>
                  )}
                </td>
                <td>
                  <button onClick={()=>setSelectedStudent(r)} style={{marginRight:8}}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Modal / Drawer for detail view */}
      {selectedStudent && (
        <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setSelectedStudent(null)}>
          <div style={{background:'white',padding:20,borderRadius:8,minWidth:520}} onClick={(e)=>e.stopPropagation()}>
            <h3>{(selectedStudent.student.firstname || '') + ' ' + (selectedStudent.student.lastname || '')}</h3>
            <p><strong>Student ID:</strong> {selectedStudent.student.studentId}</p>
            <p><strong>Email:</strong> {selectedStudent.student.email || '-'}</p>
            <p><strong>Enrolled Courses:</strong> {selectedStudent.enrolledCount}</p>
            <h4>Recent Actions</h4>
            <div style={{maxHeight:240,overflow:'auto'}}>
              {selectedStudent.actions && selectedStudent.actions.length > 0 ? (
                selectedStudent.actions.map((a,i)=> (
                  <div key={i} style={{padding:8,borderBottom:'1px solid #eee'}}>
                    <div style={{fontSize:14}}><strong>{a.type}</strong> — {a.courseName}</div>
                    <div style={{fontSize:12,color:'#666'}}>{a.date}</div>
                  </div>
                ))
              ) : (
                <div style={{color:'#666'}}>No recorded actions for this student.</div>
              )}
            </div>
            <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
              <button onClick={()=>setSelectedStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
