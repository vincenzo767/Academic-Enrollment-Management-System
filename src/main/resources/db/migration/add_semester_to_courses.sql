-- Add semester column to courses table if it doesn't exist
ALTER TABLE courses ADD COLUMN IF NOT EXISTS semester VARCHAR(50);

-- Update existing courses with semester values
-- This is a sample update - adjust based on your actual data distribution
UPDATE courses 
SET semester = CASE 
    WHEN MOD(course_id, 3) = 0 THEN '1st Semester'
    WHEN MOD(course_id, 3) = 1 THEN '2nd Semester'
    ELSE 'Summer'
END
WHERE semester IS NULL;

-- Alternatively, you can set all courses to a default semester:
-- UPDATE courses SET semester = '1st Semester' WHERE semester IS NULL;
