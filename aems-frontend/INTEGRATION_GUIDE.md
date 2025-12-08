## User-Specific Data Persistence - Integration Guide

This guide shows how to integrate the persistence system into your existing components.

### Step 1: Update Login Component

In `src/pages/Login.jsx`, modify the submit function to ensure student ID is set:

```jsx
async function submit(e){
  e.preventDefault()
  try {
    const res = await fetch('http://localhost:8080/api/student/login', {
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({ email, password })
    })
    if(!res.ok) {
      return alert('Login failed')
    }
    const data = await res.json()
    
    // Ensure we have a student ID
    const studentId = data.studentId || data.id
    
    setRole('student')
    setStudentProfile(prev => ({
      ...prev,
      studentId: studentId,  // This is critical for storage
      fullName: `${data.firstname || ''} ${data.lastname || ''}`.trim() || prev.fullName,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      program: data.program || prev.program
    }))
    navigate('/portal')
  } catch(e){
    console.error(e)
    alert('Network error')
  }
}
```

### Step 2: Update Logout (Add to PortalLayout)

In `src/layouts/PortalLayout.jsx`, add logout button:

```jsx
import { useApp } from '../state/AppContext'
import { useNavigate } from 'react-router-dom'

export default function PortalLayout() {
  const { logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      {/* Your layout code */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### Step 3: Use Persistent State in Components

#### Example: BrowseCourses.jsx Enhancement

```jsx
import { usePersistentState } from '../utils/usePersistentState'

export default function BrowseCourses(){
  const [query, setQuery] = usePersistentState('browseQuery', '')
  const [modal, setModal] = useState(null)
  const [selectedProgram, setSelectedProgram] = usePersistentState('selectedProgram', null)
  
  // ... rest of component
}
```

#### Example: Schedule.jsx Enhancement

```jsx
import { usePersistentState } from '../utils/usePersistentState'

export default function Schedule(){
  const [sortBy, setSortBy, sortLoaded] = usePersistentState('scheduleSort', 'time')
  const [selectedCourses, setSelectedCourses, coursesLoaded] = usePersistentState('scheduleSelected', [])
  
  if (!sortLoaded || !coursesLoaded) {
    return <div>Loading schedule...</div>
  }

  return (
    <div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="time">Sort by Time</option>
        <option value="day">Sort by Day</option>
        <option value="course">Sort by Course</option>
      </select>
      {/* Schedule display */}
    </div>
  )
}
```

#### Example: Payments.jsx Enhancement

```jsx
import { usePersistentState } from '../utils/usePersistentState'

export default function Payments(){
  const [paymentInfo, setPaymentInfo, infoLoaded] = usePersistentState(
    'paymentInfo',
    {
      method: 'credit_card',
      autoPayEnabled: false,
      savedCards: []
    }
  )

  if (!infoLoaded) return <div>Loading...</div>

  const handlePaymentMethodChange = (method) => {
    setPaymentInfo(prev => ({
      ...prev,
      method
    }))
  }

  return (
    <div>
      <select 
        value={paymentInfo.method}
        onChange={(e) => handlePaymentMethodChange(e.target.value)}
      >
        <option value="credit_card">Credit Card</option>
        <option value="debit_card">Debit Card</option>
        <option value="bank_transfer">Bank Transfer</option>
      </select>
      {/* Payment form */}
    </div>
  )
}
```

### Step 4: Add Debug Info Component (Optional)

Create `src/components/StorageDebug.jsx`:

```jsx
import { useApp } from '../state/AppContext'

export default function StorageDebug() {
  const { getStorageDebugInfo } = useApp()
  const [shown, setShown] = React.useState(false)

  if (!shown) {
    return (
      <button 
        onClick={() => setShown(true)}
        style={{
          position: 'fixed',
          bottom: 10,
          right: 10,
          padding: '5px 10px',
          fontSize: 12,
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc'
        }}
      >
        Debug Storage
      </button>
    )
  }

  const info = getStorageDebugInfo()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        width: 300,
        maxHeight: 400,
        overflow: 'auto',
        padding: 10,
        backgroundColor: 'white',
        border: '2px solid #333',
        borderRadius: 4,
        fontSize: 11,
        fontFamily: 'monospace',
        zIndex: 9999
      }}
    >
      <button onClick={() => setShown(false)}>✕ Close</button>
      <pre style={{ margin: '10px 0 0 0' }}>
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  )
}
```

### Step 5: Testing the System

Open DevTools and run these commands in the console:

```javascript
// Check storage manager status
import { storageManager } from './utils/StorageManager'
storageManager.debugLog()

