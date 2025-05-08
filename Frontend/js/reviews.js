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

    // Reviews Filter Elements
    const reviewSearch = document.getElementById('reviewSearch');
    const ratingFilter = document.getElementById('ratingFilter');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const propertyFilter = document.getElementById('propertyFilter');
    const filterBtn = document.querySelector('.filter-btn');
    
    // Review Items
    const reviewItems = document.querySelectorAll('.review-item');
    
    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');

    // Modals
    const reviewDetailModal = document.getElementById('reviewDetailModal');
    const replyModal = document.getElementById('replyModal');
    const rejectReviewModal = document.getElementById('rejectReviewModal');
    
    // Modal Buttons and Elements
    const modalApproveReview = document.getElementById('modalApproveReview');
    const modalRejectReview = document.getElementById('modalRejectReview');
    const modalReplyReview = document.getElementById('modalReplyReview');
    const modalDeleteReview = document.getElementById('modalDeleteReview');
    const saveReply = document.getElementById('saveReply');
    const confirmReject = document.getElementById('confirmReject');
    
    // Close Modal Buttons
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Export Button
    const exportReviews = document.getElementById('exportReviews');

    // Mock data for reviews
    const reviewsData = [
        {
            id: 1,
            user: {
                id: 101,
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@gmail.com',
                phone: '0901234567',
                joined_date: '01/01/2023',
                avatar: 'img/user1.jpg'
            },
            property: {
                id: 'PROP-123',
                name: 'Chung cư Star City',
                address: '456 Đường XYZ, Quận 2, TP.HCM',
                type: 'Căn hộ chung cư'
            },
            rating: 5,
            content: 'Khu căn hộ rất đẹp và tiện nghi. Dịch vụ chăm sóc khách hàng tuyệt vời, đội ngũ nhân viên nhiệt tình, hỗ trợ tôi rất nhiều trong quá trình mua nhà. Vị trí thuận tiện, gần các tiện ích công cộng. Rất hài lòng với căn hộ mới của gia đình.',
            date: '20/04/2023',
            status: 'pending',
            images: ['img/property-1.jpg', 'img/property-2.jpg'],
            user_ip: '192.168.1.1',
            reply: null,
            reports: []
        },
        // More reviews data could be added here
    ];
    
    // Initialize Event Listeners
    function initEventListeners() {
        // Search and Filter
        if (reviewSearch) {
            reviewSearch.addEventListener('input', function() {
                filterReviews();
            });
        }
        
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                filterReviews();
            });
        }
        
        // Filter Dropdowns
        [ratingFilter, statusFilter, dateFilter, propertyFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', function() {
                    filterReviews();
                });
            }
        });
        
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
        
        // Modal Actions
        if (modalApproveReview) {
            modalApproveReview.addEventListener('click', function() {
                approveReviewFromModal();
            });
        }
        
        if (modalRejectReview) {
            modalRejectReview.addEventListener('click', function() {
                showRejectModal();
            });
        }
        
        if (modalReplyReview) {
            modalReplyReview.addEventListener('click', function() {
                showReplyModal();
            });
        }
        
        if (modalDeleteReview) {
            modalDeleteReview.addEventListener('click', function() {
                deleteReviewFromModal();
            });
        }
        
        // Save Reply
        if (saveReply) {
            saveReply.addEventListener('click', function() {
                submitReply();
            });
        }
        
        // Confirm Reject
        if (confirmReject) {
            confirmReject.addEventListener('click', function() {
                submitReject();
            });
        }
        
        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeAllModals();
            });
        });
        
        // Export Reviews
        if (exportReviews) {
            exportReviews.addEventListener('click', function() {
                exportReviewsToExcel();
            });
        }
    }

    // Filter Reviews
    function filterReviews() {
        const searchQuery = reviewSearch ? reviewSearch.value.toLowerCase() : '';
        const ratingValue = ratingFilter ? ratingFilter.value : '';
        const statusValue = statusFilter ? statusFilter.value : '';
        const dateValue = dateFilter ? dateFilter.value : '';
        const propertyValue = propertyFilter ? propertyFilter.value : '';
        
        // Apply filters to review items
        reviewItems.forEach(item => {
            let showItem = true;
            
            // Check search query
            if (searchQuery) {
                const content = item.querySelector('.review-content').textContent.toLowerCase();
                const username = item.querySelector('.user-details h4').textContent.toLowerCase();
                if (!content.includes(searchQuery) && !username.includes(searchQuery)) {
                    showItem = false;
                }
            }
            
            // Check rating filter
            if (ratingValue && showItem) {
                const rating = item.querySelector('.rating-text').textContent.charAt(0);
                if (rating !== ratingValue) {
                    showItem = false;
                }
            }
            
            // Check status filter
            if (statusValue && showItem) {
                const statusClassName = item.classList[1]; // E.g. 'pending', 'approved', etc.
                if (statusValue !== statusClassName) {
                    showItem = false;
                }
            }
            
            // Check property filter
            if (propertyValue && showItem) {
                const propertyName = item.querySelector('.property-name').textContent;
                const propertyOption = propertyFilter.options[propertyFilter.selectedIndex].text;
                if (propertyName !== propertyOption) {
                    showItem = false;
                }
            }
            
            // Check date filter
            if (dateValue && showItem) {
                const reviewDate = item.querySelector('.review-time').textContent;
                const reviewDateObj = parseDate(reviewDate);
                const today = new Date();
                
                switch(dateValue) {
                    case 'today':
                        if (!isSameDay(reviewDateObj, today)) {
                            showItem = false;
                        }
                        break;
                    case 'week':
                        if (!isInLastDays(reviewDateObj, today, 7)) {
                            showItem = false;
                        }
                        break;
                    case 'month':
                        if (!isInLastDays(reviewDateObj, today, 30)) {
                            showItem = false;
                        }
                        break;
                    case 'year':
                        if (reviewDateObj.getFullYear() !== today.getFullYear()) {
                            showItem = false;
                        }
                        break;
                }
            }
            
            // Show or hide the item
            item.style.display = showItem ? '' : 'none';
        });
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
        console.log('Loading reviews for page:', pageNumber);
    }

    // Review Detail Modal
    window.viewReviewDetails = function(reviewId) {
        // In a real application, you would fetch review details from the server
        const review = reviewsData.find(r => r.id === parseInt(reviewId)) || reviewsData[0];
        
        // Set review details in the modal
        if (reviewDetailModal) {
            // User Information
            document.getElementById('reviewUserName').textContent = review.user.name;
            document.getElementById('reviewUserEmail').textContent = review.user.email;
            document.getElementById('reviewUserPhone').textContent = review.user.phone;
            document.getElementById('reviewUserJoined').textContent = review.user.joined_date;
            
            // Property Information
            document.getElementById('reviewPropertyName').textContent = review.property.name;
            document.getElementById('reviewPropertyCode').textContent = review.property.id;
            document.getElementById('reviewPropertyAddress').textContent = review.property.address;
            document.getElementById('reviewPropertyType').textContent = review.property.type;
            
            // Review Information
            const reviewRatingElement = document.getElementById('reviewRating');
            if (reviewRatingElement) {
                // Clear existing stars
                reviewRatingElement.innerHTML = '';
                
                // Add stars based on rating
                for (let i = 1; i <= 5; i++) {
                    const starIcon = document.createElement('i');
                    starIcon.className = i <= review.rating ? 'fas fa-star' : 'far fa-star';
                    reviewRatingElement.appendChild(starIcon);
                }
                
                // Add rating number
                const ratingText = document.createTextNode(` (${review.rating}.0)`);
                reviewRatingElement.appendChild(ratingText);
            }
            
            document.getElementById('reviewDate').textContent = review.date;
            
            const reviewStatusElement = document.getElementById('reviewStatus');
            if (reviewStatusElement) {
                reviewStatusElement.textContent = getStatusText(review.status);
                reviewStatusElement.className = `info-value status ${review.status}`;
            }
            
            document.getElementById('reviewUserIP').textContent = review.user_ip;
            
            // Review Content
            document.getElementById('reviewContent').innerHTML = `<p>${review.content}</p>`;
            
            // Review Images
            const reviewImagesSection = document.getElementById('reviewImagesSection');
            const reviewImagesGallery = reviewImagesSection.querySelector('.review-images-gallery');
            
            if (review.images && review.images.length > 0) {
                reviewImagesSection.style.display = '';
                reviewImagesGallery.innerHTML = '';
                
                review.images.forEach(image => {
                    const galleryImage = document.createElement('div');
                    galleryImage.className = 'gallery-image';
                    galleryImage.innerHTML = `<img src="${image}" alt="Review Image">`;
                    reviewImagesGallery.appendChild(galleryImage);
                });
            } else {
                reviewImagesSection.style.display = 'none';
            }
            
            // Review Reply
            const reviewReplySection = document.getElementById('reviewReplySection');
            const reviewReplyContent = document.getElementById('reviewReplyContent');
            
            if (review.reply) {
                reviewReplySection.style.display = '';
                reviewReplyContent.innerHTML = `<p>${review.reply.content}</p>`;
                reviewReplySection.querySelector('.reply-author').textContent = review.reply.author;
                reviewReplySection.querySelector('.reply-date').textContent = review.reply.date;
            } else {
                reviewReplySection.style.display = 'none';
            }
            
            // Review Reports
            const reviewReportsSection = document.getElementById('reviewReportsSection');
            const reportsList = reviewReportsSection.querySelector('.reports-list');
            
            if (review.reports && review.reports.length > 0) {
                reviewReportsSection.style.display = '';
                reportsList.innerHTML = '';
                
                review.reports.forEach(report => {
                    const reportItem = document.createElement('div');
                    reportItem.className = 'report-item';
                    reportItem.innerHTML = `
                        <div class="report-header">
                            <span class="report-user">${report.user}</span>
                            <span class="report-date">${report.date}</span>
                        </div>
                        <div class="report-reason">
                            ${report.reason}
                        </div>
                    `;
                    reportsList.appendChild(reportItem);
                });
            } else {
                reviewReportsSection.style.display = 'none';
            }
            
            // Update action buttons based on review status
            updateModalActionButtons(review.status);
            
            // Store the current review ID for modal actions
            reviewDetailModal.setAttribute('data-review-id', reviewId);
            
            // Show the modal
            reviewDetailModal.style.display = 'block';
        }
    };
    
    // Update modal action buttons based on review status
    function updateModalActionButtons(status) {
        if (modalApproveReview) {
            modalApproveReview.style.display = (status === 'pending' || status === 'rejected' || status === 'reported') ? '' : 'none';
        }
        
        if (modalRejectReview) {
            modalRejectReview.style.display = (status === 'pending' || status === 'approved' || status === 'reported') ? '' : 'none';
        }
        
        if (modalReplyReview) {
            modalReplyReview.style.display = (status === 'approved') ? '' : 'none';
        }
    }
    
    // Approve Review
    window.approveReview = function(reviewId) {
        if (confirm("Bạn có chắc chắn muốn duyệt đánh giá này không?")) {
            // In a real application, you would send an approval request to the server
            console.log('Approving review:', reviewId);
            
            // Update the UI
            const reviewItem = document.querySelector(`.review-item:has(button[onclick="viewReviewDetails(${reviewId})"])`);
            if (reviewItem) {
                // Remove existing status classes
                reviewItem.classList.remove('pending', 'rejected', 'reported');
                reviewItem.classList.add('approved');
                
                // Update status label
                const statusSpan = reviewItem.querySelector('.review-status .status');
                if (statusSpan) {
                    statusSpan.className = 'status active';
                    statusSpan.textContent = 'Đã duyệt';
                }
                
                // Update actions
                updateReviewItemActions(reviewItem, 'approved');
            }
            
            alert('Đánh giá đã được duyệt thành công!');
        }
    };
    
    // Approve Review from Modal
    function approveReviewFromModal() {
        const reviewId = reviewDetailModal.getAttribute('data-review-id');
        if (reviewId) {
            approveReview(reviewId);
            closeAllModals();
        }
    }
    
    // Reject Review
    window.rejectReview = function(reviewId) {
        // Store the review ID in the reject modal
        if (rejectReviewModal) {
            rejectReviewModal.setAttribute('data-review-id', reviewId);
            rejectReviewModal.style.display = 'block';
        }
    };
    
    // Show Reject Modal from Detail Modal
    function showRejectModal() {
        const reviewId = reviewDetailModal.getAttribute('data-review-id');
        if (reviewId) {
            closeAllModals();
            rejectReview(reviewId);
        }
    }
    
    // Submit Reject
    function submitReject() {
        const reviewId = rejectReviewModal.getAttribute('data-review-id');
        const rejectReason = document.getElementById('rejectReason').value;
        const rejectNote = document.getElementById('rejectNote').value;
        const notifyUser = document.getElementById('notifyUser').checked;
        
        if (!rejectReason) {
            alert('Vui lòng chọn lý do từ chối!');
            return;
        }
        
        // In a real application, you would send this data to the server
        console.log('Rejecting review:', {
            reviewId,
            rejectReason,
            rejectNote,
            notifyUser
        });
        
        // Update the UI
        const reviewItem = document.querySelector(`.review-item:has(button[onclick="viewReviewDetails(${reviewId})"])`);
        if (reviewItem) {
            // Remove existing status classes
            reviewItem.classList.remove('pending', 'approved', 'reported');
            reviewItem.classList.add('rejected');
            
            // Update status label
            const statusSpan = reviewItem.querySelector('.review-status .status');
            if (statusSpan) {
                statusSpan.className = 'status inactive';
                statusSpan.textContent = 'Từ chối';
            }
            
            // Clear the content
            const contentElement = reviewItem.querySelector('.review-content');
            if (contentElement) {
                contentElement.innerHTML = '<p>Nội dung đánh giá này đã bị từ chối do vi phạm quy định của chúng tôi.</p>';
            }
            
            // Update actions
            updateReviewItemActions(reviewItem, 'rejected');
        }
        
        closeAllModals();
        alert('Đánh giá đã bị từ chối!');
    }
    
    // Reply To Review
    window.replyToReview = function(reviewId) {
        // In a real application, you would fetch the review data from the server
        const review = reviewsData.find(r => r.id === parseInt(reviewId)) || reviewsData[0];
        
        if (replyModal) {
            // Set review data in the modal
            const userImage = replyModal.querySelector('.user-info img');
            const userName = replyModal.querySelector('.user-details h4');
            const reviewRating = replyModal.querySelector('.review-rating');
            const reviewTime = replyModal.querySelector('.review-time');
            const reviewContent = replyModal.querySelector('.review-content p');
            
            if (userImage) userImage.src = review.user.avatar;
            if (userName) userName.textContent = review.user.name;
            if (reviewTime) reviewTime.textContent = review.date;
            if (reviewContent) reviewContent.textContent = review.content;
            
            // Clear the reply content
            const replyContentTextarea = document.getElementById('replyContent');
            if (replyContentTextarea) {
                replyContentTextarea.value = review.reply ? review.reply.content : '';
            }
            
            // Store the review ID in the modal
            replyModal.setAttribute('data-review-id', reviewId);
            
            // Show the modal
            replyModal.style.display = 'block';
        }
    };
    
    // Show Reply Modal from Detail Modal
    function showReplyModal() {
        const reviewId = reviewDetailModal.getAttribute('data-review-id');
        if (reviewId) {
            closeAllModals();
            replyToReview(reviewId);
        }
    }
    
    // Submit Reply
    function submitReply() {
        const reviewId = replyModal.getAttribute('data-review-id');
        const replyContent = document.getElementById('replyContent').value;
        
        if (!replyContent.trim()) {
            alert('Vui lòng nhập nội dung phản hồi!');
            return;
        }
        
        // In a real application, you would send this data to the server
        console.log('Replying to review:', {
            reviewId,
            replyContent
        });
        
        // Update the UI
        const reviewItem = document.querySelector(`.review-item:has(button[onclick="viewReviewDetails(${reviewId})"])`);
        if (reviewItem) {
            // Check if reply section exists
            let replySection = reviewItem.querySelector('.review-reply');
            
            if (!replySection) {
                // Create reply section if it doesn't exist
                replySection = document.createElement('div');
                replySection.className = 'review-reply';
                replySection.innerHTML = `
                    <div class="reply-header">
                        <img src="img/admin-avatar.jpg" alt="Admin Avatar">
                        <div class="reply-info">
                            <h5>Admin</h5>
                            <span class="reply-time">${getCurrentDate()}</span>
                        </div>
                    </div>
                    <div class="reply-content">
                        <p>${replyContent}</p>
                    </div>
                `;
                
                // Insert before the review status
                const reviewStatus = reviewItem.querySelector('.review-status');
                reviewItem.insertBefore(replySection, reviewStatus);
            } else {
                // Update existing reply
                const replyContentElement = replySection.querySelector('.reply-content p');
                const replyTimeElement = replySection.querySelector('.reply-time');
                
                if (replyContentElement) replyContentElement.textContent = replyContent;
                if (replyTimeElement) replyTimeElement.textContent = getCurrentDate();
            }
            
            // Update edit reply button
            const actions = reviewItem.querySelector('.review-actions');
            if (actions) {
                // Check if edit reply button exists
                let editReplyButton = actions.querySelector('.btn-edit-reply');
                
                if (!editReplyButton) {
                    // Replace reply button with edit reply button
                    const replyButton = actions.querySelector('.btn-reply');
                    
                    if (replyButton) {
                        editReplyButton = document.createElement('button');
                        editReplyButton.className = 'btn btn-edit-reply';
                        editReplyButton.setAttribute('onclick', `editReply(${reviewId})`);
                        editReplyButton.innerHTML = '<i class="fas fa-edit"></i>';
                        
                        replyButton.parentNode.replaceChild(editReplyButton, replyButton);
                    }
                }
            }
        }
        
        closeAllModals();
        alert('Phản hồi đã được gửi thành công!');
    }
    
    // Edit Reply
    window.editReply = function(reviewId) {
        // This is essentially the same as replying to a review
        replyToReview(reviewId);
    };
    
    // Delete Review
    window.deleteReview = function(reviewId) {
        if (confirm("Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.")) {
            // In a real application, you would send a delete request to the server
            console.log('Deleting review:', reviewId);
            
            // Update the UI
            const reviewItem = document.querySelector(`.review-item:has(button[onclick="viewReviewDetails(${reviewId})"])`);
            if (reviewItem) {
                reviewItem.remove();
            }
            
            alert('Đánh giá đã được xóa thành công!');
        }
    };
    
    // Delete Review from Modal
    function deleteReviewFromModal() {
        const reviewId = reviewDetailModal.getAttribute('data-review-id');
        if (reviewId) {
            closeAllModals();
            deleteReview(reviewId);
        }
    }
    
    // Update Review Item Actions
    function updateReviewItemActions(reviewItem, status) {
        const actions = reviewItem.querySelector('.review-actions');
        if (!actions) return;
        
        // Clear existing actions
        actions.innerHTML = '';
        
        // Add view button (always present)
        const reviewId = reviewItem.querySelector('.btn-view').getAttribute('onclick').match(/\d+/)[0];
        actions.innerHTML += `
            <button class="btn btn-view" onclick="viewReviewDetails(${reviewId})">
                <i class="fas fa-eye"></i>
            </button>
        `;
        
        // Add other buttons based on status
        if (status === 'approved') {
            // For approved reviews, add reply/edit reply and delete buttons
            const hasReply = reviewItem.querySelector('.review-reply');
            
            if (hasReply) {
                actions.innerHTML += `
                    <button class="btn btn-edit-reply" onclick="editReply(${reviewId})">
                        <i class="fas fa-edit"></i>
                    </button>
                `;
            } else {
                actions.innerHTML += `
                    <button class="btn btn-reply" onclick="replyToReview(${reviewId})">
                        <i class="fas fa-reply"></i>
                    </button>
                `;
            }
        } else if (status === 'pending' || status === 'reported') {
            // For pending or reported reviews, add approve, reject, and delete buttons
            actions.innerHTML += `
                <button class="btn btn-approve" onclick="approveReview(${reviewId})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-reject" onclick="rejectReview(${reviewId})">
                    <i class="fas fa-times"></i>
                </button>
            `;
        } else if (status === 'rejected') {
            // For rejected reviews, add approve button
            actions.innerHTML += `
                <button class="btn btn-approve" onclick="approveReview(${reviewId})">
                    <i class="fas fa-check"></i>
                </button>
            `;
        }
        
        // Add delete button (always present)
        actions.innerHTML += `
            <button class="btn btn-delete" onclick="deleteReview(${reviewId})">
                <i class="fas fa-trash"></i>
            </button>
        `;
    }
    
    // Export Reviews to Excel
    function exportReviewsToExcel() {
        // In a real application, you would generate an Excel file
        alert('Đang xuất danh sách đánh giá ra file Excel...');
    }
    
    // Close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Helper Functions
    
    // Get status text based on status code
    function getStatusText(status) {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'approved': return 'Đã duyệt';
            case 'rejected': return 'Từ chối';
            case 'reported': return 'Bị báo cáo';
            default: return status;
        }
    }
    
    // Parse date from dd/mm/yyyy format
    function parseDate(dateString) {
        const parts = dateString.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    
    // Check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    // Check if date1 is within the last N days from date2
    function isInLastDays(date1, date2, days) {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
    }
    
    // Get current date in dd/mm/yyyy format
    function getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Initialize the page
    initEventListeners();
    updatePaginationButtons();
}); 