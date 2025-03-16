// DOM Elements
const adminImageGallery = document.getElementById('adminImageGallery');
const adminUsername = document.getElementById('adminUsername');
adminUsername.textContent = JSON.parse(localStorage.getItem('user')).username;
// Check if user is admin and redirect if not
async function checkAdminAndRedirect() {
    try {
        // Try to access the admin welcome endpoint
        const response = await apiRequest('/api/admin/welcome', 'GET');
        

        if (response.success) {
            return true;
        }
    } catch (error) {
        // Check if user is logged in but not admin
        try {
            const userResponse = await apiRequest('/api/home/welcome', 'GET');
            if (userResponse.success) {
                // User is logged in but not admin
                window.location.href = '/dashboard';
            } else {
                // User is not logged in
                window.location.href = '/login';
            }
        } catch (error) {
            // User is not logged in
            window.location.href = '/login';
        }
        return false;
    }
    return false;
}

// Load images with delete functionality
async function loadAdminImages() {
    if (adminImageGallery) {
        try {
            const response = await apiRequest('/api/image/get', 'GET');

            if (response.success && response.images && response.images.length > 0) {
                // Clear loading text
                adminImageGallery.innerHTML = '';

                // Display images with delete button
                response.images.forEach(image => {
                    const uploaderId = JSON.parse(localStorage.getItem('user'))._id;
                    // images uploaded by current admin is only displayed
                    if (image.uploadedBy.toString() === uploaderId.toString()) {
                        const imageItem = document.createElement('div');
                        imageItem.className = 'gallery-item';
                        imageItem.dataset.id = image._id;


                        const img = document.createElement('img');
                        img.src = image.url;
                        img.alt = image.originalname || 'Image';

                        const actions = document.createElement('div');
                        actions.className = 'gallery-actions';

                        const deleteBtn = document.createElement('button');
                        deleteBtn.innerHTML = '🗑️';
                        deleteBtn.title = 'Delete Image';
                        deleteBtn.addEventListener('click', () => deleteImage(image._id));

                        actions.appendChild(deleteBtn);
                        imageItem.appendChild(img);
                        imageItem.appendChild(actions);
                        adminImageGallery.appendChild(imageItem);
                    }
                });
            } else {
                adminImageGallery.innerHTML = '<p class="no-images">No images found. Upload some images to get started.</p>';
            }
        } catch (error) {
            console.error('Error loading images:', error);
            adminImageGallery.innerHTML = '<p class="error-text">Failed to load images.</p>';
        }
    }
}

// Delete image
async function deleteImage(imageId) {
    if (!imageId) return;

    if (confirm('Are you sure you want to delete this image?')) {
        try {
            const response = await apiRequest(`/api/image/delete/${imageId}`, 'DELETE');

            if (response.success) {
                // Remove image from DOM
                const imageElement = document.querySelector(`.gallery-item[data-id="${imageId}"]`);
                if (imageElement) {
                    imageElement.remove();
                }

                // Check if gallery is empty
                if (adminImageGallery.children.length === 0) {
                    adminImageGallery.innerHTML = '<p class="no-images">No images found. Upload some images to get started.</p>';
                }
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image. Please try again.');
        }
    }
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', async () => {
    if (await checkAdminAndRedirect()) {
        await loadAdminImages();
    }
}); 