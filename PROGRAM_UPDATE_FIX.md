# Program Update Fix - Issue & Solution

## Problem
When a student registered a new account with "Jack n Jill" and changed the program, the changes were not visible on the faculty dashboard. The program change was saved locally in the browser's localStorage, but was not being persisted to the database.

## Root Causes Identified

### 1. **Backend Partial Update Issue** (FIXED)
**Issue:** The `StudentService.updateStudent()` method was unconditionally setting all fields including `address` and `dateOfBirth`. When the frontend sent a PUT request with only `firstname`, `lastname`, `email`, `phone`, and `program` (without `address` and `dateOfBirth`), these required fields would be set to `null`, potentially causing database constraint violations or incorrect data.

**Solution:** Modified `StudentService.updateStudent()` to only update fields that are explicitly provided (non-null). This allows partial updates without overwriting existing data.

```java
// Before: Set all fields unconditionally
student.setFirstname(studentDetails.getFirstname());
student.setLastname(studentDetails.getLastname());
// ... etc (fields set to null if not provided)

// After: Only set fields that are explicitly provided
if (studentDetails.getFirstname() != null) {
    student.setFirstname(studentDetails.getFirstname());
}
if (studentDetails.getLastname() != null) {
    student.setLastname(studentDetails.getLastname());
}
// ... etc
```

### 2. **Insufficient Error Logging** (FIXED)
**Issue:** When the backend update failed silently, there was minimal logging to debug the issue.

**Solution:** Enhanced error logging in `AppContext.jsx` to provide detailed information about:
- When a profile update is being sent to the backend
- Student ID and program being updated
- Success/failure response with error details
- Any validation errors from the backend

```javascript
console.log(`[AppContext] Persisting student profile update to backend: studentId=${sid}, program=${payload.program}`)
axiosInstance.put(`/student/${sid}`, payload)
  .then(response => {
    console.log(`[AppContext] Successfully persisted profile to server for student ${sid}:`, response.data)
  })
  .catch(e => {
    console.error(`[AppContext] Failed to persist profile to server for student ${sid}:`, e.message, e.response?.data || e)
  })
```

### 3. **Faculty Dashboard Data Refresh** (ENHANCED)
**Issue:** Faculty dashboard was already polling every 5 seconds, but the FacultyStudents page did not have an explicit refresh button.

**Solution:** Added a "🔄 Refresh Data" button to the FacultyStudents page to allow manual refresh of student records without waiting for the next poll cycle.

## How the Fix Works

1. **Student Profile Update Flow:**
   - Student changes program in Dashboard → `setStudentProfile()` is called
   - `AppContext.jsx` detects the change and triggers the persistence effect
   - Creates a partial payload with only the fields being updated
   - Sends PUT request to `/api/student/{studentId}`

2. **Backend Processing:**
   - `StudentController` receives PUT request at `/api/student/{id}`
   - Calls `StudentService.updateStudent(id, studentDetails)`
   - New logic: Only updates non-null fields, preserving existing data
   - Saves updated student to database
   - Returns updated student entity in response

3. **Faculty Visibility:**
   - **FacultyDashboard:** Automatically polls `/api/student` and `/api/enrollments` every 5 seconds
   - **FacultyStudents:** Fetches and displays student data on load, with manual "Refresh Data" button
   - Faculty sees the updated program within 5 seconds or immediately after clicking refresh

## Testing the Fix

### Step 1: Register a New Student
1. Go to `/register` page
2. Fill in student details:
   - Full Name: "Jack n Jill" (or any name)
   - School ID: Any valid ID
   - Email: Any email
   - Password: Any password (6+ chars)
   - Role: Student
3. Click Register
4. Login with the new student account

### Step 2: Change Program
1. On Dashboard, click "Change Program" button
2. Select a different program from the list
3. Click "Confirm Change"
4. **Check Browser Console** (F12 → Console):
   - Should see: `[AppContext] Persisting student profile update to backend: studentId=X, program=BS in Tourism Management`
   - Should see: `[AppContext] Successfully persisted profile to server...`

### Step 3: Verify Faculty Sees Update
1. **Option A (Automatic):** Wait 5 seconds - FacultyDashboard polls automatically
2. **Option B (Manual):** Go to FacultyStudents page and click "🔄 Refresh Data" button
3. Look for the student in the enrollment requests table
4. Verify the "Program" column shows the updated program name

### Step 4: Verify Database Persistence
1. Check browser Console → Application → LocalStorage
   - `studentProfile` should show the updated program
2. Network tab should show:
   - PUT request to `/api/student/{studentId}`
   - Response: 200 OK with updated student data

## Files Modified

1. **Backend:**
   - `src/main/java/com/appdev/betaems/service/StudentService.java` - Fixed `updateStudent()` method

2. **Frontend:**
   - `aems-frontend/src/state/AppContext.jsx` - Enhanced error logging for backend persistence
   - `aems-frontend/src/pages/FacultyStudents.jsx` - Added manual refresh button

## Expected Behavior After Fix

✅ Student changes program → Saved to database  
✅ Faculty dashboard auto-refreshes (5 second poll)  
✅ Faculty sees updated program in pending enrollment requests  
✅ Changes persist across browser sessions  
✅ No more silent failures - errors logged to console  

## Troubleshooting

If changes still don't appear after 30 seconds:

1. **Check Browser Console (F12 → Console):**
   - Look for `[AppContext]` logs - they should show success or error
   - If error: Check the error message for backend validation issues

2. **Check Network Tab (F12 → Network):**
   - Filter by XHR requests
   - Look for PUT request to `/api/student/{studentId}`
   - Check response status (should be 200)

3. **Verify Backend is Running:**
   - Check if `http://localhost:8080/api/student` returns student data
   - Faculty dashboard should show some data if backend is running

4. **Clear Cache:**
   - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear localStorage if needed (F12 → Application → Storage)
