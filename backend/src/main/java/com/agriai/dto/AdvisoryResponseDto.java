package com.agriai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AdvisoryResponseDto {
    private String crop;
    private String disease;
    private Double confidence;

    @JsonProperty("what_it_means")
    private String whatItMeans;
    private List<String> symptoms;
    private List<String> management;
    private List<String> prevention;
    private String precautions;
    private List<String> sources;
    private String answer;

    public AdvisoryResponseDto() {}

    public AdvisoryResponseDto(String crop, String disease, Double confidence, String whatItMeans, List<String> symptoms, List<String> management, List<String> prevention, String precautions, List<String> sources, String answer) {
        this.crop = crop;
        this.disease = disease;
        this.confidence = confidence;
        this.whatItMeans = whatItMeans;
        this.symptoms = symptoms;
        this.management = management;
        this.prevention = prevention;
        this.precautions = precautions;
        this.sources = sources;
        this.answer = answer;
    }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getWhatItMeans() { return whatItMeans; }
    public void setWhatItMeans(String whatItMeans) { this.whatItMeans = whatItMeans; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) { this.symptoms = symptoms; }

    public List<String> getManagement() { return management; }
    public void setManagement(List<String> management) { this.management = management; }

    public List<String> getPrevention() { return prevention; }
    public void setPrevention(List<String> prevention) { this.prevention = prevention; }

    public String getPrecautions() { return precautions; }
    public void setPrecautions(String precautions) { this.precautions = precautions; }

    public List<String> getSources() { return sources; }
    public void setSources(List<String> sources) { this.sources = sources; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public static AdvisoryResponseDtoBuilder builder() { return new AdvisoryResponseDtoBuilder(); }

    public static class AdvisoryResponseDtoBuilder {
        private String crop;
        private String disease;
        private Double confidence;
        private String whatItMeans;
        private List<String> symptoms;
        private List<String> management;
        private List<String> prevention;
        private String precautions;
        private List<String> sources;
        private String answer;

        public AdvisoryResponseDtoBuilder crop(String crop) { this.crop = crop; return this; }
        public AdvisoryResponseDtoBuilder disease(String disease) { this.disease = disease; return this; }
        public AdvisoryResponseDtoBuilder confidence(Double confidence) { this.confidence = confidence; return this; }
        public AdvisoryResponseDtoBuilder whatItMeans(String whatItMeans) { this.whatItMeans = whatItMeans; return this; }
        public AdvisoryResponseDtoBuilder symptoms(List<String> symptoms) { this.symptoms = symptoms; return this; }
        public AdvisoryResponseDtoBuilder management(List<String> management) { this.management = management; return this; }
        public AdvisoryResponseDtoBuilder prevention(List<String> prevention) { this.prevention = prevention; return this; }
        public AdvisoryResponseDtoBuilder precautions(String precautions) { this.precautions = precautions; return this; }
        public AdvisoryResponseDtoBuilder sources(List<String> sources) { this.sources = sources; return this; }
        public AdvisoryResponseDtoBuilder answer(String answer) { this.answer = answer; return this; }

        public AdvisoryResponseDto build() {
            return new AdvisoryResponseDto(crop, disease, confidence, whatItMeans, symptoms, management, prevention, precautions, sources, answer);
        }
    }
}
