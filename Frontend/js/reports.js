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

    // Date Range Filter
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    // Report Action Buttons
    const refreshReport = document.getElementById('refreshReport');
    const exportReport = document.getElementById('exportReport');
    const scheduleReport = document.getElementById('scheduleReport');
    const downloadFullReport = document.getElementById('downloadFullReport');
    
    // Chart Filters
    const revenueChartType = document.getElementById('revenueChartType');
    const revenueDistributionType = document.getElementById('revenueDistributionType');
    const propertyMetric = document.getElementById('propertyMetric');
    const trafficLastWeek = document.getElementById('trafficLastWeek');
    const trafficLastMonth = document.getElementById('trafficLastMonth');
    const userActivityToday = document.getElementById('userActivityToday');
    const userActivity7days = document.getElementById('userActivity7days');
    const conversionTimeRange = document.getElementById('conversionTimeRange');
    
    // Schedule Report Modal
    const scheduleReportModal = document.getElementById('scheduleReportModal');
    const saveSchedule = document.getElementById('saveSchedule');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Chart Elements
    const revenueChartCanvas = document.getElementById('revenueChart');
    const revenuePieChartCanvas = document.getElementById('revenuePieChart');
    const trafficSourcesChartCanvas = document.getElementById('trafficSourcesChart');
    const userActivityChartCanvas = document.getElementById('userActivityChart');
    
    // Initialize Charts
    let revenueChart, revenuePieChart, trafficSourcesChart, userActivityChart;
    
    // Initialize Event Listeners
    function initEventListeners() {
        // Date Range Select
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customDateRange.style.display = 'block';
                } else {
                    customDateRange.style.display = 'none';
                    updateReportData();
                }
            });
        }
        
        // Custom Date Range Inputs
        if (startDate && endDate) {
            startDate.addEventListener('change', updateReportData);
            endDate.addEventListener('change', updateReportData);
        }
        
        // Report Actions
        if (refreshReport) {
            refreshReport.addEventListener('click', updateReportData);
        }
        
        if (exportReport) {
            exportReport.addEventListener('click', exportCurrentReport);
        }
        
        if (scheduleReport) {
            scheduleReport.addEventListener('click', showScheduleModal);
        }
        
        if (downloadFullReport) {
            downloadFullReport.addEventListener('click', downloadFullReportFile);
        }
        
        // Chart Filters
        if (revenueChartType) {
            revenueChartType.addEventListener('change', updateRevenueChart);
        }
        
        if (revenueDistributionType) {
            revenueDistributionType.addEventListener('change', updateRevenuePieChart);
        }
        
        if (propertyMetric) {
            propertyMetric.addEventListener('change', updatePropertyTable);
        }
        
        // Traffic Sources Toggle
        if (trafficLastWeek && trafficLastMonth) {
            trafficLastWeek.addEventListener('click', function() {
                setActiveButton(this, trafficLastMonth);
                updateTrafficSourcesChart('week');
            });
            
            trafficLastMonth.addEventListener('click', function() {
                setActiveButton(this, trafficLastWeek);
                updateTrafficSourcesChart('month');
            });
        }
        
        // User Activity Toggle
        if (userActivityToday && userActivity7days) {
            userActivityToday.addEventListener('click', function() {
                setActiveButton(this, userActivity7days);
                updateUserActivityChart('today');
            });
            
            userActivity7days.addEventListener('click', function() {
                setActiveButton(this, userActivityToday);
                updateUserActivityChart('week');
            });
        }
        
        // Conversion Time Range
        if (conversionTimeRange) {
            conversionTimeRange.addEventListener('change', updateConversionStats);
        }
        
        // Schedule Modal
        if (saveSchedule) {
            saveSchedule.addEventListener('click', saveReportSchedule);
        }
        
        // Close Modals
        closeModalButtons.forEach(button => {
            button.addEventListener('click', closeAllModals);
        });
    }
    
    // Initialize Charts
    function initCharts() {
        // Revenue Chart
        if (revenueChartCanvas) {
            const ctx = revenueChartCanvas.getContext('2d');
            revenueChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'],
                    datasets: [{
                        label: 'Doanh thu (tỷ đồng)',
                        data: [2.1, 2.5, 1.8, 3.2, 2.8, 3.5, 2.6],
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#4e73df',
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
                            backgroundColor: '#fff',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ddd',
                            borderWidth: 1,
                            padding: 10,
                            boxPadding: 6,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.y + ' tỷ đồng';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + ' tỷ';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Revenue Pie Chart
        if (revenuePieChartCanvas) {
            const ctx = revenuePieChartCanvas.getContext('2d');
            revenuePieChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Căn hộ chung cư', 'Biệt thự, liền kề', 'Nhà riêng', 'Đất nền dự án', 'Khác'],
                    datasets: [{
                        data: [42, 28, 15, 10, 5],
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                boxWidth: 12,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ddd',
                            borderWidth: 1,
                            padding: 10,
                            boxPadding: 6,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return percentage + '% (' + value + '%)';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Traffic Sources Chart
        if (trafficSourcesChartCanvas) {
            const ctx = trafficSourcesChartCanvas.getContext('2d');
            trafficSourcesChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Tìm kiếm', 'Trực tiếp', 'Mạng xã hội', 'Giới thiệu'],
                    datasets: [{
                        data: [42.8, 27.5, 18.3, 11.4],
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                        borderWidth: 0
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
                            backgroundColor: '#fff',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ddd',
                            borderWidth: 1,
                            padding: 10,
                            boxPadding: 6,
                            usePointStyle: true,
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // User Activity Chart
        if (userActivityChartCanvas) {
            const ctx = userActivityChartCanvas.getContext('2d');
            userActivityChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Tìm kiếm', 'Lưu BĐS', 'Bình luận', 'Chia sẻ'],
                    datasets: [{
                        label: 'Hoạt động',
                        data: [15342, 4721, 2103, 1258],
                        backgroundColor: [
                            'rgba(78, 115, 223, 0.7)',
                            'rgba(28, 200, 138, 0.7)',
                            'rgba(54, 185, 204, 0.7)',
                            'rgba(246, 194, 62, 0.7)'
                        ],
                        borderColor: [
                            'rgb(78, 115, 223)',
                            'rgb(28, 200, 138)',
                            'rgb(54, 185, 204)',
                            'rgb(246, 194, 62)'
                        ],
                        borderWidth: 1
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
                            backgroundColor: '#fff',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ddd',
                            borderWidth: 1,
                            padding: 10,
                            boxPadding: 6,
                            usePointStyle: true
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    if (value >= 1000) {
                                        return (value / 1000).toFixed(0) + 'k';
                                    }
                                    return value;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Update Report Data
    function updateReportData() {
        // In a real application, this would fetch new data from the server based on the selected date range
        console.log('Updating report data...');
        
        // Get selected date range
        const selectedRange = dateRangeSelect.value;
        let dateRange = '';
        
        if (selectedRange === 'custom' && startDate.value && endDate.value) {
            dateRange = 'Từ ' + formatDate(startDate.value) + ' đến ' + formatDate(endDate.value);
        } else {
            dateRange = getDateRangeText(selectedRange);
        }
        
        console.log('Selected date range:', dateRange);
        
        // Update charts and tables with new data
        updateRevenueChart();
        updateRevenuePieChart();
        updatePropertyTable();
        updateTrafficSourcesChart();
        updateUserActivityChart();
        updateConversionStats();
    }
    
    // Update Revenue Chart
    function updateRevenueChart() {
        if (!revenueChart) return;
        
        const chartType = revenueChartType ? revenueChartType.value : 'daily';
        console.log('Updating revenue chart with type:', chartType);
        
        let labels, data;
        
        switch (chartType) {
            case 'weekly':
                labels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                data = [10.2, 12.5, 9.8, 14.2];
                break;
            case 'monthly':
                labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                data = [8.5, 9.2, 10.5, 11.8, 13.2, 14.5, 15.8, 14.2, 12.5, 11.8, 13.5, 15.2];
                break;
            case 'daily':
            default:
                labels = ['01/04', '02/04', '03/04', '04/04', '05/04', '06/04', '07/04'];
                data = [2.1, 2.5, 1.8, 3.2, 2.8, 3.5, 2.6];
                break;
        }
        
        revenueChart.data.labels = labels;
        revenueChart.data.datasets[0].data = data;
        revenueChart.update();
    }
    
    // Update Revenue Pie Chart
    function updateRevenuePieChart() {
        if (!revenuePieChart) return;
        
        const distributionType = revenueDistributionType ? revenueDistributionType.value : 'category';
        console.log('Updating revenue pie chart with type:', distributionType);
        
        let labels, data;
        
        switch (distributionType) {
            case 'location':
                labels = ['Quận 2, TP.HCM', 'Quận 7, TP.HCM', 'Quận 9, TP.HCM', 'Thủ Đức, TP.HCM', 'Khác'];
                data = [35, 25, 20, 15, 5];
                break;
            case 'category':
            default:
                labels = ['Căn hộ chung cư', 'Biệt thự, liền kề', 'Nhà riêng', 'Đất nền dự án', 'Khác'];
                data = [42, 28, 15, 10, 5];
                break;
        }
        
        revenuePieChart.data.labels = labels;
        revenuePieChart.data.datasets[0].data = data;
        revenuePieChart.update();
    }
    
    // Update Property Table
    function updatePropertyTable() {
        const metric = propertyMetric ? propertyMetric.value : 'views';
        console.log('Updating property table with metric:', metric);
        
        // In a real application, this would update the table data based on the selected metric
        // For this demo, we'll just log the change
    }
    
    // Update Traffic Sources Chart
    function updateTrafficSourcesChart(period = 'month') {
        if (!trafficSourcesChart) return;
        
        console.log('Updating traffic sources chart for period:', period);
        
        let data;
        
        switch (period) {
            case 'week':
                data = [45.2, 25.8, 17.6, 11.4];
                break;
            case 'month':
            default:
                data = [42.8, 27.5, 18.3, 11.4];
                break;
        }
        
        trafficSourcesChart.data.datasets[0].data = data;
        trafficSourcesChart.update();
        
        // Update the legend values
        const legendValues = document.querySelectorAll('.traffic-legend .legend-value');
        if (legendValues.length) {
            for (let i = 0; i < legendValues.length; i++) {
                legendValues[i].textContent = data[i] + '%';
            }
        }
    }
    
    // Update User Activity Chart
    function updateUserActivityChart(period = 'week') {
        if (!userActivityChart) return;
        
        console.log('Updating user activity chart for period:', period);
        
        let data;
        
        switch (period) {
            case 'today':
                data = [2245, 687, 312, 198];
                break;
            case 'week':
            default:
                data = [15342, 4721, 2103, 1258];
                break;
        }
        
        userActivityChart.data.datasets[0].data = data;
        userActivityChart.update();
        
        // Update the activity values
        const activityValues = document.querySelectorAll('.activity-value');
        if (activityValues.length) {
            for (let i = 0; i < activityValues.length; i++) {
                activityValues[i].textContent = data[i].toLocaleString();
            }
        }
    }
    
    // Update Conversion Stats
    function updateConversionStats() {
        const timeRange = conversionTimeRange ? conversionTimeRange.value : '30days';
        console.log('Updating conversion stats for time range:', timeRange);
        
        // In a real application, this would update the conversion statistics based on the selected time range
        // For this demo, we'll just log the change
    }
    
    // Export Current Report
    function exportCurrentReport() {
        console.log('Exporting current report...');
        alert('Đang xuất báo cáo với các cài đặt hiện tại...');
    }
    
    // Show Schedule Modal
    function showScheduleModal() {
        if (scheduleReportModal) {
            scheduleReportModal.style.display = 'block';
        }
    }
    
    // Save Report Schedule
    function saveReportSchedule() {
        const reportName = document.getElementById('reportName').value;
        const frequency = document.getElementById('reportFrequency').value;
        const recipients = document.getElementById('reportRecipients').value;
        const format = document.getElementById('reportFormat').value;
        
        const revenueChecked = document.getElementById('scheduleRevenue').checked;
        const propertiesChecked = document.getElementById('scheduleProperties').checked;
        const usersChecked = document.getElementById('scheduleUsers').checked;
        const trafficChecked = document.getElementById('scheduleTraffic').checked;
        const conversionsChecked = document.getElementById('scheduleConversions').checked;
        
        if (!reportName) {
            alert('Vui lòng nhập tên báo cáo!');
            return;
        }
        
        if (!recipients) {
            alert('Vui lòng nhập địa chỉ email người nhận!');
            return;
        }
        
        console.log('Saving report schedule:', {
            name: reportName,
            frequency,
            recipients,
            format,
            sections: {
                revenue: revenueChecked,
                properties: propertiesChecked,
                users: usersChecked,
                traffic: trafficChecked,
                conversions: conversionsChecked
            }
        });
        
        closeAllModals();
        alert('Đã lên lịch báo cáo thành công!');
    }
    
    // Download Full Report
    function downloadFullReportFile() {
        const reportRevenue = document.getElementById('reportRevenue').checked;
        const reportProperties = document.getElementById('reportProperties').checked;
        const reportUsers = document.getElementById('reportUsers').checked;
        const reportTraffic = document.getElementById('reportTraffic').checked;
        const reportConversions = document.getElementById('reportConversions').checked;
        
        const exportFormat = document.querySelector('input[name="exportFormat"]:checked').value;
        
        console.log('Downloading full report:', {
            format: exportFormat,
            sections: {
                revenue: reportRevenue,
                properties: reportProperties,
                users: reportUsers,
                traffic: reportTraffic,
                conversions: reportConversions
            }
        });
        
        alert(`Đang tải xuống báo cáo đầy đủ dạng ${exportFormat.toUpperCase()}...`);
    }
    
    // Close all modals
    function closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Set active button
    function setActiveButton(activeButton, inactiveButton) {
        activeButton.classList.add('active');
        inactiveButton.classList.remove('active');
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Helper function to get date range text
    function getDateRangeText(range) {
        switch (range) {
            case 'today':
                return 'Hôm nay';
            case 'yesterday':
                return 'Hôm qua';
            case '7days':
                return '7 ngày qua';
            case '30days':
                return '30 ngày qua';
            case 'thisMonth':
                return 'Tháng này';
            case 'lastMonth':
                return 'Tháng trước';
            case 'thisYear':
                return 'Năm nay';
            default:
                return '';
        }
    }
    
    // Initialize the page
    initEventListeners();
    initCharts();
}); 