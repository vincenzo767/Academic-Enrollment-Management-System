package com.appdev.betaems.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.appdev.betaems.entity.Courses;
import com.appdev.betaems.service.CoursesService;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {

    @Autowired
    private CoursesService coursesService;

    @PostMapping
    public Courses create(@RequestBody Courses course) {
        return coursesService.createCourse(course);
    }

    @PutMapping("/{id}")
    public Courses update(@PathVariable Long id, @RequestBody Courses course) {
        return coursesService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        coursesService.deleteCourse(id);
    }

    @GetMapping("/{id}")
    public Courses getById(@PathVariable Long id) {
        return coursesService.getCourseById(id);
    }

    @GetMapping
    public List<Courses> getAll() {
        return coursesService.getAllCourses();
    }
}
