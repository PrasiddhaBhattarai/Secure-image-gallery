// DOM Elements
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordMessage = document.getElementById('changePasswordMessage');

// Password regex pattern for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

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

// Handle change password form submission
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        changePasswordMessage.textContent = '';
        changePasswordMessage.className = 'message';
        
        // Get form data
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        
        // Validate new password
        if (!passwordRegex.test(newPassword)) {
            changePasswordMessage.textContent = 'Password must be 8-15 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.';
            changePasswordMessage.className = 'message error';
            return;
        }
        
        try {
            // Send change password request
            const response = await apiRequest('/api/auth/change-password', 'POST', { 
                currentPassword, 
                newPassword 
            });
            
            // Handle successful password change
            if (response.success) {
                // Show success message
                changePasswordMessage.textContent = 'Password changed successfully!';
                changePasswordMessage.className = 'message success';
                
                // Clear form
                changePasswordForm.reset();
            }
        } catch (error) {
            // Handle error
            changePasswordMessage.textContent = error.message || 'Failed to change password. Please try again.';
            changePasswordMessage.className = 'message error';
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndRedirect();
}); 