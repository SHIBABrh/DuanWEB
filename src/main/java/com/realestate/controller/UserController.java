package com.realestate.controller;

import com.realestate.dto.UserDTO;
import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;
import com.realestate.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5500", "http://localhost:5173", "http://localhost:3000", 
                       "http://127.0.0.1:5500", "http://127.0.0.1:5173", "http://127.0.0.1:3000"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowedHeaders = "*", 
             allowCredentials = "true")
@Tag(name = "User Management", description = "APIs for managing users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get all users", description = "Retrieve all users with optional filtering by role, status or name search")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved users", 
                     content = @Content(mediaType = "application/json", 
                     schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @Parameter(description = "Search by user name") @RequestParam(required = false) String search,
            @Parameter(description = "Filter by user role") @RequestParam(required = false) String role,
            @Parameter(description = "Filter by user status") @RequestParam(required = false) String status) {
        
        List<UserDTO> users;
        
        if (search != null && !search.isEmpty()) {
            users = userService.searchUsersByName(search);
        } else if (role != null && !role.isEmpty() && status != null && !status.isEmpty()) {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            UserStatus userStatus = UserStatus.valueOf(status.toUpperCase());
            users = userService.findUsersByRoleAndStatus(userRole, userStatus);
        } else if (role != null && !role.isEmpty()) {
            UserRole userRole = UserRole.valueOf(role.toUpperCase());
            users = userService.findUsersByRole(userRole);
        } else if (status != null && !status.isEmpty()) {
            UserStatus userStatus = UserStatus.valueOf(status.toUpperCase());
            users = userService.findUsersByStatus(userStatus);
        } else {
            users = userService.getAllUsers();
        }
        
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved the user"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "ID of the user to retrieve") @PathVariable String id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Create a new user", description = "Add a new user to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User successfully created"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<UserDTO> createUser(
            @Parameter(description = "User data to create", required = true) @RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an existing user", description = "Update user information by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully updated"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "ID of the user to update", required = true) @PathVariable String id,
            @Parameter(description = "Updated user data", required = true) @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Delete a user", description = "Remove a user from the system by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully deleted"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @Parameter(description = "ID of the user to delete", required = true) @PathVariable String id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        response.put("id", id);
        response.put("status", "DELETED");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Upload user avatar", description = "Update a user's profile picture")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Avatar successfully uploaded"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "400", description = "Invalid file")
    })
    @PostMapping(value = "/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadAvatar(
            @Parameter(description = "ID of the user", required = true) @PathVariable String id,
            @Parameter(description = "Avatar image file", required = true) @RequestParam("file") MultipartFile file) throws IOException {
        UserDTO user = userService.getUserById(id);
        user.setAvatar(file.getBytes());
        UserDTO updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Update user status", description = "Change a user's status (ACTIVE, INACTIVE, PENDING)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Status successfully updated"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "400", description = "Invalid status")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserDTO> updateUserStatus(
            @Parameter(description = "ID of the user", required = true) @PathVariable String id,
            @Parameter(description = "New status value", required = true) @RequestParam UserStatus status) {
        UserDTO user = userService.getUserById(id);
        user.setStatus(status);
        UserDTO updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Update user role", description = "Change a user's role (ADMIN, MANAGER, AGENT, CLIENT)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Role successfully updated"),
        @ApiResponse(responseCode = "404", description = "User not found"),
        @ApiResponse(responseCode = "400", description = "Invalid role")
    })
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @Parameter(description = "ID of the user", required = true) @PathVariable String id,
            @Parameter(description = "New role value", required = true) @RequestParam UserRole role) {
        UserDTO user = userService.getUserById(id);
        user.setRole(role);
        UserDTO updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }
} 