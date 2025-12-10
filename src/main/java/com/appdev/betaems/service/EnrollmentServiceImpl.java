package com.appdev.betaems.service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appdev.betaems.dto.EnrollmentEventDTO;
import com.appdev.betaems.dto.EnrollmentRequestDTO;
import com.appdev.betaems.dto.EnrollmentResponseDTO;
import com.appdev.betaems.entity.Courses;
import com.appdev.betaems.entity.Enrollment;
import com.appdev.betaems.repository.CoursesRepository;
import com.appdev.betaems.repository.EnrollmentRepository;
import com.appdev.betaems.websocket.EnrollmentWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private EnrollmentWebSocketHandler webSocketHandler;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Enrollment createEnrollment(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public Enrollment updateEnrollment(Long id, Enrollment enrollment) {
        Enrollment existing = enrollmentRepository.findById(id).orElseThrow();
        existing.setEnrollmentDate(enrollment.getEnrollmentDate());
        existing.setStatus(enrollment.getStatus());
        existing.setStudentId(enrollment.getStudentId());
        existing.setCourseId(enrollment.getCourseId());
        return enrollmentRepository.save(existing);
    }

    @Override
    public void deleteEnrollment(Long id) {
        enrollmentRepository.deleteById(id);
    }

    @Override
    public Enrollment getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Override
    public List<Enrollment> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    /**
     * Atomically enrolls a student in a course and decrements available slots
     * Uses @Transactional to ensure data integrity and prevent race conditions
     * Broadcasts WebSocket event on successful enrollment for real-time admin dashboard updates
     */
    @Override
    @Transactional
    public EnrollmentResponseDTO enrollStudent(EnrollmentRequestDTO request) {
        Long studentId = request.getStudentId();
        Long courseId = request.getCourseId();

        // Validate input
        if (studentId == null || courseId == null) {
            return new EnrollmentResponseDTO(false, "Student ID and Course ID are required");
        }

        // Check if course exists
        Optional<Courses> courseOptional = coursesRepository.findById(courseId);
        if (!courseOptional.isPresent()) {
            return new EnrollmentResponseDTO(false, "Course not found");
        }

        Courses course = courseOptional.get();

        // Check if student is already enrolled in this course
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            return new EnrollmentResponseDTO(false, "Student is already enrolled in this course");
        }

        // Check if slots are available
        if (course.getAvailableSlots() == null || course.getAvailableSlots() <= 0) {
            return new EnrollmentResponseDTO(false, "Course is full. No available slots");
        }

        try {
            // Atomically decrement available slots
            // This update will only succeed if the condition (availableSlots > 0) is met
            int updatedRows = coursesRepository.decrementAvailableSlots(courseId);
            
            if (updatedRows == 0) {
                // Race condition detected: another thread decremented the last slot
                return new EnrollmentResponseDTO(false, "Course is full. No available slots");
            }

            // Create enrollment record
            Enrollment enrollment = new Enrollment();
            enrollment.setStudentId(studentId);
            enrollment.setCourseId(courseId);
            enrollment.setEnrollmentDate(LocalDate.now());
            enrollment.setStatus("ENROLLED");
            enrollment.setSemester(course.getSemester()); // Set semester from course
            
            Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
            
            // Refresh course entity to get updated slot count
            course = coursesRepository.findById(courseId).get();

            // Broadcast WebSocket event to connected admin clients
            try {
                EnrollmentEventDTO event = new EnrollmentEventDTO(
                        savedEnrollment.getEnrollmentId(),
                        studentId,
                        courseId,
                        course.getTitle(),
                        course.getCourseCode(),
                        course.getAvailableSlots()
                );
                String eventJson = objectMapper.writeValueAsString(event);
                webSocketHandler.broadcastEnrollmentEvent(eventJson);
            } catch (Exception e) {
                // Log error but don't fail the enrollment if WebSocket broadcast fails
                System.err.println("Failed to broadcast enrollment event: " + e.getMessage());
            }

            return new EnrollmentResponseDTO(
                    true,
                    "Enrollment confirmed successfully",
                    savedEnrollment.getEnrollmentId(),
                    studentId,
                    courseId,
                    course.getAvailableSlots()
            );

        } catch (Exception e) {
            return new EnrollmentResponseDTO(false, "Enrollment failed: " + e.getMessage());
        }
    }
}

