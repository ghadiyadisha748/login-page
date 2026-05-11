/**
 * NexAuth - Futuristic Authentication System
 * JavaScript Logic for View Switching, Validation, and Persistence
 */

// --- Global Constants & Selectors ---
const statusMessage = document.getElementById('status-message');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const views = document.querySelectorAll('.form-view');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if there is a "session" or last logged user (optional mockup)
    console.log('NexAuth System Initialized');
});

// --- View Switching Logic ---
/**
 * Switches between 'signin-view' and 'signup-view'
 * @param {string} viewId - ID of the view to activate
 */
function switchView(viewId) {
    // Clear any existing messages
    clearMessage();
    
    // Deactivate all views
    views.forEach(view => view.classList.remove('active'));
    
    // Activate target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        // Refresh icons if needed (Lucide)
        if (window.lucide) lucide.createIcons();
    }
}

// --- UI Helpers ---
/**
 * Toggles visibility of a password input
 * @param {string} inputId - ID of the password input
 * @param {HTMLElement} iconElement - The icon element clicked
 */
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    
    // Update icon (Lucide)
    const iconName = isPassword ? 'eye-off' : 'eye';
    iconElement.setAttribute('data-lucide', iconName);
    if (window.lucide) lucide.createIcons();
}

/**
 * Displays a status message (success/error)
 * @param {string} text - Message text
 * @param {string} type - 'error' or 'success'
 */
function showMessage(text, type) {
    statusMessage.textContent = text;
    statusMessage.className = `message ${type}`;
    
    // Auto-scroll to top of card if long form
    statusMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearMessage() {
    statusMessage.className = 'message';
    statusMessage.textContent = '';
}

// --- Form Validation & Submission ---

// Sign Up Handler
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    // 1. Validate Email format (basic)
    if (!validateEmail(email)) {
        return showMessage('Please enter a valid email address.', 'error');
    }

    // 2. Validate Password Match
    if (password !== confirm) {
        return showMessage('Passwords do not match. Please check again.', 'error');
    }

    // 3. Persist User in localStorage
    const users = JSON.parse(localStorage.getItem('nexauth_users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return showMessage('An account with this email already exists.', 'error');
    }

    // Store new user
    users.push({ name, email, password });
    localStorage.setItem('nexauth_users', JSON.stringify(users));

    showMessage('Account created successfully! Redirecting to Sign In...', 'success');
    
    // Auto-switch to Sign In after delay
    setTimeout(() => {
        switchView('signin-view');
        // Pre-fill email for convenience
        document.getElementById('signin-email').value = email;
    }, 2000);
});

// Sign In Handler
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // 1. Fetch Users from localStorage
    const users = JSON.parse(localStorage.getItem('nexauth_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        showMessage(`Welcome back, ${user.name}! Access granted.`, 'success');
        
        // Simulation: Redirect or update UI
        if (rememberMe) {
            localStorage.setItem('nexauth_session', JSON.stringify({ email: user.email, timestamp: Date.now() }));
        }
    } else {
        showMessage('Invalid email or password. Please try again.', 'error');
    }
});

// --- Utilities ---
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Social Login Simulation
document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.getAttribute('title');
        showMessage(`Redirecting to ${provider} authentication...`, 'success');
    });
});
