package com.realestate.repository;

import com.realestate.model.Property;
import com.realestate.model.Transaction;
import com.realestate.model.Transaction.TransactionStatus;
import com.realestate.model.Transaction.TransactionType;
import com.realestate.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    
    List<Transaction> findByProperty(Property property);
    
    List<Transaction> findByAgent(User agent);
    
    List<Transaction> findByClient(User client);
    
    List<Transaction> findByStatus(TransactionStatus status);
    
    List<Transaction> findByType(TransactionType type);
    
    List<Transaction> findByTypeAndStatus(TransactionType type, TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.agent.id = :agentId AND t.status = :status")
    Page<Transaction> findByAgentAndStatus(
            @Param("agentId") String agentId,
            @Param("status") TransactionStatus status,
            Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.client.id = :clientId AND t.status = :status")
    Page<Transaction> findByClientAndStatus(
            @Param("clientId") String clientId,
            @Param("status") TransactionStatus status,
            Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.agent.id = :agentId AND t.status = 'COMPLETED'")
    Long countCompletedTransactionsByAgent(@Param("agentId") String agentId);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.client.id = :clientId AND t.status = 'COMPLETED'")
    Long countCompletedTransactionsByClient(@Param("clientId") String clientId);
} 