package com.appdev.betaems.dto;

/**
 * DTO for course status display in admin dashboard
 * Shows real-time enrollment information
 */
public class CourseStatusDTO {
    private Long courseId;
    private String courseCode;
    private String title;
    private String description;
    private Integer credits;
    private Long instructorId;
    private Integer totalCapacity;
    private Integer enrolledStudents;
    private Integer slotsRemaining;

    public CourseStatusDTO() {}

    public CourseStatusDTO(Long courseId, String courseCode, String title, String description,
                          Integer credits, Long instructorId, Integer totalCapacity,
                          Integer enrolledStudents) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.title = title;
        this.description = description;
        this.credits = credits;
        this.instructorId = instructorId;
        this.totalCapacity = totalCapacity;
        this.enrolledStudents = enrolledStudents;
        this.slotsRemaining = totalCapacity - enrolledStudents;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public Integer getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(Integer totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public Integer getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(Integer enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
        // Recalculate slots remaining when enrolled students change
        if (this.totalCapacity != null) {
            this.slotsRemaining = this.totalCapacity - enrolledStudents;
        }
    }

    public Integer getSlotsRemaining() {
        return slotsRemaining;
    }

    public void setSlotsRemaining(Integer slotsRemaining) {
        this.slotsRemaining = slotsRemaining;
    }
}
