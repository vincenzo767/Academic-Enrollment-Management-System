package com.appdev.betaems.dto;

/**
 * DTO for enrollment response with status and message
 */
public class EnrollmentResponseDTO {
    private boolean success;
    private String message;
    private Long enrollmentId;
    private Long studentId;
    private Long courseId;
    private int availableSlotsAfterEnrollment;

    public EnrollmentResponseDTO() {}

    public EnrollmentResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public EnrollmentResponseDTO(boolean success, String message, Long enrollmentId, 
                                 Long studentId, Long courseId, int availableSlotsAfterEnrollment) {
        this.success = success;
        this.message = message;
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.availableSlotsAfterEnrollment = availableSlotsAfterEnrollment;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Long enrollmentId) {
        this.enrollmentId = enrollmentId;
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

    public int getAvailableSlotsAfterEnrollment() {
        return availableSlotsAfterEnrollment;
    }

    public void setAvailableSlotsAfterEnrollment(int availableSlotsAfterEnrollment) {
        this.availableSlotsAfterEnrollment = availableSlotsAfterEnrollment;
    }
}
