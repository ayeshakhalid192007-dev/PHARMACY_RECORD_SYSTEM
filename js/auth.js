// ============ AUTHENTICATION MODULE ============
// Handles Logins, Signups, and Logouts

let currentUser = null;

// 1. Initialize Auth
function initAuth() {
    // Check if user is already logged in (saved in browser)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateAuthUI();
    }

    // Attach Click Events to Buttons
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// 2. Show Login Window
function showLoginModal() {
    const modalContent = `
        <div class="modal-header">
            <h2>Login</h2>
            <button class="close-modal" onclick="closeModal()">×</button>
        </div>
        <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="showRegisterModal()">Register New Account</button>
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
        </form>
    `;
    showModal(modalContent);
}

// 3. Show Register Window
function showRegisterModal() {
    const modalContent = `
        <div class="modal-header">
            <h2>Create Account</h2>
            <button class="close-modal" onclick="closeModal()">×</button>
        </div>
        <form id="registerForm" onsubmit="handleRegister(event)">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <div class="form-group">
                <label>Account Type</label>
                <select name="role" required>
                    <option value="Customer">Customer (I want to buy)</option>
                    <option value="Staff">Staff (I work here)</option>
                    <option value="Admin">Admin (I own the place)</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="showLoginModal()">Back to Login</button>
                <button type="submit" class="btn btn-primary">Sign Up</button>
            </div>
        </form>
    `;
    showModal(modalContent);
}

// 4. Handle Login Logic
function handleLogin(event) {
    event.preventDefault(); // Stop page refresh

    // Get input values
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    // Check database
    const user = db.findUser(username, password);

    if (user) {
        // Success! Save user
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        updateAuthUI();
        closeModal();
        showNotification('Login successful!', 'success');

        // Go to appropriate page
        if (user.role === 'Customer') {
            navigateTo('home');
        } else {
            navigateTo('dashboard');
        }
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

// 5. Handle Register Logic
function handleRegister(event) {
    event.preventDefault();

    const form = event.target;

    // Create new user object
    const newUser = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value
    };

    // Save to database
    db.addUser(newUser);

    showNotification('Account created! Please login.', 'success');
    showLoginModal();
}

// 6. Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
    navigateTo('home');
}

// 7. Update UI based on User Role
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    // Hide all special links first
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.customer-only').forEach(el => el.style.display = 'none');

    if (currentUser) {
        // User is Logged In
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = `${currentUser.username} (${currentUser.role})`;

        // Show links based on Role
        if (currentUser.role === 'Admin' || currentUser.role === 'Staff' || currentUser.role === 'Pharmacist') {
            document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        } else if (currentUser.role === 'Customer') {
            document.querySelectorAll('.customer-only').forEach(el => el.style.display = 'block');
        }
    } else {
        // User is Guest (Not Logged In)
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
        // Only Home page is visible by default structure
    }
}

// 8. Protect Pages (Check before showing)
function requireAuth() {
    if (!currentUser) {
        showNotification('Please login to access this feature', 'warning');
        showLoginModal();
        return false;
    }
    return true;
}
