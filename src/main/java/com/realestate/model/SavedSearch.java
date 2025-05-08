package com.realestate.model;

import com.realestate.model.Property.PropertyType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_searches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedSearch {
    
    @Id
    @GeneratedValue(generator = "saved-search-id-generator")
    @GenericGenerator(name = "saved-search-id-generator", 
        strategy = "com.realestate.util.SavedSearchIdGenerator")
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column
    private PropertyType propertyType;
    
    @Column
    private BigDecimal minPrice;
    
    @Column
    private BigDecimal maxPrice;
    
    @Column
    private BigDecimal minArea;
    
    @Column
    private BigDecimal maxArea;
    
    @Column
    private Integer bedrooms;
    
    @Column
    private Integer bathrooms;
    
    @Column
    private String city;
    
    @Column
    private String district;
    
    @Column
    private String keywords;
    
    @Column(nullable = false)
    private Boolean emailNotifications = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime lastRunAt;
} 