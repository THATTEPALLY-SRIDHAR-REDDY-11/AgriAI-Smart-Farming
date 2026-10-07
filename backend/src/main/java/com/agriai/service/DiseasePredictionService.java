package com.agriai.service;

import com.agriai.dto.DiseasePredictionDto;
import com.agriai.entity.DiseasePrediction;
import com.agriai.repository.DiseasePredictionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiseasePredictionService {

    private final DiseasePredictionRepository predictionRepository;
    private final AiIntegrationService aiIntegrationService;

    public DiseasePredictionService(DiseasePredictionRepository predictionRepository, AiIntegrationService aiIntegrationService) {
        this.predictionRepository = predictionRepository;
        this.aiIntegrationService = aiIntegrationService;
    }

    public DiseasePredictionDto detectDisease(MultipartFile file, Long farmerId) throws IOException {
        DiseasePredictionDto result = aiIntegrationService.predictDisease(file, farmerId);

        DiseasePrediction entity = DiseasePrediction.builder()
                .farmerId(farmerId)
                .imageUrl(result.getImageUrl())
                .crop(result.getCrop())
                .disease(result.getDisease())
                .confidence(result.getConfidence())
                .build();

        DiseasePrediction saved = predictionRepository.save(entity);
        result.setId(saved.getId());
        result.setCreatedAt(saved.getCreatedAt());

        return result;
    }

    public List<DiseasePredictionDto> getFarmerPredictionHistory(Long farmerId) {
        return predictionRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId).stream()
                .map(p -> DiseasePredictionDto.builder()
                        .id(p.getId())
                        .farmerId(p.getFarmerId())
                        .imageUrl(p.getImageUrl())
                        .crop(p.getCrop())
                        .disease(p.getDisease())
                        .confidence(p.getConfidence())
                        .createdAt(p.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
