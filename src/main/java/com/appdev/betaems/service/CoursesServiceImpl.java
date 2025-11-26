package com.appdev.betaems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.appdev.betaems.entity.Courses;
import com.appdev.betaems.repository.CoursesRepository;
import java.util.List;

@Service
public class CoursesServiceImpl implements CoursesService {

    @Autowired
    private CoursesRepository coursesRepository;

    @Override
    public Courses createCourse(Courses course) {
        return coursesRepository.save(course);
    }

    @Override
    public Courses updateCourse(Long id, Courses course) {
        Courses existing = coursesRepository.findById(id).orElseThrow();
        existing.setCourseCode(course.getCourseCode());
        existing.setTitle(course.getTitle());
        existing.setDescription(course.getDescription());
        existing.setCredits(course.getCredits());
        existing.setInstructorId(course.getInstructorId());
        return coursesRepository.save(existing);
    }

    @Override
    public void deleteCourse(Long id) {
        coursesRepository.deleteById(id);
    }

    @Override
    public Courses getCourseById(Long id) {
        return coursesRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Courses> getAllCourses() {
        return coursesRepository.findAll();
    }
}
