// Constants
const TOTAL_RECORDS = 42;
const RECORDS_PER_PAGE = 10;
const TOTAL_PAGES = Math.ceil(TOTAL_RECORDS / RECORDS_PER_PAGE);
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8080' 
    : window.location.origin; // Use the same origin if not localhost

// Current state
let currentPage = 1;
let itemsPerPage = RECORDS_PER_PAGE;
let users = []; // Array to store users
let isOfflineMode = false; // Flag to track if we're in offline mode
let backendHealthCheckTimer = null; // For periodic backend health check

// Sample user data for demo
const sampleUsers = [
    {
        id: 'UID001',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        role: 'admin',
        status: 'active',
        registerDate: '01/01/2023',
        avatar: 'img/user.jpg',
        address: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
        dob: '1990-01-01'
    },
    {
        id: 'UID002',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0234567890',
        role: 'manager',
        status: 'active',
        registerDate: '15/01/2023',
        avatar: 'img/user.jpg',
        address: '456 Đường DEF, Quận UVW, TP. Hồ Chí Minh',
        dob: '1992-05-10'
    },
    {
        id: 'UID003',
        name: 'Lê Văn C',
        email: 'levanc@example.com',
        phone: '0345678901',
        role: 'agent',
        status: 'inactive',
        registerDate: '22/01/2023',
        avatar: 'img/user.jpg',
        address: '789 Đường GHI, Quận RST, TP. Hồ Chí Minh',
        dob: '1988-12-20'
    },
    {
        id: 'UID004',
        name: 'Phạm Thị D',
        email: 'phamthid@example.com',
        phone: '0456789012',
        role: 'client',
        status: 'active',
        registerDate: '05/02/2023',
        avatar: 'img/user.jpg',
        address: '101 Đường JKL, Quận MNO, TP. Hồ Chí Minh',
        dob: '1995-07-15'
    },
    {
        id: 'UID005',
        name: 'Hoàng Văn E',
        email: 'hoangvane@example.com',
        phone: '0567890123',
        role: 'client',
        status: 'pending',
        registerDate: '15/02/2023',
        avatar: 'img/user.jpg',
        address: '202 Đường PQR, Quận STU, TP. Hồ Chí Minh',
        dob: '1991-03-25'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Add refresh button
    addRefreshButton();
    
    // Load users from server
    fetchUsers();
    
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleSidebar = document.getElementById('toggleSidebar');

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // User Modal Elements
    const userModal = document.getElementById('userModal');
    const btnAddUser = document.getElementById('btnAddUser');
    const closeUserModal = document.getElementById('closeUserModal');
    const cancelUser = document.getElementById('cancelUser');
    const saveUser = document.getElementById('saveUser');
    const userForm = document.getElementById('userForm');
    const userModalTitle = document.getElementById('userModalTitle');

    // View User Modal Elements
    const viewUserModal = document.getElementById('viewUserModal');
    const closeViewUserModal = document.getElementById('closeViewUserModal');
    const closeUserDetail = document.getElementById('closeUserDetail');

    // Delete Modal Elements
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    // Avatar Upload Elements
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarInput = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatarPreview');
    const previewImg = document.getElementById('previewImg');
    const removeAvatar = document.getElementById('removeAvatar');

    // Current user being edited or viewed
    let currentUserId = null;

    // Add event listeners for user management modals
    if (btnAddUser) {
        btnAddUser.addEventListener('click', function() {
            openAddUserModal();
        });
    }

    if (closeUserModal) {
        closeUserModal.addEventListener('click', function() {
            userModal.classList.remove('show');
            resetUserForm();
        });
    }

    if (cancelUser) {
        cancelUser.addEventListener('click', function() {
            userModal.classList.remove('show');
            resetUserForm();
        });
    }

    if (closeViewUserModal) {
        closeViewUserModal.addEventListener('click', function() {
            viewUserModal.classList.remove('show');
        });
    }

    if (closeUserDetail) {
        closeUserDetail.addEventListener('click', function() {
            viewUserModal.classList.remove('show');
        });
    }

    if (closeDeleteModal) {
        closeDeleteModal.addEventListener('click', function() {
            deleteModal.classList.remove('show');
        });
    }

    if (cancelDelete) {
        cancelDelete.addEventListener('click', function() {
            deleteModal.classList.remove('show');
        });
    }

    // Save user functionality
    if (saveUser) {
        saveUser.addEventListener('click', function() {
            if (userForm.checkValidity()) {
                // Show loading state
                saveUser.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
                saveUser.disabled = true;
                
                // Get form values
                const userData = {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    dob: document.getElementById('dob').value,
                    role: document.getElementById('role').value.toUpperCase(),
                    status: document.getElementById('status').value.toUpperCase(),
                    address: document.getElementById('address').value
                };
                
                // If password fields are filled, include them
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password && password === confirmPassword) {
                    userData.password = password;
                    userData.confirmPassword = confirmPassword;
                } else if (password || confirmPassword) {
                    // Show error if passwords don't match
                    showToast('Mật khẩu không khớp', 'error');
                    saveUser.innerHTML = 'Lưu';
                    saveUser.disabled = false;
                    return;
                }
                
                // Handle avatar later after we have a working avatar upload endpoint
                
                if (currentUserId) {
                    // Update existing user
                    fetch(`${API_BASE_URL}/api/users/${currentUserId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Không thể cập nhật người dùng');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Update locally
                        updateUser(currentUserId, {
                            name: userData.fullName,
                            email: userData.email,
                            phone: userData.phone,
                            dob: userData.dob,
                            role: userData.role.toLowerCase(),
                            status: userData.status.toLowerCase(),
                            address: userData.address
                        });
                        
                        showToast(`Đã cập nhật thông tin người dùng ${userData.fullName}`, 'success');
                        userModal.classList.remove('show');
                        resetUserForm();
                        renderUserTable();
                    })
                    .catch(error => {
                        console.error('Error updating user:', error);
                        showToast(`Lỗi khi cập nhật: ${error.message}`, 'error');
                    })
                    .finally(() => {
                        saveUser.innerHTML = 'Lưu';
                        saveUser.disabled = false;
                    });
                } else {
                    // Create new user
                    fetch(`${API_BASE_URL}/api/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Không thể tạo người dùng mới');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Add new user to local array
                        addUser({
                            name: userData.fullName,
                            email: userData.email,
                            phone: userData.phone,
                            dob: userData.dob,
                            role: userData.role.toLowerCase(),
                            status: userData.status.toLowerCase(),
                            address: userData.address
                        });
                        
                        showToast(`Đã thêm người dùng mới: ${userData.fullName}`, 'success');
                        userModal.classList.remove('show');
                        resetUserForm();
                        renderUserTable();
                    })
                    .catch(error => {
                        console.error('Error creating user:', error);
                        showToast(`Lỗi khi tạo người dùng: ${error.message}`, 'error');
                    })
                    .finally(() => {
                        saveUser.innerHTML = 'Lưu';
                        saveUser.disabled = false;
                    });
                }
            } else {
                userForm.reportValidity();
            }
        });
    }

    // Confirm delete functionality
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
            if (currentUserId) {
                const userName = users.find(user => user.id === currentUserId)?.name || '';
                const errorMessageDiv = document.getElementById('deleteErrorMessage');
                
                // Clear any previous error messages
                if (errorMessageDiv) {
                    errorMessageDiv.style.display = 'none';
                    errorMessageDiv.textContent = '';
                }
                
                // Show loading state
                confirmDelete.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xóa...';
                confirmDelete.disabled = true;
                cancelDelete.disabled = true;
                
                // Use the API call function
                callApi(
                    `${API_BASE_URL}/api/users/${currentUserId}`,
                    'DELETE',
                    null,
                    (data) => {
                        console.log('Delete success, response data:', data);
                        
                        // Success - remove user from local array
                        deleteUserById(currentUserId);
                        showToast(`Đã xóa người dùng ${userName}`, 'success');
                        deleteModal.classList.remove('show');
                        currentUserId = null;
                        
                        // Refresh the user table
                        renderUserTable();
                    },
                    (error) => {
                        console.error('Error deleting user:', error);
                        
                        // Show more detailed error information
                        console.error('Error details:', {
                            message: error.message,
                            stack: error.stack,
                            type: error.name
                        });
                        
                        // Network error
                        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                            isOfflineMode = true;
                            if (errorMessageDiv) {
                                errorMessageDiv.textContent = 'Không thể kết nối đến máy chủ. Bạn có muốn tiếp tục xóa dữ liệu cục bộ?';
                                errorMessageDiv.style.display = 'block';
                                
                                // Add button to delete locally
                                const localDeleteBtn = document.createElement('button');
                                localDeleteBtn.className = 'btn btn-warning';
                                localDeleteBtn.textContent = 'Xóa cục bộ';
                                localDeleteBtn.style.marginTop = '10px';
                                localDeleteBtn.onclick = function() {
                                    deleteUserById(currentUserId);
                                    showToast(`Đã xóa người dùng ${userName} (chỉ cục bộ)`, 'warning');
                                    deleteModal.classList.remove('show');
                                    currentUserId = null;
                                    renderUserTable();
                                    
                                    // Reset button state
                                    confirmDelete.innerHTML = 'Xóa';
                                    confirmDelete.disabled = false;
                                    cancelDelete.disabled = false;
                                };
                                
                                errorMessageDiv.appendChild(document.createElement('br'));
                                errorMessageDiv.appendChild(localDeleteBtn);
                            }
                        } else {
                            // Display error in the modal
                            if (errorMessageDiv) {
                                errorMessageDiv.textContent = error.message;
                                errorMessageDiv.style.display = 'block';
                            }
                        }
                        
                        showToast(`Lỗi khi xóa người dùng: ${error.message}`, 'error');
                    },
                    () => {
                        // Offline fallback function
                        deleteUserById(currentUserId);
                        showToast(`Đã xóa người dùng ${userName} (chế độ ngoại tuyến)`, 'warning');
                        deleteModal.classList.remove('show');
                        currentUserId = null;
                        renderUserTable();
                        return { success: true };
                    }
                ).finally(() => {
                    // Reset button state
                    confirmDelete.innerHTML = 'Xóa';
                    confirmDelete.disabled = false;
                    cancelDelete.disabled = false;
                });
            }
        });
    }

    // Avatar upload functionality
    if (avatarUpload) {
        avatarUpload.addEventListener('click', function() {
            avatarInput.click();
        });
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    avatarPreview.style.display = 'block';
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (removeAvatar) {
        removeAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            avatarInput.value = '';
            previewImg.src = '#';
            avatarPreview.style.display = 'none';
        });
    }

    // Filter functionality
    const searchUser = document.getElementById('searchUser');
    const filterRole = document.getElementById('filterRole');
    const filterStatus = document.getElementById('filterStatus');

    if (searchUser) {
        searchUser.addEventListener('input', function() {
            filterUsers();
        });
    }

    if (filterRole) {
        filterRole.addEventListener('change', function() {
            filterUsers();
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            filterUsers();
        });
    }

    // Initialize pagination
    initPagination();
});

