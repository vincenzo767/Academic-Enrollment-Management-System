# Semester Filtering Fix for Faculty Reports

## Problem
The semester filtering dropdown in the Faculty Reports page wasn't functioning because:
1. The `Courses` entity was missing a `semester` field
2. Enrollments weren't being associated with a semester when created
3. The database didn't have semester data for existing courses

## Changes Made

### 1. Backend Changes

#### a. Added semester field to Courses entity
**File:** `src/main/java/com/appdev/betaems/entity/Courses.java`
- Added `private String semester;` field
- Added getter and setter methods

#### b. Updated enrollment creation to include semester
**File:** `src/main/java/com/appdev/betaems/service/EnrollmentServiceImpl.java`
- Modified `enrollStudent()` method to automatically set the semester from the course
- When a student enrolls in a course, the enrollment inherits the course's semester

#### c. Enhanced statistics filtering
**File:** `src/main/java/com/appdev/betaems/controller/StatisticsController.java`
- Updated `getCourseCapacity()` endpoint to filter courses by semester
- All statistics endpoints now properly respect the semester filter parameter

### 2. Database Migration

**File:** `src/main/resources/db/migration/add_semester_to_courses.sql`
- SQL script to add the semester column to the courses table
- Sample update to populate semester values for existing courses

## How to Apply

### Step 1: Update the Database

Run the migration script to add the semester column:

```sql
-- Add semester column to courses table
ALTER TABLE courses ADD COLUMN IF NOT EXISTS semester VARCHAR(50);

-- Update existing courses with semester values (adjust based on your needs)
UPDATE courses 
SET semester = CASE 
    WHEN MOD(course_id, 3) = 0 THEN '1st Semester'
    WHEN MOD(course_id, 3) = 1 THEN '2nd Semester'
    ELSE 'Summer'
END
WHERE semester IS NULL;
```

Or set all courses to a default semester:
```sql
UPDATE courses SET semester = '1st Semester' WHERE semester IS NULL;
```

### Step 2: Restart the Backend

1. Stop the current Spring Boot application
2. Rebuild and restart:
   ```powershell
   mvn clean package
   mvn spring-boot:run
   ```

### Step 3: Test the Semester Filter

1. Navigate to the Faculty Portal: `http://localhost:5173/faculty/reports`
2. Use the semester dropdown in the top-right corner
3. Select different semesters (All, 1st Semester, 2nd Semester, Summer)
4. Verify that:
   - Statistics cards update with filtered data
   - Charts reflect the selected semester
   - Course capacity report shows only courses for that semester

## Expected Behavior

When a semester is selected:
- **Total Courses**: Shows only courses offered in that semester
- **Active Students**: Shows students enrolled in courses for that semester
- **Total Enrollments**: Shows enrollments for that semester only
- **Capacity Used**: Calculated based on courses in that semester
- **Charts**: All analytics update to reflect the selected semester

When "All" is selected:
- Shows aggregate data across all semesters
- All courses and enrollments are included in calculations

## Future Enrollments

All new enrollments will automatically:
- Inherit the semester from the course being enrolled in
- Be properly filtered when using semester selection
- Provide real-time data updates in faculty reports

## Notes

- Make sure to populate the `semester` field when creating new courses
- The semester field accepts: "1st Semester", "2nd Semester", or "Summer"
- Frontend already handles the semester dropdown and makes proper API calls
- The backend now properly filters and aggregates data based on semester
