package com.agriai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "advisory_history")
public class AdvisoryHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmerId;

    @Column(columnDefinition = "TEXT")
    private String question;

    private String disease;

    @Column(columnDefinition = "TEXT")
    private String response;

    @Column(columnDefinition = "TEXT")
    private String sources;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AdvisoryHistory() {}

    public AdvisoryHistory(Long id, Long farmerId, String question, String disease, String response, String sources, LocalDateTime createdAt) {
        this.id = id;
        this.farmerId = farmerId;
        this.question = question;
        this.disease = disease;
        this.response = response;
        this.sources = sources;
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

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public String getSources() { return sources; }
    public void setSources(String sources) { this.sources = sources; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static AdvisoryHistoryBuilder builder() { return new AdvisoryHistoryBuilder(); }

    public static class AdvisoryHistoryBuilder {
        private Long id;
        private Long farmerId;
        private String question;
        private String disease;
        private String response;
        private String sources;
        private LocalDateTime createdAt;

        public AdvisoryHistoryBuilder id(Long id) { this.id = id; return this; }
        public AdvisoryHistoryBuilder farmerId(Long farmerId) { this.farmerId = farmerId; return this; }
        public AdvisoryHistoryBuilder question(String question) { this.question = question; return this; }
        public AdvisoryHistoryBuilder disease(String disease) { this.disease = disease; return this; }
        public AdvisoryHistoryBuilder response(String response) { this.response = response; return this; }
        public AdvisoryHistoryBuilder sources(String sources) { this.sources = sources; return this; }
        public AdvisoryHistoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AdvisoryHistory build() {
            return new AdvisoryHistory(id, farmerId, question, disease, response, sources, createdAt);
        }
    }
}
