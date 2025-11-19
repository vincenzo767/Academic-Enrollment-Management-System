import React, { useState } from 'react'
import Modal from '../components/Modal'

export default function FacultyCourses(){
  const [courses, setCourses] = useState([
    {code:'CS101',name:'Intro to CS',instructor:'Dr. Sarah Johnson',dept:'Computer Science',units:3,enroll:'5/30 17%'},
    {code:'MATH201',name:'Calculus II',instructor:'Prof. Michael Chen',dept:'Mathematics',units:4,enroll:'28/40 70%'},
    {code:'ENG102',name:'Academic Writing',instructor:'Dr. Emily Brown',dept:'English',units:3,enroll:'20/25 80%'},
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({code:'',name:'',instructor:'',dept:'',units:1,enroll:''})

  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({...course})
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (editingCourse) {
      setCourses(courses.map(c => c.code === editingCourse.code ? formData : c))
    } else {
      setCourses([...courses, formData])
    }
    setIsModalOpen(false)
    setEditingCourse(null)
    setFormData({code:'',name:'',instructor:'',dept:'',units:1,enroll:''})
  }

  const handleDelete = (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
      setCourses(courses.filter(c => c.code !== course.code))
    }
  }

  return (
    <div>
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
              <tr key={r.code}>
                <td>{r.code}</td>
                <td>{r.name}</td>
                <td>{r.instructor}</td>
                <td>{r.dept}</td>
                <td>{r.units}</td>
                <td>{r.enroll}</td>
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
              placeholder="Course Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="text"
              placeholder="Instructor"
              value={formData.instructor}
              onChange={(e) => setFormData({...formData, instructor: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.dept}
              onChange={(e) => setFormData({...formData, dept: e.target.value})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="number"
              placeholder="Units"
              value={formData.units}
              onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
              style={{padding:8,border:'1px solid #ccc',borderRadius:4}}
            />
            <input
              type="text"
              placeholder="Enrollment (e.g., 5/30 17%)"
              value={formData.enroll}
              onChange={(e) => setFormData({...formData, enroll: e.target.value})}
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
