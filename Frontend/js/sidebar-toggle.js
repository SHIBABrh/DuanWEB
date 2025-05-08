/**
 * Sidebar Toggle and UI Enhancement Script
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const topbar = document.querySelector('.topbar');
    const toggleButton = document.getElementById('toggleSidebar');
    const statCards = document.querySelectorAll('.stat-card');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close, [id*="close"], .modal .btn:not([id*="save"], [id*="confirm"])');
    const modalTriggers = document.querySelectorAll('[id*="btn"], [onclick*="view"], [onclick*="edit"], [onclick*="delete"]');
    
    // Toggle sidebar function
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-collapsed');
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('expanded');
        topbar.classList.toggle('expanded');
        
        // Save state to localStorage
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    }
    
    // Initialize sidebar state from localStorage
    function initSidebarState() {
        const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('expanded');
            topbar.classList.add('expanded');
        }
    }
    
    // Add hover effects to stat cards
    function addStatCardEffects() {
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = 'var(--shadow-lg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            });
        });
    }
    
    // Modal functions
    function setupModals() {
        // Open modal triggers
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                // Get the appropriate modal
                const targetId = this.id.replace('btn', 'Modal');
                const modal = document.getElementById(targetId) || findModalByFunction(this);
                
                if (modal) {
                    openModal(modal);
                }
            });
        });
        
        // Close modal buttons
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('.modal');
                closeModal(modal);
            });
        });
        
        // Close modal when clicking outside
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        });
    }
    
    function findModalByFunction(element) {
        const onclick = element.getAttribute('onclick') || '';
        
        if (onclick.includes('view')) {
            return document.getElementById('viewUserModal');
        } else if (onclick.includes('edit')) {
            return document.getElementById('userModal');
        } else if (onclick.includes('delete')) {
            return document.getElementById('deleteModal');
        }
        
        return null;
    }
    
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Add ripple effect to buttons
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .sidebar-menu a');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Initialize everything
    function init() {
        if (toggleButton) {
            toggleButton.addEventListener('click', toggleSidebar);
        }
        
        initSidebarState();
        addStatCardEffects();
        setupModals();
        addRippleEffect();
    }
    
    // Run initialization
    init();
    
    // Ensure current menu item is active after sidebar fully loads
    setTimeout(function() {
        if (typeof activateCurrentMenuItem === 'function') {
            activateCurrentMenuItem();
        }
    }, 200);
    
    // Handle window resize events
    window.addEventListener('resize', handleWindowResize);
    
    // Initial check for screen size
    handleWindowResize();
});

/**
 * Toggles the sidebar between collapsed and expanded states
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
        
        // Store state in localStorage for persistence
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }
}

/**
 * Handles window resize events to manage sidebar on different screen sizes
 */
function handleWindowResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
        if (window.innerWidth < 768) {
            // Auto-collapse on small screens
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            }
        } else {
            // Restore from localStorage on larger screens
            const shouldBeCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            
            if (shouldBeCollapsed) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
            } else {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
            }
        }
    }
}

/**
 * Force sidebar synchronization - can be called from any page
 * to ensure menu is properly highlighted
 */
function syncSidebar() {
    if (typeof activateCurrentMenuItem === 'function') {
        activateCurrentMenuItem();
    }
}

// Call syncSidebar when page is fully loaded
window.addEventListener('load', syncSidebar); 