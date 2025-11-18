import React from 'react'

export default function FacultyReports(){
  const card = (title) => (
    <div style={{background:'#fff',border:'1px dashed #ccc',borderRadius:12,padding:24,minHeight:120,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,letterSpacing:1}}>
      {title}
    </div>
  )

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

      <h3>Analytics & Reports</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:16}}>
        {card('ENROLLMENT TRENDS')}
        {card('STUDENT DEMOGRAPHICS')}
        {card('COURSE CAPACITY REPORT')}
        {card('DEPARTMENT STATISTICS')}
      </div>
    </div>
  )
}
