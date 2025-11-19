import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { courses as initialCourses } from './mockData.js'

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
  const perUnit = 500 // fee per unit (demo)

  // helper: add structured notification
  const addNotification = ({text, type = 'info', courseId = null}) => {
    const n = { id: Date.now() + Math.floor(Math.random()*1000), text, type, courseId, timestamp: new Date().toISOString(), read: false }
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

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read:true})))
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

  const value = {courses, setCourses, department, setDepartment, departments, filteredCourses, reservedIds, toggleReserve, enrolledIds, enrollCourse, dropCourse, notifications, setNotifications, addNotification, markAsRead, markAllRead, billing}

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext)

export default AppContext
