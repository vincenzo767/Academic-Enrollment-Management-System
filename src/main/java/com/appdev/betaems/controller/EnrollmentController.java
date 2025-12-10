package com.appdev.betaems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.appdev.betaems.entity.Enrollment;
import com.appdev.betaems.service.EnrollmentService;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @PostMapping
    public Enrollment create(@RequestBody Enrollment enrollment) {
        return enrollmentService.createEnrollment(enrollment);
    }

    @PutMapping("/{id}")
    public Enrollment update(@PathVariable Long id, @RequestBody Enrollment enrollment) {
        return enrollmentService.updateEnrollment(id, enrollment);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }

    @GetMapping("/{id}")
    public Enrollment getById(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @GetMapping
    public List<Enrollment> getAll() {
        return enrollmentService.getAllEnrollments();
    }

    /**
     * Get enrollments for a specific student
     * Optional query param: status (e.g., "enrolled", "pending", "dropped")
     */
    @GetMapping("/student/{studentId}")
    public List<Enrollment> getByStudent(@PathVariable Long studentId, @RequestParam(required = false) String status) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
        
        if (status != null && !status.isEmpty()) {
            enrollments = enrollments.stream()
                    .filter(e -> (e.getStatus() != null && e.getStatus().toLowerCase().equals(status.toLowerCase())))
                    .collect(Collectors.toList());
        }
        
        return enrollments;
    }

    /**
     * Get active enrollments for a student (excluding dropped and cancelled)
     */
    @GetMapping("/student/{studentId}/active")
    public List<Enrollment> getActiveByStudent(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
        return enrollments.stream()
                .filter(e -> {
                    String status = (e.getStatus() != null ? e.getStatus().toLowerCase() : "");
                    return !status.equals("dropped") && !status.equals("cancelled");
                })
                .collect(Collectors.toList());
    }

    /**
     * Clean up duplicate enrollments - keeps only the most recent enrollment per student-course combination
     */
    @PostMapping("/cleanup-duplicates")
    public Map<String, Object> cleanupDuplicates() {
        Map<String, Object> result = new HashMap<>();
        List<Enrollment> allEnrollments = enrollmentService.getAllEnrollments();
        
        // Group by studentId-courseId combination
        Map<String, List<Enrollment>> groupedByStudentCourse = new java.util.HashMap<>();
        for (Enrollment e : allEnrollments) {
            String key = e.getStudentId() + "-" + e.getCourseId();
            groupedByStudentCourse.computeIfAbsent(key, k -> new java.util.ArrayList<>()).add(e);
        }
        
        // Find and delete duplicates, keeping the most recent (latest enrollmentId or enrollmentDate)
        int deletedCount = 0;
        for (List<Enrollment> group : groupedByStudentCourse.values()) {
            if (group.size() > 1) {
                // Sort by enrollmentId descending to keep the latest one
                group.sort((a, b) -> Long.compare(b.getEnrollmentId(), a.getEnrollmentId()));
                // Delete all except the first (most recent)
                for (int i = 1; i < group.size(); i++) {
                    enrollmentService.deleteEnrollment(group.get(i).getEnrollmentId());
                    deletedCount++;
                }
            }
        }
        
        result.put("success", true);
        result.put("message", "Cleanup complete");
        result.put("duplicatesRemoved", deletedCount);
        return result;
    }
}