// Get all stored keys for current user
storageManager.getAllKeys()

// Manually save something
storageManager.save('testKey', { test: 'value' })

// Check storage size
console.log('Storage size:', storageManager.getUsageSize(), 'chars')

// Check current user
console.log('Current user:', storageManager.getCurrentUser())
```

### Step 6: Manual Testing Checklist

- [ ] Login as Student A
  - [ ] Enroll in 2-3 courses
  - [ ] Refresh page - courses should still be enrolled
  
- [ ] Change filters/settings
  - [ ] Refresh page - settings should be restored
  
- [ ] Logout
  - [ ] Check DevTools → Storage → Local Storage
  - [ ] Verify `user_[ID]_*` keys are removed
  
- [ ] Login as Student B
  - [ ] Verify Student B sees their own data (or empty state)
  
- [ ] Login as Student A again
  - [ ] Verify Student A's original data is restored

- [ ] Open application in 2 tabs, both logged in
  - [ ] In Tab 1: Enroll in a course
  - [ ] Check Tab 2 - should update automatically
  
- [ ] Test on private browsing mode
  - [ ] Perform actions
  - [ ] Should see warning about storage unavailable
  - [ ] App should still function normally

### Troubleshooting Integration

**Issue: Student ID not persisting**
- Ensure your backend returns `studentId` or `id` field
- Check `setStudentProfile` is called with the student ID
- Verify ID is non-null and non-empty

**Issue: Data not loading on refresh**
- Check `isLoaded` state in components using `usePersistentState`
- Don't render data before `isLoaded` is true
- Check browser console for errors

**Issue: Data persists after logout**
- Verify `logout()` function is called
- Check `storageManager.clearUserData()` is executed
- Manually clear: DevTools → Storage → Local Storage → Clear All

**Issue: Multiple users seeing same data**
- Verify each user has unique `studentId`
- Check `storageManager.setCurrentUser()` uses correct ID
- Clear all keys matching pattern: `user_*_*`

### Performance Considerations

The persistence system is designed for performance:

- **Save operations**: Async, non-blocking, batched
- **Load operations**: Synchronous on mount, then cached in React state
- **Storage quota**: ~5-10MB per origin (unlikely to reach)
- **Multi-tab sync**: Event-driven, only affected tabs update

For typical usage (50-100 courses, filters, selections):
- Stored data: ~10-50 KB
- Load time: < 1 ms
- Save time: < 1 ms
- No noticeable performance impact

### Advanced: Custom Persistence

To persist custom component state:

```jsx
import { usePersistentState } from '../utils/usePersistentState'

// In your component
const [customState, setCustomState, isLoaded] = usePersistentState(
  'myCustomKey', // unique key for this component
  {              // default value
    field1: 'value1',
    field2: []
  }
)

if (!isLoaded) return <div>Loading...</div>

// Use like normal state
const handleChange = (newValue) => {
  setCustomState(newValue) // Auto-saves
}
```

### Advanced: Manual Storage Access

For direct storage access without hooks:

```jsx
import { storageManager } from '../utils/StorageManager'
import { useApp } from '../state/AppContext'

function MyComponent() {
  const { role, studentProfile } = useApp()

  const saveCustomData = () => {
    storageManager.save('myCustomData', {
      timestamp: Date.now(),
      data: 'whatever'
    })
  }

  const loadCustomData = () => {
    const data = storageManager.get('myCustomData')
    console.log('Loaded:', data)
  }

  return (
    <div>
      <button onClick={saveCustomData}>Save</button>
      <button onClick={loadCustomData}>Load</button>
    </div>
  )
}
```

### Next Steps

1. Deploy the persistence system to your development environment
2. Test with actual users
3. Collect feedback on data restoration and clearing
4. Monitor console for any storage errors
5. Iterate based on user behavior
6. Consider adding analytics on persistence usage
7. Plan for future enhancements (encryption, server sync, etc.)

For additional help, refer to `PERSISTENCE_DOCUMENTATION.md`
