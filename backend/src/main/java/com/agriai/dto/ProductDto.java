package com.agriai.dto;

import com.agriai.entity.ProductStatus;
import java.time.LocalDateTime;

public class ProductDto {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String name;
    private String category;
    private String description;
    private Double price;
    private Double quantity;
    private String unit;
    private String imageUrl;
    private String location;
    private String contact;
    private ProductStatus status;
    private LocalDateTime createdAt;

    public ProductDto() {}

    public ProductDto(Long id, Long farmerId, String farmerName, String name, String category, String description, Double price, Double quantity, String unit, String imageUrl, String location, String contact, ProductStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.location = location;
        this.contact = contact;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ProductDtoBuilder builder() { return new ProductDtoBuilder(); }

    public static class ProductDtoBuilder {
        private Long id;
        private Long farmerId;
        private String farmerName;
        private String name;
        private String category;
        private String description;
        private Double price;
        private Double quantity;
        private String unit;
        private String imageUrl;
        private String location;
        private String contact;
        private ProductStatus status;
        private LocalDateTime createdAt;

        public ProductDtoBuilder id(Long id) { this.id = id; return this; }
        public ProductDtoBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public ProductDtoBuilder farmerName(String farmerName) { this.farmerName = farmerName; return this; }
        public ProductDtoBuilder name(String name) { this.name = name; return this; }
        public ProductDtoBuilder category(String category) { this.category = category; return this; }
        public ProductDtoBuilder description(String description) { this.description = description; return this; }
        public ProductDtoBuilder price(Double price) { this.price = price; return this; }
        public ProductDtoBuilder quantity(Double quantity) { this.quantity = quantity; return this; }
        public ProductDtoBuilder unit(String unit) { this.unit = unit; return this; }
        public ProductDtoBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ProductDtoBuilder location(String location) { this.location = location; return this; }
        public ProductDtoBuilder contact(String contact) { this.contact = contact; return this; }
        public ProductDtoBuilder status(ProductStatus status) { this.status = status; return this; }
        public ProductDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ProductDto build() {
            return new ProductDto(id, farmerId, farmerName, name, category, description, price, quantity, unit, imageUrl, location, contact, status, createdAt);
        }
    }
}
