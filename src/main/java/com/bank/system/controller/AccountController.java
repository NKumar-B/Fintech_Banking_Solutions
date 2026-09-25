package com.bank.system.controller;

import com.bank.system.dto.*;
import com.bank.system.service.AccountService;
import com.bank.system.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Account API", description = "Endpoints for Account operations, balance inquiry, deposit, and withdrawal")
public class AccountController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    @PostMapping
    @Operation(summary = "Open an additional account for a customer", description = "Opens a secondary account (Savings/Checking/Business) for an existing customer.")
    public ResponseEntity<ApiResponse<AccountResponse>> openAccount(@Valid @RequestBody AccountRequest request) {
        AccountResponse response = accountService.openAccount(request);
        return new ResponseEntity<>(ApiResponse.success("Account opened successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all bank accounts", description = "Retrieves a list of all bank accounts in the system.")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> response = accountService.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved successfully", response));
    }

    @GetMapping("/{accountNumber}")
    @Operation(summary = "Get account details and balance", description = "Retrieves account details including balance by account number.")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccountByNumber(@PathVariable String accountNumber) {
        AccountResponse response = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account details retrieved successfully", response));
    }

    @GetMapping("/{accountNumber}/balance")
    @Operation(summary = "Get account balance", description = "Retrieves real-time balance for an account.")
    public ResponseEntity<ApiResponse<BigDecimal>> getAccountBalance(@PathVariable String accountNumber) {
        BigDecimal balance = accountService.getAccountBalance(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account balance retrieved successfully", balance));
    }

    @PostMapping("/{accountNumber}/deposit")
    @Operation(summary = "Deposit money into account", description = "Deposits money into specified account and returns updated balance and transaction reference.")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(
            @PathVariable String accountNumber,
            @Valid @RequestBody DepositRequest request) {
        TransactionResponse response = transactionService.deposit(accountNumber, request);
        return ResponseEntity.ok(ApiResponse.success("Deposit successful", response));
    }

    @PostMapping("/{accountNumber}/withdraw")
    @Operation(summary = "Withdraw money from account", description = "Withdraws money from specified account if sufficient funds exist.")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(
            @PathVariable String accountNumber,
            @Valid @RequestBody WithdrawalRequest request) {
        TransactionResponse response = transactionService.withdraw(accountNumber, request);
        return ResponseEntity.ok(ApiResponse.success("Withdrawal successful", response));
    }
}
