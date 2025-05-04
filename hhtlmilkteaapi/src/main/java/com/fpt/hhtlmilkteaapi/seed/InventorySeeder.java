package com.fpt.hhtlmilkteaapi.seed;

import com.fpt.hhtlmilkteaapi.entity.Product;
import com.fpt.hhtlmilkteaapi.entity.ProductInventory;
import com.fpt.hhtlmilkteaapi.repository.IProductInventoryRepository;
import com.fpt.hhtlmilkteaapi.repository.IProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Component
public class InventorySeeder implements CommandLineRunner {

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IProductInventoryRepository productInventoryRepository;

    @Override
    public void run(String... args) {
        // Lấy tất cả sản phẩm loại Snack hoặc Product
        List<Product> snackProducts = productRepository.findByCategory_NameIn(Arrays.asList("Snack", "Product"));
        for (Product product : snackProducts) {
            // Nếu chưa có inventory thì tạo mới
            if (!productInventoryRepository.findByProductId(product.getId()).isPresent()) {
                ProductInventory inventory = new ProductInventory();
                inventory.setProduct(product);
                inventory.setQuantity(0); // hoặc giá trị mặc định bạn muốn
                inventory.setMinimumQuantity(10); // hoặc giá trị mặc định bạn muốn
                inventory.setIsActive(true);
                inventory.setCreatedAt(new Date());
                inventory.setUpdatedAt(new Date());
                productInventoryRepository.save(inventory);
                System.out.println("Seeded inventory for product: " + product.getId());
            }
        }
    }
}