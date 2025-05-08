package com.realestate.dao;

import com.realestate.dto.UserDTO;
import com.realestate.model.User;
import com.realestate.model.User.UserRole;
import com.realestate.model.User.UserStatus;
import com.realestate.util.DBUtil;
import com.realestate.util.UserIdGenerator;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {
    
    /**
     * Lấy danh sách người dùng có phân trang và lọc
     */
    public List<UserDTO> getUsers(int pageNumber, int pageSize, String sortBy, String sortDirection, 
                               String searchTerm, String role, String status) throws SQLException {
        List<UserDTO> users = new ArrayList<>();
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_GetUsers(?, ?, ?, ?, ?, ?, ?)}");
            stmt.setInt(1, pageNumber);
            stmt.setInt(2, pageSize);
            stmt.setString(3, sortBy);
            stmt.setString(4, sortDirection);
            stmt.setString(5, searchTerm);
            stmt.setString(6, role);
            stmt.setString(7, status);
            
            boolean hasResults = stmt.execute();
            if (hasResults) {
                rs = stmt.getResultSet();
                while (rs.next()) {
                    users.add(mapResultSetToUserDTO(rs));
                }
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return users;
    }
    
    /**
     * Lấy tổng số người dùng
     */
    public int getTotalUsers(String searchTerm, String role, String status) throws SQLException {
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        int totalCount = 0;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_GetUsers(?, ?, ?, ?, ?, ?, ?)}");
            stmt.setInt(1, 1); // pageNumber
            stmt.setInt(2, 10); // pageSize
            stmt.setString(3, ""); // sortBy
            stmt.setString(4, ""); // sortDirection
            stmt.setString(5, searchTerm);
            stmt.setString(6, role);
            stmt.setString(7, status);
            
            boolean hasResults = stmt.execute();
            if (hasResults) {
                rs = stmt.getResultSet();
                rs.next(); // Skip first result set (user data)
                
                // Get second result set (count)
                stmt.getMoreResults();
                rs = stmt.getResultSet();
                if (rs.next()) {
                    totalCount = rs.getInt("TotalCount");
                }
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return totalCount;
    }
    
    /**
     * Lấy thông tin người dùng theo ID
     */
    public UserDTO getUserById(String id) throws SQLException {
        UserDTO user = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_GetUserById(?)}");
            stmt.setString(1, id);
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                user = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return user;
    }
    
    /**
     * Tạo người dùng mới
     */
    public UserDTO createUser(UserDTO userDTO) throws SQLException {
        UserDTO createdUser = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_CreateUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            
            // Tạo ID cho người dùng mới nếu chưa có
            String userId = userDTO.getId();
            if (userId == null || userId.isEmpty()) {
                userId = new UserIdGenerator().generate(null, null);
            }
            
            stmt.setString(1, userId);
            stmt.setString(2, userDTO.getFullName());
            stmt.setString(3, userDTO.getEmail());
            stmt.setString(4, userDTO.getPhone());
            
            // Xử lý ngày sinh (nếu có)
            if (userDTO.getDob() != null) {
                stmt.setDate(5, Date.valueOf(userDTO.getDob()));
            } else {
                stmt.setNull(5, Types.DATE);
            }
            
            stmt.setString(6, userDTO.getPassword());
            stmt.setString(7, userDTO.getRole().toString());
            stmt.setString(8, userDTO.getStatus().toString());
            stmt.setString(9, userDTO.getAddress());
            
            // Xử lý avatar (nếu có)
            if (userDTO.getAvatar() != null) {
                stmt.setBytes(10, userDTO.getAvatar());
            } else {
                stmt.setNull(10, Types.VARBINARY);
            }
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                createdUser = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return createdUser;
    }
    
    /**
     * Cập nhật thông tin người dùng
     */
    public UserDTO updateUser(String id, UserDTO userDTO) throws SQLException {
        UserDTO updatedUser = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_UpdateUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");
            
            stmt.setString(1, id);
            stmt.setString(2, userDTO.getFullName());
            stmt.setString(3, userDTO.getEmail());
            stmt.setString(4, userDTO.getPhone());
            
            // Xử lý ngày sinh (nếu có)
            if (userDTO.getDob() != null) {
                stmt.setDate(5, Date.valueOf(userDTO.getDob()));
            } else {
                stmt.setNull(5, Types.DATE);
            }
            
            stmt.setString(6, userDTO.getPassword());
            
            // Xử lý vai trò và trạng thái (nếu có)
            if (userDTO.getRole() != null) {
                stmt.setString(7, userDTO.getRole().toString());
            } else {
                stmt.setNull(7, Types.VARCHAR);
            }
            
            if (userDTO.getStatus() != null) {
                stmt.setString(8, userDTO.getStatus().toString());
            } else {
                stmt.setNull(8, Types.VARCHAR);
            }
            
            stmt.setString(9, userDTO.getAddress());
            
            // Xử lý avatar (nếu có)
            if (userDTO.getAvatar() != null) {
                stmt.setBytes(10, userDTO.getAvatar());
            } else {
                stmt.setNull(10, Types.VARBINARY);
            }
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                updatedUser = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return updatedUser;
    }
    
    /**
     * Xóa người dùng
     */
    public boolean deleteUser(String id) throws SQLException {
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        boolean success = false;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_DeleteUser(?)}");
            stmt.setString(1, id);
            
            rs = stmt.executeQuery();
            success = rs.next(); // Nếu có kết quả trả về, xóa thành công
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return success;
    }
    
    /**
     * Cập nhật trạng thái người dùng
     */
    public UserDTO updateUserStatus(String id, UserStatus status) throws SQLException {
        UserDTO updatedUser = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_UpdateUserStatus(?, ?)}");
            stmt.setString(1, id);
            stmt.setString(2, status.toString());
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                updatedUser = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return updatedUser;
    }
    
    /**
     * Cập nhật vai trò người dùng
     */
    public UserDTO updateUserRole(String id, UserRole role) throws SQLException {
        UserDTO updatedUser = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_UpdateUserRole(?, ?)}");
            stmt.setString(1, id);
            stmt.setString(2, role.toString());
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                updatedUser = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return updatedUser;
    }
    
    /**
     * Cập nhật avatar người dùng
     */
    public UserDTO updateUserAvatar(String id, byte[] avatar) throws SQLException {
        UserDTO updatedUser = null;
        Connection conn = null;
        CallableStatement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = DBUtil.getConnection();
            stmt = conn.prepareCall("{CALL sp_UpdateUserAvatar(?, ?)}");
            stmt.setString(1, id);
            
            if (avatar != null) {
                stmt.setBytes(2, avatar);
            } else {
                stmt.setNull(2, Types.VARBINARY);
            }
            
            rs = stmt.executeQuery();
            if (rs.next()) {
                updatedUser = mapResultSetToUserDTO(rs);
            }
        } finally {
            DBUtil.closeAll(rs, stmt, conn);
        }
        
        return updatedUser;
    }
    
    /**
     * Chuyển đổi ResultSet thành UserDTO
     */
    private UserDTO mapResultSetToUserDTO(ResultSet rs) throws SQLException {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(rs.getString("id"));
        userDTO.setFullName(rs.getString("full_name"));
        userDTO.setEmail(rs.getString("email"));
        userDTO.setPhone(rs.getString("phone"));
        
        Date dob = rs.getDate("dob");
        if (dob != null) {
            userDTO.setDob(dob.toLocalDate());
        }
        
        userDTO.setRole(UserRole.valueOf(rs.getString("role")));
        userDTO.setStatus(UserStatus.valueOf(rs.getString("status")));
        userDTO.setAddress(rs.getString("address"));
        userDTO.setAvatar(rs.getBytes("avatar"));
        
        Timestamp registrationDate = rs.getTimestamp("registration_date");
        if (registrationDate != null) {
            userDTO.setRegistrationDate(registrationDate.toLocalDateTime());
        }
        
        return userDTO;
    }
    
    /**
     * Chuyển đổi UserDTO thành User
     */
    private User mapDTOToUser(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setDob(dto.getDob());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        user.setStatus(dto.getStatus());
        user.setAddress(dto.getAddress());
        user.setAvatar(dto.getAvatar());
        
        if (dto.getRegistrationDate() != null) {
            user.setRegistrationDate(dto.getRegistrationDate());
        } else {
            user.setRegistrationDate(LocalDateTime.now());
        }
        
        return user;
    }
} 