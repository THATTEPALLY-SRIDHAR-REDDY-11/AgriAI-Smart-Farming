package com.agriai.dto;

public class AdvisoryRequestDto {
    private String question;
    private String crop;
    private String disease;
    private Double confidence;

    public AdvisoryRequestDto() {}

    public AdvisoryRequestDto(String question, String crop, String disease, Double confidence) {
        this.question = question;
        this.crop = crop;
        this.disease = disease;
        this.confidence = confidence;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
