# User-Specific Data Persistence System

## Overview

This implementation provides **user-isolated, secure client-side data persistence** that maintains user actions and states across page refreshes. Each user's data is stored separately, preventing data leakage between accounts on shared devices.

## Architecture

### Core Components

#### 1. **StorageManager** (`src/utils/StorageManager.js`)
The main class handling all storage operations with security safeguards.

**Key Features:**
- User-ID-based key generation (`user_{userId}_{dataKey}`)
- Automatic fallback for unavailable storage (private browsing mode)
- JSON serialization/deserialization with error handling
- Multi-tab synchronization via event listeners
- Storage availability detection
- Data usage tracking

**Usage:**
```javascript
import { storageManager } from '../utils/StorageManager'

// Set current user (called after login)
storageManager.setCurrentUser(userId)

// Save data
storageManager.save('myData', { key: 'value' })

// Retrieve data
const data = storageManager.get('myData', defaultValue)

// Clear all user data (on logout)
storageManager.clearUserData()

// Debug information
storageManager.debugLog()
```

#### 2. **usePersistentState Hook** (`src/utils/usePersistentState.js`)
React hook for simplified persistent state management.

**Usage:**
```javascript
import { usePersistentState } from '../utils/usePersistentState'

const [value, setValue, isLoaded] = usePersistentState('dataKey', defaultValue)

// Automatically persists to storage whenever value changes
// Automatically restores on mount
// Syncs across tabs
```

#### 3. **AppContext Integration** (`src/state/AppContext.jsx`)
The application context now manages user-specific data persistence.

**Integrated Persistence:**
- `reservedIds` - Student's reserved courses
- `enrolledIds` - Student's enrolled courses
- `department` - Selected department filter
- Automatic restoration on login
- Automatic clearing on logout

**Context Values:**
```javascript
const {
  // ... existing context values
  logout,              // Clear user data and reset state
  storageAvailable,    // Boolean indicating if storage is available
  getStorageDebugInfo  // Function to get storage debug info
} = useApp()
```

### Notification System

Display user-friendly messages about storage operations:

```javascript
import {
  notifyDataRestored,
  notifyDataSaved,
  notifyDataCleared,
  notifyStorageUnavailable
} from '../utils/storageNotifications'
```

## Implementation Details

### User Data Isolation

All storage keys include the user ID to prevent data sharing:

```
Format: user_{userId}_{dataKey}

Example for User 12345:
- user_12345_reservedIds
- user_12345_enrolledIds
- user_12345_department
- user_12345_courseNotes
```

### Data Lifecycle

#### Login
1. User logs in with credentials
2. `setRole('student')` is called
3. Student profile is loaded with `studentId`
4. `storageManager.setCurrentUser(studentId)` initializes storage for this user
5. Previous user's data is automatically loaded from storage
6. Notification shows "Your previous session data has been restored"

#### During Session
1. User performs actions (enrolling, reserving courses, changing filters)
2. State changes trigger automatic saves to storage
3. Changes sync across all open tabs/windows in real-time

#### Page Refresh
1. User refreshes the page or navigates back
2. AppContext's `useEffect` restores all user data from storage
3. UI automatically reflects the previous state
4. Notification shows "Your previous session data has been restored"

#### Logout
1. User clicks logout
2. `logout()` function is called
3. `storageManager.clearUserData()` removes all user-specific keys
4. All user state is reset to defaults
5. Notification shows "Session data cleared"

#### Switch Accounts
1. User logs out from Account A
2. All Account A data is cleared
3. User logs in to Account B
4. `storageManager.setCurrentUser(accountBId)`
5. Only Account B's previously saved data is loaded
6. **Account A's data remains safely stored and inaccessible**

### Multi-Tab Synchronization

The system uses browser storage events to keep multiple tabs in sync:

```javascript
// Listener registered automatically
window.addEventListener('storage', (event) => {
  // Event fires when storage changes in another tab
  // Current tab's state is updated automatically
})
```

### Error Handling & Graceful Degradation

The system handles various failure scenarios:

**Storage Unavailable** (Private Browsing Mode)
- Detection: `storageManager.isAvailable`
- Behavior: No persistence, app continues normally
- Notification: "Storage is not available. Changes will not persist."
- Fallback: Session continues, just without persistence

**JSON Parsing Errors**
- Corrupted data is skipped
- Default value is used instead
- Error is logged to console

**Storage Quota Exceeded**
- Additional saves fail silently
- App continues operating normally
- Existing data remains intact

