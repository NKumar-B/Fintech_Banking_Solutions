package com.bank.system.config;

import com.bank.system.dto.CustomerRequest;
import com.bank.system.dto.CustomerResponse;
import com.bank.system.dto.DepositRequest;
import com.bank.system.dto.TransferRequest;
import com.bank.system.dto.WithdrawalRequest;
import com.bank.system.dto.AccountRequest;
import com.bank.system.entity.AccountType;
import com.bank.system.entity.Customer;
import com.bank.system.entity.Role;
import com.bank.system.entity.User;
import com.bank.system.repository.CustomerRepository;
import com.bank.system.repository.UserRepository;
import com.bank.system.service.AccountService;
import com.bank.system.service.CustomerService;
import com.bank.system.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CustomerService customerService;
    private final AccountService accountService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Seeding Initial Demo Banking Data...");

        try {
            // Seed Admin User
            if (!userRepository.existsByUsername("admin")) {
                userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@nexusbank.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("System Administrator")
                        .phone("+1-800-555-0100")
                        .role(Role.ROLE_ADMIN)
                        .build());
                log.info("Seeded Admin user: 'admin' / 'admin123'");
            }

            // Customer 1: Alex Morgan (Has 2 Accounts: Savings & Checking)
            CustomerResponse customer1 = customerService.createCustomer(CustomerRequest.builder()
                    .name("Alex Morgan")
                    .email("alex.morgan@nexusbank.com")
                    .phone("+1-555-019-2834")
                    .address("742 Evergreen Terrace, Springfield, IL")
                    .initialAccountType(AccountType.SAVINGS)
                    .initialDeposit(new BigDecimal("5000.00"))
                    .currency("USD")
                    .build());

            Customer alexCustomerEntity = customerRepository.findById(customer1.getId()).orElse(null);

            if (!userRepository.existsByUsername("alex")) {
                userRepository.save(User.builder()
                        .username("alex")
                        .email("alex.morgan@nexusbank.com")
                        .password(passwordEncoder.encode("password123"))
                        .name("Alex Morgan")
                        .phone("+1-555-019-2834")
                        .role(Role.ROLE_USER)
                        .customer(alexCustomerEntity)
                        .build());
                log.info("Seeded Demo User: 'alex' / 'password123'");
            }

            String alexSavingsAcc = customer1.getAccounts().get(0).getAccountNumber();

            // Open second account (Checking) for Alex Morgan
            accountService.openAccount(AccountRequest.builder()
                    .customerId(customer1.getId())
                    .accountType(AccountType.CHECKING)
                    .initialBalance(new BigDecimal("2500.00"))
                    .currency("USD")
                    .build());

            String alexCheckingAcc = customerService.getCustomerAccounts(customer1.getId()).stream()
                    .filter(a -> a.getAccountType() == AccountType.CHECKING)
                    .findFirst().get().getAccountNumber();

            // Customer 2: Sophia Chen (Savings Account)
            CustomerResponse customer2 = customerService.createCustomer(CustomerRequest.builder()
                    .name("Sophia Chen")
                    .email("sophia.chen@fintech.io")
                    .phone("+1-555-482-9102")
                    .address("100 Market St, San Francisco, CA")
                    .initialAccountType(AccountType.SAVINGS)
                    .initialDeposit(new BigDecimal("12500.00"))
                    .currency("USD")
                    .build());

            Customer sophiaCustomerEntity = customerRepository.findById(customer2.getId()).orElse(null);

            if (!userRepository.existsByUsername("sophia")) {
                userRepository.save(User.builder()
                        .username("sophia")
                        .email("sophia.chen@fintech.io")
                        .password(passwordEncoder.encode("password123"))
                        .name("Sophia Chen")
                        .phone("+1-555-482-9102")
                        .role(Role.ROLE_USER)
                        .customer(sophiaCustomerEntity)
                        .build());
                log.info("Seeded Demo User: 'sophia' / 'password123'");
            }

            String sophiaSavingsAcc = customer2.getAccounts().get(0).getAccountNumber();

            // Customer 3: Marcus Vance (Business Account)
            CustomerResponse customer3 = customerService.createCustomer(CustomerRequest.builder()
                    .name("Marcus Vance")
                    .email("marcus@vancetech.com")
                    .phone("+1-555-883-2019")
                    .address("500 Wall Street, New York, NY")
                    .initialAccountType(AccountType.BUSINESS)
                    .initialDeposit(new BigDecimal("50000.00"))
                    .currency("USD")
                    .build());

            Customer marcusCustomerEntity = customerRepository.findById(customer3.getId()).orElse(null);

            if (!userRepository.existsByUsername("marcus")) {
                userRepository.save(User.builder()
                        .username("marcus")
                        .email("marcus@vancetech.com")
                        .password(passwordEncoder.encode("password123"))
                        .name("Marcus Vance")
                        .phone("+1-555-883-2019")
                        .role(Role.ROLE_USER)
                        .customer(marcusCustomerEntity)
                        .build());
                log.info("Seeded Demo User: 'marcus' / 'password123'");
            }

            // Perform sample transactions for rich history
            transactionService.deposit(alexSavingsAcc, DepositRequest.builder()
                    .amount(new BigDecimal("1500.00"))
                    .description("Quarterly Bonus Deposit")
                    .build());

            transactionService.withdraw(alexSavingsAcc, WithdrawalRequest.builder()
                    .amount(new BigDecimal("300.00"))
                    .description("ATM Withdrawal")
                    .build());

            transactionService.transfer(TransferRequest.builder()
                    .fromAccountNumber(alexSavingsAcc)
                    .toAccountNumber(alexCheckingAcc)
                    .amount(new BigDecimal("800.00"))
                    .description("Internal Savings to Checking Transfer")
                    .build());

            transactionService.transfer(TransferRequest.builder()
                    .fromAccountNumber(sophiaSavingsAcc)
                    .toAccountNumber(alexSavingsAcc)
                    .amount(new BigDecimal("1200.00"))
                    .description("Consulting Services Payment")
                    .build());

            log.info("Demo Data Initialization Complete!");
            log.info("Alex Morgan Customer ID: {}", customer1.getId());
            log.info("Alex Savings Account: {}", alexSavingsAcc);
            log.info("Alex Checking Account: {}", alexCheckingAcc);
            log.info("Sophia Savings Account: {}", sophiaSavingsAcc);

        } catch (Exception e) {
            log.warn("Sample data initialization warning: {}", e.getMessage());
        }
    }
}
