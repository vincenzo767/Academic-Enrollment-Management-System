import React, { useState } from 'react'
import { useApp } from '../state/AppContext.js'

export default function Notifications(){
  const { notifications = [], markAsRead, markAllRead } = useApp()
  const [open, setOpen] = useState(false)

  const unread = notifications.filter(n=> !n.read)

  return (
    <div style={{position:'fixed', right:16, top:16, zIndex:9999, fontFamily:'sans-serif'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:'#0b5fff', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer'}} title="Notifications">
        🔔 {unread.length > 0 && <span style={{background:'#ff3b30', color:'#fff', padding:'2px 6px', borderRadius:12, marginLeft:8}}>{unread.length}</span>}
      </button>

      {open && (
        <div style={{width:360, maxHeight:420, overflowY:'auto', background:'#fff', boxShadow:'0 6px 20px rgba(0,0,0,0.12)', marginTop:8, borderRadius:8}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:12, borderBottom:'1px solid #eee'}}>
            <strong>Notifications</strong>
            <div>
              <button onClick={()=>{markAllRead();}} style={{marginRight:8}} className="btn-outline-small">Mark all read</button>
              <button onClick={()=>setOpen(false)} className="btn-outline-small">Close</button>
            </div>
          </div>
          <div>
            {notifications.length === 0 && <div style={{padding:12, color:'#666'}}>No notifications</div>}
            {notifications.map(n => (
              <div key={n.id} style={{padding:12, borderBottom:'1px solid #f4f4f4', background: n.read ? '#fff' : '#eef6ff'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontSize:13, fontWeight: n.read ? 500 : 700}}>{n.text}</div>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <div style={{fontSize:11, color:'#888'}}>{new Date(n.timestamp).toLocaleTimeString()}</div>
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
