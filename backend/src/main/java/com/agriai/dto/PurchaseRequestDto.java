package com.agriai.dto;

import com.agriai.entity.RequestStatus;
import java.time.LocalDateTime;

public class PurchaseRequestDto {
    private Long id;
    private Long productId;
    private String productName;
    private Double productPrice;
    private String productUnit;
    private String productImage;
    private Long buyerId;
    private String buyerName;
    private String buyerPhone;
    private String buyerLocation;
    private Long farmerId;
    private String farmerName;
    private String farmerPhone;
    private String farmerLocation;
    private Double requestedQuantity;
    private String message;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PurchaseRequestDto() {}

    public PurchaseRequestDto(Long id, Long productId, String productName, Double productPrice, String productUnit, String productImage, Long buyerId, String buyerName, String buyerPhone, String buyerLocation, Long farmerId, String farmerName, String farmerPhone, String farmerLocation, Double requestedQuantity, String message, RequestStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productUnit = productUnit;
        this.productImage = productImage;
        this.buyerId = buyerId;
        this.buyerName = buyerName;
        this.buyerPhone = buyerPhone;
        this.buyerLocation = buyerLocation;
        this.farmerId = farmerId;
        this.farmerName = farmerName;
        this.farmerPhone = farmerPhone;
        this.farmerLocation = farmerLocation;
        this.requestedQuantity = requestedQuantity;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getProductPrice() { return productPrice; }
    public void setProductPrice(Double productPrice) { this.productPrice = productPrice; }

    public String getProductUnit() { return productUnit; }
    public void setProductUnit(String productUnit) { this.productUnit = productUnit; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }

    public String getBuyerLocation() { return buyerLocation; }
    public void setBuyerLocation(String buyerLocation) { this.buyerLocation = buyerLocation; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getFarmerName() { return farmerName; }
    public void setFarmerName(String farmerName) { this.farmerName = farmerName; }

    public String getFarmerPhone() { return farmerPhone; }
    public void setFarmerPhone(String farmerPhone) { this.farmerPhone = farmerPhone; }

    public String getFarmerLocation() { return farmerLocation; }
    public void setFarmerLocation(String farmerLocation) { this.farmerLocation = farmerLocation; }

    public Double getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Double requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static PurchaseRequestDtoBuilder builder() { return new PurchaseRequestDtoBuilder(); }

    public static class PurchaseRequestDtoBuilder {
        private Long id;
        private Long productId;
        private String productName;
        private Double productPrice;
        private String productUnit;
        private String productImage;
        private Long buyerId;
        private String buyerName;
        private String buyerPhone;
        private String buyerLocation;
        private Long farmerId;
        private String farmerName;
        private String farmerPhone;
        private String farmerLocation;
        private Double requestedQuantity;
        private String message;
        private RequestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PurchaseRequestDtoBuilder id(Long id) { this.id = id; return this; }
        public PurchaseRequestDtoBuilder productId(Long productId) { this.productId = productId; return this; }
        public PurchaseRequestDtoBuilder productName(String productName) { this.productName = productName; return this; }
        public PurchaseRequestDtoBuilder productPrice(Double productPrice) { this.productPrice = productPrice; return this; }
        public PurchaseRequestDtoBuilder productUnit(String productUnit) { this.productUnit = productUnit; return this; }
        public PurchaseRequestDtoBuilder productImage(String productImage) { this.productImage = productImage; return this; }
        public PurchaseRequestDtoBuilder buyerId(Long buyerId) { this.buyerId = buyerId; return this; }
        public PurchaseRequestDtoBuilder buyerName(String buyerName) { this.buyerName = buyerName; return this; }
        public PurchaseRequestDtoBuilder buyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; return this; }
        public PurchaseRequestDtoBuilder buyerLocation(String buyerLocation) { this.buyerLocation = buyerLocation; return this; }
        public PurchaseRequestDtoBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public PurchaseRequestDtoBuilder farmerName(String farmerName) { this.farmerName = farmerName; return this; }
        public PurchaseRequestDtoBuilder farmerPhone(String farmerPhone) { this.farmerPhone = farmerPhone; return this; }
        public PurchaseRequestDtoBuilder farmerLocation(String farmerLocation) { this.farmerLocation = farmerLocation; return this; }
        public PurchaseRequestDtoBuilder requestedQuantity(Double requestedQuantity) { this.requestedQuantity = requestedQuantity; return this; }
        public PurchaseRequestDtoBuilder message(String message) { this.message = message; return this; }
        public PurchaseRequestDtoBuilder status(RequestStatus status) { this.status = status; return this; }
        public PurchaseRequestDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PurchaseRequestDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PurchaseRequestDto build() {
            return new PurchaseRequestDto(id, productId, productName, productPrice, productUnit, productImage, buyerId, buyerName, buyerPhone, buyerLocation, farmerId, farmerName, farmerPhone, farmerLocation, requestedQuantity, message, status, createdAt, updatedAt);
        }
    }
}
