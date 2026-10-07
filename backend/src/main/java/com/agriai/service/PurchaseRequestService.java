package com.agriai.service;

import com.agriai.dto.PurchaseRequestDto;
import com.agriai.entity.*;
import com.agriai.exception.BadRequestException;
import com.agriai.exception.ResourceNotFoundException;
import com.agriai.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PurchaseRequestService {

    private final PurchaseRequestRepository requestRepository;
    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final UserRepository userRepository;

    public PurchaseRequestService(PurchaseRequestRepository requestRepository, ProductRepository productRepository, FarmerRepository farmerRepository, BuyerRepository buyerRepository, UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.productRepository = productRepository;
        this.farmerRepository = farmerRepository;
        this.buyerRepository = buyerRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PurchaseRequestDto createRequest(Long buyerId, Long productId, Double requestedQuantity, String message) {
        if (requestedQuantity == null || requestedQuantity <= 0) {
            throw new BadRequestException("Requested quantity must be greater than zero.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new BadRequestException("This product is currently out of stock.");
        }

        if (product.getQuantity() != null && requestedQuantity > product.getQuantity()) {
            throw new BadRequestException("Requested quantity exceeds available stock (" + product.getQuantity() + " " + product.getUnit() + ").");
        }

        PurchaseRequest request = PurchaseRequest.builder()
                .productId(productId)
                .buyerId(buyerId)
                .farmerId(product.getFarmerId())
                .requestedQuantity(requestedQuantity)
                .message(message)
                .status(RequestStatus.PENDING)
                .build();

        PurchaseRequest saved = requestRepository.save(request);
        return mapToDto(saved);
    }

    public List<PurchaseRequestDto> getFarmerRequests(Long farmerId) {
        return requestRepository.findByFarmerId(farmerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<PurchaseRequestDto> getBuyerRequests(Long buyerId) {
        return requestRepository.findByBuyerId(buyerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PurchaseRequestDto updateRequestStatus(Long requestId, RequestStatus newStatus) {
        PurchaseRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase request not found"));

        req.setStatus(newStatus);
        PurchaseRequest saved = requestRepository.save(req);
        return mapToDto(saved);
    }

    public PurchaseRequestDto mapToDto(PurchaseRequest req) {
        Product product = productRepository.findById(req.getProductId()).orElse(null);
        Farmer farmer = farmerRepository.findById(req.getFarmerId()).orElse(null);
        Buyer buyer = buyerRepository.findById(req.getBuyerId()).orElse(null);

        User farmerUser = farmer != null ? userRepository.findById(farmer.getUserId()).orElse(null) : null;
        User buyerUser = buyer != null ? userRepository.findById(buyer.getUserId()).orElse(null) : null;

        return PurchaseRequestDto.builder()
                .id(req.getId())
                .productId(req.getProductId())
                .productName(product != null ? product.getName() : "Produce")
                .productPrice(product != null ? product.getPrice() : 0.0)
                .productUnit(product != null ? product.getUnit() : "kg")
                .productImage(product != null ? product.getImageUrl() : "")
                .buyerId(req.getBuyerId())
                .buyerName(buyerUser != null ? buyerUser.getName() : "Buyer")
                .buyerPhone(buyer != null ? buyer.getPhone() : "")
                .buyerLocation(buyer != null ? buyer.getLocation() : "")
                .farmerId(req.getFarmerId())
                .farmerName(farmerUser != null ? farmerUser.getName() : "Farmer")
                .farmerPhone(product != null && product.getContact() != null ? product.getContact() : (farmer != null ? farmer.getPhone() : ""))
                .farmerLocation(product != null && product.getLocation() != null ? product.getLocation() : (farmer != null ? farmer.getLocation() : ""))
                .requestedQuantity(req.getRequestedQuantity())
                .message(req.getMessage())
                .status(req.getStatus())
                .createdAt(req.getCreatedAt())
                .updatedAt(req.getUpdatedAt())
                .build();
    }
}
