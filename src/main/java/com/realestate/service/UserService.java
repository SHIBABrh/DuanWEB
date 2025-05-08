package com.realestate.service;

import com.realestate.dto.UserDTO;
import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;

import java.util.List;

public interface UserService {
    
    List<UserDTO> getAllUsers();
    
    UserDTO getUserById(String id);
    
    UserDTO getUserByEmail(String email);
    
    UserDTO createUser(UserDTO userDTO);
    
    UserDTO updateUser(String id, UserDTO userDTO);
    
    void deleteUser(String id);
    
    List<UserDTO> findUsersByRole(UserRole role);
    
    List<UserDTO> findUsersByStatus(UserStatus status);
    
    List<UserDTO> findUsersByRoleAndStatus(UserRole role, UserStatus status);
    
    List<UserDTO> searchUsersByName(String name);
} 