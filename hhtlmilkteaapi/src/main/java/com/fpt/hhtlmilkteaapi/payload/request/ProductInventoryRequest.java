package com.fpt.hhtlmilkteaapi.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductInventoryRequest {

    @NotNull
    private String productId;

    @Min(0)
    private Integer quantity;

    @Min(0)
    private Integer minimumQuantity;

    private boolean active;
}