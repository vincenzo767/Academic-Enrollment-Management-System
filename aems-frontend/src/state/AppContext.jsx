import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { courses as initialCourses } from './mockData.js'
import axiosInstance from '../api/axiosInstance.js'
import { storageManager } from '../utils/StorageManager.js'
import { notifyDataRestored, notifyDataCleared, notifyStorageUnavailable } from '../utils/storageNotifications.js'

const AppContext = createContext(null)

const DAY_MAP = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', Th: 'Thursday', F: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }

function parseDays(daysPart){
  if(!daysPart) return []
  daysPart = daysPart.trim()
  if(daysPart.toLowerCase().startsWith('sat')) return ['Saturday']
  if(daysPart.toLowerCase().startsWith('sun')) return ['Sunday']
  if(daysPart === 'TTh' || daysPart === 'T/Th' || daysPart === 'T-TH') return ['Tuesday','Thursday']
  // handle MWF, MW, etc.
  const tokens = []
  // detect 'Th' first
  if(daysPart.includes('Th')){
    let tmp = daysPart.replace(/Th/g,'-Th-')
    tmp.split('-').forEach(t=>{ if(t) tokens.push(t) })
  } else {
    // split each char
    for(const ch of daysPart){ tokens.push(ch) }
  }
  return tokens.map(t=> DAY_MAP[t] || t)
}

function parseTimeRange(timePart){
  if(!timePart) return null
  const [start,end] = timePart.split('-').map(s=>s.trim())
  const toMin = s => {
    const m = s.match(/(\d+):(\d+)/)
    if(!m) return 0
    return parseInt(m[1],10)*60 + parseInt(m[2],10)
  }
  return {start: toMin(start), end: toMin(end)}
}

