import React, { useState, useEffect } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

export default function FacultyReports(){
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    capacityUsed: 0,
    avgEnrollmentPerStudent: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('enrollment')
  const [selectedSemester, setSelectedSemester] = useState('All')
  const [chartData, setChartData] = useState({
    enrollment: null,
    demographics: null,
    capacity: null,
    program: null
  })

  const semesters = ['All', '1st Semester', '2nd Semester', 'Summer']

  // Fetch real-time statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const url = selectedSemester === 'All' 
          ? 'http://localhost:8080/api/statistics/faculty'
          : `http://localhost:8080/api/statistics/faculty?semester=${encodeURIComponent(selectedSemester)}`
        const res = await fetch(url)
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
  }, [selectedSemester])

  // Fetch chart data when tab changes
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let endpoint = ''
        switch(activeTab) {
          case 'enrollment':
            endpoint = 'enrollment-trends'
            break
          case 'demographics':
            endpoint = 'student-demographics'
            break
          case 'capacity':
            endpoint = 'course-capacity'
            break
          case 'program':
            endpoint = 'program-statistics'
            break
          default:
            return
        }
        
        const url = selectedSemester === 'All'
          ? `http://localhost:8080/api/statistics/${endpoint}`
          : `http://localhost:8080/api/statistics/${endpoint}?semester=${encodeURIComponent(selectedSemester)}`
        
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setChartData(prev => ({ ...prev, [activeTab]: data }))
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      }
    }
    
    fetchChartData()
    // Refresh chart data every 30 seconds
    const interval = setInterval(fetchChartData, 30000)
    return () => clearInterval(interval)
  }, [activeTab, selectedSemester])

  const card = (title) => (
    <div style={{background:'var(--card)',border:'1px dashed var(--border)',borderRadius:12,padding:24,minHeight:120,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,letterSpacing:1,color:'var(--text)'}}>
      {title}
    </div>
  )

  const renderChart = () => {
    switch(activeTab) {
      case 'enrollment':
        if (!chartData.enrollment) return <div style={{padding:24,textAlign:'center'}}>Loading...</div>
        return (
          <div>
            <h4 style={{marginBottom:16}}>Enrollment Trends Over Time</h4>
            <div style={{maxWidth:800,margin:'0 auto'}}>
              <Line 
                data={{
                  labels: chartData.enrollment.labels,
                  datasets: [{
                    label: 'Total Enrollments',
                    data: chartData.enrollment.data,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  }
                }}
              />
            </div>
          </div>
        )
      
      case 'demographics':
        if (!chartData.demographics) return <div style={{padding:24,textAlign:'center'}}>Loading...</div>
        return (
          <div>
            <h4 style={{marginBottom:16}}>Student Distribution by Program</h4>
            <div style={{maxWidth:500,margin:'0 auto'}}>
              <Doughnut 
                data={{
                  labels: chartData.demographics.labels,
                  datasets: [{
                    label: 'Students',
                    data: chartData.demographics.data,
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.7)',
                      'rgba(54, 162, 235, 0.7)',
                      'rgba(255, 206, 86, 0.7)',
                      'rgba(75, 192, 192, 0.7)',
                      'rgba(153, 102, 255, 0.7)',
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 1.5,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            </div>
          </div>
        )
      
      case 'capacity':
        if (!chartData.capacity) return <div style={{padding:24,textAlign:'center'}}>Loading...</div>
        return (
          <div>
            <h4 style={{marginBottom:16}}>Course Capacity vs Enrollment</h4>
            <div style={{maxWidth:800,margin:'0 auto'}}>
              <Bar 
                data={{
                  labels: chartData.capacity.labels,
                  datasets: [
                    {
                      label: 'Total Capacity',
                      data: chartData.capacity.capacity,
                      backgroundColor: 'rgba(54, 162, 235, 0.7)'
                    },
                    {
                      label: 'Enrolled',
                      data: chartData.capacity.enrolled,
                      backgroundColor: 'rgba(255, 99, 132, 0.7)'
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>
        )
      
      case 'program':
        if (!chartData.program) return <div style={{padding:24,textAlign:'center'}}>Loading...</div>
        return (
          <div>
            <h4 style={{marginBottom:16}}>Enrollment by Program</h4>
            <div style={{maxWidth:800,margin:'0 auto'}}>
              <Bar 
                data={{
                  labels: chartData.program.labels,
                  datasets: [{
                    label: 'Enrollments',
                    data: chartData.program.data,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  aspectRatio: 2,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: { beginAtZero: true }
                  }
                }}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div>
      {/* Statistics Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:16,borderRadius:8,color:'var(--text)'}}>
          <div style={{color:'var(--text-secondary)'}}>Total Courses</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.totalCourses}
          </div>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:16,borderRadius:8,color:'var(--text)'}}>
          <div style={{color:'var(--text-secondary)'}}>Active Students</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.activeStudents}
          </div>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:16,borderRadius:8,color:'var(--text)'}}>
          <div style={{color:'var(--text-secondary)'}}>Total Enrollments</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : statistics.totalEnrollments.toLocaleString()}
          </div>
        </div>
        <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:16,borderRadius:8,color:'var(--text)'}}>
          <div style={{color:'var(--text-secondary)'}}>Capacity Used</div>
          <div style={{fontSize:32,fontWeight:700}}>
            {loading ? '...' : `${statistics.capacityUsed}%`}
          </div>
        </div>
      </div>

      {/* Semester Filter */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h3 style={{margin:0,color:'var(--text)'}}>Analytics & Reports</h3>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label style={{fontWeight:600,color:'var(--text)'}}>Semester:</label>
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
      
      {/* Tab Navigation */}
      <div style={{display:'flex',gap:8,marginBottom:16,borderBottom:'2px solid var(--border)'}}>
        <button 
          onClick={() => setActiveTab('enrollment')}
          style={{
            padding:'12px 24px',
            background: activeTab === 'enrollment' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'enrollment' ? '#fff' : 'var(--text-secondary)',
            border:'none',
            borderBottom: activeTab === 'enrollment' ? `3px solid var(--accent)` : 'none',
            cursor:'pointer',
            fontWeight:600,
            transition:'all 0.2s'
          }}
        >
          Enrollment Trends
        </button>
        <button 
          onClick={() => setActiveTab('demographics')}
          style={{
            padding:'12px 24px',
            background: activeTab === 'demographics' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'demographics' ? '#fff' : 'var(--text-secondary)',
            border:'none',
            borderBottom: activeTab === 'demographics' ? `3px solid var(--accent)` : 'none',
            cursor:'pointer',
            fontWeight:600,
            transition:'all 0.2s'
          }}
        >
          Student Demographics
        </button>
        <button 
          onClick={() => setActiveTab('capacity')}
          style={{
            padding:'12px 24px',
            background: activeTab === 'capacity' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'capacity' ? '#fff' : 'var(--text-secondary)',
            border:'none',
            borderBottom: activeTab === 'capacity' ? `3px solid var(--accent)` : 'none',
            cursor:'pointer',
            fontWeight:600,
            transition:'all 0.2s'
          }}
        >
          Course Capacity Report
        </button>
        <button 
          onClick={() => setActiveTab('program')}
          style={{
            padding:'12px 24px',
            background: activeTab === 'program' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'program' ? '#fff' : 'var(--text-secondary)',
            border:'none',
            borderBottom: activeTab === 'program' ? `3px solid var(--accent)` : 'none',
            cursor:'pointer',
            fontWeight:600,
            transition:'all 0.2s'
          }}
        >
          Program Statistics
        </button>
      </div>

      {/* Chart Display Area */}
      <div style={{background:'var(--card)',borderRadius:12,padding:24,minHeight:400,border:'1px solid var(--border)',color:'var(--text)'}}>
        {renderChart()}
      </div>
    </div>
  )
}

