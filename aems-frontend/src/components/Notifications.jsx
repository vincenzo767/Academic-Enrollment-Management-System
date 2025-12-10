import React, { useState } from 'react'
import { useApp } from '../state/AppContext.js'

const STUDENT_NOTIFICATIONS_KEY = 'aems:studentNotifications'
const FACULTY_NOTIFICATIONS_KEY = 'aems:facultyNotifications'

export default function Notifications(){
  const { notifications = [], markAsRead, markAllRead, role } = useApp()
  const [open, setOpen] = useState(false)

  // Get portal-specific notifications from localStorage
  const getPortalNotifications = () => {
    if (role === 'student') {
      try {
        const stored = localStorage.getItem(STUDENT_NOTIFICATIONS_KEY)
        return stored ? JSON.parse(stored) : []
      } catch (e) {
        console.error('Failed to load student notifications:', e)
        return []
      }
    } else if (role === 'faculty') {
      try {
        const stored = localStorage.getItem(FACULTY_NOTIFICATIONS_KEY)
        return stored ? JSON.parse(stored) : []
      } catch (e) {
        console.error('Failed to load faculty notifications:', e)
        return []
      }
    }
    return []
  }

  // Use portal-specific notifications from localStorage, with memory state as fallback
  const portalNotifications = getPortalNotifications()
  const visible = portalNotifications.length > 0 ? portalNotifications : notifications.filter(n => !n.role || n.role === 'all' || (role && n.role === role))
  const unread = visible.filter(n=> !n.read)

  return (
    <div style={{position:'fixed', right:16, top:16, zIndex:9999, fontFamily:'sans-serif'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:'var(--accent-2)', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer'}} title="Notifications">
        🔔 {unread.length > 0 && <span style={{background:'var(--danger)', color:'#fff', padding:'2px 6px', borderRadius:12, marginLeft:8}}>{unread.length}</span>}
      </button>

      {open && (
        <div style={{width:360, maxHeight:420, overflowY:'auto', background:'var(--card)', boxShadow:'0 6px 20px var(--shadow)', marginTop:8, borderRadius:8}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:12, borderBottom:'1px solid var(--border)'}}>
            <strong style={{color:'var(--text)'}}>Notifications</strong>
            <div>
              <button onClick={()=>{markAllRead();}} style={{marginRight:8}} className="btn-outline-small">Mark all read</button>
              <button onClick={()=>setOpen(false)} className="btn-outline-small">Close</button>
            </div>
          </div>
          <div>
            {visible.length === 0 && <div style={{padding:12, color:'var(--text-secondary)'}}>No notifications</div>}
            {visible.map(n => (
              <div key={n.id} style={{padding:12, borderBottom:'1px solid var(--border)', background: n.read ? 'var(--card)' : 'var(--bg)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontSize:13, fontWeight: n.read ? 500 : 700, color:'var(--text)'}}>{n.text}</div>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <div style={{fontSize:11, color:'var(--text-secondary)'}}>{new Date(n.timestamp).toLocaleTimeString()}</div>
                    {!n.read && <button onClick={()=>markAsRead(n.id)} className="btn-outline-small">Mark as read</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
