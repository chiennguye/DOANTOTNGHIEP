package com.fpt.hhtlmilkteaapi.repository;

import com.fpt.hhtlmilkteaapi.entity.Category;
import com.fpt.hhtlmilkteaapi.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface IProductRepository extends JpaRepository<Product, String> {
    Page<Product> findProductsByNameLike(String keyword, Pageable pageable);

    List<Product> findProductsByCategory_Name(String name, Sort sort);

    List<Product> findProductsByCategory_NameNotLikeAndCategory_NameNotLike(String cate, String cate2, Sort sort);

    Page<Product> findProductBySaleOffDiscountLike(Double discount, Pageable pageable);

    Page<Product> findProductBySaleOff_EndDateGreaterThan(Timestamp timeNow, Pageable pageable);

    Page<Product> findProductBySaleOffNull(Pageable pageable);

    Page<Product> findProductBySaleOffNotNull(Pageable pageable);

    List<Product> findByCategory_NameIn(List<String> names);
}
