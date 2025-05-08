# Real Estate Management System - Frontend

This directory contains the frontend UI for the Real Estate Management System, built with HTML, CSS, and JavaScript.

## Architecture

The frontend follows a modular architecture with:

- **HTML**: UI structure with separate pages for different features
- **CSS**: Styling with a modern and responsive design
- **JavaScript**: Client-side functionality and API integration
- **Express.js**: Simple server for development and API proxying

## Directory Structure

```
Frontend/
├── css/                 - Stylesheets
│   └── modern-style.css - Main stylesheet
├── js/                  - JavaScript files
│   ├── components.js    - Reusable UI components
│   ├── sidebar-toggle.js- Sidebar functionality
│   └── [feature].js     - Feature-specific logic
├── components/          - HTML components
├── img/                 - Image assets
├── error/               - Error pages
│   └── 404.html         - Not found page
├── index.html           - Main entry page
├── dashboard.html       - Dashboard page
├── users.html           - User management
├── properties.html      - Property management
├── server.js            - Express server for development
├── package.json         - NPM dependencies
└── README.md            - This file
```

## Features

- Dashboard with analytics and statistics
- User management
- Property listing and management
- Transaction tracking
- Reports and analytics
- Media management
- Settings configuration

## How to Run

1. **Install Dependencies**

   ```bash
   cd Frontend
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm start
   ```

   Or run with nodemon for automatic restarts:

   ```bash
   npm run dev
   ```

3. **Access the Application**

   Open your browser and navigate to:
   
   ```
   http://localhost:5500
   ```

## Backend Connection

The Express server in `server.js` proxies all API requests to the backend:

1. All requests to `/api/*` are automatically forwarded to the backend server
2. By default, the backend URL is set to `http://localhost:8080`
3. You can change the backend URL by setting the `BACKEND_URL` environment variable:

   ```bash
   BACKEND_URL=http://your-backend-url npm start
   ```

## Handling Backend Failures

The frontend is designed to handle backend failures gracefully:

1. When the backend is unavailable, user-friendly error messages are displayed
2. Some pages can work with sample data when the backend is unavailable
3. Automatic retry mechanisms are implemented for critical operations

## Browser Compatibility

The frontend is tested and compatible with:

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Development Guidelines

1. Use the component-based approach defined in `components.js`
2. Follow the existing CSS naming conventions
3. Add JavaScript for each feature in separate files
4. Use the API utility functions for backend communication
5. Maintain responsive design for all screen sizes

## Real Estate Admin Dashboard

A modern, responsive admin dashboard for real estate management built with HTML, CSS, and JavaScript.

## Overview

This admin dashboard provides a comprehensive solution for managing a real estate website. The user interface is designed to be intuitive and responsive, ensuring a seamless experience across all devices.

## Features

- **User Management**: Create, view, edit, and delete user accounts with different roles and permissions.
- **Property Management**: Manage property listings with advanced filtering and search options.
- **Category Management**: Organize properties into categories for better navigation.
- **Order Management**: Track and manage property orders and transactions.
- **Payment Processing**: Monitor and process payments with detailed transaction history.
- **Media Library**: Upload, organize, and manage all media assets.
- **Reviews Management**: Moderate and respond to user reviews.
- **Reports & Analytics**: Generate comprehensive reports with visual charts and graphs.
- **System Settings**: Customize the dashboard to fit your specific requirements.

## Pages

1. **Dashboard**: Overview of key metrics and recent activities.
2. **Users**: Manage user accounts and permissions.
3. **Properties**: Add, edit, and remove property listings.
4. **Categories**: Organize properties into categories.
5. **Orders**: Track and manage property transactions.
6. **Payments**: Process and monitor payment activities.
7. **Media**: Manage all uploaded images and files.
8. **Reviews**: Moderate user reviews and ratings.
9. **Reports**: Generate and view detailed analytics.
10. **Settings**: Configure system preferences.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Custom CSS with Flexbox and Grid layout
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome 6
- **Responsiveness**: Mobile-first approach with responsive design

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/realestate-admin.git
   ```

2. Navigate to the project directory:
   ```bash
   cd realestate-admin
   ```

3. Open the project in your preferred code editor.

4. To run the project locally, you can use a simple local server:
   
   Using Python:
   ```bash
   # Python 3
   python -m http.server
   
   # Python 2
   python -m SimpleHTTPServer
   ```
   
   Using Node.js (with http-server):
   ```bash
   # Install http-server globally if you haven't already
   npm install -g http-server
   
   # Run the server
   http-server
   ```

5. Open your browser and navigate to `http://localhost:8000` or the port specified by your server.

## Project Structure

```
realestate-admin/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── users.html              # User management
├── properties.html         # Property management
├── categories.html         # Category management
├── orders.html             # Order management
├── payments.html           # Payment processing
├── media.html              # Media library
├── reviews.html            # Reviews management
├── reports.html            # Reports & analytics
├── settings.html           # System settings
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── dashboard.js        # Dashboard functionality
│   ├── users.js            # User management functionality
│   ├── properties.js       # Property management functionality
│   ├── categories.js       # Category management functionality
│   ├── orders.js           # Order management functionality
│   ├── payments.js         # Payment processing functionality
│   ├── media.js            # Media library functionality
│   ├── reviews.js          # Reviews management functionality
│   ├── reports.js          # Reports & analytics functionality
│   └── settings.js         # System settings functionality
└── img/
    ├── logo.png            # Site logo
    ├── avatar.jpg          # Default user avatar
    └── ...                 # Other images
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Font Awesome](https://fontawesome.com/) for the icons
- [Chart.js](https://www.chartjs.org/) for the charts
- [Unsplash](https://unsplash.com/) for the sample images

## Contact

For any questions or suggestions, please reach out to:
- Email: contact@realestatecompany.com
- Website: [www.realestatecompany.com](https://www.realestatecompany.com) 