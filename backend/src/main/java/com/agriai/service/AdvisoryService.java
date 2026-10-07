package com.agriai.service;

import com.agriai.dto.AdvisoryRequestDto;
import com.agriai.dto.AdvisoryResponseDto;
import com.agriai.entity.AdvisoryHistory;
import com.agriai.repository.AdvisoryHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdvisoryService {

    private final AdvisoryHistoryRepository advisoryRepository;
    private final AiIntegrationService aiIntegrationService;

    public AdvisoryService(AdvisoryHistoryRepository advisoryRepository, AiIntegrationService aiIntegrationService) {
        this.advisoryRepository = advisoryRepository;
        this.aiIntegrationService = aiIntegrationService;
    }

    public AdvisoryResponseDto getAdvisory(Long farmerId, AdvisoryRequestDto request) {
        AdvisoryResponseDto response = aiIntegrationService.getAdvisory(request);

        String sourcesStr = response.getSources() != null ? String.join(", ", response.getSources()) : "";
        AdvisoryHistory history = AdvisoryHistory.builder()
                .farmerId(farmerId)
                .question(request.getQuestion() != null ? request.getQuestion() : "Disease Advisory Request")
                .disease(response.getDisease())
                .response(response.getAnswer())
                .sources(sourcesStr)
                .build();

        advisoryRepository.save(history);
        return response;
    }

    public List<AdvisoryHistory> getFarmerAdvisoryHistory(Long farmerId) {
        return advisoryRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }
}
