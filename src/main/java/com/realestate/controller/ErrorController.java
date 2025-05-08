package com.realestate.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/error")
public class ErrorController {

    @GetMapping("/404")
    public ResponseEntity<Map<String, Object>> handle404() {
        return buildErrorResponse(HttpStatus.NOT_FOUND, "Không tìm thấy trang yêu cầu", "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển");
    }

    @GetMapping("/500")
    public ResponseEntity<Map<String, Object>> handle500() {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi máy chủ", "Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên");
    }

    @GetMapping("/403")
    public ResponseEntity<Map<String, Object>> handle403() {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Truy cập bị từ chối", "Bạn không có quyền truy cập tài nguyên này");
    }

    @GetMapping("/401")
    public ResponseEntity<Map<String, Object>> handle401() {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Chưa xác thực", "Vui lòng đăng nhập để truy cập tài nguyên này");
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String title, String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("title", title);
        errorResponse.put("message", message);
        
        return new ResponseEntity<>(errorResponse, status);
    }
} 