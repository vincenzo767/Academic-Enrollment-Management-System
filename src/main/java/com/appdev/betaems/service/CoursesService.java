package com.appdev.betaems.service;

import com.appdev.betaems.entity.Courses;
import java.util.List;

public interface CoursesService {
    Courses createCourse(Courses course);
    Courses updateCourse(Long id, Courses course);
    void deleteCourse(Long id);
    Courses getCourseById(Long id);
    List<Courses> getAllCourses();
}
