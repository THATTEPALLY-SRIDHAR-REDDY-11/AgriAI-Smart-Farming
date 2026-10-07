package com.agriai.controller;

import com.agriai.dto.DashboardStatsDto;
import com.agriai.entity.RequestStatus;
import com.agriai.repository.DiseasePredictionRepository;
import com.agriai.repository.ProductRepository;
import com.agriai.repository.PurchaseRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/farmer")
public class FarmerController {

    private final ProductRepository productRepository;
    private final PurchaseRequestRepository requestRepository;
    private final DiseasePredictionRepository predictionRepository;

    public FarmerController(ProductRepository productRepository, PurchaseRequestRepository requestRepository, DiseasePredictionRepository predictionRepository) {
        this.productRepository = productRepository;
        this.requestRepository = requestRepository;
        this.predictionRepository = predictionRepository;
    }

    @GetMapping("/dashboard-stats/{farmerId}")
    public ResponseEntity<DashboardStatsDto> getDashboardStats(@PathVariable Long farmerId) {
        long totalProducts = productRepository.findByFarmerId(farmerId).size();
        long pending = requestRepository.countByFarmerIdAndStatus(farmerId, RequestStatus.PENDING);
        long accepted = requestRepository.countByFarmerIdAndStatus(farmerId, RequestStatus.ACCEPTED);
        long ready = requestRepository.countByFarmerIdAndStatus(farmerId, RequestStatus.READY_FOR_PICKUP);
        long predictions = predictionRepository.countByFarmerId(farmerId);

        return ResponseEntity.ok(DashboardStatsDto.builder()
                .totalProducts(totalProducts)
                .pendingRequests(pending)
                .acceptedRequests(accepted)
                .readyForPickupRequests(ready)
                .totalAiPredictions(predictions)
                .build());
    }
}
