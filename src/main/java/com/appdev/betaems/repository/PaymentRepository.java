package com.appdev.betaems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.appdev.betaems.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
