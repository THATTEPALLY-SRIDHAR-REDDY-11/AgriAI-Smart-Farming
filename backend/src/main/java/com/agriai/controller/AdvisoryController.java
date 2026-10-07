package com.agriai.controller;

import com.agriai.dto.AdvisoryRequestDto;
import com.agriai.dto.AdvisoryResponseDto;
import com.agriai.entity.AdvisoryHistory;
import com.agriai.service.AdvisoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/advisory")
public class AdvisoryController {

    private final AdvisoryService advisoryService;

    public AdvisoryController(AdvisoryService advisoryService) {
        this.advisoryService = advisoryService;
    }

    @PostMapping("/farmer/{farmerId}")
    public ResponseEntity<AdvisoryResponseDto> getAdvisory(
            @PathVariable Long farmerId,
            @RequestBody AdvisoryRequestDto request) {
        return ResponseEntity.ok(advisoryService.getAdvisory(farmerId, request));
    }

    @GetMapping("/history/{farmerId}")
    public ResponseEntity<List<AdvisoryHistory>> getHistory(@PathVariable Long farmerId) {
        return ResponseEntity.ok(advisoryService.getFarmerAdvisoryHistory(farmerId));
    }
}
