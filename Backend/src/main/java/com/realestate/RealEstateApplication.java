package com.realestate;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "Real Estate Management API",
        version = "1.0",
        description = "API for managing real estate properties, users, and transactions",
        contact = @Contact(
            name = "Support Team",
            email = "support@realestate.com"
        ),
        license = @License(
            name = "Apache 2.0",
            url = "https://www.apache.org/licenses/LICENSE-2.0"
        )
    )
)
public class RealEstateApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealEstateApplication.class, args);
    }
} 