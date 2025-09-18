// Application state
let isLoggedIn = false;
let todoItems = [];
let timerInterval = null;
let githubToken = '';

// Shared gist configuration - everyone uses the same gist
const SHARED_GIST_ID = 'YOUR_SHARED_GIST_ID_HERE'; // Replace with actual gist ID

// Simple password for authentication (in a real app, this would be handled server-side)
const ADMIN_PASSWORD = "admin123";

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GIST_FILENAME = 'swags-todo-list.json';

// DOM elements
const loginBtn = document.getElementById('login-btn');
const addItemBtn = document.getElementById('add-item-btn');
const syncBtn = document.getElementById('sync-btn');
const gistSettingsBtn = document.getElementById('gist-settings-btn');
const loginModal = document.getElementById('login-modal');
const addItemModal = document.getElementById('add-item-modal');
const gistConfigModal = document.getElementById('gist-config-modal');
const loginForm = document.getElementById('login-form');
const addItemForm = document.getElementById('add-item-form');
const gistConfigForm = document.getElementById('gist-config-form');
const todoItemsList = document.getElementById('todo-items');
const passwordInput = document.getElementById('password');
const newItemInput = document.getElementById('new-item-text');
const githubTokenInput = document.getElementById('github-token');
const syncStatus = document.getElementById('sync-status');
const clearConfigBtn = document.getElementById('clear-config-btn');

// Initialize the application
function init() {
    setupEventListeners();
    loadGistConfig();
    loadTodoItems();
    renderTodoItems();
    startTimers();
    updateSyncButton();
    
    // Auto-load from shared gist if token is available
    if (githubToken && SHARED_GIST_ID !== 'YOUR_SHARED_GIST_ID_HERE') {
        syncFromGist();
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Login button
    loginBtn.addEventListener('click', handleLoginClick);
    
    // Add item button
    addItemBtn.addEventListener('click', showAddItemModal);
    
    // Sync button
    syncBtn.addEventListener('click', handleSyncClick);
    
    // Gist settings button
    gistSettingsBtn.addEventListener('click', showGistConfigModal);
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    addItemForm.addEventListener('submit', handleAddItem);
    gistConfigForm.addEventListener('submit', handleGistConfig);
    
    // Clear config button
    clearConfigBtn.addEventListener('click', clearGistConfig);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModals);
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModals();
        }
    });
}

// Handle login button click
function handleLoginClick() {
    if (isLoggedIn) {
        logout();
    } else {
        showLoginModal();
    }
}

// Show login modal
function showLoginModal() {
    loginModal.classList.remove('hidden');
    passwordInput.focus();
}

// Show add item modal
function showAddItemModal() {
    addItemModal.classList.remove('hidden');
    newItemInput.focus();
}

// Close all modals
function closeModals() {
    loginModal.classList.add('hidden');
    addItemModal.classList.add('hidden');
    gistConfigModal.classList.add('hidden');
    passwordInput.value = '';
    newItemInput.value = '';
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    const password = passwordInput.value;
    
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        updateLoginButton();
        enableCheckboxes();
        closeModals();
        showNotification('Successfully logged in!', 'success');
    } else {
        showNotification('Incorrect password. Please try again.', 'error');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Handle logout
function logout() {
    isLoggedIn = false;
    updateLoginButton();
    disableCheckboxes();
    showNotification('Logged out successfully.', 'info');
}

// Update login button appearance
function updateLoginButton() {
    if (isLoggedIn) {
        loginBtn.textContent = 'Logout';
        loginBtn.classList.remove('btn-secondary');
        loginBtn.classList.add('logged-in');
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('logged-in');
        loginBtn.classList.add('btn-secondary');
    }
}

// Handle add item form submission
function handleAddItem(e) {
    e.preventDefault();
    const text = newItemInput.value.trim();
    
    if (text) {
        const newItem = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date()
        };
        
        todoItems.push(newItem);
        saveTodoItems();
        renderTodoItems();
        closeModals();
        showNotification('Item added successfully!', 'success');
        
        // Auto-sync to gist if configured
        if (githubToken && SHARED_GIST_ID !== 'YOUR_SHARED_GIST_ID_HERE') {
            syncToGist();
        }
    }
}

// Toggle item completion
function toggleItem(id) {
    if (!isLoggedIn) {
        showNotification('Please login to check off items.', 'warning');
        return;
    }
    
    const item = todoItems.find(item => item.id === id);
    if (item) {
        item.completed = !item.completed;
        saveTodoItems();
        renderTodoItems();
        
        const action = item.completed ? 'completed' : 'unchecked';
        showNotification(`Item ${action}!`, 'success');
        
        // Auto-sync to gist if configured
        if (githubToken && SHARED_GIST_ID !== 'YOUR_SHARED_GIST_ID_HERE') {
            syncToGist();
        }
    }
}

// Render all todo items
function renderTodoItems() {
    todoItemsList.innerHTML = '';
    
    if (todoItems.length === 0) {
        todoItemsList.innerHTML = '<li class="empty-state">No items yet. Add your first item!</li>';
        return;
    }
    
    todoItems.forEach(item => {
        const li = document.createElement('li');
        li.className = `todo-item ${item.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${item.completed ? 'checked' : ''} 
                ${!isLoggedIn ? 'disabled' : ''}
                onchange="toggleItem(${item.id})"
            >
            <span class="todo-text">${escapeHtml(item.text)}</span>
            <span class="todo-timer" data-created="${item.createdAt}">${getTimeElapsed(item.createdAt)}</span>
        `;
        
        todoItemsList.appendChild(li);
    });
}

