package com.agriai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_requests")
public class PurchaseRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long buyerId;

    @Column(nullable = false)
    private Long farmerId;

    @Column(nullable = false)
    private Double requestedQuantity;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public PurchaseRequest() {}

    public PurchaseRequest(Long id, Long productId, Long buyerId, Long farmerId, Double requestedQuantity, String message, RequestStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.productId = productId;
        this.buyerId = buyerId;
        this.farmerId = farmerId;
        this.requestedQuantity = requestedQuantity;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RequestStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

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

    public static PurchaseRequestBuilder builder() { return new PurchaseRequestBuilder(); }

    public static class PurchaseRequestBuilder {
        private Long id;
        private Long productId;
        private Long buyerId;
        private Long farmerId;
        private Double requestedQuantity;
        private String message;
        private RequestStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PurchaseRequestBuilder id(Long id) { this.id = id; return this; }
        public PurchaseRequestBuilder productId(Long productId) { this.productId = productId; return this; }
        public PurchaseRequestBuilder buyerId(Long buyerId) { this.buyerId = buyerId; return this; }
        public PurchaseRequestBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public PurchaseRequestBuilder requestedQuantity(Double requestedQuantity) { this.requestedQuantity = requestedQuantity; return this; }
        public PurchaseRequestBuilder message(String message) { this.message = message; return this; }
        public PurchaseRequestBuilder status(RequestStatus status) { this.status = status; return this; }
        public PurchaseRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PurchaseRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PurchaseRequest build() {
            return new PurchaseRequest(id, productId, buyerId, farmerId, requestedQuantity, message, status, createdAt, updatedAt);
        }
    }
}
