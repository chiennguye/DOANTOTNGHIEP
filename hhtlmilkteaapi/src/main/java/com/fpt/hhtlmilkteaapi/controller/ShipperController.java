package com.fpt.hhtlmilkteaapi.controller;

import com.fpt.hhtlmilkteaapi.entity.Order;
import com.fpt.hhtlmilkteaapi.entity.OrderDetail;
import com.fpt.hhtlmilkteaapi.entity.Product;
import com.fpt.hhtlmilkteaapi.entity.ProductInventory;
import com.fpt.hhtlmilkteaapi.payload.response.MessageResponse;
import com.fpt.hhtlmilkteaapi.repository.IOrderRepository;
import com.fpt.hhtlmilkteaapi.repository.IProductInventoryRepository;
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

    @Autowired
    private IProductInventoryRepository productInventoryRepository;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('SHIPPER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOrdersToDeliver(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        try {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            // Lấy đơn hàng có trạng thái đang giao hàng (status = 2)
            Page<Order> orders = orderRepository.findByStatus(2, pageable);

            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/orders/{id}/complete")
    @PreAuthorize("hasRole('SHIPPER') or hasRole('ADMIN')")
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

        // Update product inventory
        for (OrderDetail orderDetail : order.getOrderDetails()) {
            Product product = orderDetail.getProduct();
            ProductInventory inventory = productInventoryRepository.findByProductId(product.getId())
                    .orElse(null);

            if (inventory != null) {
                // Subtract sold quantity from inventory
                inventory.setQuantity(inventory.getQuantity() - orderDetail.getQuantity());
                productInventoryRepository.save(inventory);
            }
        }

        return ResponseEntity.ok(new MessageResponse("Order completed successfully"));
    }
}