// DOM Elements
const heroButtons = document.querySelector('.hero-buttons');

// Update hero buttons based on authentication status
async function updateHeroButtons() {
    try {
        // Try to access a protected endpoint
        const response = await apiRequest('/api/home/welcome', 'GET');
        
        if (response.success) {
            // User is logged in, show dashboard button
            const authButtons = heroButtons.querySelectorAll('.auth-link');
            authButtons.forEach(button => button.style.display = 'none');
            
            const userButtons = heroButtons.querySelectorAll('.user-link');
            userButtons.forEach(button => button.style.display = 'inline-block');
        } else {
            // User is not logged in, show auth buttons
            const authButtons = heroButtons.querySelectorAll('.auth-link');
            authButtons.forEach(button => button.style.display = 'inline-block');
            
            const userButtons = heroButtons.querySelectorAll('.user-link');
            userButtons.forEach(button => button.style.display = 'none');
        }
    } catch (error) {
        // User is not logged in, show auth buttons
        const authButtons = heroButtons.querySelectorAll('.auth-link');
        authButtons.forEach(button => button.style.display = 'inline-block');
        
        const userButtons = heroButtons.querySelectorAll('.user-link');
        userButtons.forEach(button => button.style.display = 'none');
    }
}

// Initialize home page
document.addEventListener('DOMContentLoaded', async () => {
    if (heroButtons) {
        await updateHeroButtons();
    }
}); 