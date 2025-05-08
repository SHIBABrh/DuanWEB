const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5500;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Configure API proxy with better error handling
const apiProxy = createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests
        console.log(`[PROXY] ${req.method} ${req.url} -> ${BACKEND_URL}${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Log proxy responses
        console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('[PROXY ERROR]', err);
        
        // Send a user-friendly error response
        res.status(500).json({
            status: 'error',
            message: 'Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu',
            error: err.message
        });
    }
});

// Use proxy middleware for API requests
app.use('/api', apiProxy);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle SPA routing - serve index.html for all routes except API and existing files
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api') || req.url.includes('.')) {
        return next(); // Skip for API routes and files with extensions
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Custom 404 handler
app.use((req, res, next) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '404.html'));
        return;
    }
    
    if (req.accepts('json')) {
        res.status(404).json({ error: 'Not found' });
        return;
    }
    
    res.status(404).type('txt').send('Not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json({
        status: 'error',
        message: 'Đã xảy ra lỗi!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
    console.log(`API requests will be proxied to ${BACKEND_URL}`);
    console.log('Press Ctrl+C to stop');
}); 