# User Management System for Real Estate Application

This is a Java Spring Boot backend application for managing users in a real estate management system. It provides REST API endpoints for CRUD operations on users.

## Features

- User management (Create, Read, Update, Delete)
- Role-based user types (Admin, Manager, Agent, Client)
- User status tracking (Active, Inactive, Pending)
- User search and filtering
- Profile picture management

## Technologies Used

- Java 11
- Spring Boot 2.7.9
- Spring Data JPA
- Spring Security
- SQL Server Database
- Maven

## Prerequisites

- JDK 11 or later
- Maven
- SQL Server 2012 or later

## Database Configuration

Configure your SQL Server database in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://YOUR_SERVER_NAME;databaseName=realestate;encrypt=false
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
```

## Building and Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Build the project:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on port 8080.

## API Endpoints

### User Management

- `GET /api/users` - Get all users (with optional filter parameters)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update an existing user
- `DELETE /api/users/{id}` - Delete a user
- `POST /api/users/{id}/avatar` - Upload user avatar

### Query Parameters for Filtering

- `search`: Filter users by name
- `role`: Filter users by role (admin, manager, agent, client)
- `status`: Filter users by status (active, inactive, pending)

## User Object Example

```json
{
  "id": "UID001",
  "fullName": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0123456789",
  "dob": "1990-01-01",
  "role": "ADMIN",
  "status": "ACTIVE",
  "address": "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
  "registrationDate": "2023-01-01T00:00:00"
}
``` 