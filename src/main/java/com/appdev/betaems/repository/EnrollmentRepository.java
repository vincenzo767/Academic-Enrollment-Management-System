package com.appdev.betaems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.betaems.entity.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    // Count total enrollments for a specific course
    long countByCourseId(Long courseId);
    
    // Find all enrollments for a course
    List<Enrollment> findByCourseId(Long courseId);
    
    // Find enrollments for a specific student
    List<Enrollment> findByStudentId(Long studentId);
    
    // Check if a student is already enrolled in a course
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
