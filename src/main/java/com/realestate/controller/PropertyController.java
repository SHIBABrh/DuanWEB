package com.realestate.controller;

import com.realestate.dto.PropertyDTO;
import com.realestate.model.Property.PropertyStatus;
import com.realestate.model.Property.PropertyType;
import com.realestate.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/properties")
@Tag(name = "Property Management", description = "APIs for managing real estate properties")
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @Operation(summary = "Create a new property", description = "Add a new property to the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Property successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<PropertyDTO> createProperty(
            @Parameter(description = "Property data to create", required = true)
            @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO createdProperty = propertyService.createProperty(propertyDTO);
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @Operation(summary = "Get a property by ID", description = "Retrieve details of a specific property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved property"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(
            @Parameter(description = "ID of the property to retrieve", required = true)
            @PathVariable String id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @Operation(summary = "Get all properties", description = "Retrieve all properties with pagination and optional filtering")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved properties")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProperties(
            @Parameter(description = "Property type filter")
            @RequestParam(required = false) String type,
            @Parameter(description = "Property status filter")
            @RequestParam(required = false) String status,
            @Parameter(description = "Minimum price filter")
            @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price filter")
            @RequestParam(required = false) BigDecimal maxPrice,
            @Parameter(description = "Minimum area filter in square meters")
            @RequestParam(required = false) BigDecimal minArea,
            @Parameter(description = "Maximum area filter in square meters")
            @RequestParam(required = false) BigDecimal maxArea,
            @Parameter(description = "Minimum number of bedrooms")
            @RequestParam(required = false) Integer bedrooms,
            @Parameter(description = "Minimum number of bathrooms")
            @RequestParam(required = false) Integer bathrooms,
            @Parameter(description = "City filter")
            @RequestParam(required = false) String city,
            @Parameter(description = "District filter")
            @RequestParam(required = false) String district,
            @Parameter(description = "Search by keyword in title, description or address")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number (starts from 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction (asc or desc)")
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<PropertyDTO> propertyPage;

        // Advanced search with multiple criteria
        if (minPrice != null && maxPrice != null && minArea != null && maxArea != null) {
            propertyPage = propertyService.searchProperties(
                    minPrice, maxPrice, minArea, maxArea, 
                    bedrooms, bathrooms, city, district, pageable);
        }
        // Search by keyword
        else if (keyword != null && !keyword.isEmpty()) {
            propertyPage = propertyService.searchPropertiesByKeyword(keyword, pageable);
        }
        // Filter by type and status
        else if (type != null && !type.isEmpty() && status != null && !status.isEmpty()) {
            PropertyType propertyType = PropertyType.valueOf(type.toUpperCase());
            PropertyStatus propertyStatus = PropertyStatus.valueOf(status.toUpperCase());
            propertyPage = propertyService.getPropertiesByTypeAndStatus(propertyType, propertyStatus, pageable);
        }
        // Filter by type only
        else if (type != null && !type.isEmpty()) {
            PropertyType propertyType = PropertyType.valueOf(type.toUpperCase());
            propertyPage = propertyService.getPropertiesByType(propertyType, pageable);
        }
        // Filter by status only
        else if (status != null && !status.isEmpty()) {
            PropertyStatus propertyStatus = PropertyStatus.valueOf(status.toUpperCase());
            propertyPage = propertyService.getPropertiesByStatus(propertyStatus, pageable);
        }
        // Filter by price range
        else if (minPrice != null && maxPrice != null) {
            PropertyStatus propertyStatus = PropertyStatus.PUBLISHED;
            propertyPage = propertyService.getPropertiesByPriceRange(
                    propertyStatus, minPrice, maxPrice, pageable);
        }
        // No filters
        else {
            propertyPage = propertyService.getAllProperties(pageable);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("properties", propertyPage.getContent());
        response.put("currentPage", propertyPage.getNumber());
        response.put("totalItems", propertyPage.getTotalElements());
        response.put("totalPages", propertyPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update a property", description = "Update an existing property's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property successfully updated"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> updateProperty(
            @Parameter(description = "ID of the property to update", required = true)
            @PathVariable String id,
            @Parameter(description = "Updated property data", required = true)
            @RequestBody PropertyDTO propertyDTO) {
        PropertyDTO updatedProperty = propertyService.updateProperty(id, propertyDTO);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Delete a property", description = "Remove a property from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProperty(
            @Parameter(description = "ID of the property to delete", required = true)
            @PathVariable String id) {
        propertyService.deleteProperty(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Property deleted successfully");
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update property status", description = "Change the status of a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property status successfully updated"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @PatchMapping("/{id}/status")
    public ResponseEntity<PropertyDTO> updatePropertyStatus(
            @Parameter(description = "ID of the property", required = true)
            @PathVariable String id,
            @Parameter(description = "New status value", required = true, 
                      schema = @Schema(allowableValues = {"DRAFT", "PUBLISHED", "SOLD", "RENTED", "INACTIVE"}))
            @RequestParam String status) {
        PropertyStatus propertyStatus = PropertyStatus.valueOf(status.toUpperCase());
        PropertyDTO updatedProperty = propertyService.updatePropertyStatus(id, propertyStatus);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Publish a property", description = "Change property status to PUBLISHED and set publish date")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Property successfully published"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @PostMapping("/{id}/publish")
    public ResponseEntity<PropertyDTO> publishProperty(
            @Parameter(description = "ID of the property to publish", required = true)
            @PathVariable String id) {
        PropertyDTO publishedProperty = propertyService.publishProperty(id);
        return ResponseEntity.ok(publishedProperty);
    }

    @Operation(summary = "Add a feature to property", description = "Add a new feature or amenity to a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Feature successfully added"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @PostMapping("/{id}/features")
    public ResponseEntity<PropertyDTO> addFeature(
            @Parameter(description = "ID of the property", required = true)
            @PathVariable String id,
            @Parameter(description = "Feature to add", required = true)
            @RequestParam String feature) {
        PropertyDTO updatedProperty = propertyService.addFeatureToProperty(id, feature);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Remove a feature from property", description = "Remove a feature or amenity from a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Feature successfully removed"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @DeleteMapping("/{id}/features")
    public ResponseEntity<PropertyDTO> removeFeature(
            @Parameter(description = "ID of the property", required = true)
            @PathVariable String id,
            @Parameter(description = "Feature to remove", required = true)
            @RequestParam String feature) {
        PropertyDTO updatedProperty = propertyService.removeFeatureFromProperty(id, feature);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Upload property image", description = "Add a new image to a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image successfully uploaded"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PropertyDTO> uploadImage(
            @Parameter(description = "ID of the property", required = true)
            @PathVariable String id,
            @Parameter(description = "Image file to upload", required = true)
            @RequestParam("file") MultipartFile file) throws IOException {
        PropertyDTO updatedProperty = propertyService.addImageToProperty(id, file);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Remove property image", description = "Remove an image from a property")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Image successfully removed"),
            @ApiResponse(responseCode = "404", description = "Property not found")
    })
    @DeleteMapping("/{id}/images")
    public ResponseEntity<PropertyDTO> removeImage(
            @Parameter(description = "ID of the property", required = true)
            @PathVariable String id,
            @Parameter(description = "Image URL to remove", required = true)
            @RequestParam String imageUrl) {
        PropertyDTO updatedProperty = propertyService.removeImageFromProperty(id, imageUrl);
        return ResponseEntity.ok(updatedProperty);
    }

    @Operation(summary = "Get properties by agent", description = "Retrieve all properties managed by a specific agent")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved properties")
    })
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<PropertyDTO>> getPropertiesByAgent(
            @Parameter(description = "ID of the agent", required = true)
            @PathVariable String agentId) {
        List<PropertyDTO> properties = propertyService.getPropertiesByAgent(agentId);
        return ResponseEntity.ok(properties);
    }
} 