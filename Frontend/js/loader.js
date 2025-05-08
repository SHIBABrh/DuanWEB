/**
 * loader.js - Tối ưu hiệu suất tải trang
 * File này giúp cải thiện hiệu suất bằng cách:
 * 1. Phân chia tác vụ nặng thành các công việc nhỏ hơn
 * 2. Sử dụng requestIdleCallback để tận dụng thời gian rảnh của trình duyệt
 * 3. Thực hiện lazy-loading cho nội dung
 * 4. Ngăn chặn render-blocking scripts
 */

// Theo dõi trạng thái tải trang
const pageLoadState = {
    DOMLoaded: false,
    assetsLoaded: false,
    renderComplete: false,
    pendingTasks: 0
};

// Danh sách các tác vụ được xếp hàng đợi
const taskQueue = [];

// Theo dõi các tác vụ nặng
let isProcessing = false;

/**
 * Phân chia công việc thành các mảnh nhỏ và thực thi theo thứ tự ưu tiên
 * @param {Function} task Công việc cần thực hiện
 * @param {String} priority Mức ưu tiên ('high', 'medium', 'low')
 */
function scheduleTask(task, priority = 'medium') {
    if (priority === 'high') {
        // Thực hiện ngay lập tức cho các tác vụ quan trọng
        setTimeout(task, 0);
        return;
    }

    // Thêm vào hàng đợi với độ ưu tiên
    taskQueue.push({
        task,
        priority: priority === 'low' ? 2 : 1
    });

    // Sắp xếp hàng đợi theo mức ưu tiên
    taskQueue.sort((a, b) => a.priority - b.priority);

    // Bắt đầu xử lý hàng đợi nếu chưa có quá trình nào đang chạy
    if (!isProcessing) {
        processTaskQueue();
    }
}

/**
 * Xử lý các tác vụ trong hàng đợi khi trình duyệt rảnh
 */
function processTaskQueue() {
    if (taskQueue.length === 0) {
        isProcessing = false;
        return;
    }

    isProcessing = true;

    // Sử dụng requestIdleCallback nếu có sẵn, nếu không dùng setTimeout
    const useIdleCallback = window.requestIdleCallback && !pageLoadState.DOMLoaded;
    
    if (useIdleCallback) {
        requestIdleCallback(processTask, { timeout: 1000 });
    } else {
        setTimeout(processTask, 1);
    }
}

/**
 * Xử lý một tác vụ khi trình duyệt rảnh
 * @param {IdleDeadline|null} deadline Thời hạn xử lý tác vụ 
 */
function processTask(deadline) {
    // Kiểm tra xem còn thời gian rảnh không
    const hasTimeRemaining = deadline ? deadline.timeRemaining() > 5 : true;
    
    if (hasTimeRemaining && taskQueue.length > 0) {
        const nextTask = taskQueue.shift();
        try {
            nextTask.task();
        } catch (error) {
            console.error('Error executing task:', error);
        }
    }
    
    // Tiếp tục xử lý nếu còn tác vụ trong hàng đợi
    if (taskQueue.length > 0) {
        processTaskQueue();
    } else {
        isProcessing = false;
    }
}

/**
 * Theo dõi sự kiện DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    pageLoadState.DOMLoaded = true;
    
    // Tải các tài nguyên cần thiết và component UI
    scheduleTask(() => {
        // Khởi tạo UI components
        initUIComponents();
    }, 'high');
    
    // Thiết lập các sự kiện và handlers
    scheduleTask(setupEventHandlers, 'medium');
});

/**
 * Khởi tạo các thành phần UI
 */
function initUIComponents() {
    // Tìm và khởi tạo các thành phần động trong trang
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (sidebar && mainContent) {
        // Đánh dấu đã hoàn thành render
        pageLoadState.renderComplete = true;
    }
}

/**
 * Thiết lập các sự kiện
 */
function setupEventHandlers() {
    // Thêm các sự kiện như click, submit, v.v.
    document.addEventListener('click', (e) => {
        // Triển khai event delegation để giảm thiểu số lượng event listeners
        const target = e.target;
        
        // Xử lý nút xóa
        if (target.closest('.btn-delete')) {
            e.preventDefault();
            // Đảm bảo tác vụ xóa không gây đơ giao diện
            scheduleTask(() => {
                const deleteBtn = target.closest('.btn-delete');
                const id = deleteBtn.getAttribute('data-id') || 
                           deleteBtn.closest('[data-id]')?.getAttribute('data-id');
                
                if (id) {
                    if (typeof deleteProperty === 'function') {
                        deleteProperty(id);
                    }
                }
            }, 'medium');
        }
        
        // Xử lý nút sửa
        if (target.closest('.btn-edit')) {
            e.preventDefault();
            scheduleTask(() => {
                const editBtn = target.closest('.btn-edit');
                const id = editBtn.getAttribute('data-id') || 
                           editBtn.closest('[data-id]')?.getAttribute('data-id');
                
                if (id) {
                    if (typeof editProperty === 'function') {
                        editProperty(id);
                    }
                }
            }, 'medium');
        }
    });
    
    // Tối ưu hiệu ứng hiển thị
    optimizeAnimations();
}

/**
 * Tối ưu các hiệu ứng
 */
function optimizeAnimations() {
    // Tắt các hiệu ứng phức tạp trên thiết bị di động
    if (window.innerWidth < 768) {
        document.body.classList.add('reduce-animations');
    }
    
    // Theo dõi sự thay đổi kích thước màn hình
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth < 768) {
                document.body.classList.add('reduce-animations');
            } else {
                document.body.classList.remove('reduce-animations');
            }
        }, 250);
    });
}

/**
 * Tải lười (lazy load) các hình ảnh
 */
function lazyLoadImages() {
    // Sử dụng Intersection Observer API nếu có
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Tìm tất cả hình ảnh cần lazy load
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback cho trình duyệt không hỗ trợ Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        });
    }
}

// Khởi chạy lazy load khi DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    scheduleTask(lazyLoadImages, 'medium');
});

// Khởi chạy lazy load lại khi window load (để bắt các hình ảnh bị bỏ qua)
window.addEventListener('load', () => {
    pageLoadState.assetsLoaded = true;
    scheduleTask(lazyLoadImages, 'low');
});

// Export các hàm để có thể sử dụng từ các file JavaScript khác
window.pageOptimizer = {
    scheduleTask,
    lazyLoadImages,
    isProcessing: () => isProcessing,
    getPageLoadState: () => ({...pageLoadState})
}; 