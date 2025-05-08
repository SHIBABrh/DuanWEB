/**
 * Dashboard initialization script
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard scripts loading...');
    
    // Initialization for sidebar toggle
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleSidebar = document.getElementById('toggleSidebar');

    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    try {
        console.log('Initializing all charts...');
        
        // Initialize all charts with sample data
        initRevenueChart();
        initPropertyTypeChart();
        initTransactionStatusChart();
        initUserGrowthChart();
        initAreaDistributionChart();
        
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
    
    // Time range filter change event
    const revenueTimeRange = document.getElementById('revenueTimeRange');
    if (revenueTimeRange) {
        revenueTimeRange.addEventListener('change', function() {
            updateRevenueChart(this.value);
        });
    }

    // Sample notification functionality
    const notificationIcon = document.querySelector('.notification-icon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            alert('Chức năng thông báo sẽ được hiển thị tại đây');
        });
    }

    // Sample user profile functionality
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            alert('Menu người dùng sẽ được hiển thị tại đây');
        });
    }
});

/**
 * Initialize the revenue chart with default data
 */
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) {
        console.warn('Revenue chart canvas not found');
        return;
    }
    
    try {
        console.log('Initializing revenue chart');
        
        // Default to monthly data
        const defaultData = getRevenueData('month');
        
        // Create chart instance
        window.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: defaultData.labels,
                datasets: [{
                    label: 'Doanh thu (triệu VNĐ)',
                    data: defaultData.values,
                    backgroundColor: 'rgba(74, 108, 247, 0.1)',
                    borderColor: 'rgba(74, 108, 247, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(74, 108, 247, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        bodySpacing: 6,
                        caretSize: 6,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} triệu VNĐ`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: 'rgba(100, 116, 139, 0.8)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            color: 'rgba(100, 116, 139, 0.8)',
                            callback: function(value) {
                                return value.toLocaleString('vi-VN');
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Revenue chart initialized');
    } catch (error) {
        console.error('Error initializing revenue chart:', error);
    }
}

/**
 * Update the revenue chart based on selected time range
 * @param {string} timeRange - The selected time range ('day', 'week', or 'month')
 */
function updateRevenueChart(timeRange) {
    if (!window.revenueChart) {
        console.warn('Revenue chart not initialized');
        return;
    }
    
    try {
        const data = getRevenueData(timeRange);
        
        // Update chart data
        window.revenueChart.data.labels = data.labels;
        window.revenueChart.data.datasets[0].data = data.values;
        
        // Update label based on time range
        if (timeRange === 'day') {
            window.revenueChart.data.datasets[0].label = 'Doanh thu theo giờ (triệu VNĐ)';
        } else if (timeRange === 'week') {
            window.revenueChart.data.datasets[0].label = 'Doanh thu theo ngày (triệu VNĐ)';
        } else {
            window.revenueChart.data.datasets[0].label = 'Doanh thu theo tháng (triệu VNĐ)';
        }
        
        window.revenueChart.update();
        console.log(`Revenue chart updated to ${timeRange} view`);
    } catch (error) {
        console.error('Error updating revenue chart:', error);
    }
}

/**
 * Get revenue data based on selected time range
 * @param {string} timeRange - The selected time range ('day', 'week', or 'month')
 * @returns {Object} Object containing labels and values arrays
 */
function getRevenueData(timeRange) {
    // Sample data - this would be replaced with API calls in production
    
    let labels = [];
    let values = [];
    
    if (timeRange === 'day') {
        // Hourly data for the current day
        labels = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
                  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
        values = [1.2, 1.8, 2.5, 3.1, 2.8, 1.5, 2.0, 2.3, 3.2, 4.1, 3.8, 3.0, 2.5];
    } else if (timeRange === 'week') {
        // Daily data for the current week
        labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
        values = [18.5, 22.3, 19.8, 24.5, 28.7, 33.2, 25.9];
    } else {
        // Monthly data for the current year
        labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        values = [80.5, 75.2, 92.8, 88.5, 95.3, 110.2, 120.5, 135.8, 128.7, 142.3, 155.5, 170.2];
    }
    
    return { labels, values };
}

/**
 * Initialize the property type distribution chart
 */
function initPropertyTypeChart() {
    const ctx = document.getElementById('propertyChart');
    if (!ctx) {
        console.warn('Property chart canvas not found');
        return;
    }
    
    try {
        console.log('Initializing property type chart');
        
        // Sample data for property types
        const propertyTypes = ['Căn hộ', 'Nhà phố', 'Biệt thự', 'Đất nền', 'Văn phòng', 'Khác'];
        const propertyData = [35, 25, 15, 10, 10, 5];
        
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: propertyTypes,
                datasets: [{
                    data: propertyData,
                    backgroundColor: [
                        'rgba(74, 108, 247, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(254, 95, 85, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(100, 116, 139, 0.8)'
                    ],
                    borderColor: [
                        'rgba(74, 108, 247, 1)',
                        'rgba(34, 197, 94, 1)',
                        'rgba(254, 95, 85, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(99, 102, 241, 1)',
                        'rgba(100, 116, 139, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Property type chart initialized');
    } catch (error) {
        console.error('Error initializing property type chart:', error);
    }
}

/**
 * Initialize the transaction status chart
 */
function initTransactionStatusChart() {
    const ctx = document.getElementById('transactionChart');
    if (!ctx) {
        console.warn('Transaction chart canvas not found');
        return;
    }
    
    try {
        console.log('Initializing transaction status chart');
        
        // Sample data for transaction statuses
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
        const completedData = [12, 19, 15, 17, 21, 25];
        const pendingData = [8, 12, 9, 11, 13, 7];
        const cancelledData = [3, 5, 4, 6, 2, 1];
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Hoàn thành',
                        data: completedData,
                        backgroundColor: 'rgba(34, 197, 94, 0.8)',
                        borderColor: 'rgba(34, 197, 94, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Đang xử lý',
                        data: pendingData,
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    },
                    {
                        label: 'Đã hủy',
                        data: cancelledData,
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        padding: 12
                    }
                }
            }
        });
        
        console.log('Transaction status chart initialized');
    } catch (error) {
        console.error('Error initializing transaction status chart:', error);
    }
}

/**
 * Initialize the user growth chart
 */
function initUserGrowthChart() {
    const ctx = document.getElementById('userGrowthChart');
    if (!ctx) {
        console.warn('User growth chart canvas not found');
        return;
    }
    
    try {
        console.log('Initializing user growth chart');
        
        // Sample data for user growth
        const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        const userData = [120, 145, 175, 210, 230, 280, 320, 350, 410, 450, 520, 580];
        const growthRate = [0, 20.8, 20.7, 20, 9.5, 21.7, 14.3, 9.4, 17.1, 9.8, 15.6, 11.5];
        
        try {
            const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
            gradientFill.addColorStop(0, 'rgba(99, 102, 241, 0.6)');
            gradientFill.addColorStop(1, 'rgba(99, 102, 241, 0.1)');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Tổng người dùng',
                            data: userData,
                            backgroundColor: gradientFill,
                            borderColor: 'rgba(99, 102, 241, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Tỷ lệ tăng (%)',
                            data: growthRate,
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(254, 95, 85, 1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointBackgroundColor: 'rgba(254, 95, 85, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: false,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                callback: function(value) {
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 12,
                                padding: 15,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(30, 41, 59, 0.8)',
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.dataset.label === 'Tổng người dùng') {
                                        label += context.parsed.y.toLocaleString('vi-VN');
                                    } else {
                                        label += context.parsed.y.toLocaleString('vi-VN') + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
            
            console.log('User growth chart initialized');
        } catch (gradientError) {
            console.error('Error creating gradient for user growth chart:', gradientError);
            
            // Fallback if gradient creation fails
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Tổng người dùng',
                            data: userData,
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            borderColor: 'rgba(99, 102, 241, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Tỷ lệ tăng (%)',
                            data: growthRate,
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(254, 95, 85, 1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            pointBackgroundColor: 'rgba(254, 95, 85, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            fill: false,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            
            console.log('User growth chart initialized with fallback settings');
        }
    } catch (error) {
        console.error('Error initializing user growth chart:', error);
    }
}

/**
 * Initialize the area distribution chart
 */
function initAreaDistributionChart() {
    const ctx = document.getElementById('areaDistributionChart');
    if (!ctx) {
        console.warn('Area distribution chart canvas not found');
        return;
    }
    
    try {
        console.log('Initializing area distribution chart');
        
        // Sample data for area distribution
        const areas = ['Hà Nội', 'TP. HCM', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Khác'];
        const areaData = [30, 35, 12, 10, 8, 5];
        
        new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: areas,
                datasets: [{
                    data: areaData,
                    backgroundColor: [
                        'rgba(74, 108, 247, 0.7)',
                        'rgba(34, 197, 94, 0.7)',
                        'rgba(254, 95, 85, 0.7)',
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(99, 102, 241, 0.7)',
                        'rgba(100, 116, 139, 0.7)'
                    ],
                    borderColor: [
                        'rgba(74, 108, 247, 1)',
                        'rgba(34, 197, 94, 1)',
                        'rgba(254, 95, 85, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(99, 102, 241, 1)',
                        'rgba(100, 116, 139, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 15,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.r}%`;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Area distribution chart initialized');
    } catch (error) {
        console.error('Error initializing area distribution chart:', error);
    }
} 