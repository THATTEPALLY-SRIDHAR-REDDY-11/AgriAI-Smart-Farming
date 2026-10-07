package com.agriai.repository;

import com.agriai.entity.AdvisoryHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdvisoryHistoryRepository extends JpaRepository<AdvisoryHistory, Long> {
    List<AdvisoryHistory> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
}
