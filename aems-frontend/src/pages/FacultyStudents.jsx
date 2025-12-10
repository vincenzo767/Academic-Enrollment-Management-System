import React, { useEffect, useMemo, useState } from 'react'

export default function FacultyStudents(){
  const [students, setStudents] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [error, setError] = useState(null)
  const [approvedStudentIds, setApprovedStudentIds] = useState({})
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    studentsWithEnrollments: 0
  })

  const FACULTY_APPROVALS_KEY = 'aems:facultyApprovals'
  const semesters = ['All', '1st Semester', '2nd Semester', 'Summer']

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
    
    // Load approvals
    try {
      const raw = localStorage.getItem(FACULTY_APPROVALS_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      setApprovedStudentIds(parsed)
    } catch (e) {
      console.error('Failed to load approvals', e)
    }
    
    // Listen for approval events
    const onApprovalEvent = (evt) => {
      if (!evt.detail || !evt.detail.studentId) return
      const sid = String(evt.detail.studentId)
      setApprovedStudentIds(prev => ({ ...prev, [sid]: true }))
      // Refresh data to show newly approved student
      fetchData(new AbortController().signal)
    }
    
    const onStorage = (evt) => {
      if (evt.key !== FACULTY_APPROVALS_KEY) return
      try {
        const parsed = evt.newValue ? JSON.parse(evt.newValue) : {}
        setApprovedStudentIds(parsed)
        // Refresh data when approvals change in another tab
        fetchData(new AbortController().signal)
      } catch (e) {
        console.error('Failed to sync approvals', e)
      }
    }
    
    window.addEventListener('studentApproved', onApprovalEvent)
    window.addEventListener('storage', onStorage)
    
    return ()=> {
      controller.abort()
      window.removeEventListener('studentApproved', onApprovalEvent)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // Fetch statistics with semester filter
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const url = selectedSemester === 'All' 
          ? 'http://localhost:8080/api/statistics/faculty'
          : `http://localhost:8080/api/statistics/faculty?semester=${encodeURIComponent(selectedSemester)}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setStatistics({
            totalCourses: data.totalCourses || 0,
            activeStudents: data.activeStudents || 0,
            totalEnrollments: data.totalEnrollments || 0,
            studentsWithEnrollments: data.activeStudents || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      }
    }
    
    fetchStatistics()
    const interval = setInterval(fetchStatistics, 30000)
    return () => clearInterval(interval)
  }, [selectedSemester])

  // compute per-student enrollment counts with full course details
  const studentRows = useMemo(()=>{
    const courseMap = new Map()
    courses.forEach(c => {
      courseMap.set(c.courseId, { 
        id: c.courseId,
        title: c.title || c.name || `Course ${c.courseId}`,
        schedule: c.schedule || 'TBA'
      })
    })

    const map = new Map()
    students.forEach(s => {
      const sid = String(s.studentId)
      map.set(sid, { student: s, enrolledCount: 0, enrolledCourses: [] })
    })

    // accumulate enrollments
    enrollments.forEach(e => {
      const sid = String(e.studentId)
      const entry = map.get(sid) || { student: { studentId: e.studentId }, enrolledCount: 0, enrolledCourses: [] }
      // Count all enrollments that are not explicitly dropped or cancelled
      const statusLower = (e.status || '').toLowerCase()
      if(statusLower && statusLower !== 'dropped' && statusLower !== 'cancelled') {
        entry.enrolledCount = (entry.enrolledCount || 0) + 1
        const courseInfo = courseMap.get(e.courseId) || { id: e.courseId, title: `Course ${e.courseId}`, schedule: 'TBA' }
        entry.enrolledCourses.push(courseInfo)
      }
      map.set(sid, entry)
    })

    const rows = []
    map.forEach((v,k) => rows.push({ student: v.student, enrolledCount: v.enrolledCount || 0, enrolledCourses: v.enrolledCourses || [] }))
    return rows
  },[students,enrollments,courses])

  const filtered = studentRows.filter(r => {
    // Only show approved students
    if (!approvedStudentIds[String(r.student.studentId)]) return false
    
    if(!query) return true
    const q = query.toLowerCase()
    const name = ((r.student.firstname || '') + ' ' + (r.student.lastname || '')).toString().toLowerCase()
    const email = (r.student.email || '').toString().toLowerCase()
    return name.includes(q) || email.includes(q) || String(r.student.studentId || '').includes(q)
  })

  return (
    <div>
      {/* Semester Filter */}
      <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label style={{fontWeight:600}}>Semester:</label>
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={{
              padding:'8px 12px',
              borderRadius:6,
              border:'1px solid var(--border)',
              fontSize:14,
              cursor:'pointer',
              background:'var(--card)',
              color:'var(--text)'
            }}
          >
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,flex:1}}>
          <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
            <div>Total Courses</div>
            <div style={{fontSize:32,fontWeight:700}}>{statistics.totalCourses}</div>
          </div>
          <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
            <div>Active Students</div>
            <div style={{fontSize:32,fontWeight:700}}>{statistics.activeStudents}</div>
          </div>
          <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
            <div>Total Enrollments</div>
            <div style={{fontSize:32,fontWeight:700}}>{statistics.totalEnrollments}</div>
          </div>
          <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
            <div>Students With Enrollments</div>
            <div style={{fontSize:32,fontWeight:700}}>{statistics.studentsWithEnrollments}</div>
          </div>
          <button onClick={()=>fetchData(new AbortController().signal)} style={{padding:'16px',background:'var(--accent-2)',color:'white',border:'none',borderRadius:8,cursor:'pointer',fontWeight:600}}>🔄 Refresh Data</button>
        </div>
      </div>

      <div style={{margin:'16px 0'}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search students.." style={{width:'100%',padding:12,border:'1px solid var(--border)',borderRadius:8,background:'var(--card)',color:'var(--text)'}} />
      </div>

      <div style={{background:'var(--card)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
        <h3 style={{color:'var(--text)'}}>Student Records</h3>
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
              <th align="left">Status</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx)=> (
              <tr key={idx}>
                <td>{(r.student.firstname || '') + ' ' + (r.student.lastname || '')} <small style={{color:'#999'}}>(ID: {r.student.studentId})</small></td>
                <td>{r.student.email || '-'}</td>
                <td>{r.enrolledCount} {r.enrolledCount === 0 && <small style={{color:'#999'}}>(No enrollments found)</small>}</td>
                <td>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    Active
                  </span>
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
          <div style={{background:'var(--card)',color:'var(--text)',padding:20,borderRadius:8,minWidth:520,maxHeight:'80vh',overflow:'auto'}} onClick={(e)=>e.stopPropagation()}>
            <h3>{(selectedStudent.student.firstname || '') + ' ' + (selectedStudent.student.lastname || '')}</h3>
            <p><strong>Student ID:</strong> {selectedStudent.student.studentId}</p>
            <p><strong>Email:</strong> {selectedStudent.student.email || '-'}</p>
            <p><strong>Enrolled Courses:</strong> {selectedStudent.enrolledCount}</p>
            <h4>Enrolled Courses</h4>
            <div style={{maxHeight:300,overflow:'auto'}}>
              {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0 ? (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{borderBottom:'2px solid #e5e7eb'}}>
                      <th align="left" style={{padding:'8px',fontWeight:'600'}}>Course ID</th>
                      <th align="left" style={{padding:'8px',fontWeight:'600'}}>Course Name</th>
                      <th align="left" style={{padding:'8px',fontWeight:'600'}}>Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.enrolledCourses.map((course,i)=> (
                      <tr key={i} style={{borderBottom:'1px solid #e5e7eb'}}>
                        <td style={{padding:'8px',fontSize:'12px'}}>{course.id}</td>
                        <td style={{padding:'8px',fontSize:'12px'}}>{course.title}</td>
                        <td style={{padding:'8px',fontSize:'12px'}}>{course.schedule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{color:'#666',padding:'8px'}}>No enrolled courses for this student.</div>
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
