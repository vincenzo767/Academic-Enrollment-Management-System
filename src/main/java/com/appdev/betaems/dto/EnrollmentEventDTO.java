package com.appdev.betaems.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * DTO for WebSocket enrollment events
 * Sent to admin clients in real-time when a student enrolls
 */
public class EnrollmentEventDTO {
    private Long enrollmentId;
    private Long studentId;
    private Long courseId;
    private String courseName;
    private String courseCode;
    private Integer slotsRemainingAfterEnrollment;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    public EnrollmentEventDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public EnrollmentEventDTO(Long enrollmentId, Long studentId, Long courseId, String courseName,
                             String courseCode, Integer slotsRemainingAfterEnrollment) {
        this.enrollmentId = enrollmentId;
        this.studentId = studentId;
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.slotsRemainingAfterEnrollment = slotsRemainingAfterEnrollment;
        this.timestamp = LocalDateTime.now();
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

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public Integer getSlotsRemainingAfterEnrollment() {
        return slotsRemainingAfterEnrollment;
    }

    public void setSlotsRemainingAfterEnrollment(Integer slotsRemainingAfterEnrollment) {
        this.slotsRemainingAfterEnrollment = slotsRemainingAfterEnrollment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
