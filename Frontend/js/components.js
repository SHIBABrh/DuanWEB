/**
 * Components loader utility
 * Handles loading and activation of header and sidebar components
 */
document.addEventListener('DOMContentLoaded', function() {
    // Load header component
    loadComponent('header', 'components/header.html');
    
    // Load sidebar component
    loadComponent('sidebar', 'components/sidebar.html', function() {
        // After sidebar loads, activate the current menu item based on the page
        activateCurrentMenuItem();
    });
});

/**
 * Loads an HTML component into the specified element
 * @param {string} targetId - The ID of the element to load the component into
 * @param {string} componentPath - The path to the component HTML file
 * @param {Function} callback - Optional callback function to execute after component is loaded
 */
function loadComponent(targetId, componentPath, callback) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

/**
 * Activates the current menu item based on the current page URL
 */
function activateCurrentMenuItem() {
    // Get current page filename from URL
    let currentPath = window.location.pathname;
    let currentPage = currentPath.split('/').pop() || 'dashboard.html';
    
    console.log("Current page detected:", currentPage);
    
    // Handle various cases (with or without .html, case insensitivity)
    currentPage = currentPage.toLowerCase();
    if (!currentPage.includes('.html')) {
        currentPage += '.html';
    }
    
    // Map special cases or handle URLs with query parameters
    if (currentPage.includes('?')) {
        currentPage = currentPage.split('?')[0];
    }
    
    // Find the corresponding menu item ID
    let menuId = 'menu-' + currentPage.replace('.html', '');
    
    console.log("Looking for menu item with ID:", menuId);
    
    // Try to find the menu item
    let menuItem = document.getElementById(menuId);
    
    // If not found with exact match, try partial match
    if (!menuItem) {
        // Try generic fallbacks based on page patterns
        if (currentPage.includes('user')) {
            menuId = 'menu-users';
        } else if (currentPage.includes('propert')) {
            menuId = 'menu-properties';
        } else if (currentPage.includes('categor')) {
            menuId = 'menu-categories';
        } else if (currentPage.includes('order')) {
            menuId = 'menu-orders';
        } else if (currentPage.includes('payment')) {
            menuId = 'menu-payments';
        } else if (currentPage.includes('media')) {
            menuId = 'menu-media';
        } else if (currentPage.includes('review')) {
            menuId = 'menu-reviews';
        } else if (currentPage.includes('report')) {
            menuId = 'menu-reports';
        } else if (currentPage.includes('setting')) {
            menuId = 'menu-settings';
        } else {
            // Default to dashboard if nothing matches
            menuId = 'menu-dashboard';
        }
        
        console.log("Fallback to menu ID:", menuId);
        menuItem = document.getElementById(menuId);
    }
    
    // Add active class if found
    if (menuItem) {
        console.log("Activating menu:", menuId);
        
        // Remove active class from all menu items
        document.querySelectorAll('.sidebar-menu a').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to current menu item
        menuItem.classList.add('active');
    } else {
        console.error("Menu item not found:", menuId);
    }
    
    // Ensure sidebar is visible
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.querySelector('.sidebar-menu')) {
        sidebar.style.display = 'block';
    }
}

// Pagination Component
function createPagination(currentPage, totalPages, totalRecords, itemsPerPage) {
    // Default values if not provided
    currentPage = currentPage || 1;
    totalPages = totalPages || 5;
    totalRecords = totalRecords || 0;
    itemsPerPage = itemsPerPage || 10;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);

    const paginationHTML = `
    <div class="pagination-container">
        <div class="pagination-info">
            <div class="pagination-records">
                Hiển thị <strong>${startItem}-${endItem}</strong> của <strong>${totalRecords}</strong> bản ghi
            </div>
            <div class="pagination-limits">
                <span>Hiển thị:</span>
                <select id="recordsPerPage" onchange="changePageSize(this.value)">
                    <option value="5" ${itemsPerPage == 5 ? 'selected' : ''}>5</option>
                    <option value="10" ${itemsPerPage == 10 ? 'selected' : ''}>10</option>
                    <option value="15" ${itemsPerPage == 15 ? 'selected' : ''}>15</option>
                    <option value="20" ${itemsPerPage == 20 ? 'selected' : ''}>20</option>
                    <option value="50" ${itemsPerPage == 50 ? 'selected' : ''}>50</option>
                </select>
            </div>
        </div>
        <div class="pagination">
            <button class="pagination-btn first" onclick="goToPage(1)" ${currentPage == 1 ? 'disabled' : ''}>
                <i class="fas fa-angle-double-left"></i> Đầu
            </button>
            <button class="pagination-btn prev" onclick="goToPage(${currentPage - 1})" ${currentPage == 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Trước
            </button>
            <div class="page-numbers" id="pageNumbers">
                ${generatePageNumbers(currentPage, totalPages)}
            </div>
            <button class="pagination-btn next" onclick="goToPage(${currentPage + 1})" ${currentPage == totalPages ? 'disabled' : ''}>
                Sau <i class="fas fa-chevron-right"></i>
            </button>
            <button class="pagination-btn last" onclick="goToPage(${totalPages})" ${currentPage == totalPages ? 'disabled' : ''}>
                Cuối <i class="fas fa-angle-double-right"></i>
            </button>
            <div class="pagination-goto">
                <span>Tới trang:</span>
                <input type="number" min="1" max="${totalPages}" value="${currentPage}" 
                    onkeydown="if(event.key === 'Enter') goToPage(this.value)">
            </div>
        </div>
    </div>
    `;
    
    return paginationHTML;
}

// Helper function to generate page number buttons
function generatePageNumbers(currentPage, totalPages) {
    let html = '';
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust if we're near the end
    if (endPage - startPage < 4 && startPage > 1) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // First page always shown if we're not starting from page 1
    if (startPage > 1) {
        html += `<button class="page-number" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span>...</span>`;
        }
    }
    
    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            html += `<button class="page-number active">${i}</button>`;
        } else {
            html += `<button class="page-number" onclick="goToPage(${i})">${i}</button>`;
        }
    }
    
    // Last page always shown if we're not ending at the last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span>...</span>`;
        }
        html += `<button class="page-number" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    return html;
}

// Function to render pagination on a specific element
function renderPagination(elementId, currentPage, totalPages, totalRecords, itemsPerPage) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = createPagination(currentPage, totalPages, totalRecords, itemsPerPage);
    }
}

// Optional: Default placeholder functions that can be overridden
function goToPage(page) {
    console.log(`Navigating to page ${page}`);
    // Override this function in your page-specific JS file
}

function changePageSize(size) {
    console.log(`Changed page size to ${size}`);
    // Override this function in your page-specific JS file
} 