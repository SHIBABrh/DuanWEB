package com.realestate.controller;

import com.realestate.dto.TransactionDTO;
import com.realestate.model.Transaction.TransactionStatus;
import com.realestate.model.Transaction.TransactionType;
import com.realestate.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transaction Management", description = "APIs for managing property transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @Operation(summary = "Create a new transaction", description = "Add a new transaction to the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transaction successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @Parameter(description = "Transaction data to create", required = true)
            @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO createdTransaction = transactionService.createTransaction(transactionDTO);
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    @Operation(summary = "Get a transaction by ID", description = "Retrieve details of a specific transaction")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved transaction"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(
            @Parameter(description = "ID of the transaction to retrieve", required = true)
            @PathVariable String id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @Operation(summary = "Get all transactions", description = "Retrieve all transactions with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved transactions")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTransactions(
            @Parameter(description = "Property ID filter")
            @RequestParam(required = false) String propertyId,
            @Parameter(description = "Agent ID filter")
            @RequestParam(required = false) String agentId,
            @Parameter(description = "Client ID filter")
            @RequestParam(required = false) String clientId,
            @Parameter(description = "Transaction status filter", 
                     schema = @Schema(allowableValues = {"PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"}))
            @RequestParam(required = false) String status,
            @Parameter(description = "Transaction type filter", 
                     schema = @Schema(allowableValues = {"SALE", "RENTAL"}))
            @RequestParam(required = false) String type,
            @Parameter(description = "Start date filter")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "End date filter")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @Parameter(description = "Page number (starts from 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc or desc)")
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<TransactionDTO> transactionPage;
        List<TransactionDTO> transactions;
        
        // Filter by property
        if (propertyId != null && !propertyId.isEmpty()) {
            transactions = transactionService.getTransactionsByProperty(propertyId);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by agent and status
        else if (agentId != null && !agentId.isEmpty() && status != null && !status.isEmpty()) {
            TransactionStatus statusEnum = TransactionStatus.valueOf(status.toUpperCase());
            transactionPage = transactionService.getTransactionsByAgentAndStatus(agentId, statusEnum, pageable);
        }
        // Filter by agent only
        else if (agentId != null && !agentId.isEmpty()) {
            transactions = transactionService.getTransactionsByAgent(agentId);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by client and status
        else if (clientId != null && !clientId.isEmpty() && status != null && !status.isEmpty()) {
            TransactionStatus statusEnum = TransactionStatus.valueOf(status.toUpperCase());
            transactionPage = transactionService.getTransactionsByClientAndStatus(clientId, statusEnum, pageable);
        }
        // Filter by client only
        else if (clientId != null && !clientId.isEmpty()) {
            transactions = transactionService.getTransactionsByClient(clientId);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by type and status
        else if (type != null && !type.isEmpty() && status != null && !status.isEmpty()) {
            TransactionType typeEnum = TransactionType.valueOf(type.toUpperCase());
            TransactionStatus statusEnum = TransactionStatus.valueOf(status.toUpperCase());
            transactions = transactionService.getTransactionsByTypeAndStatus(typeEnum, statusEnum);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by type only
        else if (type != null && !type.isEmpty()) {
            TransactionType typeEnum = TransactionType.valueOf(type.toUpperCase());
            transactions = transactionService.getTransactionsByType(typeEnum);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by status only
        else if (status != null && !status.isEmpty()) {
            TransactionStatus statusEnum = TransactionStatus.valueOf(status.toUpperCase());
            transactions = transactionService.getTransactionsByStatus(statusEnum);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // Filter by date range
        else if (startDate != null && endDate != null) {
            transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
            Map<String, Object> response = new HashMap<>();
            response.put("transactions", transactions);
            response.put("totalItems", transactions.size());
            return ResponseEntity.ok(response);
        }
        // No filters
        else {
            transactionPage = transactionService.getTransactionsPaged(pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("transactions", transactionPage.getContent());
        response.put("currentPage", transactionPage.getNumber());
        response.put("totalItems", transactionPage.getTotalElements());
        response.put("totalPages", transactionPage.getTotalPages());
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a transaction", description = "Update an existing transaction's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction successfully updated"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @Parameter(description = "ID of the transaction to update", required = true)
            @PathVariable String id,
            @Parameter(description = "Updated transaction data", required = true)
            @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO updatedTransaction = transactionService.updateTransaction(id, transactionDTO);
        return ResponseEntity.ok(updatedTransaction);
    }

    @Operation(summary = "Delete a transaction", description = "Remove a transaction from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(
            @Parameter(description = "ID of the transaction to delete", required = true)
            @PathVariable String id) {
        transactionService.deleteTransaction(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Transaction deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update transaction status", description = "Change the status of a transaction")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction status successfully updated"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<TransactionDTO> updateTransactionStatus(
            @Parameter(description = "ID of the transaction", required = true)
            @PathVariable String id,
            @Parameter(description = "New status value", required = true, 
                     schema = @Schema(allowableValues = {"PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"}))
            @RequestParam String status) {
        TransactionStatus statusEnum = TransactionStatus.valueOf(status.toUpperCase());
        TransactionDTO updatedTransaction = transactionService.updateTransactionStatus(id, statusEnum);
        return ResponseEntity.ok(updatedTransaction);
    }

    @Operation(summary = "Complete a transaction", description = "Mark a transaction as completed")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction successfully completed"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @PostMapping("/{id}/complete")
    public ResponseEntity<TransactionDTO> completeTransaction(
            @Parameter(description = "ID of the transaction to complete", required = true)
            @PathVariable String id) {
        TransactionDTO completedTransaction = transactionService.completeTransaction(id);
        return ResponseEntity.ok(completedTransaction);
    }

    @Operation(summary = "Cancel a transaction", description = "Mark a transaction as cancelled")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transaction successfully cancelled"),
            @ApiResponse(responseCode = "404", description = "Transaction not found")
    })
    @PostMapping("/{id}/cancel")
    public ResponseEntity<TransactionDTO> cancelTransaction(
            @Parameter(description = "ID of the transaction to cancel", required = true)
            @PathVariable String id) {
        TransactionDTO cancelledTransaction = transactionService.cancelTransaction(id);
        return ResponseEntity.ok(cancelledTransaction);
    }
    
    @Operation(summary = "Get transaction stats for an agent", description = "Count completed transactions for an agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved transaction count")
    })
    @GetMapping("/stats/agent/{agentId}")
    public ResponseEntity<Map<String, Long>> getAgentTransactionStats(
            @Parameter(description = "ID of the agent", required = true)
            @PathVariable String agentId) {
        Long completedCount = transactionService.countCompletedTransactionsByAgent(agentId);
        Map<String, Long> stats = new HashMap<>();
        stats.put("completedTransactions", completedCount);
        return ResponseEntity.ok(stats);
    }
    
    @Operation(summary = "Get transaction stats for a client", description = "Count completed transactions for a client")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved transaction count")
    })
    @GetMapping("/stats/client/{clientId}")
    public ResponseEntity<Map<String, Long>> getClientTransactionStats(
            @Parameter(description = "ID of the client", required = true)
            @PathVariable String clientId) {
        Long completedCount = transactionService.countCompletedTransactionsByClient(clientId);
        Map<String, Long> stats = new HashMap<>();
        stats.put("completedTransactions", completedCount);
        return ResponseEntity.ok(stats);
    }
} 