export function AppProvider({children}){
  const [courses, setCourses] = useState(initialCourses)
  const [department, setDepartment] = useState('All')
  const [reservedIds, setReservedIds] = useState([])
  const [enrolledIds, setEnrolledIds] = useState([])
  const [notifications, setNotifications] = useState([])
  // role can be 'student' | 'faculty' | 'admin' | null
  const [role, setRole] = useState(null)
  const [storageAvailable, setStorageAvailable] = useState(storageManager.isAvailable)
  const perUnit = 500 // fee per unit (demo)
  
  // Student profile state
  const loadProfile = () => {
    try {
      const raw = localStorage.getItem('studentProfile')
      if(raw) return JSON.parse(raw)
    } catch(e) { /* ignore */ }
    return {
      fullName: 'John Michael Dien Doe',
      schoolId: '20-2000-200',
      email: 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      yearLevel: '3rd Year',
      semester: '3rd Semester',
      program: '',
      enrollmentStatus: 'Active',
      profilePicture: null, // base64 or URL
      joinDate: '2021-06-15'
    }
  }

  const [studentProfile, setStudentProfile] = useState(loadProfile)
  const [dataRestored, setDataRestored] = useState(false) // flag to show restoration notification only once

  // Initialize storage manager with current user ID when role is set
  useEffect(() => {
    if (role === 'student' && studentProfile && studentProfile.studentId) {
      try {
        storageManager.setCurrentUser(studentProfile.studentId)
        
        // Check if storage is available
        if (!storageManager.isAvailable) {
          setStorageAvailable(false)
        }
      } catch (e) {
        console.error('Failed to initialize StorageManager:', e)
      }
    }
  }, [role, studentProfile?.studentId])

  // Restore user-specific data from storage on mount (only once per user)
  useEffect(() => {
    if (role === 'student' && storageManager.getCurrentUser() && !dataRestored) {
      try {
        // Restore reserved and enrolled courses
        const storedReserved = storageManager.get('reservedIds', [])
        const storedEnrolled = storageManager.get('enrolledIds', [])
        const storedDepartment = storageManager.get('department', 'All')
        
        if (storedReserved.length > 0) {
          setReservedIds(storedReserved)
        }
        if (storedEnrolled.length > 0) {
          setEnrolledIds(storedEnrolled)
        }
        if (storedDepartment) {
          setDepartment(storedDepartment)
        }

        // Show notification only if we actually restored something
        if (storedReserved.length > 0 || storedEnrolled.length > 0) {
          const context = { addNotification: (opts) => setNotifications(prev => [{ id: Date.now(), ...opts }, ...prev]) }
          notifyDataRestored(context)
        }

        setDataRestored(true)
      } catch (e) {
        console.error('Failed to restore user data from storage:', e)
        setDataRestored(true)
      }
    }
  }, [role, dataRestored])

  // Persist enrolled/reserved IDs to storage whenever they change
  useEffect(() => {
    if (role === 'student' && storageManager.getCurrentUser()) {
      try {
        storageManager.save('reservedIds', reservedIds)
      } catch (e) {
        console.error('Failed to persist reservedIds:', e)
      }
    }
  }, [reservedIds, role])

  useEffect(() => {
    if (role === 'student' && storageManager.getCurrentUser()) {
      try {
        storageManager.save('enrolledIds', enrolledIds)
      } catch (e) {
        console.error('Failed to persist enrolledIds:', e)
      }
    }
  }, [enrolledIds, role])

  useEffect(() => {
    if (role === 'student' && storageManager.getCurrentUser()) {
      try {
        storageManager.save('department', department)
      } catch (e) {
        console.error('Failed to persist department:', e)
      }
    }
  }, [department, role])

  // persist studentProfile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('studentProfile', JSON.stringify(studentProfile))
    } catch (e) {
      console.error('Could not persist studentProfile', e)
    }
  }, [studentProfile])

  // persist studentProfile to backend when studentId exists
  useEffect(() => {
    const sid = studentProfile && (studentProfile.studentId || studentProfile.id)
    if (!sid) return
    const [first, ...rest] = (studentProfile.fullName || '').split(' ')
    const lastname = rest.length ? rest.join(' ') : ''
    const payload = {
      firstname: first || null,
      lastname: lastname || null,
      email: studentProfile.email || null,
      phone: studentProfile.phone || null,
      program: studentProfile.program || null
    }
    axiosInstance.put(`/student/${sid}`, payload).catch(e => console.error('Could not persist profile to server', e))
  }, [studentProfile])

  // load courses from backend and provide CRUD helpers
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/courses')
        if (!res.ok) return
        const data = await res.json()
        const mapped = data.map(c => ({
          id: c.courseId,
          code: c.courseCode || c.code || '',
          title: c.title || c.name || '',
          subtitle: c.description || '',
          units: c.credits || c.units || 0,
          instructor: c.instructorId ? String(c.instructorId) : (c.instructor || ''),
          schedule: c.schedule || '',
        }))
        setCourses(mapped)
      } catch (e) {
        console.error('Could not load courses from API', e)
      }
    }
    loadCourses()
  }, [])

  // CRUD helpers for courses
  const createCourse = async (course) => {
    // course: { courseCode, title, description, credits, instructorId }
    try {
      const res = await fetch('http://localhost:8080/api/courses', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(course)
      })
      if(!res.ok) throw new Error('Create failed')
      const created = await res.json()
      setCourses(prev => [{ id: created.courseId, code: created.courseCode, title: created.title, subtitle: created.description, units: created.credits, instructor: created.instructorId ? String(created.instructorId) : '' }, ...prev])
      return created
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const updateCourse = async (id, course) => {
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(course) })
      if(!res.ok) throw new Error('Update failed')
      const updated = await res.json()
      setCourses(prev => prev.map(c => c.id === updated.courseId ? { id: updated.courseId, code: updated.courseCode, title: updated.title, subtitle: updated.description, units: updated.credits, instructor: updated.instructorId ? String(updated.instructorId) : '' } : c))
      return updated
    } catch(e){ console.error(e); throw e }
  }

  const deleteCourseById = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/courses/${id}`, { method:'DELETE' })
      if(res.ok){ setCourses(prev => prev.filter(c => c.id !== id)) }
      else throw new Error('Delete failed')
    } catch(e){ console.error(e); throw e }
  }

  // helper: add structured notification; accepts optional `role` to scope recipients
  const addNotification = ({text, type = 'info', courseId = null, targetRole = null}) => {
    const n = { id: Date.now() + Math.floor(Math.random()*1000), text, type, courseId, timestamp: new Date().toISOString(), read: false, role: targetRole || role || 'all' }
    setNotifications(prev => [n, ...prev])
  }

  useEffect(()=>{
    // recalc conflicts whenever enroll/reserve changes
    const activeIds = [...enrolledIds, ...reservedIds]
    const activeCourses = courses.filter(c=> activeIds.includes(c.id))
    const conflicts = new Set()
    // build intervals per day
    const intervals = []
    activeCourses.forEach(c=>{
      const [daysPart, timePart] = c.schedule.split(' ',2)
      const days = parseDays(daysPart)
      const tr = parseTimeRange(timePart)
      if(!tr) return
      days.forEach(d=> intervals.push({day:d,start:tr.start,end:tr.end,id:c.id}))
    })
    for(let i=0;i<intervals.length;i++){
      for(let j=i+1;j<intervals.length;j++){
        const a = intervals[i], b = intervals[j]
        if(a.day !== b.day) continue
        if(Math.max(a.start,b.start) < Math.min(a.end,b.end)){
          conflicts.add(a.id); conflicts.add(b.id)
        }
      }
    }
    setCourses(prev => prev.map(c=> ({...c, conflict: conflicts.has(c.id)})))
  },[reservedIds,enrolledIds])

  const toggleReserve = (id) => {
    const isReserved = reservedIds.includes(id)
    setReservedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id])
    const course = courses.find(c=>c.id===id)
    if(!course) return
    if(isReserved) addNotification({text:`Reservation cancelled: ${course.code} ${course.title}`, type:'cancel', courseId:id})
    else addNotification({text:`Reserved: ${course.code} ${course.title}`, type:'reserve', courseId:id})
  }

  const enrollCourse = (id) => {
    if(!enrolledIds.includes(id)){
      setEnrolledIds(prev=>[...prev,id])
      const course = courses.find(c=>c.id===id)
      addNotification({text: `Enrolled in: ${course ? course.code + ' ' + course.title : id}`, type:'enroll', courseId:id})
    }
  }

  const dropCourse = (id) => {
    if(enrolledIds.includes(id)){
      setEnrolledIds(prev => prev.filter(x=> x !== id))
      const course = courses.find(c=>c.id===id)
      addNotification({text: `Dropped: ${course ? course.code + ' ' + course.title : id}`, type:'drop', courseId:id})
    }
  }

  const markAsRead = (nid) => {
    setNotifications(prev => prev.map(n => n.id === nid ? {...n, read:true} : n))
  }

  const markAllRead = (targetRole = null) => {
    const roleToMark = targetRole || role || 'all'
    setNotifications(prev => prev.map(n => (n.role === 'all' || n.role === roleToMark) ? {...n, read:true} : n))
  }

  const departments = useMemo(()=>{
    const set = new Set()
    courses.forEach(c=>{
      const pref = c.code.replace(/\d+/g,'')
      if(pref.startsWith('CS')) set.add('Computer Science')
      else if(pref.startsWith('IT')) set.add('Information Technology')
      else if(pref.startsWith('MATH')) set.add('Mathematics')
      else if(pref.startsWith('ENG')) set.add('English')
      else set.add(pref)
    })
    return ['All', ...Array.from(set)]
  },[courses])

  const filteredCourses = useMemo(()=>{
    if(department === 'All') return courses
    return courses.filter(c=>{
      const pref = c.code.replace(/\d+/g,'')
      if(department === 'Computer Science') return pref.startsWith('CS')
      if(department === 'Information Technology') return pref.startsWith('IT')
      if(department === 'Mathematics') return pref.startsWith('MATH')
      if(department === 'English') return pref.startsWith('ENG')
      return true
    })
  },[department,courses])

  const billing = useMemo(()=>{
    const selected = courses.filter(c=> reservedIds.includes(c.id) || enrolledIds.includes(c.id))
    const units = selected.reduce((s,c)=> s + (c.units||0), 0)
    return {units, perUnit, total: units * perUnit}
  },[courses,reservedIds,enrolledIds])

  // Logout function: clears user-specific data from storage
  const logout = () => {
    try {
      storageManager.clearUserData()
      const context = { addNotification: (opts) => setNotifications(prev => [{ id: Date.now(), ...opts }, ...prev]) }
      notifyDataCleared(context)
    } catch (e) {
      console.error('Error during logout:', e)
    }
    
    // Reset user state
    setRole(null)
    setStudentProfile(loadProfile())
    setReservedIds([])
    setEnrolledIds([])
    setDepartment('All')
    setDataRestored(false)
  }

  // Get debug info about storage
  const getStorageDebugInfo = () => {
    if (!storageManager.isAvailable) {
      return 'Storage is not available'
    }
    return {
      isAvailable: storageManager.isAvailable,
      currentUserId: storageManager.getCurrentUser(),
      usageSize: storageManager.getUsageSize(),
      keys: storageManager.getAllKeys()
    }
  }

  const value = {courses, setCourses, department, setDepartment, departments, filteredCourses, reservedIds, toggleReserve, enrolledIds, enrollCourse, dropCourse, notifications, setNotifications, addNotification, markAsRead, markAllRead, billing, role, setRole, studentProfile, setStudentProfile, logout, storageAvailable, getStorageDebugInfo}

  // expose course CRUD helpers
  value.createCourse = createCourse
  value.updateCourse = updateCourse
  value.deleteCourseById = deleteCourseById

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext)

export default AppContext