// Enable checkboxes when logged in
function enableCheckboxes() {
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.disabled = false;
    });
}

// Disable checkboxes when logged out
function disableCheckboxes() {
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.disabled = true;
    });
}

// Save todo items to localStorage
function saveTodoItems() {
    localStorage.setItem('swags-todo-items', JSON.stringify(todoItems));
}

// Load todo items from localStorage
function loadTodoItems() {
    const saved = localStorage.getItem('swags-todo-items');
    if (saved) {
        try {
            todoItems = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading saved items:', e);
            todoItems = [];
        }
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification (simple implementation)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1001',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        warning: '#d69e2e',
        info: '#3182ce'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);

// GitHub Gist Integration
function handleSyncClick() {
    if (!githubToken) {
        showGistConfigModal();
    } else if (SHARED_GIST_ID === 'YOUR_SHARED_GIST_ID_HERE') {
        showNotification('Shared gist not configured. Please update SHARED_GIST_ID in the code.', 'warning');
    } else {
        syncFromGist();
    }
}

function showGistConfigModal() {
    // Populate current values
    githubTokenInput.value = githubToken || '';
    
    gistConfigModal.classList.remove('hidden');
    githubTokenInput.focus();
}

function handleGistConfig(e) {
    e.preventDefault();
    const token = githubTokenInput.value.trim();
    
    if (token) {
        githubToken = token;
        saveGistConfig();
        updateSyncButton();
        closeModals();
        showNotification('GitHub token saved! Now syncing with shared todo list.', 'success');
        
        // Load from shared gist
        if (SHARED_GIST_ID !== 'YOUR_SHARED_GIST_ID_HERE') {
            syncFromGist();
        }
    }
}

function loadGistConfig() {
    const savedToken = localStorage.getItem('swags-todo-github-token');
    
    if (savedToken) {
        githubToken = savedToken;
    }
}

function saveGistConfig() {
    localStorage.setItem('swags-todo-github-token', githubToken);
}

function clearGistConfig() {
    githubToken = '';
    localStorage.removeItem('swags-todo-github-token');
    githubTokenInput.value = '';
    updateSyncButton();
    closeModals();
    showNotification('GitHub token cleared!', 'info');
}

function updateSyncButton() {
    if (!githubToken) {
        syncStatus.textContent = '⚙️ Configure Token';
        syncBtn.className = 'btn btn-secondary';
        syncBtn.title = 'Click to add your GitHub token';
    } else if (SHARED_GIST_ID === 'YOUR_SHARED_GIST_ID_HERE') {
        syncStatus.textContent = '❌ Not Configured';
        syncBtn.className = 'btn btn-secondary';
        syncBtn.title = 'Shared gist ID not set in code';
    } else {
        syncStatus.textContent = '🔄 Sync Shared List';
        syncBtn.className = 'btn btn-sync';
        syncBtn.title = 'Click to sync with shared todo list';
    }
}

async function syncToGist() {
    if (!githubToken || SHARED_GIST_ID === 'YOUR_SHARED_GIST_ID_HERE') return;
    
    try {
        const gistData = {
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify({
                        todos: todoItems,
                        lastUpdated: new Date().toISOString()
                    }, null, 2)
                }
            }
        };
        
        const response = await fetch(`${GITHUB_API_BASE}/gists/${SHARED_GIST_ID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gistData)
        });
        
        if (response.ok) {
            showNotification('✅ Synced to shared list!', 'success');
        } else {
            const errorText = await response.text();
            throw new Error(`Failed to sync: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error syncing to gist:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            showNotification('Authentication failed. Please reconfigure your GitHub token.', 'error');
        } else {
            showNotification('Failed to sync to GitHub. Check your connection.', 'error');
        }
    }
}

async function syncFromGist() {
    if (!githubToken || SHARED_GIST_ID === 'YOUR_SHARED_GIST_ID_HERE') return;
    
    try {
        syncStatus.textContent = '📥 Loading...';
        
        const response = await fetch(`${GITHUB_API_BASE}/gists/${SHARED_GIST_ID}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const gist = await response.json();
            const fileContent = gist.files[GIST_FILENAME];
            
            if (fileContent) {
                const data = JSON.parse(fileContent.content);
                todoItems = data.todos || [];
                saveTodoItems();
                renderTodoItems();
                showNotification('📥 Loaded shared todo list!', 'success');
            } else {
                showNotification('No todo data found in shared gist.', 'warning');
            }
        } else {
            const errorText = await response.text();
            throw new Error(`Failed to load gist: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error loading from gist:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
            showNotification('Authentication failed. Please reconfigure your GitHub token.', 'error');
        } else if (error.message.includes('404')) {
            showNotification('Shared gist not found. Please check the gist ID.', 'error');
        } else {
            showNotification('Failed to load from GitHub. Check your connection.', 'error');
        }
    } finally {
        updateSyncButton();
    }
}

// Timer functionality
function startTimers() {
    // Clear existing interval if any
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Update timers every second
    timerInterval = setInterval(updateTimers, 1000);
}

function updateTimers() {
    document.querySelectorAll('.todo-timer').forEach(timer => {
        const createdAt = timer.getAttribute('data-created');
        timer.textContent = getTimeElapsed(createdAt);
    });
}

function getTimeElapsed(createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    
    // Convert to seconds, minutes, hours, days
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}
