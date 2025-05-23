package com.fpt.hhtlmilkteaapi.payload.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProducUpdatetRequest {

    private String id;
    private String name;
    private String title;
    private long price;

    @JsonIgnoreProperties("products")
    private Object category;
    private List<Object> additionOptions;
    private List<Object> sizeOptions;

    private MultipartFile multipartFile;

    private Integer initialQuantity;
    private Integer minimumQuantity;

}
