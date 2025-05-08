// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const toggleSidebar = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Settings tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Form elements
    const settingsForms = document.querySelectorAll('.settings-form');
    const saveButtons = document.querySelectorAll('.btn-primary');
    const resetButtons = document.querySelectorAll('.btn-secondary');
    
    // Logo and image upload elements
    const companyLogoInput = document.getElementById('companyLogo');
    const logoPreview = document.getElementById('logoPreview');
    const logoUploadBtn = companyLogoInput ? companyLogoInput.previousElementSibling : null;
    const logoDeleteBtn = companyLogoInput ? companyLogoInput.nextElementSibling : null;
    
    // Initialize settings tabs
    function initTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Initialize color options
    function initColorOptions() {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all options
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to selected option
                this.classList.add('active');
                
                // Apply color to the theme
                const selectedColor = this.getAttribute('data-color');
                applyThemeColor(selectedColor);
            });
        });
    }
    
    // Apply theme color
    function applyThemeColor(color) {
        console.log('Applying theme color:', color);
        // In a real application, this would update CSS variables or theme classes
    }
    
    // Initialize forms
    function initForms() {
        settingsForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                saveSettings(form);
            });
        });
        
        saveButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Find the closest settings section or tab content
                const section = this.closest('.settings-section') || this.closest('.tab-content');
                if (section) {
                    const form = section.querySelector('form');
                    if (form) {
                        saveSettings(form);
                    } else {
                        // If there are multiple forms in this section or tab
                        const forms = section.querySelectorAll('form');
                        forms.forEach(form => saveSettings(form));
                    }
                }
            });
        });
        
        resetButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Find the closest settings section or tab content
                const section = this.closest('.settings-section') || this.closest('.tab-content');
                if (section) {
                    const form = section.querySelector('form');
                    if (form) {
                        resetSettings(form);
                    } else {
                        // If there are multiple forms in this section or tab
                        const forms = section.querySelectorAll('form');
                        forms.forEach(form => resetSettings(form));
                    }
                }
            });
        });
    }
    
    // Save settings
    function saveSettings(form) {
        // Collect form data
        const formData = new FormData(form);
        const settings = {};
        
        for (const [key, value] of formData.entries()) {
            settings[key] = value;
        }
        
        // Additional checkboxes and radio buttons need special handling
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            settings[checkbox.id] = checkbox.checked;
        });
        
        // Color options if applicable
        const activeColor = form.querySelector('.color-option.active');
        if (activeColor) {
            settings.themeColor = activeColor.getAttribute('data-color');
        }
        
        console.log('Saving settings:', settings);
        
        // In a real application, this would send the settings to the server
        // For this demo, we'll just show a success message
        showNotification('Cài đặt đã được lưu thành công!', 'success');
    }
    
    // Reset settings to default
    function resetSettings(form) {
        if (confirm('Bạn có chắc chắn muốn đặt lại tất cả cài đặt về mặc định không?')) {
            console.log('Resetting settings form:', form.id);
            form.reset();
            
            // Reset color options if applicable
            const colorOptionsInForm = form.querySelectorAll('.color-option');
            if (colorOptionsInForm.length) {
                colorOptionsInForm.forEach(opt => opt.classList.remove('active'));
                const defaultColor = colorOptionsInForm[0];
                if (defaultColor) {
                    defaultColor.classList.add('active');
                    applyThemeColor(defaultColor.getAttribute('data-color'));
                }
            }
            
            // Reset logo preview if applicable
            if (logoPreview && form.contains(logoPreview)) {
                logoPreview.src = 'img/logo.png';
            }
            
            showNotification('Cài đặt đã được đặt lại về mặc định!', 'info');
        }
    }
    
    // Initialize logo upload
    function initLogoUpload() {
        if (logoUploadBtn) {
            logoUploadBtn.addEventListener('click', function() {
                companyLogoInput.click();
            });
        }
        
        if (companyLogoInput) {
            companyLogoInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        logoPreview.src = e.target.result;
                    };
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
        
        if (logoDeleteBtn) {
            logoDeleteBtn.addEventListener('click', function() {
                if (confirm('Bạn có chắc chắn muốn xóa logo hiện tại không?')) {
                    logoPreview.src = 'img/default-logo.png';
                    if (companyLogoInput) {
                        companyLogoInput.value = '';
                    }
                }
            });
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
    }
    
    // Initialize appearance settings
    function initAppearanceSettings() {
        const themeSetting = document.getElementById('themeSetting');
        if (themeSetting) {
            themeSetting.addEventListener('change', function() {
                applyTheme(this.value);
            });
        }
        
        const showNotificationsToggle = document.getElementById('showNotifications');
        if (showNotificationsToggle) {
            showNotificationsToggle.addEventListener('change', function() {
                toggleNotifications(this.checked);
            });
        }
        
        const enableAnimationsToggle = document.getElementById('enableAnimations');
        if (enableAnimationsToggle) {
            enableAnimationsToggle.addEventListener('change', function() {
                toggleAnimations(this.checked);
            });
        }
        
        const compactSidebarToggle = document.getElementById('compactSidebar');
        if (compactSidebarToggle) {
            compactSidebarToggle.addEventListener('change', function() {
                toggleCompactSidebar(this.checked);
            });
        }
    }
    
    // Apply theme
    function applyTheme(theme) {
        console.log('Applying theme:', theme);
        // In a real application, this would update the theme class on body or a theme provider
    }
    
    // Toggle notifications
    function toggleNotifications(enabled) {
        console.log('Notifications:', enabled ? 'enabled' : 'disabled');
        // In a real application, this would update a user preference in the database
    }
    
    // Toggle animations
    function toggleAnimations(enabled) {
        console.log('Animations:', enabled ? 'enabled' : 'disabled');
        // In a real application, this would add or remove a 'no-animations' class to body
    }
    
    // Toggle compact sidebar
    function toggleCompactSidebar(enabled) {
        console.log('Compact sidebar:', enabled ? 'enabled' : 'disabled');
        // In a real application, this would update a user preference and apply the change
        if (enabled) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }
    
    // Load content for other tabs - in a real application, this would fetch data from the server
    function loadTabContent(tabId) {
        const tabContent = document.getElementById(tabId);
        if (tabContent && tabContent.querySelector('.settings-section h2').textContent.includes('Đang tải')) {
            console.log('Loading content for tab:', tabId);
            
            // Simulate loading delay
            setTimeout(() => {
                // Replace with actual content - in a real app, this would come from the server
                switch (tabId) {
                    case 'users':
                        tabContent.innerHTML = getUsersTabContent();
                        break;
                    case 'email':
                        tabContent.innerHTML = getEmailTabContent();
                        break;
                    case 'payment':
                        tabContent.innerHTML = getPaymentTabContent();
                        break;
                    case 'api':
                        tabContent.innerHTML = getApiTabContent();
                        break;
                    case 'backup':
                        tabContent.innerHTML = getBackupTabContent();
                        break;
                }
                
                // Reinitialize event listeners for the new content
                initForms();
            }, 500);
        }
    }
    
    // Mock content for users tab
    function getUsersTabContent() {
        return `
            <div class="settings-section">
                <h2 class="section-title">Cài đặt đăng ký & đăng nhập</h2>
                <form class="settings-form">
                    <div class="form-group">
                        <label>Đăng ký người dùng</label>
                        <div class="radio-group">
                            <label class="radio-item">
                                <input type="radio" name="registrationType" value="open" checked>
                                <span class="radio-label">Mở (Cho phép đăng ký tự do)</span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="registrationType" value="approval">
                                <span class="radio-label">Phê duyệt (Người dùng cần được duyệt)</span>
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="registrationType" value="closed">
                                <span class="radio-label">Đóng (Chỉ admin tạo tài khoản)</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="defaultRole">Vai trò mặc định</label>
                            <select id="defaultRole" class="form-control">
                                <option value="subscriber" selected>Người dùng</option>
                                <option value="agent">Đại lý</option>
                                <option value="author">Tác giả</option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="accountVerification">Xác minh tài khoản</label>
                            <select id="accountVerification" class="form-control">
                                <option value="email" selected>Xác minh email</option>
                                <option value="phone">Xác minh điện thoại</option>
                                <option value="both">Cả hai</option>
                                <option value="none">Không xác minh</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Tùy chọn bảo mật</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="enableCaptcha" checked>
                                <span class="checkbox-label">Bật CAPTCHA khi đăng ký</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="loginThrottling" checked>
                                <span class="checkbox-label">Giới hạn số lần đăng nhập thất bại</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="twoFactorAuth">
                                <span class="checkbox-label">Bật xác thực hai yếu tố</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="strongPassword" checked>
                                <span class="checkbox-label">Yêu cầu mật khẩu mạnh</span>
                            </label>
                        </div>
                    </div>
                </form>
            </div>
            <div class="settings-section">
                <h2 class="section-title">Hồ sơ người dùng</h2>
                <form class="settings-form">
                    <div class="form-group">
                        <label>Trường thông tin bắt buộc</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item">
                                <input type="checkbox" id="requireName" checked>
                                <span class="checkbox-label">Họ tên</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="requirePhone" checked>
                                <span class="checkbox-label">Số điện thoại</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="requireAddress">
                                <span class="checkbox-label">Địa chỉ</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" id="requireAvatar">
                                <span class="checkbox-label">Ảnh đại diện</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="avatarSize">Kích thước ảnh đại diện tối đa (KB)</label>
                        <input type="number" id="avatarSize" class="form-control" value="500">
                    </div>
                </form>
            </div>
            <div class="settings-actions">
                <button class="btn btn-secondary">Đặt lại mặc định</button>
                <button class="btn btn-primary">Lưu thay đổi</button>
            </div>
        `;
    }
    
    // Mock content for other tabs
    function getEmailTabContent() {
        return `
            <div class="settings-section">
                <h2 class="section-title">Cài đặt Email</h2>
                <form class="settings-form">
                    <div class="form-group">
                        <label for="emailProvider">Dịch vụ email</label>
                        <select id="emailProvider" class="form-control">
                            <option value="smtp" selected>SMTP</option>
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailchimp">Mailchimp</option>
                        </select>
                    </div>
                    <div id="smtpSettings">
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="smtpHost">SMTP Host</label>
                                <input type="text" id="smtpHost" class="form-control" value="smtp.gmail.com">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="smtpPort">SMTP Port</label>
                                <input type="number" id="smtpPort" class="form-control" value="587">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="smtpUsername">SMTP Username</label>
                                <input type="text" id="smtpUsername" class="form-control" value="contact@realestatecompany.com">
                            </div>
                            <div class="form-group col-md-6">
                                <label for="smtpPassword">SMTP Password</label>
                                <input type="password" id="smtpPassword" class="form-control" value="********">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="smtpEncryption">Mã hóa</label>
                            <select id="smtpEncryption" class="form-control">
                                <option value="tls" selected>TLS</option>
                                <option value="ssl">SSL</option>
                                <option value="none">Không mã hóa</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="settings-section">
                <h2 class="section-title">Mẫu Email</h2>
                <form class="settings-form">
                    <div class="form-group">
                        <label for="emailTemplate">Mẫu email mặc định</label>
                        <select id="emailTemplate" class="form-control">
                            <option value="default" selected>Mẫu mặc định</option>
                            <option value="modern">Mẫu hiện đại</option>
                            <option value="minimal">Mẫu tối giản</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="emailFooter">Chân trang email</label>
                        <textarea id="emailFooter" class="form-control" rows="3">© 2023 RealEstate Company. Tất cả các quyền được bảo lưu.</textarea>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-secondary">Kiểm tra cài đặt email</button>
                    </div>
                </form>
            </div>
            <div class="settings-actions">
                <button class="btn btn-secondary">Đặt lại mặc định</button>
                <button class="btn btn-primary">Lưu thay đổi</button>
            </div>
        `;
    }
    
    function getPaymentTabContent() {
        return `
            <div class="settings-section">
                <h2 class="section-title">Đang phát triển...</h2>
                <p>Nội dung cài đặt thanh toán sẽ sớm được cập nhật.</p>
            </div>
        `;
    }
    
    function getApiTabContent() {
        return `
            <div class="settings-section">
                <h2 class="section-title">Đang phát triển...</h2>
                <p>Nội dung cài đặt API & tích hợp sẽ sớm được cập nhật.</p>
            </div>
        `;
    }
    
    function getBackupTabContent() {
        return `
            <div class="settings-section">
                <h2 class="section-title">Đang phát triển...</h2>
                <p>Nội dung cài đặt sao lưu & phục hồi sẽ sớm được cập nhật.</p>
            </div>
        `;
    }
    
    // Tab loading handler
    function handleTabLoading() {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                loadTabContent(tabId);
            });
        });
    }
    
    // Initialize everything
    function init() {
        initTabs();
        initColorOptions();
        initForms();
        initLogoUpload();
        initAppearanceSettings();
        handleTabLoading();
    }
    
    // Start initialization
    init();
}); 