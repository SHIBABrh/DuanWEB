// Constants
const TOTAL_RECORDS = 48;
const RECORDS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_RECORDS / RECORDS_PER_PAGE);

// Current state
let currentPage = 1;
let itemsPerPage = RECORDS_PER_PAGE;
let isProcessing = false; // Flag to prevent multiple rapid clicks

// Track modal state
let modalIsOpen = false;
let currentPropertyId = null;

// Debounce function to prevent excessive function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');

    toggleSidebar.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Property Modal Elements
    const propertyModal = document.getElementById('propertyModal');
    const btnAddProperty = document.getElementById('btnAddProperty');
    const closePropertyModal = document.getElementById('closePropertyModal');
    const cancelProperty = document.getElementById('cancelProperty');
    const saveProperty = document.getElementById('saveProperty');
    const propertyForm = document.getElementById('propertyForm');
    const propertyModalTitle = document.getElementById('propertyModalTitle');

    // View Property Modal Elements
    const viewPropertyModal = document.getElementById('viewPropertyModal');
    const closeViewPropertyModal = document.getElementById('closeViewPropertyModal');
    const closePropertyDetail = document.getElementById('closePropertyDetail');

    // Delete Modal Elements
    const deletePropertyModal = document.getElementById('deletePropertyModal');
    const closeDeletePropertyModal = document.getElementById('closeDeletePropertyModal');
    const cancelDeleteProperty = document.getElementById('cancelDeleteProperty');
    const confirmDeleteProperty = document.getElementById('confirmDeleteProperty');

    // Images Upload Elements
    const imagesUpload = document.getElementById('imagesUpload');
    const imagesInput = document.getElementById('images');
    const imagesPreview = document.getElementById('imagesPreview');

    // Add event listeners for property management modals
    if (btnAddProperty) {
        btnAddProperty.addEventListener('click', function() {
            if (isProcessing) return;
            isProcessing = true;
            
            // Allow UI to update before heavy operations
            setTimeout(() => {
                openAddPropertyModal();
                isProcessing = false;
            }, 50);
        });
    }

    if (closePropertyModal) {
        closePropertyModal.addEventListener('click', function() {
            propertyModal.classList.remove('show');
            setTimeout(resetPropertyForm, 100); // Delay form reset to prevent UI freeze
        });
    }

    if (cancelProperty) {
        cancelProperty.addEventListener('click', function() {
            propertyModal.classList.remove('show');
            setTimeout(resetPropertyForm, 100); // Delay form reset to prevent UI freeze
        });
    }

    if (closeViewPropertyModal) {
        closeViewPropertyModal.addEventListener('click', function() {
            viewPropertyModal.classList.remove('show');
        });
    }

    if (closePropertyDetail) {
        closePropertyDetail.addEventListener('click', function() {
            viewPropertyModal.classList.remove('show');
        });
    }

    // IMPROVED DELETE MODAL HANDLERS
    if (closeDeletePropertyModal) {
        closeDeletePropertyModal.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideDeleteModal();
        });
    }

    if (cancelDeleteProperty) {
        cancelDeleteProperty.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hideDeleteModal();
        });
    }

    // Completely revised delete confirmation handler
    if (confirmDeleteProperty) {
        // Remove any existing event listeners to prevent duplicates
        confirmDeleteProperty.replaceWith(confirmDeleteProperty.cloneNode(true));
        
        // Get the fresh element reference and add new listener
        const newConfirmBtn = document.getElementById('confirmDeleteProperty');
        
        newConfirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!currentPropertyId || isProcessing) return;
            
            isProcessing = true;
            
            // Show visual feedback
            this.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
            this.disabled = true;
            
            // Add a small delay to allow UI update
            setTimeout(() => {
                try {
                    console.log('Deleting property with ID:', currentPropertyId);
                    
                    // In a real app, you would make an API call here
                    fetch(`/api/properties/${currentPropertyId}`, { method: 'DELETE' })
                    
                    // Show success message using toast instead of alert
                    showToast(`Đã xóa bất động sản với ID: ${currentPropertyId}`, 'success');
                    
                    // Reset and hide the modal
                    hideDeleteModal();
                    
                } catch (err) {
                    console.error('Error deleting property:', err);
                    showToast('Có lỗi xảy ra khi xóa bất động sản', 'error');
                } finally {
                    // Reset button state
                    this.innerHTML = 'Xóa';
                    this.disabled = false;
                    isProcessing = false;
                }
            }, 300);
        });
    }

    // Helper function to hide delete modal
    function hideDeleteModal() {
        if (deletePropertyModal) {
            deletePropertyModal.classList.remove('show');
            // Reset modal state
            modalIsOpen = false;
            // Reset currentPropertyId with delay to prevent race conditions
            setTimeout(() => {
                currentPropertyId = null;
            }, 300);
        }
    }

    // Add toast notification system
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Create toast content
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
            <div class="toast-content">${message}</div>
            <div class="toast-close"><i class="fas fa-times"></i></div>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Add close handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            });
        }
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Save property functionality
    if (saveProperty) {
        saveProperty.addEventListener('click', function() {
            if (isProcessing) return;
            isProcessing = true;
            
            // Allow UI to update before validation
            setTimeout(() => {
                if (propertyForm.checkValidity()) {
                    // Show visual feedback immediately
                    saveProperty.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
                    saveProperty.disabled = true;
                    
                    // Process after a short delay to allow UI update
                    setTimeout(() => {
                        // In a real application, we would send this data to the server
                        if (currentPropertyId) {
                            // Update existing property
                            console.log('Updating property with ID:', currentPropertyId);
                            showToast(`Đã cập nhật thông tin bất động sản: ${document.getElementById('title').value}`, 'success');
                        } else {
                            // Create new property
                            console.log('Creating new property');
                            showToast(`Đã thêm bất động sản mới: ${document.getElementById('title').value}`, 'success');
                        }
                        
                        propertyModal.classList.remove('show');
                        setTimeout(resetPropertyForm, 100);
                        
                        // Reset button state
                        saveProperty.innerHTML = 'Lưu bất động sản';
                        saveProperty.disabled = false;
                        isProcessing = false;
                    }, 300);
                } else {
                    propertyForm.reportValidity();
                    isProcessing = false;
                }
            }, 50);
        });
    }

    // Images upload functionality - optimize to handle large files better
    if (imagesUpload) {
        imagesUpload.addEventListener('click', function() {
            imagesInput.click();
        });
    }

    if (imagesInput) {
        imagesInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                // Clear previous images immediately for visual feedback
                imagesPreview.innerHTML = '';
                imagesPreview.style.display = 'grid';
                
                // Add loading indicator
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'loading-indicator';
                loadingIndicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
                imagesPreview.appendChild(loadingIndicator);
                
                // Use setTimeout to process images in chunks
                setTimeout(() => {
                    processImages(this.files, 0, 3); // Process 3 images at a time
                }, 50);
            }
        });
    }

    // Process images in small batches to prevent UI freezing
    function processImages(files, startIndex, batchSize) {
        imagesPreview.querySelector('.loading-indicator')?.remove();
        
        const endIndex = Math.min(startIndex + batchSize, files.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const file = files[i];
            if (!file.type.match('image.*')) {
                continue;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Property Image Preview';
                img.loading = 'lazy'; // Add lazy loading
                
                // Add load event for better performance metrics
                img.onload = function() {
                    img.classList.add('loaded');
                };
                
                const deleteBtn = document.createElement('div');
                deleteBtn.className = 'delete-image';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    imageItem.remove();
                });
                
                imageItem.appendChild(img);
                imageItem.appendChild(deleteBtn);
                imagesPreview.appendChild(imageItem);
            };
            reader.readAsDataURL(file);
        }
        
        // If there are more images to process, schedule the next batch
        if (endIndex < files.length) {
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Đang xử lý...';
            imagesPreview.appendChild(loadingIndicator);
            
            setTimeout(() => {
                processImages(files, endIndex, batchSize);
            }, 100);
        }
    }

    // Filter functionality - debounce to prevent excessive processing
    const searchProperty = document.getElementById('searchProperty');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');

    const debouncedFilter = debounce(filterProperties, 300);

    if (searchProperty) {
        searchProperty.addEventListener('input', debouncedFilter);
    }

    if (filterCategory) {
        filterCategory.addEventListener('change', debouncedFilter);
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', debouncedFilter);
    }

    // Functions for property management
    function openAddPropertyModal() {
        propertyModalTitle.textContent = 'Thêm bất động sản mới';
        currentPropertyId = null;
        resetPropertyForm();
        propertyModal.classList.add('show');
    }

    function resetPropertyForm() {
        propertyForm.reset();
        if (imagesPreview) {
            imagesPreview.innerHTML = '';
            imagesPreview.style.display = 'none';
        }
    }

    function filterProperties() {
        // In a real application, this would likely be a server-side filter or API call
        console.log('Filtering properties with:');
        console.log('Search:', searchProperty ? searchProperty.value : 'N/A');
        console.log('Category:', filterCategory ? filterCategory.value : 'N/A');
        console.log('Status:', filterStatus ? filterStatus.value : 'N/A');
        
        // For demo purposes, just show a toast instead of an alert
        showToast('Đang lọc bất động sản...', 'info');
    }

    // Initialize pagination
    initPagination();
    
    // Setup event listeners for filter and search
    setupEventListeners();
    
    // Add data-id attributes to all property rows for easier identification
    const propertyRows = document.querySelectorAll('#propertyTable tbody tr');
    propertyRows.forEach(row => {
        const idCell = row.querySelector('td:first-child');
        if (idCell) {
            const propertyId = idCell.textContent.replace('#', '');
            row.setAttribute('data-id', propertyId);
        }
    });
});

