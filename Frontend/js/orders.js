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

    // Orders Table Elements
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const filterBtn = document.querySelector('.filter-btn');
    const selectAll = document.getElementById('selectAll');
    const orderCheckboxes = document.querySelectorAll('.order-checkbox');
    const exportOrders = document.getElementById('exportOrders');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');

    // Order Detail Modal Elements
    const viewButtons = document.querySelectorAll('.view-btn');
    const orderDetailModal = document.getElementById('orderDetailModal');
    const orderDetailId = document.getElementById('orderDetailId');
    const printOrder = document.getElementById('printOrder');

    // Edit Order Modal Elements
    const editButtons = document.querySelectorAll('.edit-btn');
    const editOrderModal = document.getElementById('editOrderModal');
    const editOrderId = document.getElementById('editOrderId');
    const orderStatus = document.getElementById('orderStatus');
    const paymentStatus = document.getElementById('paymentStatus');
    const orderNotes = document.getElementById('orderNotes');
    const saveOrderChanges = document.getElementById('saveOrderChanges');

    // Delete Action
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // Close Modal Buttons
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Mock data for demonstration
    const orders = [
        {
            id: 'ORD-001',
            customer: 'Nguyễn Văn A',
            property: 'Chung cư Star City',
            type: 'Mua',
            date: '20/04/2023',
            time: '14:30',
            amount: '3.5 tỷ VNĐ',
            status: 'completed',
            payment_status: 'paid',
            payment_date: '21/04/2023',
            payment_method: 'Chuyển khoản ngân hàng',
            notes: 'Khách hàng thanh toán đầy đủ, giao dịch hoàn tất. Đã bàn giao sổ đỏ và giấy tờ liên quan.',
            customer_details: {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@gmail.com',
                phone: '0901234567',
                address: '123 Đường ABC, Quận 1, TP.HCM'
            },
            property_details: {
                name: 'Chung cư Star City',
                code: 'PROP-123',
                address: '456 Đường XYZ, Quận 2, TP.HCM',
                area: '95 m²'
            }
        },
        // More orders could be added here
    ];

    // Initialize Event Listeners
    function initEventListeners() {
        // Select All Checkboxes
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                orderCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAll.checked;
                });
            });
        }

        // View Order Details
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                showOrderDetails(orderId);
            });
        });

        // Edit Order
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                showEditOrderModal(orderId);
            });
        });

        // Delete Order
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                confirmDeleteOrder(orderId);
            });
        });

        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeAllModals();
            });
        });

        // Save Order Changes
        if (saveOrderChanges) {
            saveOrderChanges.addEventListener('click', function() {
                updateOrder();
            });
        }

        // Print Order
        if (printOrder) {
            printOrder.addEventListener('click', function() {
                printOrderDetails();
            });
        }

        // Export Orders
        if (exportOrders) {
            exportOrders.addEventListener('click', function() {
                exportOrdersToExcel();
            });
        }

        // Search and Filter
        if (orderSearch) {
            orderSearch.addEventListener('input', function() {
                filterOrders();
            });
        }

        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                filterOrders();
            });
        }

        // Pagination
        if (prevPage) {
            prevPage.addEventListener('click', function() {
                goToPreviousPage();
            });
        }

        if (nextPage) {
            nextPage.addEventListener('click', function() {
                goToNextPage();
            });
        }

        pageNumbers.forEach(button => {
            button.addEventListener('click', function() {
                goToPage(this.textContent);
            });
        });
    }

    // Show Order Details
    function showOrderDetails(orderId) {
        // In a real application, you would fetch order details from the server
        // For demonstration, we're using the mock data
        const order = orders.find(o => o.id === orderId) || orders[0];
        
        if (orderDetailId) {
            orderDetailId.textContent = order.id;
        }

        // Populate order details in the modal
        // This would be more comprehensive in a real application

        // Show the modal
        if (orderDetailModal) {
            orderDetailModal.style.display = 'block';
        }
    }

    // Show Edit Order Modal
    function showEditOrderModal(orderId) {
        // In a real application, you would fetch order details from the server
        // For demonstration, we're using the mock data
        const order = orders.find(o => o.id === orderId) || orders[0];
        
        if (editOrderId) {
            editOrderId.textContent = order.id;
        }

        // Populate form fields with order data
        if (orderStatus) {
            orderStatus.value = order.status;
        }
        
        if (paymentStatus) {
            paymentStatus.value = order.payment_status;
        }
        
        if (orderNotes) {
            orderNotes.value = order.notes;
        }

        // Show the modal
        if (editOrderModal) {
            editOrderModal.style.display = 'block';
        }
    }

    // Update Order
    function updateOrder() {
        const id = editOrderId.textContent;
        const status = orderStatus.value;
        const payment = paymentStatus.value;
        const notes = orderNotes.value;

        // In a real application, you would send this data to the server
        console.log('Updating order:', { id, status, payment, notes });

        // Show success message
        alert('Đơn hàng #' + id + ' đã được cập nhật thành công!');

        // Close the modal
        closeAllModals();

        // Update the order in the table (in a real app, you might refresh the data from the server)
        const statusCell = document.querySelector(`tr td:nth-child(2):contains('${id}')`).nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
        
        // Update the displayed status (simplified)
        let statusClass = '';
        let statusText = '';
        
        switch(status) {
            case 'pending':
                statusClass = 'pending';
                statusText = 'Chờ xử lý';
                break;
            case 'processing':
                statusClass = 'processing';
                statusText = 'Đang xử lý';
                break;
            case 'completed':
                statusClass = 'active';
                statusText = 'Hoàn thành';
                break;
            case 'cancelled':
                statusClass = 'inactive';
                statusText = 'Đã hủy';
                break;
        }
        
        // This is a simplified way to update the DOM and would be more robust in a real application
        if (statusCell) {
            statusCell.innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        }
    }

    // Confirm Delete Order
    function confirmDeleteOrder(orderId) {
        if (confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId}?`)) {
            // In a real application, you would send a delete request to the server
            console.log('Deleting order:', orderId);
            
            // Show success message
            alert('Đơn hàng #' + orderId + ' đã được xóa thành công!');
            
            // Remove the row from the table (in a real app, you might refresh the data from the server)
            const row = document.querySelector(`button.delete-btn[data-id="${orderId}"]`).closest('tr');
            if (row) {
                row.remove();
            }
        }
    }

    // Print Order Details
    function printOrderDetails() {
        // In a real application, you would generate a printable view
        window.print();
    }

    // Export Orders to Excel
    function exportOrdersToExcel() {
        // In a real application, you would generate an Excel file
        alert('Đang xuất danh sách đơn hàng ra file Excel...');
        // Typically, you would redirect to a server endpoint that generates the Excel file
    }

    // Filter Orders
    function filterOrders() {
        const searchValue = orderSearch ? orderSearch.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const dateValue = dateFilter ? dateFilter.value : '';

        // In a real application, you would filter the data on the server or locally
        console.log('Filtering orders:', { searchValue, statusValue, dateValue });

        // For a more complex implementation, you would implement actual filtering logic here
        // This would involve either sending a request to the server or filtering the local data
        // and then updating the table with the filtered results
    }

    // Pagination Functions
    function goToPreviousPage() {
        // Get the current active page
        const activePage = document.querySelector('.page-number.active');
        if (activePage && activePage.previousElementSibling && activePage.previousElementSibling.classList.contains('page-number')) {
            activePage.classList.remove('active');
            activePage.previousElementSibling.classList.add('active');
            
            // Update button states
            updatePaginationButtons();
            
            // In a real application, you would load the previous page of data
            loadPageData(parseInt(activePage.previousElementSibling.textContent));
        }
    }

    function goToNextPage() {
        // Get the current active page
        const activePage = document.querySelector('.page-number.active');
        if (activePage && activePage.nextElementSibling && activePage.nextElementSibling.classList.contains('page-number')) {
            activePage.classList.remove('active');
            activePage.nextElementSibling.classList.add('active');
            
            // Update button states
            updatePaginationButtons();
            
            // In a real application, you would load the next page of data
            loadPageData(parseInt(activePage.nextElementSibling.textContent));
        }
    }

    function goToPage(pageNumber) {
        // Remove active class from current page
        const currentActivePage = document.querySelector('.page-number.active');
        if (currentActivePage) {
            currentActivePage.classList.remove('active');
        }
        
        // Add active class to the clicked page
        const newActivePage = document.querySelector(`.page-number:nth-child(${pageNumber})`);
        if (newActivePage) {
            newActivePage.classList.add('active');
        }
        
        // Update button states
        updatePaginationButtons();
        
        // In a real application, you would load the selected page of data
        loadPageData(parseInt(pageNumber));
    }

    function updatePaginationButtons() {
        const activePage = document.querySelector('.page-number.active');
        const firstPage = document.querySelector('.page-number:first-child');
        const lastPage = document.querySelector('.page-number:last-child');
        
        if (prevPage) {
            prevPage.disabled = activePage === firstPage;
        }
        
        if (nextPage) {
            nextPage.disabled = activePage === lastPage;
        }
    }

    function loadPageData(pageNumber) {
        // In a real application, you would load data for the specified page from the server
        console.log('Loading data for page:', pageNumber);
    }

    // Close All Modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Initialize the page
    initEventListeners();
    updatePaginationButtons();
}); 