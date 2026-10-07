package com.agriai.service;

import com.agriai.dto.ProductDto;
import com.agriai.entity.Farmer;
import com.agriai.entity.Product;
import com.agriai.entity.ProductStatus;
import com.agriai.entity.User;
import com.agriai.exception.BadRequestException;
import com.agriai.exception.ResourceNotFoundException;
import com.agriai.repository.FarmerRepository;
import com.agriai.repository.ProductRepository;
import com.agriai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, FarmerRepository farmerRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.farmerRepository = farmerRepository;
        this.userRepository = userRepository;
    }

    public ProductDto createProduct(Long farmerId, ProductDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Product name is required.");
        }
        if (dto.getPrice() == null || dto.getPrice() <= 0) {
            throw new BadRequestException("Product price must be greater than zero.");
        }
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new BadRequestException("Product quantity must be greater than zero.");
        }

        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found for id: " + farmerId));
        User farmerUser = userRepository.findById(farmer.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Farmer user account not found"));

        Product product = Product.builder()
                .farmerId(farmerId)
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .unit(dto.getUnit())
                .imageUrl(dto.getImageUrl())
                .location(dto.getLocation() != null ? dto.getLocation() : farmer.getLocation())
                .contact(dto.getContact() != null ? dto.getContact() : farmer.getPhone())
                .status(ProductStatus.AVAILABLE)
                .build();

        Product saved = productRepository.save(product);
        return mapToDto(saved, farmerUser.getName());
    }

    public List<ProductDto> getProductsByFarmer(Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer profile not found"));
        User farmerUser = userRepository.findById(farmer.getUserId()).orElse(null);
        String farmerName = farmerUser != null ? farmerUser.getName() : "Farmer";

        return productRepository.findByFarmerId(farmerId).stream()
                .map(p -> mapToDto(p, farmerName))
                .collect(Collectors.toList());
    }

    public List<ProductDto> searchMarketplace(String query, String category, String location) {
        return productRepository.searchProducts(ProductStatus.AVAILABLE, query, category, location).stream()
                .map(p -> {
                    Farmer farmer = farmerRepository.findById(p.getFarmerId()).orElse(null);
                    String name = "Farmer";
                    if (farmer != null) {
                        User u = userRepository.findById(farmer.getUserId()).orElse(null);
                        if (u != null) name = u.getName();
                    }
                    return mapToDto(p, name);
                })
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        Farmer farmer = farmerRepository.findById(p.getFarmerId()).orElse(null);
        String farmerName = "Farmer";
        if (farmer != null) {
            User u = userRepository.findById(farmer.getUserId()).orElse(null);
            if (u != null) farmerName = u.getName();
        }

        return mapToDto(p, farmerName);
    }

    public void updateProductStatus(Long id, ProductStatus status) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setStatus(status);
        productRepository.save(p);
    }

    private ProductDto mapToDto(Product p, String farmerName) {
        return ProductDto.builder()
                .id(p.getId())
                .farmerId(p.getFarmerId())
                .farmerName(farmerName)
                .name(p.getName())
                .category(p.getCategory())
                .description(p.getDescription())
                .price(p.getPrice())
                .quantity(p.getQuantity())
                .unit(p.getUnit())
                .imageUrl(p.getImageUrl())
                .location(p.getLocation())
                .contact(p.getContact())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
