package com.bank.system.controller;

import com.bank.system.dto.AccountResponse;
import com.bank.system.dto.ApiResponse;
import com.bank.system.dto.CustomerRequest;
import com.bank.system.dto.CustomerResponse;
import com.bank.system.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Customer API", description = "Endpoints for Customer management and opening primary accounts")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create customer & open initial account", description = "Creates a new customer record and automatically opens their initial bank account.")
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return new ResponseEntity<>(ApiResponse.success("Customer created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all customers", description = "Retrieves a list of all registered customers with their associated accounts.")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> response = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID", description = "Retrieves customer information and their accounts by Customer ID.")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", response));
    }

    @GetMapping("/{id}/accounts")
    @Operation(summary = "Get accounts for customer", description = "Retrieves all bank accounts belonging to a specific customer ID.")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getCustomerAccounts(@PathVariable Long id) {
        List<AccountResponse> response = customerService.getCustomerAccounts(id);
        return ResponseEntity.ok(ApiResponse.success("Customer accounts retrieved successfully", response));
    }
}
