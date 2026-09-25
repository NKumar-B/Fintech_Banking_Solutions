package com.bank.system.service;

import com.bank.system.dto.AccountRequest;
import com.bank.system.dto.AccountResponse;
import com.bank.system.entity.Account;
import com.bank.system.entity.AccountStatus;
import com.bank.system.entity.Customer;
import com.bank.system.entity.Transaction;
import com.bank.system.entity.TransactionType;
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
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public AccountResponse openAccount(AccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        String accountNumber = generateAccountNumber();
        BigDecimal initialBalance = request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO;
        String currency = request.getCurrency() != null && !request.getCurrency().isBlank() ? request.getCurrency() : "USD";

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(request.getAccountType())
                .balance(initialBalance)
                .currency(currency)
                .status(AccountStatus.ACTIVE)
                .customer(customer)
                .createdAt(LocalDateTime.now())
                .build();

        Account savedAccount = accountRepository.save(account);

        if (initialBalance.compareTo(BigDecimal.ZERO) > 0) {
            Transaction transaction = Transaction.builder()
                    .transactionReference("TRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .account(savedAccount)
                    .type(TransactionType.DEPOSIT)
                    .amount(initialBalance)
                    .balanceAfter(initialBalance)
                    .description("Initial deposit on new account creation")
                    .timestamp(LocalDateTime.now())
                    .build();
            transactionRepository.save(transaction);
        }

        return mapToAccountResponse(savedAccount);
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));
        return mapToAccountResponse(account);
    }

    @Transactional(readOnly = true)
    public BigDecimal getAccountBalance(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));
        return account.getBalance();
    }

    @Transactional(readOnly = true)
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
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
