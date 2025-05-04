package com.fpt.hhtlmilkteaapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fpt.hhtlmilkteaapi.entity.*;
import com.fpt.hhtlmilkteaapi.payload.request.ProducUpdatetRequest;
import com.fpt.hhtlmilkteaapi.payload.response.MessageResponse;
import com.fpt.hhtlmilkteaapi.payload.request.ProductRequest;
import com.fpt.hhtlmilkteaapi.payload.response.ProductResponse;
import com.fpt.hhtlmilkteaapi.repository.*;
import com.fpt.hhtlmilkteaapi.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private ISizeOptionRepository sizeOptionRepository;

    @Autowired
    private IAdditionOptionRepository additionOptionRepository;

    @Autowired
    private IProductInventoryRepository productInventoryRepository;

    private Map<String, String> options = new HashMap<>();

    @Value("${javadocfast.cloudinary.folder.image}")
    private String image;

    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "") String keyword) {

        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).descending() : Sort.by(sortField).ascending());

        Page<Product> products = "".equals(keyword) ? productRepository.findAll(pageable)
                : productRepository.findProductsByNameLike("%" + keyword + "%", pageable);

        return ResponseEntity.ok(products);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> addProduct(@ModelAttribute ProductRequest productRequest) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        SimpleDateFormat formatter = new SimpleDateFormat("ddMyyyyhhmmss");

        // Xử lý upload ảnh
        MultipartFile multipartFile = productRequest.getMultipartFile();
        String linkImg = "";
        String nameImg = "";

        if (multipartFile != null) {
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            if (bufferedImage == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid image"));
            }

            Map<String, String> options = new HashMap<>();
            options.put("folder", image);
            Map result = cloudinaryService.upload(multipartFile, options);

            linkImg = result.get("url").toString();
            nameImg = result.get("public_id").toString();
        }

        // Tạo ID cho sản phẩm
        String id = "P" + formatter.format(new Date());

        // Parse category
        Long categoryId = Long.parseLong(productRequest.getCategory().toString());
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category not found"));
        }
        String categoryName = category.getName();

        // Xử lý size options và addition options dựa trên category
        Set<SizeOption> sizeOptions = new HashSet<>();
        Set<AdditionOption> additionOptions = new HashSet<>();

        if (!"Snack".equals(categoryName) && !"Product".equals(categoryName)) {
            // Xử lý sizeOptionsList
            if (productRequest.getSizeOptionsList() != null) {
                for (Object sizeOptionObj : productRequest.getSizeOptionsList()) {
                    System.out.println("sizeOptionsList received: " + sizeOptionObj);
                    String sizeOptionStr = sizeOptionObj.toString();
                    if (sizeOptionStr.trim().startsWith("[")) {
                        SizeOption[] arr = objectMapper.readValue(sizeOptionStr, SizeOption[].class);
                        sizeOptions.addAll(Arrays.asList(arr));
                    } else {
                        sizeOptions.add(objectMapper.readValue(sizeOptionStr, SizeOption.class));
                    }
                }
            }
            // Xử lý additionOptionsList
            if (productRequest.getAdditionOptionsList() != null) {
                for (Object additionOptionObj : productRequest.getAdditionOptionsList()) {
                    System.out.println("additionOptionsList received: " + additionOptionObj);
                    String additionOptionStr = additionOptionObj.toString();
                    if (additionOptionStr.trim().startsWith("[")) {
                        AdditionOption[] arr = objectMapper.readValue(additionOptionStr, AdditionOption[].class);
                        additionOptions.addAll(Arrays.asList(arr));
                    } else {
                        additionOptions.add(objectMapper.readValue(additionOptionStr, AdditionOption.class));
                    }
                }
            }
        }

        // Tạo sản phẩm mới
        Product product = new Product(id, productRequest.getName(), productRequest.getTitle(),
                linkImg, nameImg, productRequest.getPrice(), category, sizeOptions, additionOptions);

        // Lưu sản phẩm
        product = productRepository.save(product);

        // Nếu là Snack hoặc Product, tự động tạo inventory
        if ("Snack".equals(categoryName) || "Product".equals(categoryName)) {
            ProductInventory inventory = new ProductInventory();
            inventory.setProduct(product);
            inventory
                    .setQuantity(productRequest.getInitialQuantity() != null ? productRequest.getInitialQuantity() : 0);
            inventory.setMinimumQuantity(
                    productRequest.getMinimumQuantity() != null ? productRequest.getMinimumQuantity() : 10);
            inventory.setIsActive(true);
            inventory.setCreatedAt(new Date());
            inventory.setUpdatedAt(new Date());

            productInventoryRepository.save(inventory);
        }

        // Fetch inventory và set lại vào product trước khi trả response
        ProductInventory inventory = productInventoryRepository.findByProductId(product.getId()).orElse(null);
        product.setInventory(inventory);

        return ResponseEntity.ok(new MessageResponse("Product added successfully"));
    }

    @PutMapping("")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@ModelAttribute ProducUpdatetRequest productRequest) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        String id = productRequest.getId();
        Product product = productRepository.findById(id).get();

        // Lấy tên category
        Long categoryId = Long.parseLong(productRequest.getCategory().toString());
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Category not found"));
        }
        String categoryName = category.getName();
        product.setCategory(category);

        if ("Snack".equals(categoryName) || "Product".equals(categoryName)) {
            // Cập nhật inventory
            ProductInventory inventory = productInventoryRepository.findByProductId(product.getId()).orElse(null);
            if (inventory != null) {
                inventory.setQuantity(productRequest.getInitialQuantity());
                inventory.setMinimumQuantity(productRequest.getMinimumQuantity());
                productInventoryRepository.save(inventory);
            }
            // KHÔNG cập nhật size/topping
            product.setSizeOptions(null);
            product.setAdditionOptions(null);
        } else {
            // Cập nhật size/topping như logic addProduct
            Set<SizeOption> sizeOptions = new HashSet<>();
            if (productRequest.getSizeOptions() != null) {
                for (Object sizeOptionObj : productRequest.getSizeOptions()) {
                    String sizeOptionStr = sizeOptionObj.toString();
                    sizeOptions.add(objectMapper.readValue(sizeOptionStr, SizeOption.class));
                }
                if (!sizeOptions.isEmpty() && !sizeOptions.contains(sizeOptionRepository.findById(1L).get())) {
                    sizeOptions.add(sizeOptionRepository.findById(1L).get());
                }
            } else {
                sizeOptions = null;
            }

            Set<AdditionOption> additionOptions = new HashSet<>();
            if (productRequest.getAdditionOptions() != null) {
                for (Object additionOptionObj : productRequest.getAdditionOptions()) {
                    String additionOptionStr = additionOptionObj.toString();
                    additionOptions.add(objectMapper.readValue(additionOptionStr, AdditionOption.class));
                }
            } else {
                additionOptions = null;
            }

            product.setSizeOptions(sizeOptions);
            product.setAdditionOptions(additionOptions);
            // KHÔNG cập nhật inventory
        }

        product.setName(productRequest.getName());
        product.setTitle(productRequest.getTitle());
        product.setPrice(productRequest.getPrice());

        Map<String, String> options = new HashMap<>();
        options.put("folder", image);

        MultipartFile multipartFile = productRequest.getMultipartFile();
        if (multipartFile != null) {
            BufferedImage bufferedImage = ImageIO.read(multipartFile.getInputStream());
            if (bufferedImage == null) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Invalid image"));
            }

            Map result = cloudinaryService.upload(multipartFile, options);

            if (multipartFile != null) {
                String linkImg = result.get("url").toString();
                String nameImg = result.get("public_id").toString();
                product.setLinkImage(linkImg);
                product.setNameImage(nameImg);
            }
        }

        productRepository.save(product);

        // Fetch inventory và set lại vào product trước khi trả response
        ProductInventory inventory = productInventoryRepository.findByProductId(product.getId()).orElse(null);
        product.setInventory(inventory);

        return new ResponseEntity(product, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProductById(@PathVariable String id) {
        Product product = productRepository.findById(id).get();
        if (product.getDeletedAt() == null) {
            product.setDeletedAt(new Date());
        } else {
            product.setDeletedAt(null);
        }
        productRepository.save(product);
        return new ResponseEntity(product, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<?> getProducts(
            @RequestParam(defaultValue = "") String cateName,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "") String keyword) {
        ProductResponse productResponse = new ProductResponse();
        List<Product> products;
        List<Product> productNew = productRepository.findProductsByCategory_Name("Product",
                Sort.by(Sort.Direction.DESC, "id"));
        productNew.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                .collect(Collectors.toList());

        if ("".equals(cateName)) {
            products = !"asc".equals(sortDir)
                    ? productRepository.findProductsByCategory_Name("Product", Sort.by(Sort.Direction.DESC, sortField))
                    : productRepository.findProductsByCategory_Name("Product", Sort.by(Sort.Direction.ASC, sortField));
            products = products.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                    .collect(Collectors.toList());
        } else {
            products = !"asc".equals(sortDir)
                    ? productRepository.findProductsByCategory_Name(cateName, Sort.by(Sort.Direction.DESC, sortField))
                    : productRepository.findProductsByCategory_Name(cateName, Sort.by(Sort.Direction.ASC, sortField));
            products = products.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                    .collect(Collectors.toList());
        }

        String newProductId = productNew.size() > 0 ? productNew.get(0).getId() : "";

        if (!"".equals(keyword)) {
            products = products.stream()
                    .filter((item) -> (item.getName().toLowerCase().contains(keyword.toLowerCase()))
                            || item.getTitle().toLowerCase().contains(keyword.toLowerCase()))
                    .collect(Collectors.toList());
        }

        productResponse.setProduct(products);
        productResponse.setNewProductId(newProductId);

        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("/milktea")
    public ResponseEntity<?> getMilkteaProducts(
            @RequestParam(defaultValue = "") String cateName,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "") String keyword) {
        ProductResponse productResponse = new ProductResponse();
        List<Product> products;
        List<Product> productNew = productRepository.findProductsByCategory_NameNotLikeAndCategory_NameNotLike("Snack",
                "Product", Sort.by(Sort.Direction.DESC, "id"));
        productNew.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                .collect(Collectors.toList());

        if ("".equals(cateName)) {
            products = !"asc".equals(sortDir)
                    ? productRepository.findProductsByCategory_NameNotLikeAndCategory_NameNotLike("Snack", "Product",
                            Sort.by(Sort.Direction.DESC, sortField))
                    : productRepository.findProductsByCategory_NameNotLikeAndCategory_NameNotLike("Snack", "Product",
                            Sort.by(Sort.Direction.ASC, sortField));
            products = products.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                    .collect(Collectors.toList());
        } else {
            products = !"asc".equals(sortDir)
                    ? productRepository.findProductsByCategory_Name(cateName, Sort.by(Sort.Direction.DESC, sortField))
                    : productRepository.findProductsByCategory_Name(cateName, Sort.by(Sort.Direction.ASC, sortField));
            products = products.stream().filter(p -> p.getCategory().getDeletedAt() == null && p.getDeletedAt() == null)
                    .collect(Collectors.toList());
        }

        String newProductId = productNew.size() > 0 ? productNew.get(0).getId() : "";

        if (!"".equals(keyword)) {
            products = products.stream()
                    .filter((item) -> (item.getName().toLowerCase().contains(keyword.toLowerCase()))
                            || item.getTitle().toLowerCase().contains(keyword.toLowerCase()))
                    .collect(Collectors.toList());
        }

        productResponse.setProduct(products);
        productResponse.setNewProductId(newProductId);

        return ResponseEntity.ok(productResponse);
    }

    @GetMapping("/showAll")
    public ResponseEntity<?> showAll() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/saleoff")
    public ResponseEntity<?> getProductsBySaleOff(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int pageSize,
            @RequestParam(defaultValue = "id") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") Double discount,
            @RequestParam(defaultValue = "list") String saleOff // list: show product saleOff !== null, add: === null
    ) {
        Date date = new Date();
        Timestamp timeNow = new Timestamp(date.getTime());

        Pageable pageable = PageRequest.of(
                page - 1, pageSize,
                "asc".equals(sortDir) ? Sort.by(sortField).descending() : Sort.by(sortField).ascending());

        Page<Product> products = productRepository.findAll(pageable);

        if ("list".equals(saleOff)) {
            products = discount == 0 ? productRepository.findProductBySaleOff_EndDateGreaterThan(timeNow, pageable)
                    : productRepository.findProductBySaleOffDiscountLike(discount, pageable);
        } else {
            products = "".equals(keyword) ? productRepository.findProductBySaleOffNull(pageable)
                    : productRepository.findProductsByNameLike("%" + keyword + "%", pageable);
        }

        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getProductDetail(@PathVariable String id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (!productOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Product not found"));
        }
        Product product = productOpt.get();
        String categoryName = product.getCategory().getName();
        ProductInventory inventory = productInventoryRepository.findByProductId(product.getId()).orElse(null);
        // Nếu là Snack/Product mà chưa có inventory thì tạo mới
        if (("Snack".equals(categoryName) || "Product".equals(categoryName)) && inventory == null) {
            inventory = new ProductInventory();
            inventory.setProduct(product);
            inventory.setQuantity(0);
            inventory.setMinimumQuantity(10);
            inventory.setIsActive(true);
            inventory.setCreatedAt(new Date());
            inventory.setUpdatedAt(new Date());
            productInventoryRepository.save(inventory);
        }
        product.setInventory(inventory);
        return ResponseEntity.ok(product);
    }
}
