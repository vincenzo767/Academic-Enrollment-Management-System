import React, { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { useApp } from '../state/AppContext.jsx'

export default function FacultyCourses(){
  const { courses, createCourse, updateCourse, deleteCourseById } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({ code:'', title:'', description:'', credits:3, instructorId: null })

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
    } catch(e){
      alert('Failed to save course')
    }
  }

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.title || course.name}?`)) {
      try{
        const id = course.id || course.courseId
        await deleteCourseById(id)
      } catch(e){ alert('Delete failed') }
    }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
        <button onClick={() => setIsModalOpen(true)} style={{padding:'8px 12px',background:'#28a745',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Add Course</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Courses</div>
          <div style={{fontSize:32,fontWeight:700}}>24</div>
          <div style={{color:'#777'}}>+12% from last semester</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Active Students</div>
          <div style={{fontSize:32,fontWeight:700}}>249</div>
          <div style={{color:'#777'}}>+12% from last semester</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>1,024</div>
          <div style={{color:'#777'}}>Avg. 3/5 per student</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Capacity Used</div>
          <div style={{fontSize:32,fontWeight:700}}>84%</div>
          <div style={{color:'#777'}}>Optimal enrollment</div>
        </div>
      </div>

      <div style={{margin:'16px 0'}}>
        <input placeholder="Search by course, name, code or department.." style={{width:'100%',padding:12,border:'1px solid #ccc',borderRadius:8}} />
      </div>

      <div style={{background:'#f5f5f5',borderRadius:12,padding:16}}>
        <h3>Course Management</h3>
        <table style={{width:'100%'}}>
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
          <h3>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <input
              type="text"
              placeholder="Course Code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="text"
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4,minHeight:80}}
            />
            <input
              type="text"
              placeholder="Instructor ID"
              value={formData.instructorId || ''}
              onChange={(e) => setFormData({...formData, instructorId: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="number"
              placeholder="Credits"
              value={formData.credits}
              onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <button onClick={handleSave} style={{padding:12,background:'#007bff',color:'white',border:'none',borderRadius:4,cursor:'pointer'}}>
              {editingCourse ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
