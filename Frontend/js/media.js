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

    // Media Filter Elements
    const mediaSearch = document.getElementById('mediaSearch');
    const mediaTypeFilter = document.getElementById('mediaTypeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const viewBtns = document.querySelectorAll('.view-btn');
    const mediaGallery = document.getElementById('mediaGallery');
    
    // Media Gallery Items
    const mediaItems = document.querySelectorAll('.media-item');
    const mediaCheckboxes = document.querySelectorAll('.media-select');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.querySelector('.selected-count');
    const downloadSelected = document.getElementById('downloadSelected');
    const deleteSelected = document.getElementById('deleteSelected');

    // Media Action Buttons
    const previewBtns = document.querySelectorAll('.preview-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const copyBtns = document.querySelectorAll('.copy-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');

    // Media Upload Modal
    const uploadMediaBtn = document.getElementById('uploadMediaBtn');
    const uploadMediaModal = document.getElementById('uploadMediaModal');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const startUpload = document.getElementById('startUpload');
    const uploadProgressContainer = document.querySelector('.upload-progress-container');

    // Media Preview Modal
    const previewMediaModal = document.getElementById('previewMediaModal');
    const mediaPreviewContainer = document.getElementById('mediaPreviewContainer');
    const previewMediaTitle = document.getElementById('previewMediaTitle');
    const previewFileName = document.getElementById('previewFileName');
    const previewFileType = document.getElementById('previewFileType');
    const previewFileSize = document.getElementById('previewFileSize');
    const previewDimensions = document.getElementById('previewDimensions');
    const previewUploadDate = document.getElementById('previewUploadDate');
    const previewUrl = document.getElementById('previewUrl');
    const copyUrl = document.getElementById('copyUrl');
    const downloadMedia = document.getElementById('downloadMedia');

    // Edit Media Modal
    const editMediaModal = document.getElementById('editMediaModal');
    const mediaTitle = document.getElementById('mediaTitle');
    const mediaAlt = document.getElementById('mediaAlt');
    const mediaDescription = document.getElementById('mediaDescription');
    const tagInput = document.getElementById('tagInput');
    const saveMediaChanges = document.getElementById('saveMediaChanges');

    // Close Modal Buttons
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');

    // Mock data for demonstration
    const mediaData = [
        {
            id: 1,
            type: 'image',
            title: 'property-01.jpg',
            alt: 'Hình ảnh bất động sản',
            description: '',
            file_type: 'jpg',
            mime_type: 'image/jpeg',
            size: '1.2 MB',
            dimensions: '1920 x 1080 px',
            uploaded_at: '24/04/2023',
            url: 'img/property-1.jpg',
            tags: ['Bất động sản', 'Nhà ở']
        },
        // More media items could be added here
    ];

    // Initialize Event Listeners
    function initEventListeners() {
        // View Toggle (Grid/List)
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                if (mediaGallery) {
                    mediaGallery.className = `media-gallery ${view}-view`;
                }
            });
        });

        // Media Checkboxes for Bulk Actions
        mediaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateBulkActions);
        });

        // Bulk Actions
        if (downloadSelected) {
            downloadSelected.addEventListener('click', function() {
                downloadSelectedFiles();
            });
        }

        if (deleteSelected) {
            deleteSelected.addEventListener('click', function() {
                deleteSelectedFiles();
            });
        }

        // Media Preview
        previewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mediaId = this.getAttribute('data-id');
                showMediaPreview(mediaId);
            });
        });

        // Media Edit
        editBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mediaId = this.getAttribute('data-id');
                showMediaEdit(mediaId);
            });
        });

        // Copy URL
        copyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mediaId = this.getAttribute('data-id');
                copyMediaUrl(mediaId);
            });
        });

        // Delete Media
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const mediaId = this.getAttribute('data-id');
                confirmDeleteMedia(mediaId);
            });
        });

        // Upload Media
        if (uploadMediaBtn) {
            uploadMediaBtn.addEventListener('click', function() {
                if (uploadMediaModal) {
                    uploadMediaModal.style.display = 'block';
                }
            });
        }

        // File Input Change
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                handleFileSelection(e.target.files);
            });
        }

        // Drag and Drop
        if (uploadArea) {
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    handleFileSelection(e.dataTransfer.files);
                }
            });
        }

        // Start Upload
        if (startUpload) {
            startUpload.addEventListener('click', function() {
                simulateFileUpload();
            });
        }

        // Copy URL in Preview Modal
        if (copyUrl) {
            copyUrl.addEventListener('click', function() {
                if (previewUrl) {
                    previewUrl.select();
                    document.execCommand('copy');
                    
                    // Show feedback
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 1500);
                }
            });
        }

        // Download Media in Preview Modal
        if (downloadMedia) {
            downloadMedia.addEventListener('click', function() {
                // In a real app, this would initiate a download
                alert('Đang tải xuống tập tin...');
            });
        }

        // Save Media Changes
        if (saveMediaChanges) {
            saveMediaChanges.addEventListener('click', function() {
                saveMediaEdits();
            });
        }

        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeAllModals();
            });
        });

        // Search and Filters
        if (mediaSearch) {
            mediaSearch.addEventListener('input', function() {
                filterMedia();
            });
        }

        if (mediaTypeFilter) {
            mediaTypeFilter.addEventListener('change', function() {
                filterMedia();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', function() {
                sortMedia();
            });
        }

        // Tag Input
        if (tagInput) {
            tagInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addTag(this.value.trim());
                    this.value = '';
                }
            });
        }

        // Remove Tags
        document.querySelectorAll('.tag .fa-times').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                this.parentElement.remove();
            });
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
    }

    // Update Bulk Actions UI
    function updateBulkActions() {
        const checkedCount = document.querySelectorAll('.media-select:checked').length;
        
        if (selectedCount) {
            selectedCount.textContent = `${checkedCount} tập tin được chọn`;
        }
        
        if (bulkActions) {
            if (checkedCount > 0) {
                bulkActions.classList.add('show');
            } else {
                bulkActions.classList.remove('show');
            }
        }
    }

    // Download Selected Files
    function downloadSelectedFiles() {
        const checkedItems = document.querySelectorAll('.media-select:checked');
        const selectedIds = Array.from(checkedItems).map(item => item.id.replace('media-', ''));
        
        // In a real app, this would initiate downloads for the selected files
        alert(`Đang tải xuống ${selectedIds.length} tập tin đã chọn...`);
    }

    // Delete Selected Files
    function deleteSelectedFiles() {
        const checkedItems = document.querySelectorAll('.media-select:checked');
        const selectedIds = Array.from(checkedItems).map(item => item.id.replace('media-', ''));
        
        if (selectedIds.length > 0 && confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tập tin đã chọn không?`)) {
            // In a real app, you would send a request to delete these files
            checkedItems.forEach(item => {
                const mediaItem = item.closest('.media-item');
                if (mediaItem) {
                    mediaItem.remove();
                }
            });
            
            // Update UI
            updateBulkActions();
            alert(`Đã xóa ${selectedIds.length} tập tin.`);
        }
    }

    // Show Media Preview
    function showMediaPreview(mediaId) {
        // In a real app, you would fetch media details from the server
        const media = mediaData.find(m => m.id === parseInt(mediaId)) || mediaData[0];
        
        if (previewMediaModal) {
            // Set title
            if (previewMediaTitle) {
                previewMediaTitle.textContent = `Xem trước: ${media.title}`;
            }
            
            // Set preview content based on media type
            if (mediaPreviewContainer) {
                if (media.type === 'image') {
                    mediaPreviewContainer.innerHTML = `<img src="${media.url}" alt="${media.alt || ''}">`;
                } else if (media.type === 'document') {
                    mediaPreviewContainer.innerHTML = `<div class="document-preview"><i class="fas fa-file-pdf fa-5x"></i><p>${media.title}</p></div>`;
                } else if (media.type === 'video') {
                    mediaPreviewContainer.innerHTML = `<div class="video-preview"><i class="fas fa-play-circle fa-5x"></i><p>${media.title}</p></div>`;
                }
            }
            
            // Set file details
            if (previewFileName) previewFileName.textContent = media.title;
            if (previewFileType) previewFileType.textContent = media.type === 'image' ? `Hình ảnh (${media.file_type.toUpperCase()})` : media.file_type.toUpperCase();
            if (previewFileSize) previewFileSize.textContent = media.size;
            if (previewDimensions) {
                if (media.type === 'image' && media.dimensions) {
                    previewDimensions.textContent = media.dimensions;
                    previewDimensions.parentElement.style.display = '';
                } else {
                    previewDimensions.parentElement.style.display = 'none';
                }
            }
            if (previewUploadDate) previewUploadDate.textContent = media.uploaded_at;
            if (previewUrl) previewUrl.value = media.url;
            
            // Show the modal
            previewMediaModal.style.display = 'block';
        }
    }

    // Show Media Edit
    function showMediaEdit(mediaId) {
        // In a real app, you would fetch media details from the server
        const media = mediaData.find(m => m.id === parseInt(mediaId)) || mediaData[0];
        
        if (editMediaModal) {
            // Populate form fields
            if (mediaTitle) mediaTitle.value = media.title;
            if (mediaAlt) mediaAlt.value = media.alt || '';
            if (mediaDescription) mediaDescription.value = media.description || '';
            
            // Clear existing tags
            const tagsContainer = document.querySelector('.tags-container');
            if (tagsContainer) {
                // Remove all tags except the input field
                const inputField = tagInput;
                while (tagsContainer.firstChild) {
                    tagsContainer.removeChild(tagsContainer.firstChild);
                }
                tagsContainer.appendChild(inputField);
                
                // Add tags from media data
                if (media.tags && media.tags.length > 0) {
                    media.tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.className = 'tag';
                        tagElement.innerHTML = `${tag} <i class="fas fa-times"></i>`;
                        
                        // Add event listener to the close icon
                        const closeIcon = tagElement.querySelector('.fa-times');
                        closeIcon.addEventListener('click', function() {
                            tagElement.remove();
                        });
                        
                        tagsContainer.insertBefore(tagElement, inputField);
                    });
                }
            }
            
            // Show the modal
            editMediaModal.style.display = 'block';
        }
    }

    // Copy Media URL
    function copyMediaUrl(mediaId) {
        // In a real app, you would fetch the URL from the server
        const media = mediaData.find(m => m.id === parseInt(mediaId)) || mediaData[0];
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = media.url;
        document.body.appendChild(tempInput);
        
        // Select and copy the text
        tempInput.select();
        document.execCommand('copy');
        
        // Remove the temporary element
        document.body.removeChild(tempInput);
        
        // Show feedback
        alert('Đã sao chép đường dẫn vào clipboard!');
    }

    // Confirm Delete Media
    function confirmDeleteMedia(mediaId) {
        if (confirm('Bạn có chắc chắn muốn xóa tập tin này không?')) {
            // In a real app, you would send a delete request to the server
            const mediaItem = document.querySelector(`.preview-btn[data-id="${mediaId}"]`).closest('.media-item');
            if (mediaItem) {
                mediaItem.remove();
                alert('Đã xóa tập tin thành công!');
            }
        }
    }

    // Handle File Selection
    function handleFileSelection(files) {
        if (files.length > 0) {
            // In a real app, you would prepare to upload these files
            // For demonstration, we're just showing the upload progress container
            if (uploadArea && uploadProgressContainer) {
                uploadArea.style.display = 'none';
                uploadProgressContainer.style.display = 'block';
                
                // Create a file item for each selected file
                const uploadFiles = document.querySelector('.upload-files');
                if (uploadFiles) {
                    uploadFiles.innerHTML = '';
                    
                    for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const fileSize = formatFileSize(file.size);
                        let fileIcon = 'fa-file';
                        
                        // Set appropriate icon based on file type
                        if (file.type.startsWith('image/')) {
                            fileIcon = 'fa-image';
                        } else if (file.type === 'application/pdf') {
                            fileIcon = 'fa-file-pdf';
                        } else if (file.type.startsWith('video/')) {
                            fileIcon = 'fa-file-video';
                        }
                        
                        const fileItem = `
                            <div class="upload-file">
                                <div class="file-info">
                                    <i class="fas ${fileIcon}"></i>
                                    <div class="file-details">
                                        <div class="file-name">${file.name}</div>
                                        <div class="file-size">${fileSize}</div>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: 0%"></div>
                                </div>
                                <div class="upload-status">0%</div>
                            </div>
                        `;
                        
                        uploadFiles.innerHTML += fileItem;
                    }
                }
            }
        }
    }

    // Simulate File Upload
    function simulateFileUpload() {
        const progressBars = document.querySelectorAll('.progress');
        const statusElements = document.querySelectorAll('.upload-status');
        
        if (progressBars.length > 0) {
            // Simulate progress for each file
            progressBars.forEach((progressBar, index) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.floor(Math.random() * 10);
                    if (progress > 100) progress = 100;
                    
                    progressBar.style.width = `${progress}%`;
                    if (statusElements[index]) {
                        statusElements[index].textContent = `${progress}%`;
                    }
                    
                    if (progress === 100) {
                        clearInterval(interval);
                        
                        // Check if all files are uploaded
                        const allDone = Array.from(progressBars).every(bar => bar.style.width === '100%');
                        if (allDone) {
                            setTimeout(() => {
                                alert('Tất cả tập tin đã được tải lên thành công!');
                                closeAllModals();
                                
                                // In a real app, you would refresh the media gallery to show the new files
                            }, 500);
                        }
                    }
                }, 200 + Math.random() * 300); // Random interval to simulate different upload speeds
            });
        }
    }

    // Save Media Edits
    function saveMediaEdits() {
        // Get form values
        const title = mediaTitle ? mediaTitle.value : '';
        const alt = mediaAlt ? mediaAlt.value : '';
        const description = mediaDescription ? mediaDescription.value : '';
        
        // Get tags
        const tagElements = document.querySelectorAll('.tag');
        const tags = Array.from(tagElements).map(tag => tag.textContent.trim().replace(' ×', ''));
        
        // In a real app, you would send this data to the server
        console.log('Saving media edits:', { title, alt, description, tags });
        
        // Show success message
        alert('Thông tin đã được lưu thành công!');
        
        // Close the modal
        closeAllModals();
    }

    // Add Tag
    function addTag(tagText) {
        if (tagText && tagInput) {
            const tagsContainer = tagInput.parentElement;
            
            // Create new tag element
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.innerHTML = `${tagText} <i class="fas fa-times"></i>`;
            
            // Add event listener to the close icon
            const closeIcon = tagElement.querySelector('.fa-times');
            closeIcon.addEventListener('click', function() {
                tagElement.remove();
            });
            
            // Insert the tag before the input
            tagsContainer.insertBefore(tagElement, tagInput);
        }
    }

    // Filter Media
    function filterMedia() {
        const searchValue = mediaSearch ? mediaSearch.value.toLowerCase() : '';
        const typeValue = mediaTypeFilter ? mediaTypeFilter.value : 'all';
        
        mediaItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemTitle = item.querySelector('.media-title').textContent.toLowerCase();
            
            const matchesType = typeValue === 'all' || itemType === typeValue;
            const matchesSearch = searchValue === '' || itemTitle.includes(searchValue);
            
            if (matchesType && matchesSearch) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Sort Media
    function sortMedia() {
        const sortValue = sortFilter ? sortFilter.value : 'date-desc';
        const container = document.getElementById('mediaGallery');
        
        if (container) {
            const items = Array.from(mediaItems);
            
            items.sort((a, b) => {
                const titleA = a.querySelector('.media-title').textContent;
                const titleB = b.querySelector('.media-title').textContent;
                
                const metaA = a.querySelector('.media-meta').textContent;
                const metaB = b.querySelector('.media-meta').textContent;
                
                // Extract size and date from meta text
                const sizeA = metaA.split('•')[0].trim();
                const sizeB = metaB.split('•')[0].trim();
                
                const dateA = metaA.split('•')[1].trim();
                const dateB = metaB.split('•')[1].trim();
                
                switch (sortValue) {
                    case 'date-desc':
                        return new Date(dateB.split('/').reverse().join('/')) - new Date(dateA.split('/').reverse().join('/'));
                    case 'date-asc':
                        return new Date(dateA.split('/').reverse().join('/')) - new Date(dateB.split('/').reverse().join('/'));
                    case 'name-asc':
                        return titleA.localeCompare(titleB);
                    case 'name-desc':
                        return titleB.localeCompare(titleA);
                    case 'size-desc':
                        return parseFileSize(sizeB) - parseFileSize(sizeA);
                    case 'size-asc':
                        return parseFileSize(sizeA) - parseFileSize(sizeB);
                    default:
                        return 0;
                }
            });
            
            // Reorder elements in the DOM
            items.forEach(item => {
                container.appendChild(item);
            });
        }
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
        console.log('Loading media for page:', pageNumber);
    }

    // Close All Modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Reset upload UI
        if (uploadArea && uploadProgressContainer) {
            uploadArea.style.display = 'block';
            uploadProgressContainer.style.display = 'none';
        }
    }

    // Helper Functions
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function parseFileSize(sizeString) {
        const value = parseFloat(sizeString);
        const unit = sizeString.replace(/[\d.]/g, '').trim();
        
        const units = {
            'Bytes': 1,
            'KB': 1024,
            'MB': 1024 * 1024,
            'GB': 1024 * 1024 * 1024,
            'TB': 1024 * 1024 * 1024 * 1024
        };
        
        return value * (units[unit] || 1);
    }

    // Initialize the page
    initEventListeners();
    updatePaginationButtons();
    
    // Show bulk actions if any items are selected
    updateBulkActions();
}); 