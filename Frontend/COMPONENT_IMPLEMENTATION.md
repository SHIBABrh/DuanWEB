# Component Implementation Guide

This document explains how to implement the header and sidebar components across all HTML files in the project.

## Step 1: Component Files

The following component files have been created:

1. `components/header.html` - Contains the header navigation bar
2. `components/sidebar.html` - Contains the sidebar menu

## Step 2: Component Loading Script

A JavaScript file has been created to load these components:

- `js/components.js` - Handles loading and activating the components

## Step 3: Update HTML Files

For each HTML file in the project, make the following changes:

### 1. Add Component Script Import

Add this line before the closing `</head>` tag:

```html
<script src="js/components.js"></script>
```

### 2. Replace Sidebar

Replace the entire sidebar section:

```html
<!-- Sidebar -->
<aside class="sidebar" id="sidebar">
    <!-- ... all sidebar content ... -->
</aside>
```

With:

```html
<!-- Sidebar Component -->
<div id="sidebar"></div>
```

### 3. Replace Header

Replace the entire header section:

```html
<!-- Top Navigation Bar -->
<header class="topbar">
    <!-- ... all header content ... -->
</header>
```

With:

```html
<!-- Header Component -->
<div id="header"></div>
```

## Files To Update

The following files need to be updated:
- dashboard.html
- users.html
- properties.html
- categories.html
- orders.html
- payments.html
- media.html
- reviews.html
- reports.html
- settings.html
- index.html

## Benefits of This Approach

1. **Maintainability**: Changes to the header or sidebar can be made in one place
2. **Consistency**: All pages will have the same header and sidebar
3. **Reduced Duplication**: No more copy-pasting of header and sidebar code
4. **Active Menu Highlighting**: The active menu item is automatically highlighted based on the current page

If you need to make changes to the header or sidebar in the future, you only need to edit the component files rather than updating each HTML file individually. 