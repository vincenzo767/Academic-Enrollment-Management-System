package com.appdev.betaems.service;

import com.appdev.betaems.entity.Enrollment;
import java.util.List;

public interface EnrollmentService {
    Enrollment createEnrollment(Enrollment enrollment);
    Enrollment updateEnrollment(Long id, Enrollment enrollment);
    void deleteEnrollment(Long id);
    Enrollment getEnrollmentById(Long id);
    List<Enrollment> getAllEnrollments();
}