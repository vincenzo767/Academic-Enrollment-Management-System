package com.appdev.betaems.dto;

/**
 * DTO for enrollment request containing student ID and course ID
 */
public class EnrollmentRequestDTO {
    private Long studentId;
    private Long courseId;

    public EnrollmentRequestDTO() {}

    public EnrollmentRequestDTO(Long studentId, Long courseId) {
        this.studentId = studentId;
        this.courseId = courseId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
}
