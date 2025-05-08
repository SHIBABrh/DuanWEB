# Troubleshooting Guide: Frontend-Backend Connectivity

This guide helps resolve common issues with the frontend-backend connection in the Real Estate Management System.

## Common Issues & Solutions

### 1. 404 Error Page - "Không tìm thấy trang"

If you see a 404 error page with the message "Không tìm thấy trang":

#### Check Backend Server Status

1. Ensure the Spring Boot backend is running:
   ```bash
   cd /path/to/project
   mvn spring-boot:run
   ```

2. Verify the backend server is accessible:
   ```bash
   curl http://localhost:8080/api/users
   ```

#### Check Frontend Server Status

1. If using the Express server, make sure it's running:
   ```bash
   cd /c:/Users/User/Desktop/duanweb/Frontend
   npm start
   ```

2. Check the server logs for any errors about proxy connections.

#### Fix CORS Configuration

1. Make sure the frontend origin is allowed in WebConfig.java and SecurityConfig.java
2. Check that your API requests include the correct CORS headers:
   ```javascript
   fetch(url, {
     mode: 'cors',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
     }
   })
   ```

### 2. Backend Connection Errors

If you see errors like "Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu":

#### Check Network Connectivity

1. Verify MySQL service is running:
   ```bash
   # Windows
   net start mysql
   
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl status mysql
   ```

2. Check MySQL connection parameters in DBUtil.java:
   - JDBC_URL = "jdbc:mysql://localhost:3306/realestatedb"
   - JDBC_USER = "root"
   - JDBC_PASSWORD = "root"

#### Test API Endpoints Directly

Use browser or tools like Postman to test API endpoints directly:

- GET http://localhost:8080/api/users
- DELETE http://localhost:8080/api/users/{id}

### 3. User Management Issues

If you're having trouble with user management functionality:

#### User Creation Problems

1. Check server logs for validation errors
2. Make sure all required fields are provided
3. Check if the email might already exist in the database

#### User Deletion Problems

1. Verify you're sending the correct user ID
2. Check browser console for any errors during deletion
3. Try manual deletion via API:
   ```bash
   curl -X DELETE http://localhost:8080/api/users/{id}
   ```

4. Check the stored procedure in MySQL:
   ```sql
   CALL sp_DeleteUser('{id}');
   ```

## Quick Solution Checklist

1. ✅ Backend server running
2. ✅ MySQL server running
3. ✅ Correct database connection parameters
4. ✅ CORS configuration allows your frontend origin
5. ✅ API base URL is correct in frontend code
6. ✅ Request includes proper headers and credentials

## Debugging Tools

- Browser Network Tab: Check request/response details
- Backend Logs: Look for exceptions or errors
- MySQL Logs: Check for database connection issues
- `console.log()`: Add logging in your JavaScript functions

## If All Else Fails

Try the "Reset and Rebuild" approach:

1. Restart backend server
2. Restart MySQL server
3. Clear browser cache or use Incognito mode
4. Rebuild and restart frontend server 