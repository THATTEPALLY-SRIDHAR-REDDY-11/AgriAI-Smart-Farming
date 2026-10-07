package com.agriai.controller;

import com.agriai.dto.ProductDto;
import com.agriai.entity.ProductStatus;
import com.agriai.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<ProductDto> createProduct(@PathVariable Long farmerId, @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(farmerId, dto));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProductDto>> getFarmerProducts(@PathVariable Long farmerId) {
        return ResponseEntity.ok(productService.getProductsByFarmer(farmerId));
    }

    @GetMapping("/marketplace")
    public ResponseEntity<List<ProductDto>> searchMarketplace(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(productService.searchMarketplace(query, category, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam ProductStatus status) {
        productService.updateProductStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