## Usage Examples

### Example 1: Using usePersistentState in a Component

```jsx
import { usePersistentState } from '../utils/usePersistentState'

function MyCourses() {
  const [selectedFilter, setSelectedFilter, isLoaded] = usePersistentState(
    'coursesFilter',
    'all'
  )

  if (!isLoaded) return <div>Loading...</div>

  return (
    <div>
      <select 
        value={selectedFilter} 
        onChange={(e) => setSelectedFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="enrolled">Enrolled</option>
        <option value="reserved">Reserved</option>
      </select>
    </div>
  )
}
```

### Example 2: Persisting Form Data

```jsx
function EnrollmentForm() {
  const [formData, setFormData, isLoaded] = usePersistentState(
    'enrollmentForm',
    {
      program: '',
      courses: [],
      schedule: 'flexible'
    }
  )

  if (!isLoaded) return <div>Loading...</div>

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form>
      <select 
        value={formData.program}
        onChange={(e) => handleChange('program', e.target.value)}
      >
        {/* options */}
      </select>
      {/* more form fields */}
    </form>
  )
}
```

### Example 3: Manual Storage Management

```jsx
import { storageManager } from '../utils/StorageManager'

function MyComponent() {
  const userId = storageManager.getCurrentUser()
  
  const saveState = () => {
    storageManager.save('myData', { timestamp: Date.now() })
  }

  const loadState = () => {
    const data = storageManager.get('myData')
    console.log('Loaded:', data)
  }

  const clearAllData = () => {
    storageManager.clearUserData()
  }

  return (
    <div>
      <button onClick={saveState}>Save</button>
      <button onClick={loadState}>Load</button>
      <button onClick={clearAllData}>Clear All</button>
    </div>
  )
}
```

### Example 4: Debug Information

```jsx
import { useApp } from '../state/AppContext'

function StorageDebug() {
  const { getStorageDebugInfo } = useApp()

  return (
    <pre>
      {JSON.stringify(getStorageDebugInfo(), null, 2)}
    </pre>
  )
}
```

## Security Considerations

### What is Stored
✓ User-specific UI state (filters, selections, form inputs)
✓ Non-sensitive user preferences
✓ Application progress states

### What is NOT Stored
✗ Passwords (never sent to client storage)
✗ Authentication tokens (store in httpOnly cookies instead)
✗ Credit card information
✗ Personal identification numbers
✗ Medical or financial information

### Data Isolation

**Per-User Isolation:**
- Each user's data uses their `studentId` as key prefix
- Cross-user access requires knowing the exact student ID
- Even on shared devices, users' data remains separate

**No Cross-Tab Leakage:**
- Storage changes are only broadcasted, not accessible directly
- Each tab maintains its own context
- Logout from one tab doesn't affect others until their next action

**Browser Storage Limits:**
- Typically 5-10MB per origin
- Quoted size tracking via `getUsageSize()`
- System manages gracefully when limits are reached

## Testing & Validation

### Manual Testing Steps

1. **Test User Login & Data Restoration:**
   ```
   - Log in as Student A
   - Enroll in 2 courses, reserve 1 course
   - Refresh page
   ✓ Verify data is restored
   ```

2. **Test Cross-Account Isolation:**
   ```
   - Log in as Student A, perform actions
   - Log out
   - Log in as Student B
   ✓ Verify Student A's data is not visible
   - Log out
   - Log in as Student A again
   ✓ Verify Student A's data is still there
   ```

3. **Test Multi-Tab Sync:**
   ```
   - Open two tabs, both logged in as Student A
   - In Tab 1: Enroll in a course
   ✓ Verify Tab 2 reflects the change instantly
   ```

4. **Test Storage Unavailable:**
   ```
   - Enable private browsing mode
   - Perform actions
   ✓ Verify warning message appears
   ✓ Verify app continues to function
   - Disable private mode
   ✓ Verify normal storage resumes
   ```

5. **Test Data Clearing on Logout:**
   ```
   - Log in, perform actions
   - Log out
   - Check DevTools > Application > Local Storage
   ✓ Verify user_[ID]_* keys are removed
   ```

### Browser Compatibility

| Browser | localStorage | sessionStorage | Multi-Tab Sync |
|---------|--------------|----------------|----------------|
| Chrome  | ✓            | ✓              | ✓              |
| Firefox | ✓            | ✓              | ✓              |
| Safari  | ✓            | ✓              | ✓              |
| Edge    | ✓            | ✓              | ✓              |
| IE 11   | ✓ (legacy)   | ✓ (legacy)     | ✓ (legacy)     |

