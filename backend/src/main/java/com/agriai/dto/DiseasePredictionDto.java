package com.agriai.dto;

import java.time.LocalDateTime;

public class DiseasePredictionDto {
    private Long id;
    private Long farmerId;
    private String imageUrl;
    private String crop;
    private String disease;
    private Double confidence;
    private LocalDateTime createdAt;

    public DiseasePredictionDto() {}

    public DiseasePredictionDto(Long id, Long farmerId, String imageUrl, String crop, String disease, Double confidence, LocalDateTime createdAt) {
        this.id = id;
        this.farmerId = farmerId;
        this.imageUrl = imageUrl;
        this.crop = crop;
        this.disease = disease;
        this.confidence = confidence;
        this.createdAt = createdAt;
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

    public static DiseasePredictionDtoBuilder builder() { return new DiseasePredictionDtoBuilder(); }

    public static class DiseasePredictionDtoBuilder {
        private Long id;
        private Long farmerId;
        private String imageUrl;
        private String crop;
        private String disease;
        private Double confidence;
        private LocalDateTime createdAt;

        public DiseasePredictionDtoBuilder id(Long id) { this.id = id; return this; }
        public DiseasePredictionDtoBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public DiseasePredictionDtoBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public DiseasePredictionDtoBuilder crop(String crop) { this.crop = crop; return this; }
        public DiseasePredictionDtoBuilder disease(String disease) { this.disease = disease; return this; }
        public DiseasePredictionDtoBuilder confidence(Double confidence) { this.confidence = confidence; return this; }
        public DiseasePredictionDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public DiseasePredictionDto build() {
            return new DiseasePredictionDto(id, farmerId, imageUrl, crop, disease, confidence, createdAt);
        }
    }
}
