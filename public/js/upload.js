// DOM Elements
const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('imagePreview');
const uploadMessage = document.getElementById('uploadMessage');

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

// Show image preview
if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = '';
        }
    });
}

// Handle upload form submission
if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        uploadMessage.textContent = 'Image is being uploaded...';
        uploadMessage.className = 'message';
        
        const file = imageInput.files[0];
        
        if (!file) {
            uploadMessage.textContent = 'Please select an image to upload.';
            uploadMessage.className = 'message error';
            return;
        }
        
        // Create form data
        const formData = new FormData();
        formData.append('image', file);
        
        try {
            // Custom fetch for file upload
            const response = await fetch('/api/image/upload', {
                method: 'POST',
                credentials: 'include', // Include cookies in the request
                body: formData
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }
            
            // Handle successful upload
            if (result.success) {
                // Show success message
                uploadMessage.textContent = 'Image uploaded successfully!';
                uploadMessage.className = 'message success';
                
                // Clear form and preview
                uploadForm.reset();
                imagePreview.innerHTML = '';
                
                // Redirect to admin page after a delay
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 2000);
            }
        } catch (error) {
            // Handle upload error
            uploadMessage.textContent = error.message || 'Upload failed. Please try again.';
            uploadMessage.className = 'message error';
        }
    });
}

// Initialize upload page
document.addEventListener('DOMContentLoaded', async () => {
    if (await checkAdminAndRedirect()) {
        // Page is ready for upload
    }
}); 