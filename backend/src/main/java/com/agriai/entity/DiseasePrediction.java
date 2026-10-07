package com.agriai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "disease_predictions")
public class DiseasePrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmerId;

    private String imageUrl;
    private String crop;
    private String disease;
    private Double confidence;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DiseasePrediction() {}

    public DiseasePrediction(Long id, Long farmerId, String imageUrl, String crop, String disease, Double confidence, LocalDateTime createdAt) {
        this.id = id;
        this.farmerId = farmerId;
        this.imageUrl = imageUrl;
        this.crop = crop;
        this.disease = disease;
        this.confidence = confidence;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFarmerId() { return farmerId; }
    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static DiseasePredictionBuilder builder() { return new DiseasePredictionBuilder(); }

    public static class DiseasePredictionBuilder {
        private Long id;
        private Long farmerId;
        private String imageUrl;
        private String crop;
        private String disease;
        private Double confidence;
        private LocalDateTime createdAt;

        public DiseasePredictionBuilder id(Long id) { this.id = id; return this; }
        public DiseasePredictionBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public DiseasePredictionBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public DiseasePredictionBuilder crop(String crop) { this.crop = crop; return this; }
        public DiseasePredictionBuilder disease(String disease) { this.disease = disease; return this; }
        public DiseasePredictionBuilder confidence(Double confidence) { this.confidence = confidence; return this; }
        public DiseasePredictionBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DiseasePrediction build() {
            return new DiseasePrediction(id, farmerId, imageUrl, crop, disease, confidence, createdAt);
        }
    }
}
