package com.fpt.hhtlmilkteaapi.payload.request;

import lombok.Data;

@Data
public class OrderStatusRequest {
    private String orderId;
    private int status;
}
