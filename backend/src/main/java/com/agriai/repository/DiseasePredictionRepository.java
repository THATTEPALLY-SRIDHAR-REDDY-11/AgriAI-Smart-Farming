package com.agriai.repository;

import com.agriai.entity.DiseasePrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiseasePredictionRepository extends JpaRepository<DiseasePrediction, Long> {
    List<DiseasePrediction> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    Long countByFarmerId(Long farmerId);
}
