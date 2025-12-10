package com.appdev.betaems.service;

import java.util.List;

import com.appdev.betaems.entity.Payment;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment updatePayment(Long id, Payment payment);
    void deletePayment(Long id);
    Payment getPaymentById(Long id);
    List<Payment> getAllPayments();
    List<Payment> getPaymentsByStudentId(Long studentId);
    List<Payment> getPaymentsByEnrollmentId(Long enrollmentId);
}

