import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../state/AppContext.jsx'

export default function FacultyCourses(){
  const { courses, createCourse, updateCourse, deleteCourseById } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({ code:'', title:'', description:'', credits:3, instructorId: null })
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    capacityUsed: 0,
    avgEnrollmentPerStudent: 0
  })
  const [loading, setLoading] = useState(true)

  // Fetch real-time statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/statistics/faculty')
        if (res.ok) {
          const data = await res.json()
          setStatistics(data)
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStatistics()
    // Refresh statistics every 30 seconds
    const interval = setInterval(fetchStatistics, 30000)
    return () => clearInterval(interval)
  }, [])

  // Function to refresh statistics manually
  const refreshStatistics = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/statistics/faculty')
      if (res.ok) {
        const data = await res.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error('Failed to refresh statistics:', error)
    }
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({ code: course.code, title: course.name || course.title, description: course.subtitle || course.description || '', credits: course.units || course.credits || 3, instructorId: course.instructor || null })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try{
      if (editingCourse) {
        // editingCourse has id or code
        const id = editingCourse.id || editingCourse.courseId
        const payload = { courseCode: formData.code, title: formData.title, description: formData.description, credits: formData.credits, instructorId: formData.instructorId }
        await updateCourse(id, payload)
      } else {
        const payload = { courseCode: formData.code, title: formData.title, description: formData.description, credits: formData.credits, instructorId: formData.instructorId }
        await createCourse(payload)
      }
      setIsModalOpen(false)
      setEditingCourse(null)
      setFormData({code:'', title:'', description:'', credits:3, instructorId: null})
      // Refresh statistics after course changes
      refreshStatistics()
    } catch(e){
      alert('Failed to save course')
    }
  }

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.title || course.name}?`)) {
      try{
        const id = course.id || course.courseId
        await deleteCourseById(id)
        // Refresh statistics after deletion
        refreshStatistics()
      } catch(e){ alert('Delete failed') }
    }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
        <button onClick={() => setIsModalOpen(true)} style={{padding:'8px 12px',background:'var(--success)',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Add Course</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
          <div>Total Courses</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.totalCourses}
          </div>
          <div style={{color:'var(--text-secondary)'}}>Active courses</div>
        </div>
        <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
          <div>Active Students</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.activeStudents}
          </div>
          <div style={{color:'var(--text-secondary)'}}>Enrolled students</div>
        </div>
        <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
          <div>Total Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.totalEnrollments.toLocaleString()}
          </div>
          <div style={{color:'var(--text-secondary)'}}>            Avg. {statistics.avgEnrollmentPerStudent}/student
          </div>
        </div>
        <div style={{background:'var(--card)',padding:16,borderRadius:8,border:'1px solid var(--border)',color:'var(--text)'}}>
          <div>Capacity Used</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : `${statistics.capacityUsed}%`}
          </div>
          <div style={{color:'var(--text-secondary)'}}>
            {statistics.capacityUsed < 70 ? 'Low enrollment' : statistics.capacityUsed < 85 ? 'Optimal enrollment' : 'High enrollment'}
          </div>
        </div>
      </div>

      <div style={{margin:'16px 0'}}>
        <input placeholder="Search by course, name, code or department.." style={{width:'100%',padding:12,border:'1px solid var(--border)',borderRadius:8,background:'var(--card)',color:'var(--text)'}} />
      </div>

      <div style={{background:'var(--card)',borderRadius:12,padding:16,border:'1px solid var(--border)'}}>
        <h3 style={{color:'var(--text)'}}>Course Management</h3>
        <table style={{width:'100%',color:'var(--text)'}}>
          <thead>
            <tr>
              <th align="left">Code</th>
              <th align="left">Course Name</th>
              <th align="left">Instructor</th>
              <th align="left">Department</th>
              <th align="left">Units</th>
              <th align="left">Enrollment</th>
              <th align="left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((r)=> (
              <tr key={r.id || r.courseId}>
                <td>{r.code}</td>
                <td>{r.title}</td>
                <td>{r.instructor}</td>
                <td>{r.dept || ''}</td>
                <td>{r.units}</td>
                <td>{r.enroll || ''}</td>
                <td>
                  <button onClick={() => handleEdit(r)} style={{marginRight:8}}>✏️</button>
                  <button onClick={() => handleDelete(r)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <h3 style={{color:'var(--text)'}}>{ editingCourse ? 'Edit Course' : 'Add Course'}</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input
              type="text"
              placeholder="Course Code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              style={{padding:8,border:'1px solid var(--border)',borderRadius:4,background:'var(--card)',color:'var(--text)'}}
            />
            <input
              type="text"
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{padding:8,border:'1px solid var(--border)',borderRadius:4,background:'var(--card)',color:'var(--text)'}}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{padding:8,border:'1px solid var(--border)',borderRadius:4,minHeight:80,background:'var(--card)',color:'var(--text)'}}
            />
            <input
              type="text"
              placeholder="Instructor ID"
              value={formData.instructorId || ''}
              onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
              style={{padding:8,border:'1px solid var(--border)',borderRadius:4,background:'var(--card)',color:'var(--text)'}}
            />
            <input
              type="number"
              placeholder="Credits"
              value={formData.credits}
              onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
              style={{padding:8,border:'1px solid var(--border)',borderRadius:4,background:'var(--card)',color:'var(--text)'}}
            />
            <button onClick={handleSave} style={{padding:12,background:'var(--accent-2)',color:'white',border:'none',borderRadius:4,cursor:'pointer'}}>
              {editingCourse ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
