package com.appdev.betaems.service;

import com.appdev.betaems.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment updatePayment(Long id, Payment payment);
    void deletePayment(Long id);
    Payment getPaymentById(Long id);
    List<Payment> getAllPayments();
}

