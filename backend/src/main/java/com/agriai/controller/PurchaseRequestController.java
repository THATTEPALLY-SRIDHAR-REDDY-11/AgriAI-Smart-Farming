package com.agriai.controller;

import com.agriai.dto.PurchaseRequestDto;
import com.agriai.entity.RequestStatus;
import com.agriai.service.PurchaseRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class PurchaseRequestController {

    private final PurchaseRequestService requestService;

    public PurchaseRequestController(PurchaseRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<PurchaseRequestDto> createRequest(
            @RequestParam Long buyerId,
            @RequestParam Long productId,
            @RequestParam Double requestedQuantity,
            @RequestParam(required = false, defaultValue = "") String message) {
        return ResponseEntity.ok(requestService.createRequest(buyerId, productId, requestedQuantity, message));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<PurchaseRequestDto>> getFarmerRequests(@PathVariable Long farmerId) {
        return ResponseEntity.ok(requestService.getFarmerRequests(farmerId));
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PurchaseRequestDto>> getBuyerRequests(@PathVariable Long buyerId) {
        return ResponseEntity.ok(requestService.getBuyerRequests(buyerId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<PurchaseRequestDto> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status));
    }
}
