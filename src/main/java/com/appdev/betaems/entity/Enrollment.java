package com.appdev.betaems.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long enrollmentId;

    private LocalDate enrollmentDate;
    private String status;
    private Long studentId;
    private Long courseId;
    private String semester; // 1st Semester, 2nd Semester, Summer

    // Constructors
    public Enrollment() {}

    public Enrollment(LocalDate enrollmentDate, String status, Long studentId, Long courseId) {
        this.enrollmentDate = enrollmentDate;
        this.status = status;
        this.studentId = studentId;
        this.courseId = courseId;
    }

    // Getters and Setters
    public Long getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }

    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }
}
