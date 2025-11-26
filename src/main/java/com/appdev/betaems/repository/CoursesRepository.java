package com.appdev.betaems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.appdev.betaems.entity.Courses;

@Repository
public interface CoursesRepository extends JpaRepository<Courses, Long> {
}