// Global functions for property actions - optimize with timeouts
// These are called from the HTML onclick attributes

function viewProperty(propertyId) {
    if (isProcessing) return;
    isProcessing = true;
    
    // Show loading indicator
    const btn = document.querySelector(`button[onclick="viewProperty('${propertyId}')"]`);
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        btn.disabled = true;
        
        // Allow UI to update before heavy operations
        setTimeout(() => {
            // In a real application, we would fetch property details from the server
            console.log('Viewing property with ID:', propertyId);
            
            // For demo, just show the modal with some data
            const viewPropertyModal = document.getElementById('viewPropertyModal');
            
            // These would normally be set from API data
            document.getElementById('propertyTitle').textContent = 'Căn hộ cao cấp Green Park';
            document.getElementById('propertyPrice').textContent = '2.5 tỷ VNĐ';
            
            viewPropertyModal.classList.add('show');
            
            // Reset button state
            btn.innerHTML = originalContent;
            btn.disabled = false;
            isProcessing = false;
        }, 50);
    } else {
        isProcessing = false;
    }
}

function editProperty(propertyId) {
    if (isProcessing) return;
    isProcessing = true;
    
    // Show loading indicator
    const btn = document.querySelector(`button[onclick="editProperty('${propertyId}')"]`);
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        btn.disabled = true;
        
        // Allow UI to update before heavy operations
        setTimeout(() => {
            // In a real application, we would fetch property details from the server
            console.log('Editing property with ID:', propertyId);
            
            const propertyModal = document.getElementById('propertyModal');
            const propertyModalTitle = document.getElementById('propertyModalTitle');
            
            propertyModalTitle.textContent = 'Chỉnh sửa bất động sản';
            currentPropertyId = propertyId;
            
            // In a real application, we would populate the form with data from the server
            // For demo, just show the modal
            document.getElementById('title').value = 'Căn hộ cao cấp Green Park';
            document.getElementById('description').value = 'Căn hộ cao cấp với đầy đủ tiện nghi hiện đại...';
            document.getElementById('price').value = '2500000000';
            document.getElementById('area').value = '85';
            document.getElementById('bedrooms').value = '2';
            document.getElementById('bathrooms').value = '2';
            
            propertyModal.classList.add('show');
            
            // Reset button state
            btn.innerHTML = originalContent;
            btn.disabled = false;
            isProcessing = false;
        }, 50);
    } else {
        isProcessing = false;
    }
}

