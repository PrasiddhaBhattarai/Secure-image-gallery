// DOM Elements
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const logoutBtn = document.getElementById('logoutBtn');
const authLinks = document.querySelectorAll('.auth-link');
const userLinks = document.querySelectorAll('.user-link');
const adminLinks = document.querySelectorAll('.admin-link');

// Check if user is logged in
async function checkAuth() {
    try {
        // Try to access a protected endpoint
        const response = await apiRequest('/api/home/welcome', 'GET');
        
        if (response.success) {
            // User is logged in
            const user = response.user;
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update UI
            authLinks.forEach(link => link.style.display = 'none');
            userLinks.forEach(link => link.style.display = 'block');
            
            // Check if user is admin
            if (user.role === 'admin') {
                adminLinks.forEach(link => link.style.display = 'block');
            } else {
                adminLinks.forEach(link => link.style.display = 'none');
            }
            
            return true;
        }
    } catch (error) {
        // User is not logged in
        authLinks.forEach(link => link.style.display = 'block');
        userLinks.forEach(link => link.style.display = 'none');
        adminLinks.forEach(link => link.style.display = 'none');
        
        // Clear user info from localStorage
        localStorage.removeItem('user');
        
        return false;
    }
}

// Toggle navigation menu for mobile
function toggleNav() {
    navLinks.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    navOverlay.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
    
    // Animate Links
    const navItems = document.querySelectorAll('.nav-links li');
    navItems.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

// Logout function
async function logout() {
    try {
        // Send logout request to clear the cookie
        const response = await apiRequest('/api/auth/logout', 'POST');
        
        if (response.success) {
            // Clear user info from localStorage
            localStorage.removeItem('user');
            
            // Redirect to home page
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Redirect to home page anyway
        window.location.href = '/';
    }
}

// Event Listeners
if (burger) {
    burger.addEventListener('click', toggleNav);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Close menu when clicking overlay
if (navOverlay) {
    navOverlay.addEventListener('click', toggleNav);
}

// API Request Helper
async function apiRequest(url, method = 'GET', data = null) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const options = {
            method,
            headers,
            credentials: 'include' // Include cookies in the request
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', checkAuth); 