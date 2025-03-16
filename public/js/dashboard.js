// DOM Elements
const usernameElement = document.getElementById('username');
const profileUsername = document.getElementById('profileUsername');
const profileEmail = document.getElementById('profileEmail');
const profileRole = document.getElementById('profileRole');
const profileCreated = document.getElementById('profileCreated');
const imageGallery = document.getElementById('imageGallery');

// Check authentication and redirect if not logged in
async function checkAuthAndRedirect() {
    try {
        // Try to access a protected endpoint
        const response = await apiRequest('/api/home/welcome', 'GET');
        if (response.success) {
            return true;
        }
    } catch (error) {
        // User is not logged in, redirect to login page
        window.location.href = '/login';
        return false;
    }
    return false;
}

// Load user profile data
async function loadUserProfile() {
    try {
        // Get user data from the welcome endpoint
        const response = await apiRequest('/api/home/welcome', 'GET');
        
        if (response.success) {
            const user = response.user;
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            
            // Display username
            if (usernameElement) {
                usernameElement.textContent = user.username || 'User';
            }
            
            // Display profile info
            if (profileUsername) {
                profileUsername.textContent = user.username || 'N/A';
            }
            
            if (profileEmail) {
                profileEmail.textContent = user.email || 'N/A';
            }
            
            if (profileRole) {
                profileRole.textContent = user.role || 'user';
            }
            
            if (profileCreated) {
                profileCreated.textContent = user.createdAt ? new Date(user.createdAt).toLocaleString().split(",")[0] : 'N/A';
            }
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Load images
async function loadImages() {
    if (imageGallery) {
        try {
            const response = await apiRequest('/api/image/get', 'GET');
            
            if (response.success && response.images && response.images.length > 0) {
                // Clear loading text
                imageGallery.innerHTML = '';
                
                // Display images
                response.images.forEach(image => {
                    const imageItem = document.createElement('div');
                    imageItem.className = 'gallery-item';
                    
                    const img = document.createElement('img');
                    img.src = image.url;
                    img.alt = image.originalname || 'Image';
                    
                    imageItem.appendChild(img);
                    imageGallery.appendChild(imageItem);
                });
            } else {
                imageGallery.innerHTML = '<p class="no-images">No images found.</p>';
            }
        } catch (error) {
            console.error('Error loading images:', error);
            imageGallery.innerHTML = '<p class="error-text">Failed to load images.</p>';
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    if (await checkAuthAndRedirect()) {
        await loadUserProfile();
        await loadImages();
    }
}); 