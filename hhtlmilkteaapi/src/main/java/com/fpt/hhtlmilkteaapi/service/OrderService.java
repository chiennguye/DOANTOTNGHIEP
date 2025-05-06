package com.fpt.hhtlmilkteaapi.service;

import com.fpt.hhtlmilkteaapi.entity.Order;
import com.fpt.hhtlmilkteaapi.payload.request.OrderStatusRequest;
import com.fpt.hhtlmilkteaapi.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService implements IOrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Order updateStatus(OrderStatusRequest orderStatusRequest) {
        Order order = orderRepository.findById(String.valueOf(orderStatusRequest.getOrderId()))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(orderStatusRequest.getStatus());
        Order updatedOrder = orderRepository.save(order);

        if ("SHIPPING".equals(orderStatusRequest.getStatus())) {
            notificationService.sendShippingNotification(updatedOrder.getId());
        } else if ("COMPLETED".equals(orderStatusRequest.getStatus())) {
            notificationService.sendCompletedNotification(updatedOrder.getId());
        }

        return updatedOrder;
    }

    public Order createOrder(Order order) {
        Order savedOrder = orderRepository.save(order);
        notificationService.sendNewOrderNotification(savedOrder.getId());
        return savedOrder;
    }
}