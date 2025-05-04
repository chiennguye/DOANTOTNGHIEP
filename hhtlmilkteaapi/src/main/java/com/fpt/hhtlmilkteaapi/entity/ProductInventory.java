package com.fpt.hhtlmilkteaapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DynamicInsert
@Table(name = "product_inventory")
public class ProductInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", unique = true, nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "quantity", nullable = false)
    @ColumnDefault("0")
    private Integer quantity;

    @Column(name = "minimum_quantity", nullable = false)
    @ColumnDefault("10")
    private Integer minimumQuantity;

    @Column(name = "is_active", nullable = false)
    @ColumnDefault("false")
    private Boolean isActive;

    @Column(name = "created_at")
    @ColumnDefault("CURRENT_TIMESTAMP")
    private Date createdAt;

    @Column(name = "updated_at")
    @ColumnDefault("CURRENT_TIMESTAMP")
    private Date updatedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = new Date();
    }

    public ProductInventory(Product product, Integer quantity, Integer minimumQuantity, Boolean isActive) {
        this.product = product;
        this.quantity = quantity != null ? quantity : 0;
        this.minimumQuantity = minimumQuantity != null ? minimumQuantity : 10;
        this.isActive = isActive != null ? isActive : false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}