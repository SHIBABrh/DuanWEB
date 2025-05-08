package com.realestate.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    
    @Id
    @GeneratedValue(generator = "transaction-id-generator")
    @GenericGenerator(name = "transaction-id-generator", 
        strategy = "com.realestate.util.TransactionIdGenerator")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;
    
    @Column(nullable = false)
    private BigDecimal amount;
    
    @Column
    private BigDecimal commission;
    
    @Column
    private String paymentMethod;
    
    @Column(length = 1000)
    private String notes;
    
    @Column
    private LocalDate startDate;
    
    @Column
    private LocalDate endDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime completedAt;
    
    public enum TransactionType {
        SALE, RENTAL
    }
    
    public enum TransactionStatus {
        PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    }
} 