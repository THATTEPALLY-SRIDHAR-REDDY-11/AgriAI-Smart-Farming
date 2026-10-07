package com.agriai.service;

import com.agriai.dto.AuthResponse;
import com.agriai.dto.LoginRequest;
import com.agriai.dto.RegisterRequest;
import com.agriai.entity.Buyer;
import com.agriai.entity.Farmer;
import com.agriai.entity.Role;
import com.agriai.entity.User;
import com.agriai.exception.BadRequestException;
import com.agriai.exception.ResourceNotFoundException;
import com.agriai.repository.BuyerRepository;
import com.agriai.repository.FarmerRepository;
import com.agriai.repository.UserRepository;
import com.agriai.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, FarmerRepository farmerRepository, BuyerRepository buyerRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.farmerRepository = farmerRepository;
        this.buyerRepository = buyerRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        User savedUser = userRepository.save(user);
        Long profileId = null;

        if (request.getRole() == Role.FARMER) {
            Farmer farmer = Farmer.builder()
                    .userId(savedUser.getId())
                    .phone(request.getPhone() != null ? request.getPhone() : "")
                    .location(request.getLocation() != null ? request.getLocation() : "")
                    .farmDetails(request.getFarmDetails() != null ? request.getFarmDetails() : "")
                    .build();
            Farmer savedFarmer = farmerRepository.save(farmer);
            profileId = savedFarmer.getId();
        } else {
            Buyer buyer = Buyer.builder()
                    .userId(savedUser.getId())
                    .phone(request.getPhone() != null ? request.getPhone() : "")
                    .location(request.getLocation() != null ? request.getLocation() : "")
                    .build();
            Buyer savedBuyer = buyerRepository.save(buyer);
            profileId = savedBuyer.getId();
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .profileId(profileId)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Long profileId = null;
        if (user.getRole() == Role.FARMER) {
            Farmer farmer = farmerRepository.findByUserId(user.getId())
                    .orElseGet(() -> farmerRepository.save(Farmer.builder().userId(user.getId()).build()));
            profileId = farmer.getId();
        } else {
            Buyer buyer = buyerRepository.findByUserId(user.getId())
                    .orElseGet(() -> buyerRepository.save(Buyer.builder().userId(user.getId()).build()));
            profileId = buyer.getId();
        }

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileId(profileId)
                .build();
    }
}
