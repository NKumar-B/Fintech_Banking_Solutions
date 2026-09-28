package com.bank.system.service;

import com.bank.system.config.JwtUtils;
import com.bank.system.dto.*;
import com.bank.system.entity.AccountType;
import com.bank.system.entity.Customer;
import com.bank.system.entity.Role;
import com.bank.system.entity.User;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.CustomerRepository;
import com.bank.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing user registration for username: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }

        Role userRole = request.getRole() != null ? request.getRole() : Role.ROLE_USER;

        // Auto-create customer profile and primary account if requested or for regular users
        Customer customer = null;
        if (request.getInitialAccountType() != null || userRole == Role.ROLE_USER) {
            AccountType accType = request.getInitialAccountType() != null ? request.getInitialAccountType() : AccountType.SAVINGS;
            BigDecimal deposit = request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO;

            CustomerResponse customerDto = customerService.createCustomer(CustomerRequest.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .address(request.getAddress())
                    .initialAccountType(accType)
                    .initialDeposit(deposit)
                    .currency("USD")
                    .build());

            customer = customerRepository.findById(customerDto.getId())
                    .orElse(null);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(userRole)
                .customer(customer)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtils.generateToken(savedUser);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationTimeSeconds())
                .userId(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().name())
                .customerId(savedUser.getCustomer() != null ? savedUser.getCustomer().getId() : null)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login request for: {}", request.getUsernameOrEmail());

        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username/email or password");
        }

        String token = jwtUtils.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtils.getExpirationTimeSeconds())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .customerId(user.getCustomer() != null ? user.getCustomer().getId() : null)
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .role(user.getRole())
                .customerId(user.getCustomer() != null ? user.getCustomer().getId() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
