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

    // Payments Table Elements
    const paymentSearch = document.getElementById('paymentSearch');
    const methodFilter = document.getElementById('methodFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const filterBtn = document.querySelector('.filter-btn');
    const selectAll = document.getElementById('selectAll');
    const paymentCheckboxes = document.querySelectorAll('.payment-checkbox');
    const exportPayments = document.getElementById('exportPayments');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');

    // Payment Detail Modal Elements
    const viewButtons = document.querySelectorAll('.view-btn');
    const paymentDetailModal = document.getElementById('paymentDetailModal');
    const paymentDetailId = document.getElementById('paymentDetailId');
    const printPayment = document.getElementById('printPayment');

    // Edit Payment Modal Elements
    const editButtons = document.querySelectorAll('.edit-btn');
    const editPaymentModal = document.getElementById('editPaymentModal');
    const editPaymentId = document.getElementById('editPaymentId');
    const paymentStatus = document.getElementById('paymentStatus');
    const paymentMethod = document.getElementById('paymentMethod');
    const bankName = document.getElementById('bankName');
    const transactionCode = document.getElementById('transactionCode');
    const paymentDate = document.getElementById('paymentDate');
    const paymentNotes = document.getElementById('paymentNotes');
    const savePaymentChanges = document.getElementById('savePaymentChanges');

    // Delete Action
    const deleteButtons = document.querySelectorAll('.delete-btn');

    // Close Modal Buttons
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Mock data for demonstration
    const payments = [
        {
            id: 'PAY-001',
            order_id: 'ORD-001',
            customer: 'Nguyễn Văn A',
            method: 'bank',
            method_name: 'Chuyển khoản',
            amount: '3.5 tỷ VNĐ',
            date: '21/04/2023',
            time: '09:15',
            status: 'completed',
            bank_name: 'Vietcombank',
            transaction_code: 'VCB12345678',
            created_at: '20/04/2023 14:30',
            notes: 'Khách hàng đã thanh toán đầy đủ. Đã xác nhận với ngân hàng về giao dịch.',
            customer_details: {
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@gmail.com',
                phone: '0901234567'
            }
        },
        // More payments could be added here
    ];

    // Initialize Event Listeners
    function initEventListeners() {
        // Date Range Filter
        if (dateRangeFilter) {
            dateRangeFilter.addEventListener('change', function() {
                if (this.value === 'custom' && customDateRange) {
                    customDateRange.style.display = 'flex';
                } else if (customDateRange) {
                    customDateRange.style.display = 'none';
                }
            });
        }

        // Select All Checkboxes
        if (selectAll) {
            selectAll.addEventListener('change', function() {
                paymentCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAll.checked;
                });
            });
        }

        // View Payment Details
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const paymentId = this.getAttribute('data-id');
                showPaymentDetails(paymentId);
            });
        });

        // Edit Payment
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const paymentId = this.getAttribute('data-id');
                showEditPaymentModal(paymentId);
            });
        });

        // Delete Payment
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const paymentId = this.getAttribute('data-id');
                confirmDeletePayment(paymentId);
            });
        });

        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeAllModals();
            });
        });

        // Save Payment Changes
        if (savePaymentChanges) {
            savePaymentChanges.addEventListener('click', function() {
                updatePayment();
            });
        }

        // Print Payment
        if (printPayment) {
            printPayment.addEventListener('click', function() {
                printPaymentDetails();
            });
        }

        // Export Payments
        if (exportPayments) {
            exportPayments.addEventListener('click', function() {
                exportPaymentsToExcel();
            });
        }

        // Search and Filter
        if (paymentSearch) {
            paymentSearch.addEventListener('input', function() {
                filterPayments();
            });
        }

        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                filterPayments();
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

    // Show Payment Details
    function showPaymentDetails(paymentId) {
        // In a real application, you would fetch payment details from the server
        // For demonstration, we're using the mock data
        const payment = payments.find(p => p.id === paymentId) || payments[0];
        
        if (paymentDetailId) {
            paymentDetailId.textContent = payment.id;
        }

        // Populate payment details in the modal
        // This would be more comprehensive in a real application

        // Show the modal
        if (paymentDetailModal) {
            paymentDetailModal.style.display = 'block';
        }
    }

    // Show Edit Payment Modal
    function showEditPaymentModal(paymentId) {
        // In a real application, you would fetch payment details from the server
        // For demonstration, we're using the mock data
        const payment = payments.find(p => p.id === paymentId) || payments[0];
        
        if (editPaymentId) {
            editPaymentId.textContent = payment.id;
        }

        // Populate form fields with payment data
        if (paymentStatus) {
            paymentStatus.value = payment.status;
        }
        
        if (paymentMethod) {
            paymentMethod.value = payment.method;
        }
        
        if (bankName) {
            bankName.value = payment.bank_name || '';
        }
        
        if (transactionCode) {
            transactionCode.value = payment.transaction_code || '';
        }
        
        if (paymentDate) {
            // Convert dd/mm/yyyy to yyyy-mm-dd for date input
            if (payment.date) {
                const parts = payment.date.split('/');
                if (parts.length === 3) {
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    paymentDate.value = formattedDate;
                }
            }
        }
        
        if (paymentNotes) {
            paymentNotes.value = payment.notes || '';
        }

        // Show the modal
        if (editPaymentModal) {
            editPaymentModal.style.display = 'block';
        }
    }

    // Update Payment
    function updatePayment() {
        const id = editPaymentId.textContent;
        const status = paymentStatus.value;
        const method = paymentMethod.value;
        const bank = bankName.value;
        const transaction = transactionCode.value;
        const date = paymentDate.value;
        const notes = paymentNotes.value;

        // In a real application, you would send this data to the server
        console.log('Updating payment:', { id, status, method, bank, transaction, date, notes });

        // Show success message
        alert('Thanh toán #' + id + ' đã được cập nhật thành công!');

        // Close the modal
        closeAllModals();

        // Update the payment in the table (in a real app, you might refresh the data from the server)
        // Find the row
        const row = document.querySelector(`button.edit-btn[data-id="${id}"]`).closest('tr');
        
        if (row) {
            // Update method cell
            const methodCell = row.cells[4];
            let methodText = '';
            switch(method) {
                case 'bank': methodText = 'Chuyển khoản'; break;
                case 'cash': methodText = 'Tiền mặt'; break;
                case 'card': methodText = 'Thẻ tín dụng'; break;
                case 'momo': methodText = 'Ví MoMo'; break;
                case 'vnpay': methodText = 'VNPay'; break;
                default: methodText = 'Khác';
            }
            methodCell.textContent = methodText;
            
            // Update date cell if date is changed
            if (date) {
                const dateCell = row.cells[6];
                // Convert yyyy-mm-dd to dd/mm/yyyy
                const parts = date.split('-');
                if (parts.length === 3) {
                    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    dateCell.textContent = formattedDate;
                }
            }
            
            // Update status cell
            const statusCell = row.cells[7];
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
                    statusText = 'Đã hoàn thành';
                    break;
                case 'failed':
                    statusClass = 'inactive';
                    statusText = 'Thất bại';
                    break;
                case 'refunded':
                    statusClass = 'warning';
                    statusText = 'Đã hoàn tiền';
                    break;
            }
            
            statusCell.innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
        }
    }

    // Confirm Delete Payment
    function confirmDeletePayment(paymentId) {
        if (confirm(`Bạn có chắc chắn muốn xóa thanh toán #${paymentId}?`)) {
            // In a real application, you would send a delete request to the server
            console.log('Deleting payment:', paymentId);
            
            // Show success message
            alert('Thanh toán #' + paymentId + ' đã được xóa thành công!');
            
            // Remove the row from the table (in a real app, you might refresh the data from the server)
            const row = document.querySelector(`button.delete-btn[data-id="${paymentId}"]`).closest('tr');
            if (row) {
                row.remove();
            }
        }
    }

    // Print Payment Details
    function printPaymentDetails() {
        // In a real application, you would generate a printable view
        window.print();
    }

    // Export Payments to Excel
    function exportPaymentsToExcel() {
        // In a real application, you would generate an Excel file
        alert('Đang xuất danh sách thanh toán ra file Excel...');
        // Typically, you would redirect to a server endpoint that generates the Excel file
    }

    // Filter Payments
    function filterPayments() {
        const searchValue = paymentSearch ? paymentSearch.value.toLowerCase() : '';
        const methodValue = methodFilter ? methodFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const dateValue = dateRangeFilter ? dateRangeFilter.value : '';
        
        let startDateValue = '';
        let endDateValue = '';
        
        if (dateValue === 'custom') {
            startDateValue = startDate ? startDate.value : '';
            endDateValue = endDate ? endDate.value : '';
        }

        // In a real application, you would filter the data on the server or locally
        console.log('Filtering payments:', { 
            searchValue, 
            methodValue, 
            statusValue, 
            dateValue,
            startDateValue,
            endDateValue
        });

        // For a more complex implementation, you would implement actual filtering logic here
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