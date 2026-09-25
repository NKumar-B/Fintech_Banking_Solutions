package com.bank.system.service;

import com.bank.system.dto.*;
import com.bank.system.entity.*;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.CustomerRepository;
import com.bank.system.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Customer with email " + request.getEmail() + " already exists");
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .createdAt(LocalDateTime.now())
                .build();

        Customer savedCustomer = customerRepository.save(customer);

        // Open initial account for customer
        String accountNumber = generateAccountNumber();
        BigDecimal initialDeposit = request.getInitialDeposit() != null ? request.getInitialDeposit() : BigDecimal.ZERO;
        String currency = request.getCurrency() != null && !request.getCurrency().isBlank() ? request.getCurrency() : "USD";

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(request.getInitialAccountType())
                .balance(initialDeposit)
                .currency(currency)
                .status(AccountStatus.ACTIVE)
                .customer(savedCustomer)
                .createdAt(LocalDateTime.now())
                .build();

        Account savedAccount = accountRepository.save(account);

        // Record initial deposit transaction if > 0
        if (initialDeposit.compareTo(BigDecimal.ZERO) > 0) {
            Transaction transaction = Transaction.builder()
                    .transactionReference("TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .account(savedAccount)
                    .type(TransactionType.DEPOSIT)
                    .amount(initialDeposit)
                    .balanceAfter(initialDeposit)
                    .description("Initial account opening deposit")
                    .timestamp(LocalDateTime.now())
                    .build();
            transactionRepository.save(transaction);
        }

        savedCustomer.getAccounts().add(savedAccount);
        return mapToCustomerResponse(savedCustomer);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToCustomerResponse(customer);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToCustomerResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getCustomerAccounts(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        return accountRepository.findByCustomerId(customerId).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    private String generateAccountNumber() {
        Random random = new Random();
        String num;
        do {
            long number = 1000000000L + (long)(random.nextDouble() * 9000000000L);
            num = "ACC" + number;
        } while (accountRepository.existsByAccountNumber(num));
        return num;
    }

    public CustomerResponse mapToCustomerResponse(Customer customer) {
        List<AccountResponse> accountResponses = customer.getAccounts() != null ?
                customer.getAccounts().stream().map(this::mapToAccountResponse).collect(Collectors.toList())
                : List.of();

        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .createdAt(customer.getCreatedAt())
                .accounts(accountResponses)
                .build();
    }

    public AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .status(account.getStatus())
                .customerId(account.getCustomer() != null ? account.getCustomer().getId() : null)
                .customerName(account.getCustomer() != null ? account.getCustomer().getName() : null)
                .createdAt(account.getCreatedAt())
                .build();
    }
}
