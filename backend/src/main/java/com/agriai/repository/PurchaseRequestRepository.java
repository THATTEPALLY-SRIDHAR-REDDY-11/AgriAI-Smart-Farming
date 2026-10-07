package com.agriai.repository;

import com.agriai.entity.PurchaseRequest;
import com.agriai.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByFarmerId(Long farmerId);
    List<PurchaseRequest> findByBuyerId(Long buyerId);
    List<PurchaseRequest> findByFarmerIdAndStatus(Long farmerId, RequestStatus status);
    List<PurchaseRequest> findByBuyerIdAndStatus(Long buyerId, RequestStatus status);
    Long countByFarmerIdAndStatus(Long farmerId, RequestStatus status);
    Long countByBuyerIdAndStatus(Long buyerId, RequestStatus status);
}
