package com.realestate.dto;

import com.realestate.model.Property.PropertyStatus;
import com.realestate.model.Property.PropertyType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data Transfer Object for Property information")
public class PropertyDTO {
    
    @Schema(description = "Unique identifier of the property", example = "PROP001")
    private String id;
    
    @Schema(description = "Title of the property", example = "Modern Apartment in District 2", required = true)
    private String title;
    
    @Schema(description = "Detailed description of the property", example = "Spacious apartment with beautiful view...")
    private String description;
    
    @Schema(description = "Type of property", example = "APARTMENT", required = true, 
            allowableValues = {"APARTMENT", "HOUSE", "VILLA", "LAND", "OFFICE", "RETAIL", "WAREHOUSE", "OTHER"})
    private PropertyType type;
    
    @Schema(description = "Current status of the property", example = "PUBLISHED", required = true, 
            allowableValues = {"DRAFT", "PUBLISHED", "SOLD", "RENTED", "INACTIVE"})
    private PropertyStatus status;
    
    @Schema(description = "Price of the property in VND", example = "2000000000", required = true)
    private BigDecimal price;
    
    @Schema(description = "Area of the property in square meters", example = "80.5")
    private BigDecimal area;
    
    @Schema(description = "Number of bedrooms", example = "2")
    private Integer bedrooms;
    
    @Schema(description = "Number of bathrooms", example = "2")
    private Integer bathrooms;
    
    @Schema(description = "Number of floors", example = "1")
    private Integer floors;
    
    @Schema(description = "Year the property was built", example = "2020")
    private Integer yearBuilt;
    
    @Schema(description = "Full address of the property", example = "123 Nguyen Van Linh", required = true)
    private String address;
    
    @Schema(description = "City where the property is located", example = "Ho Chi Minh")
    private String city;
    
    @Schema(description = "District where the property is located", example = "District 2")
    private String district;
    
    @Schema(description = "Latitude coordinate for mapping", example = "10.7769")
    private Double latitude;
    
    @Schema(description = "Longitude coordinate for mapping", example = "106.7009")
    private Double longitude;
    
    @Schema(description = "List of property features/amenities", example = "[\"Air Conditioning\", \"Swimming Pool\", \"Parking\"]")
    private Set<String> features = new HashSet<>();
    
    @Schema(description = "List of image URLs for the property", example = "[\"image1.jpg\", \"image2.jpg\"]")
    private Set<String> images = new HashSet<>();
    
    @Schema(description = "ID of the agent managing this property", example = "UID001")
    private String agentId;
    
    @Schema(description = "Name of the agent managing this property", example = "Nguyễn Văn A")
    private String agentName;
    
    @Schema(description = "Date and time when the property was created")
    private LocalDateTime createdAt;
    
    @Schema(description = "Date and time when the property was last updated")
    private LocalDateTime updatedAt;
    
    @Schema(description = "Date and time when the property was published")
    private LocalDateTime publishedAt;
} 