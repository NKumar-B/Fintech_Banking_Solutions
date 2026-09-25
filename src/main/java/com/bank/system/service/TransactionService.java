package com.bank.system.service;

import com.bank.system.dto.*;
import com.bank.system.entity.*;
import com.bank.system.exception.InsufficientBalanceException;
import com.bank.system.exception.InvalidTransactionException;
import com.bank.system.exception.ResourceNotFoundException;
import com.bank.system.repository.AccountRepository;
import com.bank.system.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse deposit(String accountNumber, DepositRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidTransactionException("Account is not active. Current status: " + account.getStatus());
        }

        BigDecimal newBalance = account.getBalance().add(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        String ref = "TRX-DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transaction transaction = Transaction.builder()
                .transactionReference(ref)
                .account(account)
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .description(request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "Cash Deposit")
                .timestamp(LocalDateTime.now())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToTransactionResponse(saved);
    }

    @Transactional
    public TransactionResponse withdraw(String accountNumber, WithdrawalRequest request) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with account number: " + accountNumber));

        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidTransactionException("Account is not active. Current status: " + account.getStatus());
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds. Available balance: " + account.getBalance() + ", Requested withdrawal: " + request.getAmount());
        }

        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        String ref = "TRX-WTH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Transaction transaction = Transaction.builder()
                .transactionReference(ref)
                .account(account)
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(newBalance)
                .description(request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "Cash Withdrawal")
                .timestamp(LocalDateTime.now())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToTransactionResponse(saved);
    }

    @Transactional
    public List<TransactionResponse> transfer(TransferRequest request) {
        if (request.getFromAccountNumber().equalsIgnoreCase(request.getToAccountNumber())) {
            throw new InvalidTransactionException("Source and target account numbers must be different.");
        }

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Source account not found: " + request.getFromAccountNumber()));

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Target account not found: " + request.getToAccountNumber()));

        if (fromAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidTransactionException("Source account is not active.");
        }

        if (toAccount.getStatus() != AccountStatus.ACTIVE) {
            throw new InvalidTransactionException("Target account is not active.");
        }

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Insufficient funds in source account. Available: " + fromAccount.getBalance() + ", Requested transfer: " + request.getAmount());
        }

        // Debit source
        BigDecimal newFromBalance = fromAccount.getBalance().subtract(request.getAmount());
        fromAccount.setBalance(newFromBalance);

        // Credit destination
        BigDecimal newToBalance = toAccount.getBalance().add(request.getAmount());
        toAccount.setBalance(newToBalance);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String refBase = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String desc = request.getDescription() != null && !request.getDescription().isBlank()
                ? request.getDescription()
                : "Fund Transfer";

        // Transaction for Source Account (TRANSFER_OUT)
        Transaction outTx = Transaction.builder()
                .transactionReference("TRX-OUT-" + refBase)
                .account(fromAccount)
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .balanceAfter(newFromBalance)
                .relatedAccountNumber(toAccount.getAccountNumber())
                .description(desc + " to " + toAccount.getAccountNumber())
                .timestamp(LocalDateTime.now())
                .build();

        // Transaction for Target Account (TRANSFER_IN)
        Transaction inTx = Transaction.builder()
                .transactionReference("TRX-IN-" + refBase)
                .account(toAccount)
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .balanceAfter(newToBalance)
                .relatedAccountNumber(fromAccount.getAccountNumber())
                .description(desc + " from " + fromAccount.getAccountNumber())
                .timestamp(LocalDateTime.now())
                .build();

        Transaction savedOut = transactionRepository.save(outTx);
        Transaction savedIn = transactionRepository.save(inTx);

        return List.of(mapToTransactionResponse(savedOut), mapToTransactionResponse(savedIn));
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getAccountTransactions(
            String accountNumber,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable) {

        if (!accountRepository.existsByAccountNumber(accountNumber)) {
            throw new ResourceNotFoundException("Account not found with account number: " + accountNumber);
        }

        Page<Transaction> page = transactionRepository.findByAccountNumberAndDateRange(
                accountNumber, startDate, endDate, pageable);

        Page<TransactionResponse> dtoPage = page.map(this::mapToTransactionResponse);
        return PageResponse.from(dtoPage);
    }

    public TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionReference(transaction.getTransactionReference())
                .accountNumber(transaction.getAccount() != null ? transaction.getAccount().getAccountNumber() : null)
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .balanceAfter(transaction.getBalanceAfter())
                .relatedAccountNumber(transaction.getRelatedAccountNumber())
                .description(transaction.getDescription())
                .timestamp(transaction.getTimestamp())
                .build();
    }
}
