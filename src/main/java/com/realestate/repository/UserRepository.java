package com.realestate.repository;

import com.realestate.model.User;
import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByStatus(UserStatus status);
    
    List<User> findByRoleAndStatus(UserRole role, UserStatus status);
    
    List<User> findByFullNameContainingIgnoreCase(String name);
} 