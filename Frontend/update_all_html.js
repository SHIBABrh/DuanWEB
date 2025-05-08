/**
 * Update All HTML Files
 * 
 * This script ensures all HTML files have the correct structure 
 * and necessary scripts for consistent sidebar functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // All pages that need to be synchronized
    const pages = [
        'dashboard.html',
        'users.html',
        'properties.html',
        'categories.html',
        'orders.html',
        'payments.html',
        'media.html',
        'reviews.html',
        'reports.html',
        'settings.html'
    ];

    // For each page, add essential sidebar structure if missing
    pages.forEach(page => {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Check for required scripts
                const hasComponentsScript = !!doc.querySelector('script[src="js/components.js"]');
                const hasSidebarToggleScript = !!doc.querySelector('script[src="js/sidebar-toggle.js"]');
                
                // Check for sidebar container
                const hasSidebar = !!doc.getElementById('sidebar');

                if (!hasComponentsScript || !hasSidebarToggleScript || !hasSidebar) {
                    console.log(`Page ${page} needs updates`);
                    
                    // You'd need server-side code to actually update the files
                    // This is just a check to identify which pages need changes
                }
            })
            .catch(error => {
                console.error(`Error processing ${page}:`, error);
            });
    });
});

// Function to synchronize sidebar on all pages
function syncSidebarOnAllPages() {
    // Get all loaded sidebar elements
    const sidebarElements = document.querySelectorAll('.sidebar, #sidebar');
    
    // For each sidebar found in the DOM
    sidebarElements.forEach(sidebar => {
        // Get all menu items
        const menuItems = sidebar.querySelectorAll('.sidebar-menu a');
        
        // Get current page path
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'dashboard.html';
        
        // Remove all active classes
        menuItems.forEach(item => item.classList.remove('active'));
        
        // Find and activate the right menu item
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && (href === currentPage || currentPage.includes(href.replace('.html', '')))) {
                item.classList.add('active');
            }
        });
    });
}

// Provide a global function that can be called from the console to manually sync
window.syncAllSidebars = syncSidebarOnAllPages; 