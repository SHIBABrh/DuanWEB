package com.realestate.service.impl;

import com.realestate.dto.TransactionDTO;
import com.realestate.model.Property;
import com.realestate.model.Transaction;
import com.realestate.model.Transaction.TransactionStatus;
import com.realestate.model.Transaction.TransactionType;
import com.realestate.model.User;
import com.realestate.repository.PropertyRepository;
import com.realestate.repository.TransactionRepository;
import com.realestate.repository.UserRepository;
import com.realestate.service.TransactionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Autowired
    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            PropertyRepository propertyRepository,
            UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        // Validate referenced entities
        Property property = propertyRepository.findById(transactionDTO.getPropertyId())
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + transactionDTO.getPropertyId()));

        User agent = userRepository.findById(transactionDTO.getAgentId())
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + transactionDTO.getAgentId()));

        User client = userRepository.findById(transactionDTO.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + transactionDTO.getClientId()));

        Transaction transaction = new Transaction();
        transaction.setProperty(property);
        transaction.setAgent(agent);
        transaction.setClient(client);
        transaction.setType(transactionDTO.getType());
        transaction.setStatus(transactionDTO.getStatus() != null ? transactionDTO.getStatus() : TransactionStatus.PENDING);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCommission(transactionDTO.getCommission());
        transaction.setPaymentMethod(transactionDTO.getPaymentMethod());
        transaction.setNotes(transactionDTO.getNotes());
        transaction.setStartDate(transactionDTO.getStartDate());
        transaction.setEndDate(transactionDTO.getEndDate());
        transaction.setCreatedAt(LocalDateTime.now());

        // Update property status if transaction is SALE type and COMPLETED status
        if (transactionDTO.getType() == TransactionType.SALE && 
            transactionDTO.getStatus() == TransactionStatus.COMPLETED) {
            property.setStatus(Property.PropertyStatus.SOLD);
            propertyRepository.save(property);
        } 
        // Update property status if transaction is RENTAL type and COMPLETED status
        else if (transactionDTO.getType() == TransactionType.RENTAL && 
                 transactionDTO.getStatus() == TransactionStatus.COMPLETED) {
            property.setStatus(Property.PropertyStatus.RENTED);
            propertyRepository.save(property);
        }

        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    @Override
    public TransactionDTO getTransactionById(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with ID: " + id));
        return convertToDTO(transaction);
    }

    @Override
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TransactionDTO> getTransactionsPaged(Pageable pageable) {
        return transactionRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<TransactionDTO> getTransactionsByProperty(String propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + propertyId));
        
        return transactionRepository.findByProperty(property).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByAgent(String agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + agentId));
        
        return transactionRepository.findByAgent(agent).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TransactionDTO> getTransactionsByAgentAndStatus(String agentId, TransactionStatus status, Pageable pageable) {
        return transactionRepository.findByAgentAndStatus(agentId, status, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<TransactionDTO> getTransactionsByClient(String clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + clientId));
        
        return transactionRepository.findByClient(client).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<TransactionDTO> getTransactionsByClientAndStatus(String clientId, TransactionStatus status, Pageable pageable) {
        return transactionRepository.findByClientAndStatus(clientId, status, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<TransactionDTO> getTransactionsByStatus(TransactionStatus status) {
        return transactionRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByType(TransactionType type) {
        return transactionRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByTypeAndStatus(TransactionType type, TransactionStatus status) {
        return transactionRepository.findByTypeAndStatus(type, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionDTO updateTransaction(String id, TransactionDTO transactionDTO) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with ID: " + id));
        
        // Update property if needed
        if (transactionDTO.getPropertyId() != null && 
                !transaction.getProperty().getId().equals(transactionDTO.getPropertyId())) {
            Property property = propertyRepository.findById(transactionDTO.getPropertyId())
                    .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + transactionDTO.getPropertyId()));
            transaction.setProperty(property);
        }
        
        // Update agent if needed
        if (transactionDTO.getAgentId() != null && 
                !transaction.getAgent().getId().equals(transactionDTO.getAgentId())) {
            User agent = userRepository.findById(transactionDTO.getAgentId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + transactionDTO.getAgentId()));
            transaction.setAgent(agent);
        }
        
        // Update client if needed
        if (transactionDTO.getClientId() != null && 
                !transaction.getClient().getId().equals(transactionDTO.getClientId())) {
            User client = userRepository.findById(transactionDTO.getClientId())
                    .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + transactionDTO.getClientId()));
            transaction.setClient(client);
        }
        
        // Update other fields
        if (transactionDTO.getType() != null) {
            transaction.setType(transactionDTO.getType());
        }
        
        if (transactionDTO.getStatus() != null) {
            transaction.setStatus(transactionDTO.getStatus());
        }
        
        if (transactionDTO.getAmount() != null) {
            transaction.setAmount(transactionDTO.getAmount());
        }
        
        transaction.setCommission(transactionDTO.getCommission());
        transaction.setPaymentMethod(transactionDTO.getPaymentMethod());
        transaction.setNotes(transactionDTO.getNotes());
        transaction.setStartDate(transactionDTO.getStartDate());
        transaction.setEndDate(transactionDTO.getEndDate());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        // Handle property status changes based on transaction status
        updatePropertyStatus(transaction);
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    @Override
    @Transactional
    public TransactionDTO updateTransactionStatus(String id, TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(status);
        transaction.setUpdatedAt(LocalDateTime.now());
        
        // If status is COMPLETED and completedAt is null, set it
        if (status == TransactionStatus.COMPLETED && transaction.getCompletedAt() == null) {
            transaction.setCompletedAt(LocalDateTime.now());
        }
        
        // Update property status
        updatePropertyStatus(transaction);
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return convertToDTO(updatedTransaction);
    }

    @Override
    @Transactional
    public TransactionDTO completeTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setCompletedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());
        
        // Update property status
        updatePropertyStatus(transaction);
        
        Transaction completedTransaction = transactionRepository.save(transaction);
        return convertToDTO(completedTransaction);
    }

    @Override
    @Transactional
    public TransactionDTO cancelTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transaction not found with ID: " + id));
        
        transaction.setStatus(TransactionStatus.CANCELLED);
        transaction.setUpdatedAt(LocalDateTime.now());
        
        Transaction cancelledTransaction = transactionRepository.save(transaction);
        return convertToDTO(cancelledTransaction);
    }

    @Override
    public void deleteTransaction(String id) {
        if (!transactionRepository.existsById(id)) {
            throw new EntityNotFoundException("Transaction not found with ID: " + id);
        }
        transactionRepository.deleteById(id);
    }

    @Override
    public Long countCompletedTransactionsByAgent(String agentId) {
        return transactionRepository.countCompletedTransactionsByAgent(agentId);
    }

    @Override
    public Long countCompletedTransactionsByClient(String clientId) {
        return transactionRepository.countCompletedTransactionsByClient(clientId);
    }
    
    // Helper methods
    private void updatePropertyStatus(Transaction transaction) {
        Property property = transaction.getProperty();
        
        // Only update property status if transaction status is COMPLETED
        if (transaction.getStatus() == TransactionStatus.COMPLETED) {
            if (transaction.getType() == TransactionType.SALE) {
                property.setStatus(Property.PropertyStatus.SOLD);
            } else if (transaction.getType() == TransactionType.RENTAL) {
                property.setStatus(Property.PropertyStatus.RENTED);
            }
            propertyRepository.save(property);
        } 
        // If transaction was COMPLETED but now CANCELLED, restore property status
        else if (transaction.getStatus() == TransactionStatus.CANCELLED) {
            if (property.getStatus() == Property.PropertyStatus.SOLD || 
                property.getStatus() == Property.PropertyStatus.RENTED) {
                property.setStatus(Property.PropertyStatus.PUBLISHED);
                propertyRepository.save(property);
            }
        }
    }
    
    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        
        // Set property information
        dto.setPropertyId(transaction.getProperty().getId());
        dto.setPropertyTitle(transaction.getProperty().getTitle());
        
        // Set agent information
        dto.setAgentId(transaction.getAgent().getId());
        dto.setAgentName(transaction.getAgent().getFullName());
        
        // Set client information
        dto.setClientId(transaction.getClient().getId());
        dto.setClientName(transaction.getClient().getFullName());
        
        dto.setType(transaction.getType());
        dto.setStatus(transaction.getStatus());
        dto.setAmount(transaction.getAmount());
        dto.setCommission(transaction.getCommission());
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setNotes(transaction.getNotes());
        dto.setStartDate(transaction.getStartDate());
        dto.setEndDate(transaction.getEndDate());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());
        dto.setCompletedAt(transaction.getCompletedAt());
        
        return dto;
    }
} 