// Functions for user management
function openAddUserModal() {
    const userModalTitle = document.getElementById('userModalTitle');
    userModalTitle.textContent = 'Thêm người dùng mới';
    currentUserId = null;
    resetUserForm();
    document.getElementById('userModal').classList.add('show');
}

function resetUserForm() {
    const userForm = document.getElementById('userForm');
    userForm.reset();
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview) {
        avatarPreview.style.display = 'none';
    }
}

function filterUsers() {
    const searchValue = document.getElementById('searchUser').value.toLowerCase();
    const roleValue = document.getElementById('filterRole').value;
    const statusValue = document.getElementById('filterStatus').value;
    
    // Filter the users array
    const filteredUsers = users.filter(user => {
        const matchesSearch = searchValue === '' || 
                            user.name.toLowerCase().includes(searchValue) || 
                            user.email.toLowerCase().includes(searchValue);
        const matchesRole = roleValue === '' || user.role === roleValue;
        const matchesStatus = statusValue === '' || user.status === statusValue;
        
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    // Render the filtered users
    renderUserTable(filteredUsers);
}

// Render user table
function renderUserTable(usersList = users) {
    const tableBody = document.querySelector('table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (usersList.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `<td colspan="7" style="text-align: center;">Không có dữ liệu người dùng</td>`;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    usersList.forEach(user => {
        const row = document.createElement('tr');
        
        // Format status class
        const statusClass = user.status === 'active' ? 'active' : 
                          user.status === 'inactive' ? 'inactive' : 'pending';
        
        // Format status text
        const statusText = user.status === 'active' ? 'Hoạt động' : 
                         user.status === 'inactive' ? 'Không hoạt động' : 'Chờ xác thực';
        
        // Format role text
        const roleText = user.role === 'admin' ? 'Admin' : 
                       user.role === 'manager' ? 'Quản lý' : 
                       user.role === 'agent' ? 'Môi giới' : 'Khách hàng';
        
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>
                <div style="display: flex; align-items: center;">
                    <img src="${user.avatar}" alt="User" style="width: 35px; height: 35px; border-radius: 50%; margin-right: 10px;">
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${roleText}</td>
            <td>${user.registerDate}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-view" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-edit" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="deleteUser('${user.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// CRUD Operations
function addUser(userData) {
    // Generate a new ID
    const newId = 'UID' + (users.length + 1).toString().padStart(3, '0');
    
    // Add today's date as register date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const registerDate = `${day}/${month}/${year}`;
    
    // Create new user object
    const newUser = {
        id: newId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        registerDate: registerDate,
        avatar: userData.avatar,
        address: userData.address,
        dob: userData.dob
    };
    
    // Add to users array
    users.push(newUser);
}

function updateUser(userId, userData) {
    // Find the user
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            status: userData.status,
            address: userData.address,
            dob: userData.dob
        };
        
        // Update avatar only if provided
        if (userData.avatar && userData.avatar !== '#') {
            users[userIndex].avatar = userData.avatar;
        }
    }
}

function deleteUserById(userId) {
    // Remove user from array
    users = users.filter(user => user.id !== userId);
}

// Global functions for user actions
function viewUser(userId) {
    // Find the user
    const user = users.find(user => user.id === userId);
    if (!user) return;
    
    currentUserId = userId;
    
    // Format role text
    const roleText = user.role === 'admin' ? 'Admin' : 
                   user.role === 'manager' ? 'Quản lý' : 
                   user.role === 'agent' ? 'Môi giới' : 'Khách hàng';
    
    // Format status class
    const statusClass = user.status === 'active' ? 'active' : 
                      user.status === 'inactive' ? 'inactive' : 'pending';
    
    // Format status text
    const statusText = user.status === 'active' ? 'Hoạt động' : 
                     user.status === 'inactive' ? 'Không hoạt động' : 'Chờ xác thực';
    
    // Format date of birth
    let formattedDob = user.dob ? new Date(user.dob) : null;
    formattedDob = formattedDob ? 
                 `${String(formattedDob.getDate()).padStart(2, '0')}/${String(formattedDob.getMonth() + 1).padStart(2, '0')}/${formattedDob.getFullYear()}` : 
                 'Không có';
    
    // Set modal fields
    document.getElementById('userAvatar').src = user.avatar;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = roleText;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phone || 'Không có';
    document.getElementById('userDob').textContent = formattedDob;
    document.getElementById('userAddress').textContent = user.address || 'Không có';
    document.getElementById('userRegDate').textContent = user.registerDate;
    document.getElementById('userStatus').innerHTML = `<span class="status ${statusClass}">${statusText}</span>`;
    
    // Show modal
    document.getElementById('viewUserModal').classList.add('show');
}

function editUser(userId) {
    try {
        // Find the user
        const user = users.find(user => user.id === userId);
        if (!user) return;
        
        currentUserId = userId;
        
        // Set loading state
        document.getElementById('userModalTitle').textContent = 'Đang tải dữ liệu...';
        
        // Fetch the latest user data from the server
        fetch(`${API_BASE_URL}/api/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể tải thông tin người dùng');
                }
                return response.json();
            })
            .then(serverUser => {
                // Set modal title
                document.getElementById('userModalTitle').textContent = 'Chỉnh sửa người dùng';
                
                // Format data for form
                const userData = {
                    name: serverUser.fullName || user.name,
                    email: serverUser.email || user.email,
                    phone: serverUser.phone || user.phone || '',
                    dob: serverUser.dob || user.dob || '',
                    role: (serverUser.role || user.role).toLowerCase(),
                    status: (serverUser.status || user.status).toLowerCase(),
                    address: serverUser.address || user.address || ''
                };
                
                // Populate form fields
                document.getElementById('fullName').value = userData.name;
                document.getElementById('email').value = userData.email;
                document.getElementById('phone').value = userData.phone;
                document.getElementById('dob').value = userData.dob;
                document.getElementById('role').value = userData.role;
                document.getElementById('status').value = userData.status;
                document.getElementById('address').value = userData.address;
                
                // Show avatar preview if available
                const avatarPreview = document.getElementById('avatarPreview');
                const previewImg = document.getElementById('previewImg');
                
                if (user.avatar) {
                    previewImg.src = user.avatar;
                    avatarPreview.style.display = 'block';
                } else {
                    avatarPreview.style.display = 'none';
                }
                
                // Show modal
                document.getElementById('userModal').classList.add('show');
            })
            .catch(error => {
                console.error('Error fetching user:', error);
                // Fallback to local data if server fails
                document.getElementById('userModalTitle').textContent = 'Chỉnh sửa người dùng';
                
                // Populate form fields
                document.getElementById('fullName').value = user.name;
                document.getElementById('email').value = user.email;
                document.getElementById('phone').value = user.phone || '';
                document.getElementById('dob').value = user.dob || '';
                document.getElementById('role').value = user.role;
                document.getElementById('status').value = user.status;
                document.getElementById('address').value = user.address || '';
                
                // Show avatar preview if available
                const avatarPreview = document.getElementById('avatarPreview');
                const previewImg = document.getElementById('previewImg');
                
                if (user.avatar) {
                    previewImg.src = user.avatar;
                    avatarPreview.style.display = 'block';
                } else {
                    avatarPreview.style.display = 'none';
                }
                
                // Show modal
                document.getElementById('userModal').classList.add('show');
            });
    } catch (error) {
        console.error('Error in editUser function:', error);
        showToast('Có lỗi xảy ra khi chỉnh sửa người dùng', 'error');
    }
}

function deleteUser(userId) {
    try {
        // Set the current user for deletion
        currentUserId = userId;
        
        // Show confirmation modal
        const deleteModal = document.getElementById('deleteModal');
        if (!deleteModal) {
            console.error('Delete modal not found in the DOM');
            showToast('Lỗi khi hiển thị hộp thoại xác nhận xóa', 'error');
            return;
        }
        
        // If we're in offline mode, add direct delete option
        if (isOfflineMode) {
            const confirmDeleteDirectly = document.getElementById('confirmDelete');
            confirmDeleteDirectly.addEventListener('click', function localDeleteHandler() {
                deleteUserById(userId);
                showToast(`Đã xóa người dùng (chế độ ngoại tuyến)`, 'success');
                deleteModal.classList.remove('show');
                renderUserTable();
                
                // Remove this event listener to avoid duplicates
                confirmDeleteDirectly.removeEventListener('click', localDeleteHandler);
            }, { once: true });
        }
        
        deleteModal.classList.add('show');
    } catch (error) {
        console.error('Error showing delete confirmation:', error);
        showToast('Có lỗi xảy ra khi xóa người dùng', 'error');
    }
}

// Initialize pagination
function initPagination() {
    // Find a container to render pagination
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        // Render pagination
        renderPagination(paginationContainer.id, currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
    }
}

// Handle page navigation
function goToPage(page) {
    page = parseInt(page);
    
    // Validate page number
    if (isNaN(page) || page < 1 || page > TOTAL_PAGES) {
        console.error('Invalid page number');
        return;
    }
    
    // Update current page
    currentPage = page;
    
    // Re-render pagination
    renderPagination('pagination-container', currentPage, TOTAL_PAGES, TOTAL_RECORDS, itemsPerPage);
    
    // For demo purposes, we'll just rerender the current table
    renderUserTable();
    
    // Update display text
    updateDisplayText();
}

// Handle page size change
function changePageSize(size) {
    size = parseInt(size);
    
    // Validate size
    if (isNaN(size) || size < 1) {
        console.error('Invalid page size');
        return;
    }
    
    // Update items per page
    itemsPerPage = size;
    
    // Recalculate total pages
    const totalPages = Math.ceil(TOTAL_RECORDS / itemsPerPage);
    
    // Adjust current page if needed
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    // Re-render pagination
    renderPagination('pagination-container', currentPage, totalPages, TOTAL_RECORDS, itemsPerPage);
    
    // For demo, rerender the table
    renderUserTable();
    
    // Update display text
    updateDisplayText();
}

// Update the "Hiển thị" text
function updateDisplayText() {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, TOTAL_RECORDS);
    
    const recordsElement = document.querySelector('.pagination-records');
    if (recordsElement) {
        recordsElement.innerHTML = `Hiển thị <strong>${startItem}-${endItem}</strong> của <strong>${TOTAL_RECORDS}</strong> bản ghi`;
    }
}

// Render pagination
function renderPagination(containerId, currentPage, totalPages, totalRecords, itemsPerPage) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalRecords);
    
    let html = `
        <div class="pagination-container">
            <div class="pagination-info">
                <div class="pagination-records">
                    Hiển thị <strong>${startItem}-${endItem}</strong> của <strong>${totalRecords}</strong> bản ghi
                </div>
                <div class="pagination-limits">
                    <span>Hiển thị</span>
                    <select onchange="changePageSize(this.value)">
                        <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5</option>
                        <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
                        <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>20</option>
                        <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
                    </select>
                    <span>mục</span>
                </div>
            </div>
            <div class="pagination">
                <button class="pagination-btn first" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-angle-double-left"></i>
                </button>
                <button class="pagination-btn prev" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-angle-left"></i>
                </button>
                <div class="page-numbers">
    `;
    
    // Generate page numbers
    const maxPagesToShow = 5;
    const halfWay = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(currentPage - halfWay, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    html += `
                </div>
                <button class="pagination-btn next" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-angle-right"></i>
                </button>
                <button class="pagination-btn last" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
            <div class="pagination-goto">
                <span>Đi đến trang</span>
                <input type="number" min="1" max="${totalPages}" value="${currentPage}" onkeydown="if(event.key === 'Enter') goToPage(this.value)">
                <span>/ ${totalPages}</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <div class="toast-close">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add animation class after a small delay to trigger CSS transition
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Add close functionality
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Function to check if backend is reachable
function checkBackendConnection() {
    return new Promise((resolve) => {
        const timeoutDuration = 3000; // 3 seconds timeout
        
        // Set up timeout
        const timeout = setTimeout(() => {
            console.log('Backend connection check timed out');
            resolve(false);
        }, timeoutDuration);
        
        // Try to fetch a simple endpoint
        fetch(`${API_BASE_URL}/api/users`, {
            method: 'HEAD',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            credentials: 'include'
        })
        .then(response => {
            clearTimeout(timeout);
            resolve(response.ok);
        })
        .catch(error => {
            clearTimeout(timeout);
            console.error('Backend connection check failed:', error);
            resolve(false);
        });
    });
}

// Function to handle API calls with offline fallback
async function callApi(url, method = 'GET', body = null, successCallback, errorCallback, offlineAction) {
    // Check connection status if we don't know yet
    if (!isOfflineMode && method !== 'HEAD') {
        isOfflineMode = !(await checkBackendConnection());
        
        if (isOfflineMode) {
            showToast('Không thể kết nối đến máy chủ. Chuyển sang chế độ ngoại tuyến.', 'warning');
            
            // Set up periodic health check to detect when backend comes back online
            if (!backendHealthCheckTimer) {
                backendHealthCheckTimer = setInterval(async () => {
                    const isOnline = await checkBackendConnection();
                    if (isOnline && isOfflineMode) {
                        isOfflineMode = false;
                        showToast('Đã kết nối lại với máy chủ. Chuyển sang chế độ trực tuyến.', 'success');
                        clearInterval(backendHealthCheckTimer);
                        backendHealthCheckTimer = null;
                        fetchUsers(); // Refresh data from server
                    }
                }, 30000); // Check every 30 seconds
            }
        }
    }
    
    // If we're offline and have an offline action, execute it
    if (isOfflineMode && offlineAction) {
        return offlineAction();
    }
    
    // Otherwise try the API call
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        };
        
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(url, options);
        
        // Handle different error responses
        if (!response.ok) {
            // Special handling for 404 errors on DELETE requests (treat as success if the resource is already gone)
            if (response.status === 404 && method === 'DELETE') {
                console.warn('Resource not found during DELETE, treating as success');
                return successCallback ? successCallback({success: true, message: "Resource already deleted"}) : {success: true};
            }
            
            const errorText = await response.text();
            let errorMessage;
            try {
                // Try to parse as JSON
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || `HTTP error ${response.status}`;
            } catch (e) {
                // If not JSON, use text
                errorMessage = errorText || `HTTP error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        // For HEAD requests or 204 responses, no body to parse
        if (method === 'HEAD' || response.status === 204) {
            return successCallback ? successCallback({success: true}) : {success: true};
        }
        
        // Check content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return successCallback ? successCallback(data) : data;
        } else {
            const text = await response.text();
            return successCallback ? successCallback({success: true, message: text}) : {success: true, message: text};
        }
    } catch (error) {
        console.error(`API call error (${url})`, error);
        
        // Set offline mode if network error
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            isOfflineMode = true;
            
            // Set up periodic health check
            if (!backendHealthCheckTimer) {
                backendHealthCheckTimer = setInterval(async () => {
                    const isOnline = await checkBackendConnection();
                    if (isOnline) {
                        isOfflineMode = false;
                        showToast('Đã kết nối lại với máy chủ', 'success');
                        clearInterval(backendHealthCheckTimer);
                        backendHealthCheckTimer = null;
                    }
                }, 30000); // Check every 30 seconds
            }
        }
        
        // Execute offline action if available, otherwise propagate the error
        if (isOfflineMode && offlineAction) {
            return offlineAction();
        } else if (errorCallback) {
            return errorCallback(error);
        } else {
            throw error;
        }
    }
}

// Function to fetch users from the server
function fetchUsers() {
    // Show loading indicator
    const tableBody = document.querySelector('table tbody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;"><i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...</td></tr>';
    }
    
    // Use the new API call function
    callApi(
        `${API_BASE_URL}/api/users`,
        'GET',
        null,
        (data) => {
            console.log('Fetched users:', data);
            isOfflineMode = false;
            
            // Transform server data to match our local format
            users = data.map(serverUser => ({
                id: serverUser.id,
                name: serverUser.fullName,
                email: serverUser.email,
                phone: serverUser.phone,
                role: serverUser.role ? serverUser.role.toLowerCase() : 'client',
                status: serverUser.status ? serverUser.status.toLowerCase() : 'active',
                registerDate: formatDate(serverUser.registrationDate),
                avatar: serverUser.avatar ? `data:image/jpeg;base64,${serverUser.avatar}` : 'img/user.jpg',
                address: serverUser.address,
                dob: serverUser.dob
            }));
            
            // Render user table with data
            renderUserTable();
            
            // Initialize pagination
            initPagination();
        },
        (error) => {
            console.error('Error fetching users:', error);
            isOfflineMode = true;
            
            // Fallback to sample data if API fails
            users = [...sampleUsers];
            renderUserTable();
            initPagination();
            
            showToast('Không thể kết nối đến máy chủ. Hiển thị dữ liệu mẫu.', 'warning');
        },
        () => {
            // Offline fallback function
            users = [...sampleUsers];
            renderUserTable();
            initPagination();
            return users;
        }
    );
}

// Helper function to format date from server (ISO format) to display format (DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
    }
}

// Add a refresh button to the user list header
function addRefreshButton() {
    const cardTools = document.querySelector('.card-tools');
    if (cardTools) {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-view ml-2';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới';
        refreshBtn.onclick = function() {
            fetchUsers();
            showToast('Đang tải lại danh sách người dùng', 'info');
        };
        cardTools.appendChild(refreshBtn);
    }
} 