// COMPLETELY REWRITTEN delete function to resolve modal freeze issues
function deleteProperty(propertyId) {
    if (isProcessing || modalIsOpen) return;
    
    // Set flags to prevent multiple calls
    isProcessing = true;
    modalIsOpen = true;
    
    // Store property ID globally
    currentPropertyId = propertyId;
    
    // Get button element
    const btn = document.querySelector(`button[onclick="deleteProperty('${propertyId}')"]`);
    
    // Show loading indicator on button
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        btn.disabled = true;
        
        // Put small delay before showing modal for better UX
        setTimeout(() => {
            console.log('Preparing to delete property ID:', propertyId);
            
            // Get modal and ensure it exists
            const deletePropertyModal = document.getElementById('deletePropertyModal');
            if (!deletePropertyModal) {
                console.error('Delete modal not found');
                isProcessing = false;
                modalIsOpen = false;
                
                // Reset button
                btn.innerHTML = originalContent;
                btn.disabled = false;
                return;
            }
            
            // Update modal content with property info (if needed)
            try {
                // Optional: Update modal message with property name
                // Use try/catch to prevent errors if elements don't exist
                const propertyRow = document.querySelector(`tr[data-id="${propertyId}"]`);
                if (propertyRow) {
                    const propertyTitle = propertyRow.querySelector('td:nth-child(3)').textContent;
                    const modalBody = deletePropertyModal.querySelector('.modal-body p');
                    if (modalBody) {
                        modalBody.textContent = `Bạn có chắc chắn muốn xóa bất động sản "${propertyTitle}"? Thao tác này không thể hoàn tác.`;
                    }
                }
            } catch (e) {
                console.log('Error updating modal content:', e);
                // Continue anyway since this is just an enhancement
            }
            
            // Show the modal with animation
            deletePropertyModal.style.display = 'flex';
            setTimeout(() => {
                deletePropertyModal.classList.add('show');
                
                // Reset button state
                btn.innerHTML = originalContent;
                btn.disabled = false;
                isProcessing = false;
            }, 50);
        }, 150);
    } else {
        // If button not found, just show modal
        const deletePropertyModal = document.getElementById('deletePropertyModal');
        if (deletePropertyModal) {
            deletePropertyModal.style.display = 'flex';
            deletePropertyModal.classList.add('show');
        }
        isProcessing = false;
    }
}

