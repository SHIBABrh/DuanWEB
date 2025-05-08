package com.realestate.service;

import com.realestate.dto.PropertyDTO;
import com.realestate.model.Property.PropertyStatus;
import com.realestate.model.Property.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    
    PropertyDTO createProperty(PropertyDTO propertyDTO);
    
    PropertyDTO getPropertyById(String id);
    
    Page<PropertyDTO> getAllProperties(Pageable pageable);
    
    Page<PropertyDTO> getPropertiesByStatus(PropertyStatus status, Pageable pageable);
    
    Page<PropertyDTO> getPropertiesByType(PropertyType type, Pageable pageable);
    
    Page<PropertyDTO> getPropertiesByTypeAndStatus(PropertyType type, PropertyStatus status, Pageable pageable);
    
    Page<PropertyDTO> getPropertiesByPriceRange(
            PropertyStatus status, 
            BigDecimal minPrice, 
            BigDecimal maxPrice, 
            Pageable pageable);
    
    Page<PropertyDTO> searchProperties(
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minArea,
            BigDecimal maxArea,
            Integer bedrooms,
            Integer bathrooms,
            String city,
            String district,
            Pageable pageable);
    
    Page<PropertyDTO> searchPropertiesByKeyword(String keyword, Pageable pageable);
    
    List<PropertyDTO> getPropertiesByAgent(String agentId);
    
    PropertyDTO updateProperty(String id, PropertyDTO propertyDTO);
    
    void deleteProperty(String id);
    
    PropertyDTO updatePropertyStatus(String id, PropertyStatus status);
    
    PropertyDTO addFeatureToProperty(String id, String feature);
    
    PropertyDTO removeFeatureFromProperty(String id, String feature);
    
    PropertyDTO addImageToProperty(String id, MultipartFile file) throws IOException;
    
    PropertyDTO removeImageFromProperty(String id, String imageUrl);
    
    PropertyDTO publishProperty(String id);
} 