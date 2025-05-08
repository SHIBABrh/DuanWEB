package com.realestate.dto;

import com.realestate.model.Transaction.TransactionStatus;
import com.realestate.model.Transaction.TransactionType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data Transfer Object for Transaction information")
public class TransactionDTO {
    
    @Schema(description = "Unique identifier of the transaction", example = "TRX001")
    private String id;
    
    @Schema(description = "ID of the property associated with this transaction", example = "PROP001", required = true)
    private String propertyId;
    
    @Schema(description = "Title of the property", example = "Modern Apartment in District 2")
    private String propertyTitle;
    
    @Schema(description = "ID of the agent handling this transaction", example = "UID001", required = true)
    private String agentId;
    
    @Schema(description = "Name of the agent", example = "Nguyễn Văn A")
    private String agentName;
    
    @Schema(description = "ID of the client involved in this transaction", example = "UID004", required = true)
    private String clientId;
    
    @Schema(description = "Name of the client", example = "Trần Thị B")
    private String clientName;
    
    @Schema(description = "Type of transaction", example = "SALE", required = true, 
            allowableValues = {"SALE", "RENTAL"})
    private TransactionType type;
    
    @Schema(description = "Current status of the transaction", example = "PENDING", required = true,
            allowableValues = {"PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"})
    private TransactionStatus status;
    
    @Schema(description = "Total amount of the transaction in VND", example = "2000000000", required = true)
    private BigDecimal amount;
    
    @Schema(description = "Commission amount for the agent", example = "60000000")
    private BigDecimal commission;
    
    @Schema(description = "Payment method used", example = "Bank Transfer")
    private String paymentMethod;
    
    @Schema(description = "Additional notes about the transaction", example = "Client requests to finalize before end of month")
    private String notes;
    
    @Schema(description = "Start date for rental transactions", example = "2023-06-01")
    private LocalDate startDate;
    
    @Schema(description = "End date for rental transactions", example = "2024-05-31")
    private LocalDate endDate;
    
    @Schema(description = "Date and time when the transaction was created")
    private LocalDateTime createdAt;
    
    @Schema(description = "Date and time when the transaction was last updated")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Date and time when the transaction was completed")
    private LocalDateTime completedAt;
} 