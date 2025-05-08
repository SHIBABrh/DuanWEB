package com.realestate.service.impl;

import com.realestate.dto.PropertyDTO;
import com.realestate.model.Property;
import com.realestate.model.Property.PropertyStatus;
import com.realestate.model.Property.PropertyType;
import com.realestate.model.User;
import com.realestate.repository.PropertyRepository;
import com.realestate.repository.UserRepository;
import com.realestate.service.PropertyService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    
    @Value("${app.upload.dir:${user.home}/uploads/properties}")
    private String uploadDir;

    @Autowired
    public PropertyServiceImpl(PropertyRepository propertyRepository, UserRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public PropertyDTO createProperty(PropertyDTO propertyDTO) {
        Property property = convertToEntity(propertyDTO);
        property.setCreatedAt(LocalDateTime.now());
        
        // By default, a property is created in DRAFT status if not specified
        if (property.getStatus() == null) {
            property.setStatus(PropertyStatus.DRAFT);
        }
        
        // Set agent if provided
        if (propertyDTO.getAgentId() != null) {
            User agent = userRepository.findById(propertyDTO.getAgentId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + propertyDTO.getAgentId()));
            property.setAgent(agent);
        }
        
        Property savedProperty = propertyRepository.save(property);
        return convertToDTO(savedProperty);
    }

    @Override
    public PropertyDTO getPropertyById(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        return convertToDTO(property);
    }

    @Override
    public Page<PropertyDTO> getAllProperties(Pageable pageable) {
        return propertyRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> getPropertiesByStatus(PropertyStatus status, Pageable pageable) {
        return propertyRepository.findByStatus(status, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> getPropertiesByType(PropertyType type, Pageable pageable) {
        return propertyRepository.findByType(type, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> getPropertiesByTypeAndStatus(PropertyType type, PropertyStatus status, Pageable pageable) {
        return propertyRepository.findByTypeAndStatus(type, status, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> getPropertiesByPriceRange(PropertyStatus status, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return propertyRepository.findByStatusAndPriceRange(status, minPrice, maxPrice, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> searchProperties(BigDecimal minPrice, BigDecimal maxPrice, BigDecimal minArea, BigDecimal maxArea, 
                                             Integer bedrooms, Integer bathrooms, String city, String district, Pageable pageable) {
        return propertyRepository.searchProperties(minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms, city, district, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public Page<PropertyDTO> searchPropertiesByKeyword(String keyword, Pageable pageable) {
        return propertyRepository.searchByKeyword(keyword, pageable)
                .map(this::convertToDTO);
    }

    @Override
    public List<PropertyDTO> getPropertiesByAgent(String agentId) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + agentId));
        
        return propertyRepository.findByAgent(agent).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PropertyDTO updateProperty(String id, PropertyDTO propertyDTO) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        // Update basic properties
        existingProperty.setTitle(propertyDTO.getTitle());
        existingProperty.setDescription(propertyDTO.getDescription());
        existingProperty.setType(propertyDTO.getType());
        existingProperty.setPrice(propertyDTO.getPrice());
        existingProperty.setArea(propertyDTO.getArea());
        existingProperty.setBedrooms(propertyDTO.getBedrooms());
        existingProperty.setBathrooms(propertyDTO.getBathrooms());
        existingProperty.setFloors(propertyDTO.getFloors());
        existingProperty.setYearBuilt(propertyDTO.getYearBuilt());
        existingProperty.setAddress(propertyDTO.getAddress());
        existingProperty.setCity(propertyDTO.getCity());
        existingProperty.setDistrict(propertyDTO.getDistrict());
        existingProperty.setLatitude(propertyDTO.getLatitude());
        existingProperty.setLongitude(propertyDTO.getLongitude());
        
        // Update status if provided
        if (propertyDTO.getStatus() != null) {
            existingProperty.setStatus(propertyDTO.getStatus());
        }
        
        // Update agent if provided
        if (propertyDTO.getAgentId() != null && 
                (existingProperty.getAgent() == null || !existingProperty.getAgent().getId().equals(propertyDTO.getAgentId()))) {
            User agent = userRepository.findById(propertyDTO.getAgentId())
                    .orElseThrow(() -> new EntityNotFoundException("Agent not found with ID: " + propertyDTO.getAgentId()));
            existingProperty.setAgent(agent);
        }
        
        // Update features if provided
        if (propertyDTO.getFeatures() != null) {
            existingProperty.setFeatures(propertyDTO.getFeatures());
        }
        
        // Update images if provided
        if (propertyDTO.getImages() != null) {
            existingProperty.setImages(propertyDTO.getImages());
        }
        
        existingProperty.setUpdatedAt(LocalDateTime.now());
        Property updatedProperty = propertyRepository.save(existingProperty);
        return convertToDTO(updatedProperty);
    }

    @Override
    public void deleteProperty(String id) {
        if (!propertyRepository.existsById(id)) {
            throw new EntityNotFoundException("Property not found with ID: " + id);
        }
        propertyRepository.deleteById(id);
    }

    @Override
    public PropertyDTO updatePropertyStatus(String id, PropertyStatus status) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        property.setStatus(status);
        property.setUpdatedAt(LocalDateTime.now());
        
        // If status is PUBLISHED and publishedAt is null, set it
        if (status == PropertyStatus.PUBLISHED && property.getPublishedAt() == null) {
            property.setPublishedAt(LocalDateTime.now());
        }
        
        Property updatedProperty = propertyRepository.save(property);
        return convertToDTO(updatedProperty);
    }

    @Override
    public PropertyDTO addFeatureToProperty(String id, String feature) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        property.getFeatures().add(feature);
        property.setUpdatedAt(LocalDateTime.now());
        
        Property updatedProperty = propertyRepository.save(property);
        return convertToDTO(updatedProperty);
    }

    @Override
    public PropertyDTO removeFeatureFromProperty(String id, String feature) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        property.getFeatures().remove(feature);
        property.setUpdatedAt(LocalDateTime.now());
        
        Property updatedProperty = propertyRepository.save(property);
        return convertToDTO(updatedProperty);
    }

    @Override
    public PropertyDTO addImageToProperty(String id, MultipartFile file) throws IOException {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        // Create the upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        String newFilename = "property_" + id + "_" + UUID.randomUUID().toString() + fileExtension;
        
        // Save the file
        Path filepath = Paths.get(uploadDir, newFilename);
        Files.copy(file.getInputStream(), filepath);
        
        // Add the image URL to the property
        String imageUrl = "/uploads/properties/" + newFilename;
        property.getImages().add(imageUrl);
        property.setUpdatedAt(LocalDateTime.now());
        
        Property updatedProperty = propertyRepository.save(property);
        return convertToDTO(updatedProperty);
    }

    @Override
    public PropertyDTO removeImageFromProperty(String id, String imageUrl) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        // Remove the image URL from the property
        if (property.getImages().remove(imageUrl)) {
            // Try to delete the physical file if it exists
            if (imageUrl.startsWith("/uploads/properties/")) {
                String filename = imageUrl.substring("/uploads/properties/".length());
                try {
                    Path filepath = Paths.get(uploadDir, filename);
                    Files.deleteIfExists(filepath);
                } catch (IOException e) {
                    // Log error but continue
                    System.err.println("Failed to delete image file: " + e.getMessage());
                }
            }
            
            property.setUpdatedAt(LocalDateTime.now());
            Property updatedProperty = propertyRepository.save(property);
            return convertToDTO(updatedProperty);
        } else {
            throw new IllegalArgumentException("Image URL not found for property");
        }
    }

    @Override
    public PropertyDTO publishProperty(String id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Property not found with ID: " + id));
        
        property.setStatus(PropertyStatus.PUBLISHED);
        property.setPublishedAt(LocalDateTime.now());
        property.setUpdatedAt(LocalDateTime.now());
        
        Property publishedProperty = propertyRepository.save(property);
        return convertToDTO(publishedProperty);
    }
    
    // Helper methods
    private PropertyDTO convertToDTO(Property property) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setType(property.getType());
        dto.setStatus(property.getStatus());
        dto.setPrice(property.getPrice());
        dto.setArea(property.getArea());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setFloors(property.getFloors());
        dto.setYearBuilt(property.getYearBuilt());
        dto.setAddress(property.getAddress());
        dto.setCity(property.getCity());
        dto.setDistrict(property.getDistrict());
        dto.setLatitude(property.getLatitude());
        dto.setLongitude(property.getLongitude());
        dto.setFeatures(property.getFeatures());
        dto.setImages(property.getImages());
        dto.setCreatedAt(property.getCreatedAt());
        dto.setUpdatedAt(property.getUpdatedAt());
        dto.setPublishedAt(property.getPublishedAt());
        
        // Set agent information if available
        if (property.getAgent() != null) {
            dto.setAgentId(property.getAgent().getId());
            dto.setAgentName(property.getAgent().getFullName());
        }
        
        return dto;
    }
    
    private Property convertToEntity(PropertyDTO dto) {
        Property property = new Property();
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setType(dto.getType());
        property.setStatus(dto.getStatus());
        property.setPrice(dto.getPrice());
        property.setArea(dto.getArea());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setFloors(dto.getFloors());
        property.setYearBuilt(dto.getYearBuilt());
        property.setAddress(dto.getAddress());
        property.setCity(dto.getCity());
        property.setDistrict(dto.getDistrict());
        property.setLatitude(dto.getLatitude());
        property.setLongitude(dto.getLongitude());
        
        // Copy collections if they're not null
        if (dto.getFeatures() != null) {
            property.setFeatures(dto.getFeatures());
        }
        
        if (dto.getImages() != null) {
            property.setImages(dto.getImages());
        }
        
        return property;
    }
} 