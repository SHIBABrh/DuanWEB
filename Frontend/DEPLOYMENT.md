# Deployment Guide for Real Estate Admin Dashboard

This document provides instructions for deploying the Real Estate Admin Dashboard to various hosting environments.

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Basic knowledge of command line operations

## Option 1: Local Deployment

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd realestate-admin-dashboard
```

### Step 2: Install Dependencies (for development)

```bash
npm install
```

### Step 3: Start the Server

```bash
npm start
```

The dashboard will be available at `http://localhost:3000`.

For development with auto-restart:

```bash
npm run dev
```

## Option 2: Deploying to a Static Web Host (e.g., Netlify, Vercel, GitHub Pages)

Since this is primarily a static web application, you can deploy it to any static web hosting service.

### Netlify Deployment

1. Sign up for a [Netlify](https://www.netlify.com/) account if you don't have one.
2. Click on "New site from Git" button.
3. Connect your repository and follow the instructions.
4. Set the publish directory to the root folder.
5. Deploy the site.

### Vercel Deployment

1. Sign up for a [Vercel](https://vercel.com/) account if you don't have one.
2. Click on "Import Project" and select your repository.
3. Follow the default configuration for static sites.
4. Deploy the site.

### GitHub Pages Deployment

1. Go to your repository settings on GitHub.
2. Scroll down to the GitHub Pages section.
3. Select the main/master branch as source.
4. Save the settings and wait for GitHub to deploy your site.

## Option 3: Deploying to a Web Server (e.g., Apache, Nginx)

### Apache Web Server

1. Copy all files to your web server's document root (e.g., `/var/www/html/`):

```bash
cp -r * /var/www/html/
```

2. Make sure Apache is configured to serve index.html by default.

3. Ensure proper file permissions:

```bash
chmod -R 755 /var/www/html/
```

### Nginx Web Server

1. Copy all files to your web server's document root (e.g., `/usr/share/nginx/html/`):

```bash
cp -r * /usr/share/nginx/html/
```

2. Configure Nginx to serve index.html by default:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Restart Nginx:

```bash
sudo systemctl restart nginx
```

## Option 4: Deploying to a Node.js Host (e.g., Heroku, DigitalOcean)

### Heroku Deployment

1. Sign up for a [Heroku](https://www.heroku.com/) account if you don't have one.
2. Install the Heroku CLI:

```bash
npm install -g heroku
```

3. Log in to Heroku:

```bash
heroku login
```

4. Create a new Heroku app:

```bash
heroku create your-app-name
```

5. Push your code to Heroku:

```bash
git push heroku main
```

### DigitalOcean Deployment

1. Sign up for a [DigitalOcean](https://www.digitalocean.com/) account if you don't have one.
2. Create a new Droplet (select a Node.js App option if available).
3. Connect to your Droplet via SSH.
4. Clone your repository to the server.
5. Install dependencies:

```bash
npm install --production
```

6. Start the server:

```bash
npm start
```

7. For production, consider using PM2 to manage your Node.js application:

```bash
npm install -g pm2
pm2 start server.js --name "realestate-admin"
pm2 save
pm2 startup
```

## SSL Configuration

For production deployments, it's recommended to enable HTTPS:

1. Obtain an SSL certificate (Let's Encrypt provides free certificates).
2. Configure your web server to use HTTPS.
3. Update any hardcoded URLs in your application to use `https://` instead of `http://`.

## Environment Variables

No environment variables are required for this application by default. If you want to run the server on a specific port, you can set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Post-Deployment Checklist

- [ ] Verify that all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Ensure all charts and data visualizations work properly
- [ ] Test form submissions
- [ ] Verify file uploads (if applicable)
- [ ] Check browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Review console for any errors or warnings

## Troubleshooting

### Issue: Server doesn't start

Check if the port is already in use. Try changing the port:

```bash
PORT=3001 npm start
```

### Issue: Static files not loading

Ensure that paths to CSS, JS, and image files are correct. If you're serving from a subdirectory, you might need to update paths in HTML files.

### Issue: Charts not displaying

Make sure Chart.js is loading correctly. Check browser console for any errors.

## Support

If you encounter any issues with deployment, please open an issue on the repository or contact support at contact@realestatecompany.com. 