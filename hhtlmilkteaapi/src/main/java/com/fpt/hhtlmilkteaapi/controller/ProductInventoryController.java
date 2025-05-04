package com.fpt.hhtlmilkteaapi.controller;

import com.fpt.hhtlmilkteaapi.entity.ProductInventory;
import com.fpt.hhtlmilkteaapi.payload.request.ProductInventoryRequest;
import com.fpt.hhtlmilkteaapi.payload.response.MessageResponse;
import com.fpt.hhtlmilkteaapi.repository.IProductInventoryRepository;
import com.fpt.hhtlmilkteaapi.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/product-inventory")
public class ProductInventoryController {

    @Autowired
    private IProductInventoryRepository productInventoryRepository;

    @Autowired
    private IProductRepository productRepository;

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductInventories() {
        List<ProductInventory> inventories = productInventoryRepository.findAll();
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductInventory(@PathVariable String productId) {
        ProductInventory inventory = productInventoryRepository.findByProductId(productId)
                .orElse(null);
        if (inventory == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Product inventory not found"));
        }
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addProductInventory(@Valid @RequestBody ProductInventoryRequest inventoryRequest) {
        if (productInventoryRepository.existsByProductId(inventoryRequest.getProductId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Product inventory already exists"));
        }

        ProductInventory inventory = new ProductInventory();
        inventory.setProduct(productRepository.findById(inventoryRequest.getProductId()).orElse(null));
        inventory.setQuantity(inventoryRequest.getQuantity());
        inventory.setMinimumQuantity(inventoryRequest.getMinimumQuantity());
        inventory.setIsActive(inventoryRequest.isActive());

        productInventoryRepository.save(inventory);
        return ResponseEntity.ok(new MessageResponse("Product inventory added successfully"));
    }

    @PutMapping("/update/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProductInventory(@PathVariable String productId,
            @Valid @RequestBody ProductInventoryRequest inventoryRequest) {
        ProductInventory inventory = productInventoryRepository.findByProductId(productId)
                .orElse(null);
        if (inventory == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Product inventory not found"));
        }

        inventory.setQuantity(inventoryRequest.getQuantity());
        inventory.setMinimumQuantity(inventoryRequest.getMinimumQuantity());
        inventory.setIsActive(inventoryRequest.isActive());

        productInventoryRepository.save(inventory);
        return ResponseEntity.ok(new MessageResponse("Product inventory updated successfully"));
    }

    @DeleteMapping("/delete/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProductInventory(@PathVariable String productId) {
        ProductInventory inventory = productInventoryRepository.findByProductId(productId)
                .orElse(null);
        if (inventory == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Product inventory not found"));
        }

        productInventoryRepository.delete(inventory);
        return ResponseEntity.ok(new MessageResponse("Product inventory deleted successfully"));
    }
}