package com.realestate.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(generator = "user-id-generator")
    @GenericGenerator(name = "user-id-generator", 
        strategy = "com.realestate.util.UserIdGenerator")
    private String id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column
    private String phone;
    
    @Column
    private LocalDate dob;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;
    
    @Column
    private String address;
    
    @Lob
    @Column(columnDefinition = "VARBINARY(MAX)")
    private byte[] avatar;
    
    @Column(nullable = false)
    private LocalDateTime registrationDate;
    
    public enum UserRole {
        ADMIN, MANAGER, AGENT, CLIENT
    }
    
    public enum UserStatus {
        ACTIVE, INACTIVE, PENDING
    }
} 