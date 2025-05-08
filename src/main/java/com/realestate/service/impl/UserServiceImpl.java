package com.realestate.service.impl;

import com.realestate.dto.UserDTO;
import com.realestate.model.User;
import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;
import com.realestate.repository.UserRepository;
import com.realestate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.EntityNotFoundException;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
        return convertToDTO(user);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        validatePasswords(userDTO);
        
        User user = convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRegistrationDate(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    public UserDTO updateUser(String id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + id));
        
        // Update user properties
        existingUser.setFullName(userDTO.getFullName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPhone(userDTO.getPhone());
        existingUser.setDob(userDTO.getDob());
        existingUser.setRole(userDTO.getRole());
        existingUser.setStatus(userDTO.getStatus());
        existingUser.setAddress(userDTO.getAddress());
        
        // Update avatar if provided
        if (userDTO.getAvatar() != null) {
            existingUser.setAvatar(userDTO.getAvatar());
        }
        
        // Update password if provided
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            validatePasswords(userDTO);
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        
        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDTO> findUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> findUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> findUsersByRoleAndStatus(UserRole role, UserStatus status) {
        return userRepository.findByRoleAndStatus(role, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDTO> searchUsersByName(String name) {
        return userRepository.findByFullNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Helper methods
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setDob(user.getDob());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setAddress(user.getAddress());
        dto.setAvatar(user.getAvatar());
        dto.setRegistrationDate(user.getRegistrationDate());
        return dto;
    }
    
    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDob(dto.getDob());
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        user.setAddress(dto.getAddress());
        user.setAvatar(dto.getAvatar());
        return user;
    }
    
    private void validatePasswords(UserDTO userDTO) {
        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        
        if (!userDTO.getPassword().equals(userDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }
} 