### DevTools Inspection

To verify data is being stored correctly:

1. Open DevTools (F12)
2. Navigate to **Application** tab
3. Select **Local Storage** → [Your Domain]
4. Look for keys matching: `user_[studentId]_*`
5. Click on a key to view its value (pretty-printed JSON)

Example:
```
Key: user_12345_enrolledIds
Value: [1001, 1002, 1003]

Key: user_12345_reservedIds  
Value: [2001]

Key: user_12345_department
Value: "Computer Science"
```

## Configuration

### Change Storage Type (localStorage vs sessionStorage)

```javascript
// In src/utils/StorageManager.js, line ~13:
// Change from:
this.storageType = 'localStorage'
// To:
this.storageType = 'sessionStorage'
```

**sessionStorage** - Data clears when browser tab/window closes
**localStorage** - Data persists even after browser closes

### Disable Notifications

```javascript
// In src/utils/storageNotifications.js, modify functions:
export function showStorageNotification(appContext, message, type = 'info') {
  // return early to disable
  if (true) return
  // ... rest of function
}
```

## Troubleshooting

### Data Not Persisting

**Problem:** Data is lost after refresh
**Solutions:**
1. Check if user ID is set: `storageManager.getCurrentUser()`
2. Verify storage is available: `storageManager.isAvailable`
3. Check browser's private mode is off
4. Check storage quota: `storageManager.getUsageSize()`
5. Open DevTools and check for error messages

### Data Not Restoring

**Problem:** Data is stored but not loading on refresh
**Solutions:**
1. Verify `isLoaded` state in components using persistent state
2. Check component is rendering after data loads
3. Check for JSON parsing errors in console
4. Verify student ID is the same before/after refresh

### Multiple Users Sharing Data

**Problem:** User B sees User A's data
**Solutions:**
1. Verify logout clears all data properly
2. Check `storageManager.getCurrentUser()` returns correct ID
3. Manually clear storage: Open DevTools → Application → Local Storage → Delete all user_* keys
4. Verify login sets student ID correctly

### Storage Quota Exceeded

**Problem:** New data won't save
**Solutions:**
1. Clear old sessions: Logout and log back in
2. Remove old browser cache
3. Reduce stored data size
4. Check `storageManager.getUsageSize()` for current usage
5. Implement data cleanup strategy for old records

## API Reference

### StorageManager Class

```javascript
// Initialization
storageManager.setCurrentUser(userId)

// CRUD Operations
storageManager.save(key, data)           // Save data
storageManager.get(key, defaultValue)    // Retrieve data
storageManager.remove(key)               // Delete specific key
storageManager.has(key)                  // Check if key exists

// User Data Management
storageManager.clearUserData()           // Clear all user's data
storageManager.getAllKeys()              // Get all user's keys

// Events & Monitoring
storageManager.onDataChange(key, callback)  // Subscribe to changes
storageManager.debugLog()                // Log all user data
storageManager.getUsageSize()            // Get storage usage in chars

// Status
storageManager.isAvailable               // Boolean
storageManager.getCurrentUser()          // Get current user ID
```

### usePersistentState Hook

```javascript
const [value, setValue, isLoaded] = usePersistentState(dataKey, initialValue)

// value: Current stored value
// setValue: Update function (same as useState)
// isLoaded: Boolean indicating if data has been restored
```

### Context Methods

```javascript
const { logout, storageAvailable, getStorageDebugInfo } = useApp()

logout()                    // Clear user data and logout
storageAvailable            // Boolean
getStorageDebugInfo()      // Returns { isAvailable, currentUserId, usageSize, keys }
```

## Future Enhancements

Potential improvements for future versions:

1. **Server Sync**: Optional backend sync for critical data
2. **Data Encryption**: Client-side encryption for sensitive data
3. **Compression**: Compress stored data to reduce quota usage
4. **Versioning**: Handle data schema migrations
5. **Conflict Resolution**: Smart merging for multi-device sync
6. **Selective Persistence**: Tag data for different persistence strategies
7. **Analytics**: Track user patterns for improved UX
8. **Offline Mode**: Enhanced offline support with service workers

## Support & Contact

For issues or questions about the persistence system:

1. Check the Troubleshooting section above
2. Review console errors (F12 → Console)
3. Run `storageManager.debugLog()` to inspect current state
4. Check GitHub issues: [Project Repository]
5. Contact development team for assistance
