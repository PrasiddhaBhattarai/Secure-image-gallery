// DOM Elements
const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Password regex pattern for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

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

// Handle register form submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        registerMessage.textContent = '';
        registerMessage.className = 'message';
        
        // Get form data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate password
        if (!passwordRegex.test(password)) {
            registerMessage.textContent = 'Password must be 8-15 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.';
            registerMessage.className = 'message error';
            return;
        }
        
        try {
            // Send register request
            const response = await apiRequest('/api/auth/register', 'POST', { 
                username, 
                email, 
                password,
                role: 'user' // Default role
            });
            
            // Handle successful registration
            if (response.success) {
                // Show success message
                registerMessage.textContent = 'Registration successful! Redirecting to login...';
                registerMessage.className = 'message success';
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        } catch (error) {
            // Handle registration error
            registerMessage.textContent = error.message || 'Registration failed. Please try again.';
            registerMessage.className = 'message error';
        }
    });
}

// Redirect if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard';
    }
}); 