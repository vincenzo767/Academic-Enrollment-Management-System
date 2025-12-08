# User-Specific Data Persistence System - Quick Start

## What Was Implemented

A complete **client-side data persistence system** that:

✅ Stores user-specific data in browser localStorage  
✅ Prevents data sharing between users (even on same device)  
✅ Automatically restores data after page refresh  
✅ Syncs data across multiple browser tabs  
✅ Gracefully handles storage unavailability (private mode)  
✅ Provides visual notifications for persistence events  
✅ Includes comprehensive error handling  

## Files Created/Modified

### Core Utilities
- **`src/utils/StorageManager.js`** - Main class for storage operations
- **`src/utils/usePersistentState.js`** - React hook for persistent state
- **`src/utils/storageNotifications.js`** - User notifications for storage events

### Documentation
- **`src/utils/PERSISTENCE_DOCUMENTATION.md`** - Complete technical reference
- **`INTEGRATION_GUIDE.md`** - Step-by-step integration instructions
- **`src/utils/StorageManager.test.js`** - Unit and integration tests

### Examples
- **`src/pages/PersistentFormExample.jsx`** - Working example component

### Updated Files
- **`src/state/AppContext.jsx`** - Integrated persistence for user data

## Quick Usage Examples

### Example 1: Use Persistent State Hook

```jsx
import { usePersistentState } from '../utils/usePersistentState'

function MyComponent() {
  const [searchQuery, setSearchQuery, isLoaded] = usePersistentState('search', '')

  if (!isLoaded) return <div>Loading...</div>

  return (
    <input 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search (auto-saves)..."
    />
  )
}
```

### Example 2: Use Direct Storage Manager

```jsx
import { storageManager } from '../utils/StorageManager'
import { useApp } from '../state/AppContext'

function MyComponent() {
  const { role, studentProfile } = useApp()

  const saveData = () => {
    storageManager.save('myData', { value: 'test' })
  }

  const loadData = () => {
    const data = storageManager.get('myData')
  }

  return (
    <div>
      <button onClick={saveData}>Save</button>
      <button onClick={loadData}>Load</button>
    </div>
  )
}
```

### Example 3: Logout

```jsx
import { useApp } from '../state/AppContext'
import { useNavigate } from 'react-router-dom'

function ProfileMenu() {
  const { logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout() // Clears all user data
    navigate('/login')
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

## What Gets Persisted by Default

- ✅ `reservedIds` - Courses student has reserved
- ✅ `enrolledIds` - Courses student is enrolled in
- ✅ `department` - Selected department filter
- ✅ Student profile information (name, email, etc.)

## Data Isolation

All storage keys include the user's ID:
```
user_[studentId]_[dataKey]

Examples:
- user_12345_enrolledIds
- user_12345_reservedIds
- user_12345_department
```

This ensures:
- User A's data is completely separate from User B's data
- Even if they log in from the same browser/device
- Switching users automatically loads their previous session
- Logging out clears all user data

## Testing the Feature

### Manual Testing

1. **Login and enroll in courses**
   ```
   1. Log in as Student A
   2. Enroll in 2-3 courses
   3. Refresh the page
   ✓ Courses should still be enrolled
   ```

2. **Switch users**
   ```
   1. Log out from Student A
   2. Log in as Student B
   3. Student B should see empty enrollment (or their own)
   4. Log in as Student A again
   ✓ Student A's courses should be restored
   ```

3. **Multi-tab sync**
   ```
   1. Open app in 2 tabs, both logged in as Student A
   2. In Tab 1: Enroll in a course
   3. Check Tab 2
   ✓ Tab 2 should automatically update
   ```

4. **Private browsing**
   ```
   1. Enable private mode
   2. Perform actions
   ✓ Should see warning "Storage unavailable"
   ✓ App should still work normally
   ```

### DevTools Inspection

1. Open DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Look for keys like: `user_[ID]_*`
4. Click a key to view the stored value (JSON format)

### Console Testing

```javascript
// Check if storage is available
console.log(storageManager.isAvailable)

