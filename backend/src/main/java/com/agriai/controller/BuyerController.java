package com.agriai.controller;

import com.agriai.dto.DashboardStatsDto;
import com.agriai.entity.ProductStatus;
import com.agriai.entity.RequestStatus;
import com.agriai.repository.ProductRepository;
import com.agriai.repository.PurchaseRequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/buyer")
public class BuyerController {

    private final ProductRepository productRepository;
    private final PurchaseRequestRepository requestRepository;

    public BuyerController(ProductRepository productRepository, PurchaseRequestRepository requestRepository) {
        this.productRepository = productRepository;
        this.requestRepository = requestRepository;
    }

    @GetMapping("/dashboard-stats/{buyerId}")
    public ResponseEntity<DashboardStatsDto> getDashboardStats(@PathVariable Long buyerId) {
        long availableProducts = productRepository.findByStatus(ProductStatus.AVAILABLE).size();
        long pending = requestRepository.countByBuyerIdAndStatus(buyerId, RequestStatus.PENDING);
        long accepted = requestRepository.countByBuyerIdAndStatus(buyerId, RequestStatus.ACCEPTED);
        long ready = requestRepository.countByBuyerIdAndStatus(buyerId, RequestStatus.READY_FOR_PICKUP);
        long completed = requestRepository.countByBuyerIdAndStatus(buyerId, RequestStatus.COMPLETED);

        return ResponseEntity.ok(DashboardStatsDto.builder()
                .totalProducts(availableProducts)
                .pendingRequests(pending)
                .acceptedRequests(accepted)
                .readyForPickupRequests(ready)
                .completedPurchases(completed)
                .build());
    }
}
