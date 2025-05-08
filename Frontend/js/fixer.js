/**
 * fixer.js - Sửa lỗi tương tác trang properties.html
 * File này khắc phục các vấn đề về tương tác với modal và sự kiện trên trang quản lý bất động sản
 */

document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo script này chạy cuối cùng sau tất cả các script khác
    setTimeout(function() {
        fixDeletePropertyModal();
        fixEditButtons();
        fixAddPropertyButton();
        setupEventDelegation();
    }, 500);
});

/**
 * Khắc phục vấn đề với modal xóa bất động sản
 */
function fixDeletePropertyModal() {
    console.log('Fixing delete property modal...');
    
    // Lấy tham chiếu đến các phần tử modal
    const deletePropertyModal = document.getElementById('deletePropertyModal');
    const closeDeletePropertyModal = document.getElementById('closeDeletePropertyModal');
    const cancelDeleteProperty = document.getElementById('cancelDeleteProperty');
    const confirmDeleteProperty = document.getElementById('confirmDeleteProperty');
    
    if (!deletePropertyModal || !confirmDeleteProperty) {
        console.error('Modal elements not found');
        return;
    }

    // Đảm bảo modal có z-index cao và hiển thị đúng
    deletePropertyModal.style.zIndex = '9999';
    
    // Sửa chức năng đóng modal
    function hideDeleteModal() {
        deletePropertyModal.classList.remove('show');
        deletePropertyModal.style.display = 'none';
        
        // Làm sạch các trạng thái
        window.currentPropertyId = null;
        window.modalIsOpen = false;
    }
    
    // Ghi đè lại sự kiện cho nút đóng
    if (closeDeletePropertyModal) {
        closeDeletePropertyModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideDeleteModal();
        }, true);
    }
    
    // Ghi đè lại sự kiện cho nút hủy
    if (cancelDeleteProperty) {
        cancelDeleteProperty.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideDeleteModal();
        }, true);
    }
    
    // Ghi đè lại sự kiện cho nút xác nhận xóa
    confirmDeleteProperty.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Lấy ID từ biến global, được set bởi hàm deleteProperty
        const propertyId = window.currentPropertyId;
        if (!propertyId) {
            console.error('No property ID found');
            hideDeleteModal();
            return;
        }
        
        // Thay đổi trạng thái nút khi đang xử lý
        this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
        this.disabled = true;
        
        // Xử lý xóa (giả lập)
        setTimeout(() => {
            try {
                // Xóa dòng khỏi bảng
                const row = document.querySelector(`tr[data-id="${propertyId}"]`);
                if (row) {
                    row.style.transition = 'opacity 0.5s ease';
                    row.style.opacity = '0';
                    
                    setTimeout(() => {
                        row.remove();
                    }, 500);
                }
                
                // Hiển thị thông báo thành công
                showNotification(`Đã xóa bất động sản với ID: ${propertyId}`, 'success');
                
                // Đóng modal
                hideDeleteModal();
            } catch (err) {
                console.error('Error deleting property:', err);
                showNotification('Có lỗi xảy ra khi xóa bất động sản', 'error');
            } finally {
                // Khôi phục trạng thái nút
                this.innerHTML = 'Xóa';
                this.disabled = false;
            }
        }, 500);
    }, true);
    
    // Ghi đè lại hàm deleteProperty toàn cục
    window.deleteProperty = function(propertyId) {
        console.log('Delete property function called with ID:', propertyId);
        
        // Lưu ID vào biến toàn cục để sử dụng sau
        window.currentPropertyId = propertyId;
        window.modalIsOpen = true;
        
        // Hiển thị modal
        deletePropertyModal.style.display = 'flex';
        setTimeout(() => {
            deletePropertyModal.classList.add('show');
        }, 10);
    };
}

/**
 * Khắc phục vấn đề với các nút chỉnh sửa
 */
