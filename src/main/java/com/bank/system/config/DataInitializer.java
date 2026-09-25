package com.bank.system.config;

import com.bank.system.dto.CustomerRequest;
import com.bank.system.dto.CustomerResponse;
import com.bank.system.dto.DepositRequest;
import com.bank.system.dto.TransferRequest;
import com.bank.system.dto.WithdrawalRequest;
import com.bank.system.dto.AccountRequest;
import com.bank.system.entity.AccountType;
import com.bank.system.service.AccountService;
import com.bank.system.service.CustomerService;
import com.bank.system.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CustomerService customerService;
    private final AccountService accountService;
    private final TransactionService transactionService;

    @Override
    public void run(String... args) throws Exception {
        log.info("Seeding Initial Demo Banking Data...");

        try {
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
