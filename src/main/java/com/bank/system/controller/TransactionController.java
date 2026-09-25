package com.bank.system.controller;

import com.bank.system.dto.*;
import com.bank.system.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Transaction API", description = "Endpoints for Fund transfers and Transaction history with pagination and date filter")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfers")
    @Operation(summary = "Fund transfer between two accounts", description = "Transfers money from source account to destination account atomically.")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> transfer(@Valid @RequestBody TransferRequest request) {
        List<TransactionResponse> response = transactionService.transfer(request);
        return ResponseEntity.ok(ApiResponse.success("Fund transfer completed successfully", response));
    }

    @GetMapping("/accounts/{accountNumber}/transactions")
    @Operation(
            summary = "Get transaction history for an account",
            description = "Retrieves paginated transaction history filtered by optional date range (startDate, endDate)."
    )
    public ResponseEntity<ApiResponse<PageResponse<TransactionResponse>>> getAccountTransactions(
            @PathVariable String accountNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<TransactionResponse> response = transactionService.getAccountTransactions(
                accountNumber, startDate, endDate, pageable);

        return ResponseEntity.ok(ApiResponse.success("Transaction history retrieved successfully", response));
    }
}
