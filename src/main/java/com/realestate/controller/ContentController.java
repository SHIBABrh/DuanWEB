package com.realestate.controller;

import com.realestate.dto.ContentDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/content")
@Tag(name = "Content Management", description = "APIs for managing static content")
public class ContentController {

    private final ResourceLoader resourceLoader;
    
    @Value("${app.content.directory:src/main/resources/static}")
    private String contentDirectory;

    public ContentController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @Operation(summary = "Get content", description = "Retrieve the content of a static file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved content"),
            @ApiResponse(responseCode = "404", description = "File not found")
    })
    @GetMapping
    public ResponseEntity<ContentDTO> getContent(
            @Parameter(description = "Path to the file", required = true)
            @RequestParam String path) throws IOException {
        
        // Security check - prevent directory traversal
        if (path.contains("..")) {
            throw new IllegalArgumentException("Invalid path: " + path);
        }
        
        Resource resource = resourceLoader.getResource("classpath:static/" + path);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        String content = "";
        try (InputStream inputStream = resource.getInputStream()) {
            content = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
        }
        
        ContentDTO contentDTO = new ContentDTO();
        contentDTO.setPath(path);
        contentDTO.setContent(content);
        
        return ResponseEntity.ok(contentDTO);
    }

    @Operation(summary = "Update content", description = "Update the content of a static file")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Content successfully updated"),
            @ApiResponse(responseCode = "404", description = "File not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PostMapping
    public ResponseEntity<Map<String, String>> updateContent(
            @Parameter(description = "Content data", required = true)
            @RequestBody ContentDTO contentDTO) throws IOException {
        
        // Security check - prevent directory traversal
        if (contentDTO.getPath().contains("..")) {
            throw new IllegalArgumentException("Invalid path: " + contentDTO.getPath());
        }
        
        Path filePath = Paths.get(contentDirectory, contentDTO.getPath());
        Files.createDirectories(filePath.getParent());
        Files.writeString(filePath, contentDTO.getContent(), StandardCharsets.UTF_8);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Content updated successfully");
        return ResponseEntity.ok(response);
    }
} 