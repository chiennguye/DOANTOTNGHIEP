package com.fpt.hhtlmilkteaapi.payload.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String title;

    private String linkImage;
    private String nameImage;

    @NotNull
    private Long price;

    @NotBlank
    private String categoryId;

    private Set<String> sizeOptions;
    private Set<String> additionOptions;

    private boolean manageInventory = false;
    private Integer initialQuantity = 0;
    private Integer minimumQuantity = 10;

    @JsonIgnoreProperties("products")
    private Object category;
    private List<Object> additionOptionsList;
    private List<Object> sizeOptionsList;
    private MultipartFile multipartFile;

}
