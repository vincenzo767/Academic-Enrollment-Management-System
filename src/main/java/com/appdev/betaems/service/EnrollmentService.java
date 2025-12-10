package com.appdev.betaems.service;

import java.util.List;

import com.appdev.betaems.dto.EnrollmentRequestDTO;
import com.appdev.betaems.dto.EnrollmentResponseDTO;
import com.appdev.betaems.entity.Enrollment;

public interface EnrollmentService {
    Enrollment createEnrollment(Enrollment enrollment);
    Enrollment updateEnrollment(Long id, Enrollment enrollment);
    void deleteEnrollment(Long id);
    Enrollment getEnrollmentById(Long id);
    List<Enrollment> getAllEnrollments();
    List<Enrollment> getEnrollmentsByStudentId(Long studentId);
    
    /**
     * Enrolls a student in a course with atomic slot decrement
     * Prevents over-enrollment by checking and decrementing slots in a single transaction
     * 
     * @param request EnrollmentRequestDTO containing studentId and courseId
     * @return EnrollmentResponseDTO with success/failure status and details
     */
    EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request);
}