function fixEditButtons() {
    console.log('Fixing edit buttons...');
    
    // Tham chiếu modal chỉnh sửa
    const propertyModal = document.getElementById('propertyModal');
    
    if (!propertyModal) {
        console.error('Property modal not found');
        return;
    }
    
    // Ghi đè lại hàm editProperty toàn cục
    window.editProperty = function(propertyId) {
        console.log('Edit property function called with ID:', propertyId);
        
        // Lưu ID vào biến toàn cục để sử dụng sau
        window.currentPropertyId = propertyId;
        
        const propertyModalTitle = document.getElementById('propertyModalTitle');
        if (propertyModalTitle) {
            propertyModalTitle.textContent = 'Chỉnh sửa bất động sản';
        }
        
        // Điền thông tin mẫu vào form
        document.getElementById('title').value = 'Căn hộ cao cấp Green Park';
        document.getElementById('description').value = 'Căn hộ cao cấp với đầy đủ tiện nghi hiện đại...';
        document.getElementById('price').value = '2500000000';
        document.getElementById('area').value = '85';
        document.getElementById('bedrooms').value = '2';
        document.getElementById('bathrooms').value = '2';
        
        // Hiển thị modal
        propertyModal.style.display = 'flex';
        setTimeout(() => {
            propertyModal.classList.add('show');
        }, 10);
    };
}

/**
 * Khắc phục vấn đề với nút thêm bất động sản
 */
function fixAddPropertyButton() {
    console.log('Fixing add property button...');
    
    const btnAddProperty = document.getElementById('btnAddProperty');
    const propertyModal = document.getElementById('propertyModal');
    const propertyModalTitle = document.getElementById('propertyModalTitle');
    
    if (!btnAddProperty || !propertyModal) {
        console.error('Add property button or modal not found');
        return;
    }
    
    // Ghi đè sự kiện click
    btnAddProperty.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Đặt lại tiêu đề và ID
        if (propertyModalTitle) {
            propertyModalTitle.textContent = 'Thêm bất động sản mới';
        }
        window.currentPropertyId = null;
        
        // Reset form
        const propertyForm = document.getElementById('propertyForm');
        if (propertyForm) {
            propertyForm.reset();
        }
        
        // Ẩn preview hình ảnh
        const imagesPreview = document.getElementById('imagesPreview');
        if (imagesPreview) {
            imagesPreview.innerHTML = '';
            imagesPreview.style.display = 'none';
        }
        
        // Hiển thị modal
        propertyModal.style.display = 'flex';
        setTimeout(() => {
            propertyModal.classList.add('show');
        }, 10);
    }, true);
}

/**
 * Thiết lập sự kiện bằng phương pháp ủy quyền (delegation)
 * để giảm số lượng event listeners và cải thiện hiệu suất
 */
function setupEventDelegation() {
    // Sử dụng event delegation thay vì gắn nhiều event listeners
    document.addEventListener('click', function(e) {
        // Xử lý nút xóa
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            e.preventDefault();
            const id = deleteBtn.getAttribute('data-id') || 
                      deleteBtn.closest('[data-id]')?.getAttribute('data-id');
            
            if (id) {
                deleteProperty(id);
            }
        }
        
        // Xử lý nút sửa
        const editBtn = e.target.closest('.btn-edit');
        if (editBtn) {
            e.preventDefault();
            const id = editBtn.getAttribute('data-id') || 
                      editBtn.closest('[data-id]')?.getAttribute('data-id');
            
            if (id) {
                editProperty(id);
            }
        }
    });
}

/**
 * Hiển thị thông báo đẹp mắt thay vì alert
 */
function showNotification(message, type = 'info') {
    // Tạo container nếu chưa tồn tại
    let notifContainer = document.querySelector('.notif-container');
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notif-container';
        document.body.appendChild(notifContainer);
    }
    
    // Tạo thông báo
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    
    // Chọn icon phù hợp
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notif.innerHTML = `
        <div class="notif-icon"><i class="fas fa-${icon}"></i></div>
        <div class="notif-content">${message}</div>
        <div class="notif-close"><i class="fas fa-times"></i></div>
    `;
    
    // Thêm vào container
    notifContainer.appendChild(notif);
    
    // Hiển thị
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    // Thêm nút đóng
    const closeBtn = notif.querySelector('.notif-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notif.classList.remove('show');
            setTimeout(() => {
                notif.remove();
            }, 300);
        });
    }
    
    // Tự động đóng sau 3 giây
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
} 