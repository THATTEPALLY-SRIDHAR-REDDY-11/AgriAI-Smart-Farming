package com.agriai;

import com.agriai.dto.*;
import com.agriai.entity.Role;
import com.agriai.entity.RequestStatus;
import com.agriai.service.AuthService;
import com.agriai.service.ProductService;
import com.agriai.service.PurchaseRequestService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AgriBackendApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProductService productService;

    @Autowired
    private PurchaseRequestService requestService;

    @Test
    void testFarmerRegistrationAndLogin() {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Suresh Patel");
        registerReq.setEmail("suresh@agriai.com");
        registerReq.setPassword("password123");
        registerReq.setRole(Role.FARMER);
        registerReq.setPhone("9876543210");
        registerReq.setLocation("Gujarat");

        AuthResponse authRes = authService.register(registerReq);
        assertNotNull(authRes.getToken());
        assertEquals("Suresh Patel", authRes.getName());
        assertEquals(Role.FARMER, authRes.getRole());

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("suresh@agriai.com");
        loginReq.setPassword("password123");

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
    }

    @Test
    void testProductCreationAndRetrieval() {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setName("Farmer Test");
        registerReq.setEmail("farmertest@agriai.com");
        registerReq.setPassword("password123");
        registerReq.setRole(Role.FARMER);

        AuthResponse farmerAuth = authService.register(registerReq);

        ProductDto productDto = ProductDto.builder()
                .name("Organic Capsicum")
                .category("Vegetables")
                .price(60.0)
                .quantity(50.0)
                .unit("kg")
                .location("Pune")
                .build();

        ProductDto created = productService.createProduct(farmerAuth.getProfileId(), productDto);
        assertNotNull(created.getId());
        assertEquals("Organic Capsicum", created.getName());

        List<ProductDto> farmerProducts = productService.getProductsByFarmer(farmerAuth.getProfileId());
        assertFalse(farmerProducts.isEmpty());
    }

    @Test
    void testPurchaseRequestLifecycle() {
        // Register Farmer & Buyer
        RegisterRequest fReq = new RegisterRequest();
        fReq.setName("Farmer Life");
        fReq.setEmail("flife@agriai.com");
        fReq.setPassword("pass");
        fReq.setRole(Role.FARMER);
        AuthResponse farmerAuth = authService.register(fReq);

        RegisterRequest bReq = new RegisterRequest();
        bReq.setName("Buyer Life");
        bReq.setEmail("blife@agriai.com");
        bReq.setPassword("pass");
        bReq.setRole(Role.BUYER);
        AuthResponse buyerAuth = authService.register(bReq);

        // Create product
        ProductDto pDto = productService.createProduct(farmerAuth.getProfileId(), ProductDto.builder()
                .name("Carrots")
                .price(30.0)
                .quantity(100.0)
                .unit("kg")
                .build());

        // Create purchase request
        PurchaseRequestDto reqDto = requestService.createRequest(buyerAuth.getProfileId(), pDto.getId(), 10.0, "Want 10kg");
        assertEquals(RequestStatus.PENDING, reqDto.getStatus());

        // Farmer Accepts request
        PurchaseRequestDto accepted = requestService.updateRequestStatus(reqDto.getId(), RequestStatus.ACCEPTED);
        assertEquals(RequestStatus.ACCEPTED, accepted.getStatus());

        // Farmer Marks Ready for Pickup
        PurchaseRequestDto ready = requestService.updateRequestStatus(reqDto.getId(), RequestStatus.READY_FOR_PICKUP);
        assertEquals(RequestStatus.READY_FOR_PICKUP, ready.getStatus());

        // Buyer Marks Completed
        PurchaseRequestDto completed = requestService.updateRequestStatus(reqDto.getId(), RequestStatus.COMPLETED);
        assertEquals(RequestStatus.COMPLETED, completed.getStatus());
    }
}
