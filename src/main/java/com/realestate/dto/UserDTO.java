package com.realestate.dto;

import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data Transfer Object for User information")
public class UserDTO {
    @Schema(description = "Unique identifier of the user", example = "UID001")
    private String id;
    
    @Schema(description = "Full name of the user", example = "Nguyễn Văn A", required = true)
    private String fullName;
    
    @Schema(description = "Email address of the user", example = "nguyenvana@example.com", required = true)
    private String email;
    
    @Schema(description = "Phone number of the user", example = "0123456789")
    private String phone;
    
    @Schema(description = "Date of birth", example = "1990-01-01")
    private LocalDate dob;
    
    @Schema(description = "User role in the system", example = "ADMIN", required = true, allowableValues = {"ADMIN", "MANAGER", "AGENT", "CLIENT"})
    private UserRole role;
    
    @Schema(description = "Current user status", example = "ACTIVE", required = true, allowableValues = {"ACTIVE", "INACTIVE", "PENDING"})
    private UserStatus status;
    
    @Schema(description = "User's address", example = "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh")
    private String address;
    
    @Schema(description = "User's profile picture as byte array", hidden = true)
    private byte[] avatar;
    
    @Schema(description = "Date and time when the user registered", example = "2023-01-01T10:00:00")
    private LocalDateTime registrationDate;
    
    // Field for password - only used during creation/update
    @Schema(description = "User's password (only for creation/update)", writeOnly = true)
    private String password;
    
    @Schema(description = "Password confirmation (only for creation/update)", writeOnly = true)
    private String confirmPassword;
} 