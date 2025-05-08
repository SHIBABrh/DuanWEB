package com.realestate.service;

import com.realestate.dto.TransactionDTO;
import com.realestate.model.Transaction.TransactionStatus;
import com.realestate.model.Transaction.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
    
    TransactionDTO getTransactionById(String id);
    
    List<TransactionDTO> getAllTransactions();
    
    Page<TransactionDTO> getTransactionsPaged(Pageable pageable);
    
    List<TransactionDTO> getTransactionsByProperty(String propertyId);
    
    List<TransactionDTO> getTransactionsByAgent(String agentId);
    
    Page<TransactionDTO> getTransactionsByAgentAndStatus(String agentId, TransactionStatus status, Pageable pageable);
    
    List<TransactionDTO> getTransactionsByClient(String clientId);
    
    Page<TransactionDTO> getTransactionsByClientAndStatus(String clientId, TransactionStatus status, Pageable pageable);
    
    List<TransactionDTO> getTransactionsByStatus(TransactionStatus status);
    
    List<TransactionDTO> getTransactionsByType(TransactionType type);
    
    List<TransactionDTO> getTransactionsByTypeAndStatus(TransactionType type, TransactionStatus status);
    
    List<TransactionDTO> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    TransactionDTO updateTransaction(String id, TransactionDTO transactionDTO);
    
    TransactionDTO updateTransactionStatus(String id, TransactionStatus status);
    
    TransactionDTO completeTransaction(String id);
    
    TransactionDTO cancelTransaction(String id);
    
    void deleteTransaction(String id);
    
    Long countCompletedTransactionsByAgent(String agentId);
    
    Long countCompletedTransactionsByClient(String clientId);
} 