package com.appdev.betaems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.appdev.betaems.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find payments by enrollment ID
    List<Payment> findByEnrollmentId(Long enrollmentId);
    
    // Find all payments for a specific student
    List<Payment> findByStudentId(Long studentId);
}
