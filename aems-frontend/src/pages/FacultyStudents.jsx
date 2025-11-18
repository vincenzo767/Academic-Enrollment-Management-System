import React from 'react'

export default function FacultyStudents(){
  const rows = [
    {name:'John Doe', email:'john.doe@university.edu', enrolled:2, status:'Active'},
    {name:'Jane Smith', email:'jane.smith@university.edu', enrolled:5, status:'Active'},
    {name:'Mike Johnson', email:'mike.johnson@university.edu', enrolled:1, status:'Active'},
  ]

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Courses</div>
          <div style={{fontSize:32,fontWeight:700}}>24</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Active Students</div>
          <div style={{fontSize:32,fontWeight:700}}>249</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Total Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>1,024</div>
        </div>
        <div style={{background:'#eee',padding:16,borderRadius:8}}>
          <div>Capacity Used</div>
          <div style={{fontSize:32,fontWeight:700}}>84%</div>
        </div>
      </div>

      <div style={{margin:'16px 0'}}>
        <input placeholder="Search students.." style={{width:'100%',padding:12,border:'1px solid #ccc',borderRadius:8}} />
      </div>

      <div style={{background:'#f5f5f5',borderRadius:12,padding:16}}>
        <h3>Student Records</h3>
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
            {rows.map((r, idx)=> (
              <tr key={idx}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.enrolled}</td>
                <td style={{color:'green'}}>{r.status}</td>
                <td>
                  <button style={{marginRight:8}}>✏️</button>
                  <button>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
