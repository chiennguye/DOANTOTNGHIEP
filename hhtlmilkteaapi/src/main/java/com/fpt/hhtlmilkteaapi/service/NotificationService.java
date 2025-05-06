package com.fpt.hhtlmilkteaapi.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    
    public void sendNewOrderNotification(String orderId) {
        // TODO: Implement notification logic for new orders
    }

    public void sendShippingNotification(String orderId) {
        // TODO: Implement notification logic for shipping status
    }

    public void sendCompletedNotification(String orderId) {
        // TODO: Implement notification logic for completed orders
    }
}