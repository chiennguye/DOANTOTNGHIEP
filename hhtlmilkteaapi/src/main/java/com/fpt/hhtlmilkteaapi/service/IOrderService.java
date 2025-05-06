package com.fpt.hhtlmilkteaapi.service;

import com.fpt.hhtlmilkteaapi.entity.Order;
import com.fpt.hhtlmilkteaapi.payload.request.OrderStatusRequest;

public interface IOrderService {
    Order updateStatus(OrderStatusRequest orderStatusRequest);
}