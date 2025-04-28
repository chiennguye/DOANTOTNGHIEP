package com.fpt.hhtlmilkteaapi.seed;

import com.fpt.hhtlmilkteaapi.entity.*;
import com.fpt.hhtlmilkteaapi.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class SeedData implements CommandLineRunner {

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private ISizeOptionRepository sizeOptionRepository;

    @Autowired
    private IAdditionOptionRepository additionOptionRepository;

    @Override
    public void run(String... args) throws Exception {
        seedCategories();
        seedSizeOptions();
        seedAdditionOptions();
        seedProducts();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            Category milkTea = new Category();
            milkTea.setName("Milk Tea");

            Category fruitTea = new Category();
            fruitTea.setName("Fruit Tea");

            Category snack = new Category();
            snack.setName("Snack");

            Category product = new Category();
            product.setName("Product");

            categoryRepository.save(milkTea);
            categoryRepository.save(fruitTea);
            categoryRepository.save(snack);
            categoryRepository.save(product);
        }
    }

    private void seedSizeOptions() {
        if (sizeOptionRepository.count() == 0) {
            SizeOption small = new SizeOption();
            small.setName("S");
            small.setPrice(0);

            SizeOption medium = new SizeOption();
            medium.setName("M");
            medium.setPrice(5000);

            SizeOption large = new SizeOption();
            large.setName("L");
            large.setPrice(10000);

            sizeOptionRepository.save(small);
            sizeOptionRepository.save(medium);
            sizeOptionRepository.save(large);
        }
    }

    private void seedAdditionOptions() {
        if (additionOptionRepository.count() == 0) {
            AdditionOption pearl = new AdditionOption();
            pearl.setName("Pearl");
            pearl.setPrice(5000);

            AdditionOption jelly = new AdditionOption();
            jelly.setName("Jelly");
            jelly.setPrice(5000);

            AdditionOption pudding = new AdditionOption();
            pudding.setName("Pudding");
            pudding.setPrice(5000);

            AdditionOption cream = new AdditionOption();
            cream.setName("Cream");
            cream.setPrice(5000);

            additionOptionRepository.save(pearl);
            additionOptionRepository.save(jelly);
            additionOptionRepository.save(pudding);
            additionOptionRepository.save(cream);
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            // Get categories
            Category milkTea = categoryRepository.findByName("Milk Tea");
            Category fruitTea = categoryRepository.findByName("Fruit Tea");
            Category snack = categoryRepository.findByName("Snack");
            Category product = categoryRepository.findByName("Product");

            // Get size options
            SizeOption small = sizeOptionRepository.findByName("S");
            SizeOption medium = sizeOptionRepository.findByName("M");
            SizeOption large = sizeOptionRepository.findByName("L");

            // Get addition options
            AdditionOption pearl = additionOptionRepository.findByName("Pearl");
            AdditionOption jelly = additionOptionRepository.findByName("Jelly");
            AdditionOption pudding = additionOptionRepository.findByName("Pudding");
            AdditionOption cream = additionOptionRepository.findByName("Cream");

            // Create size option sets
            Set<SizeOption> sizeOptions = new HashSet<>();
            sizeOptions.add(small);
            sizeOptions.add(medium);
            sizeOptions.add(large);

            // Create addition option sets
            Set<AdditionOption> additionOptions = new HashSet<>();
            additionOptions.add(pearl);
            additionOptions.add(jelly);
            additionOptions.add(pudding);
            additionOptions.add(cream);

            // Create products
            Product product1 = new Product("P1", "Trà sữa trân châu", "Trà sữa trân châu đường đen", 
                "https://example.com/image1.jpg", "image1", 35000, milkTea, sizeOptions, additionOptions);
            
            Product product2 = new Product("P2", "Trà sữa matcha", "Trà sữa matcha kem cheese", 
                "https://example.com/image2.jpg", "image2", 40000, milkTea, sizeOptions, additionOptions);
            
            Product product3 = new Product("P3", "Trà đào", "Trà đào cam sả", 
                "https://example.com/image3.jpg", "image3", 30000, fruitTea, sizeOptions, additionOptions);
            
            Product product4 = new Product("P4", "Khoai tây chiên", "Khoai tây chiên giòn", 
                "https://example.com/image4.jpg", "image4", 25000, snack, new HashSet<>(), new HashSet<>());
            
            Product product5 = new Product("P5", "Bánh tráng trộn", "Bánh tráng trộn thập cẩm", 
                "https://example.com/image5.jpg", "image5", 20000, snack, new HashSet<>(), new HashSet<>());
            
            Product product6 = new Product("P6", "Ly giữ nhiệt", "Ly giữ nhiệt inox", 
                "https://example.com/image6.jpg", "image6", 150000, product, new HashSet<>(), new HashSet<>());

            productRepository.save(product1);
            productRepository.save(product2);
            productRepository.save(product3);
            productRepository.save(product4);
            productRepository.save(product5);
            productRepository.save(product6);
        }
    }
} 