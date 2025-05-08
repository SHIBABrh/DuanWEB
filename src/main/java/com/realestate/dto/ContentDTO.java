package com.realestate.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Data Transfer Object for content management")
public class ContentDTO {
    
    @Schema(description = "Path to the file", example = "index.html", required = true)
    private String path;
    
    @Schema(description = "Content of the file", required = true)
    private String content;
} 