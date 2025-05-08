package com.realestate.repository;

import com.realestate.model.Property;
import com.realestate.model.Property.PropertyStatus;
import com.realestate.model.Property.PropertyType;
import com.realestate.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, String> {
    
    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);
    
    Page<Property> findByType(PropertyType type, Pageable pageable);
    
    Page<Property> findByTypeAndStatus(PropertyType type, PropertyStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Property p WHERE p.status = :status AND " +
           "p.price BETWEEN :minPrice AND :maxPrice")
    Page<Property> findByStatusAndPriceRange(
            @Param("status") PropertyStatus status,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
    
    @Query("SELECT p FROM Property p WHERE p.price BETWEEN :minPrice AND :maxPrice " +
           "AND p.area BETWEEN :minArea AND :maxArea " +
           "AND (:bedrooms IS NULL OR p.bedrooms >= :bedrooms) " +
           "AND (:bathrooms IS NULL OR p.bathrooms >= :bathrooms) " +
           "AND (:city IS NULL OR p.city = :city) " +
           "AND (:district IS NULL OR p.district = :district) " +
           "AND p.status = 'PUBLISHED'")
    Page<Property> searchProperties(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minArea") BigDecimal minArea,
            @Param("maxArea") BigDecimal maxArea,
            @Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms,
            @Param("city") String city,
            @Param("district") String district,
            Pageable pageable);
    
    List<Property> findByAgent(User agent);
    
    @Query("SELECT p FROM Property p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Property> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
} 