// Get current user ID
console.log(storageManager.getCurrentUser())

// See all stored keys
console.log(storageManager.getAllKeys())

// View all user data
storageManager.debugLog()

// Check storage size
console.log(storageManager.getUsageSize() + ' characters')
```

## Configuration

### Change Storage Type

By default uses `localStorage` (survives browser close). To use `sessionStorage` instead (clears when tab closes):

In `src/utils/StorageManager.js` line ~13:
```javascript
// Change:
this.storageType = 'localStorage'
// To:
this.storageType = 'sessionStorage'
```

### Disable Notifications

In `src/utils/storageNotifications.js`:
```javascript
export function showStorageNotification(appContext, message, type = 'info') {
  // return  // Uncomment to disable
  // ... rest of function
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Data not persisting | Check student ID is set: `storageManager.getCurrentUser()` |
| Data not restoring | Ensure `isLoaded` is true before rendering |
| Storage full | Clear old data or use `getUsageSize()` to check |
| Private mode warning | This is expected - app still works without persistence |
| Users seeing same data | Verify each has unique student ID |
| Data persists after logout | Ensure `logout()` is called, not just `setRole(null)` |

## API Reference

### StorageManager Methods

```javascript
import { storageManager } from '../utils/StorageManager'

// User Management
storageManager.setCurrentUser(userId)
storageManager.getCurrentUser()

// CRUD Operations
storageManager.save(key, data)
storageManager.get(key, defaultValue)
storageManager.has(key)
storageManager.remove(key)

// User Data
storageManager.clearUserData()
storageManager.getAllKeys()

// Monitoring
storageManager.getUsageSize()
storageManager.debugLog()

// Events
storageManager.onDataChange(key, callback)
```

### usePersistentState Hook

```javascript
import { usePersistentState } from '../utils/usePersistentState'

const [value, setValue, isLoaded] = usePersistentState(dataKey, defaultValue)

// value: Current stored value
// setValue: Update function (auto-persists)
// isLoaded: Boolean, true after data is restored
```

### Context Methods

```javascript
import { useApp } from '../state/AppContext'

const {
  logout,                // Clear user data and reset state
  storageAvailable,      // Is storage available?
  getStorageDebugInfo    // Get debug information
} = useApp()
```

## Best Practices

✅ **DO:**
- Check `isLoaded` before rendering persistent state data
- Use `usePersistentState` for component-level persistence
- Call `logout()` to clear data when user signs out
- Store non-sensitive UI state (filters, selections, form progress)

❌ **DON'T:**
- Store passwords or tokens in localStorage
- Store PII (unless non-sensitive)
- Assume storage is always available
- Use synchronously stored IDs as authentication

## Architecture Diagram

```
User Login
    ↓
setRole('student')
    ↓
setStudentProfile(data with studentId)
    ↓
storageManager.setCurrentUser(studentId)
    ↓
AppContext loads previous user data from storage
    ↓
UI renders with restored state
    ↓
User actions → setState → auto-save to storage
    ↓
Page refresh → reload from storage → UI restored
    ↓
User logout → storageManager.clearUserData() → state reset
```

## Next Steps

1. ✅ Review `INTEGRATION_GUIDE.md` for step-by-step setup
2. ✅ Check `PERSISTENCE_DOCUMENTATION.md` for detailed reference
3. ✅ Run example component: `src/pages/PersistentFormExample.jsx`
4. ✅ Run tests: `npm test StorageManager.test.js`
5. ✅ Integrate into your pages (BrowseCourses, Payments, Schedule, etc.)
6. ✅ Test with multiple users and scenarios
7. ✅ Monitor console for any errors

## Support

- 📖 Full documentation: `src/utils/PERSISTENCE_DOCUMENTATION.md`
- 🔧 Integration guide: `INTEGRATION_GUIDE.md`
- 💡 Working example: `src/pages/PersistentFormExample.jsx`
- ✅ Tests: `src/utils/StorageManager.test.js`

For issues or questions, check the documentation files or review the test file for implementation examples.
