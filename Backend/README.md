# Real Estate Management System - Backend

This directory contains the backend API for the Real Estate Management System, built with Spring Boot.

## Architecture

The backend follows a standard Spring Boot architecture with:

- **Controller Layer**: REST API endpoints
- **Service Layer**: Business logic
- **Repository Layer**: Data access logic
- **Model Layer**: Domain entities
- **DTO Layer**: Data Transfer Objects for API communication

## Directory Structure

```
Backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/realestate/
│   │   │       ├── config/        - Configuration classes
│   │   │       ├── controller/    - REST API controllers
│   │   │       ├── dto/           - Data Transfer Objects
│   │   │       ├── model/         - Domain entities
│   │   │       ├── repository/    - Data repositories
│   │   │       ├── service/       - Business services
│   │   │       └── util/          - Utility classes
│   │   └── resources/
│   │       ├── application.properties - Application configuration
│   │       └── static/               - Static resources
│   └── test/                      - Unit and integration tests
├── database/                      - SQL scripts and database setup
└── pom.xml                        - Maven dependencies
```

## Database

The application uses MySQL as the database. Database setup scripts can be found in the `database` directory.

## How to Run

1. **Setup Database**
   
   Make sure you have MySQL installed and running. The application will create the database if it doesn't exist.

2. **Configure Application**

   Check the `src/main/resources/application.properties` file to configure:
   - Database connection
   - Server port
   - Other application properties

3. **Build the Application**

   ```bash
   cd Backend
   mvn clean install
   ```

4. **Run the Application**

   ```bash
   mvn spring-boot:run
   ```

   Or run the generated JAR file:

   ```bash
   java -jar target/realestate-management-0.0.1-SNAPSHOT.jar
   ```

5. **Access API Documentation**

   Once the application is running, you can access the API documentation at:
   - Swagger UI: http://localhost:8080/swagger-ui
   - OpenAPI JSON: http://localhost:8080/api-docs

## API Endpoints

The API provides endpoints for:

- User Management
- Property Management
- Transaction Management
- Content Management
- Error Handling

## Security

The backend implements Spring Security for authentication and authorization. For development, all API endpoints are currently accessible without authentication.

In a production environment, you should:
1. Configure proper authentication (JWT, OAuth2, etc.)
2. Update SecurityConfig to secure all necessary endpoints
3. Enable HTTPS 