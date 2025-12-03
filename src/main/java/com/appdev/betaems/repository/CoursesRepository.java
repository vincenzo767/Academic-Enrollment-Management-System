package com.appdev.betaems.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.appdev.betaems.entity.Courses;

@Repository
public interface CoursesRepository extends JpaRepository<Courses, Long> {
    
    // Find course by course code
    Optional<Courses> findByCourseCode(String courseCode);
    
    // Decrement available slots atomically
    @Modifying
    @Query("UPDATE Courses c SET c.availableSlots = c.availableSlots - 1 WHERE c.courseId = :courseId AND c.availableSlots > 0")
    int decrementAvailableSlots(@Param("courseId") Long courseId);
}
