package com.agriai.config;

import com.agriai.entity.*;
import com.agriai.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final ProductRepository productRepository;
    private final PurchaseRequestRepository requestRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, FarmerRepository farmerRepository, BuyerRepository buyerRepository, ProductRepository productRepository, PurchaseRequestRepository requestRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.farmerRepository = farmerRepository;
        this.buyerRepository = buyerRepository;
        this.productRepository = productRepository;
        this.requestRepository = requestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("[DataInitializer] Seeding initial AgriAI demo data...");

        // 1. Create Farmer User
        User farmerUser = userRepository.save(User.builder()
                .name("Ramesh Kumar")
                .email("farmer@agriai.com")
                .password(passwordEncoder.encode("farmer123"))
                .role(Role.FARMER)
                .build());

        Farmer farmer = farmerRepository.save(Farmer.builder()
                .userId(farmerUser.getId())
                .phone("+91 98765 43210")
                .location("Hyderabad, Telangana")
                .farmDetails("10-acre organic vegetable farm focusing on tomatoes, potatoes, and peppers.")
                .build());

        // 2. Create Buyer User
        User buyerUser = userRepository.save(User.builder()
                .name("Anita Sharma")
                .email("buyer@agriai.com")
                .password(passwordEncoder.encode("buyer123"))
                .role(Role.BUYER)
                .build());

        Buyer buyer = buyerRepository.save(Buyer.builder()
                .userId(buyerUser.getId())
                .phone("+91 91234 56789")
                .location("Secunderabad, Telangana")
                .build());

        // 3. Create Sample Products
        Product p1 = productRepository.save(Product.builder()
                .farmerId(farmer.getId())
                .name("Fresh Farm Tomatoes")
                .category("Vegetables")
                .description("Vine-ripened organic red tomatoes harvested daily from open fields.")
                .price(40.0)
                .quantity(150.0)
                .unit("kg")
                .imageUrl("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80")
                .location("Hyderabad, Telangana")
                .contact("+91 98765 43210")
                .status(ProductStatus.AVAILABLE)
                .build());

        Product p2 = productRepository.save(Product.builder()
                .farmerId(farmer.getId())
                .name("Organic Kufri Potatoes")
                .category("Vegetables")
                .description("Freshly harvested grade-A potatoes, ideal for wholesale and retail.")
                .price(25.0)
                .quantity(500.0)
                .unit("kg")
                .imageUrl("https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80")
                .location("Hyderabad, Telangana")
                .contact("+91 98765 43210")
                .status(ProductStatus.AVAILABLE)
                .build());

        // 4. Create Sample Purchase Request
        requestRepository.save(PurchaseRequest.builder()
                .productId(p1.getId())
                .buyerId(buyer.getId())
                .farmerId(farmer.getId())
                .requestedQuantity(25.0)
                .message("Hi Ramesh, I would like to buy 25 kg tomatoes for pickup tomorrow morning.")
                .status(RequestStatus.PENDING)
                .build());

        System.out.println("[DataInitializer] Demo accounts ready:\n - Farmer: farmer@agriai.com / farmer123\n - Buyer:  buyer@agriai.com / buyer123");
    }
}