// The rest of the functions remain the same
function changeMainImage(src) {
    document.getElementById('mainPropertyImage').src = src;
}

function initPagination() {
    updateDisplayText();
    renderPagination('topPagination', currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
    renderPagination('bottomPagination', currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
}

function goToPage(page) {
    if (page < 1 || page > TOTAL_PAGES || page === currentPage) return;
    
    currentPage = page;
    updateDisplayText();
    
    renderPagination('topPagination', currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
    renderPagination('bottomPagination', currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
    
    // In a real application, we would fetch data for the new page
    console.log('Going to page:', page);
}

function changePageSize(size) {
    if (size === itemsPerPage) return;
    
    itemsPerPage = size;
    const newTotalPages = Math.ceil(TOTAL_RECORDS / itemsPerPage);
    
    if (currentPage > newTotalPages) {
        currentPage = newTotalPages;
    }
    
    updateDisplayText();
    
    renderPagination('topPagination', currentPage, newTotalPages, TOTAL_RECORDS, itemsPerPage);
    renderPagination('bottomPagination', currentPage, newTotalPages, TOTAL_RECORDS, itemsPerPage);
    
    // In a real application, we would fetch data with the new page size
    console.log('Changed page size to:', size);
}

function updateDisplayText() {
    const displayElems = document.querySelectorAll('.pagination-info');
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, TOTAL_RECORDS);
    
    displayElems.forEach(elem => {
        elem.textContent = `Hiển thị ${start} đến ${end} trên tổng số ${TOTAL_RECORDS} bất động sản`;
    });
}

function setupEventListeners() {
    // Handle page size selector
    const pageSizeSelectors = document.querySelectorAll('.page-size-selector');
    pageSizeSelectors.forEach(selector => {
        selector.addEventListener('change', function() {
            changePageSize(parseInt(this.value));
        });
    });
}

// Helper function to render pagination
function renderPagination(containerId, currentPage, totalPages, totalRecords, itemsPerPage) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Delay rendering to prevent UI freeze
    setTimeout(() => {
        let html = '<ul>';
        
        // Previous button
        html += `<li><a href="javascript:void(0)" ${currentPage === 1 ? 'class="disabled"' : 'onclick="goToPage(' + (currentPage - 1) + ')"'}><i class="fas fa-angle-left"></i></a></li>`;
        
        // Page numbers
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        // First page
        if (startPage > 1) {
            html += `<li><a href="javascript:void(0)" onclick="goToPage(1)">1</a></li>`;
            if (startPage > 2) {
                html += `<li><span class="ellipsis">...</span></li>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            html += `<li><a href="javascript:void(0)" ${i === currentPage ? 'class="active"' : 'onclick="goToPage(' + i + ')"'}>${i}</a></li>`;
        }
        
        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li><span class="ellipsis">...</span></li>`;
            }
            html += `<li><a href="javascript:void(0)" onclick="goToPage(${totalPages})">${totalPages}</a></li>`;
        }
        
        // Next button
        html += `<li><a href="javascript:void(0)" ${currentPage === totalPages ? 'class="disabled"' : 'onclick="goToPage(' + (currentPage + 1) + ')"'}><i class="fas fa-angle-right"></i></a></li>`;
        
        html += '</ul>';
        
        container.innerHTML = html;
    }, 0);
}

function deleteUser(userId) {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Xóa dòng từ bảng hiện tại
                document.querySelector(`tr[data-id="${userId}"]`).remove();
                showNotification("Đã xóa người dùng thành công", "success");
            } else {
                throw new Error("Không thể xóa người dùng");
            }
        })
        .catch(error => {
            showNotification(error.message, "error");
        });
    }
} 