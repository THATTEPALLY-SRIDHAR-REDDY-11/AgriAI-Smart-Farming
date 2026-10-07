package com.agriai.controller;

import com.agriai.dto.DiseasePredictionDto;
import com.agriai.service.DiseasePredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/disease")
public class DiseaseController {

    private final DiseasePredictionService predictionService;

    public DiseaseController(DiseasePredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/predict/{farmerId}")
    public ResponseEntity<DiseasePredictionDto> predict(
            @PathVariable Long farmerId,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(predictionService.detectDisease(image, farmerId));
    }

    @GetMapping("/history/{farmerId}")
    public ResponseEntity<List<DiseasePredictionDto>> getHistory(@PathVariable Long farmerId) {
        return ResponseEntity.ok(predictionService.getFarmerPredictionHistory(farmerId));
    }
}
