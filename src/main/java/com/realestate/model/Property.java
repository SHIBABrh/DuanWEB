package com.realestate.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    
    @Id
    @GeneratedValue(generator = "property-id-generator")
    @GenericGenerator(name = "property-id-generator", 
        strategy = "com.realestate.util.PropertyIdGenerator")
    private String id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyStatus status;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column
    private BigDecimal area;
    
    @Column
    private Integer bedrooms;
    
    @Column
    private Integer bathrooms;
    
    @Column
    private Integer floors;
    
    @Column
    private Integer yearBuilt;
    
    @Column(nullable = false)
    private String address;
    
    @Column
    private String city;
    
    @Column
    private String district;
    
    @Column
    private Double latitude;
    
    @Column
    private Double longitude;
    
    @ElementCollection
    @CollectionTable(name = "property_features", 
                    joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "feature")
    private Set<String> features = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "property_images", 
                    joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_url")
    private Set<String> images = new HashSet<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime updatedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    public enum PropertyType {
        APARTMENT, HOUSE, VILLA, LAND, OFFICE, RETAIL, WAREHOUSE, OTHER
    }
    
    public enum PropertyStatus {
        DRAFT, PUBLISHED, SOLD, RENTED, INACTIVE
    }
} 