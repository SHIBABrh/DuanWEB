document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // In a real application, this would be a server-side authentication
            // For demo purposes, we just check against a hard-coded value
            if (username === 'admin' && password === 'admin123') {
                // Store login status if remember me is checked
                if (remember) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);
                } else {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('username', username);
                }
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        });
    }
    
    // Check if user is already logged in
    function checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true') {
            // If on login page, redirect to dashboard
            if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // If not logged in and not on login page, redirect to login
            if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    }
    
    // Run check on page load
    // Uncomment this in a real application
    // checkLoginStatus();
}); 