// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Toggle password visibility
if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle the eye icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        loginMessage.textContent = '';
        loginMessage.className = 'message';
        
        // Get form data
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            // Send login request
            const response = await apiRequest('/api/auth/login', 'POST', { username, password });
            
            // Handle successful login
            if (response.success) {
                // Store user info in localStorage (not the token)
                localStorage.setItem('user', JSON.stringify(response.user));
                
                // Show success message
                loginMessage.textContent = 'Login successful! Redirecting...';
                loginMessage.className = 'message success';
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        } catch (error) {
            // Handle login error
            loginMessage.textContent = error.message || 'Login failed. Please try again.';
            loginMessage.className = 'message error';
        }
    });
}

// Check if user is already logged in
async function checkLoggedIn() {
    try {
        // Try to access a protected endpoint
        const response = await apiRequest('/api/home/welcome', 'GET');
        if (response.success) {
            // User is logged in
            return true;
        }
    } catch (error) {
        // User is not logged in
        return false;
    }
    return false;
}

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = await checkLoggedIn();
    if (isLoggedIn) {
        window.location.href = '/dashboard';
    }
}); 