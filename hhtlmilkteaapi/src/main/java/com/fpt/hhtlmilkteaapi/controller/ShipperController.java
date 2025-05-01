package com.fpt.hhtlmilkteaapi.controller;

import com.fpt.hhtlmilkteaapi.entity.Order;
import com.fpt.hhtlmilkteaapi.payload.response.MessageResponse;
import com.fpt.hhtlmilkteaapi.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shipper")
public class ShipperController {

    @Autowired
    private IOrderRepository orderRepository;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<?> getOrdersToDeliver(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).ascending() : Sort.by(sortField).descending()
        );

        Page<Order> orders = orderRepository.findByStatus(2, pageable);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/complete")
    @PreAuthorize("hasRole('SHIPPER')")
    public ResponseEntity<?> completeOrder(@PathVariable String id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Order not found"));
        }

        if (order.getStatus() != 2) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Order is not in shipping status"));
        }

        order.setStatus(3); // Set status to completed
        orderRepository.save(order);
        return ResponseEntity.ok(new MessageResponse("Order completed successfully"));
    }
} 