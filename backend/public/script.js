document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    
    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginForm);
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', showSignupForm);
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', showForgotPasswordForm);
    }
    
    // Form submission handlers
    handleLoginFormSubmission();
    handleSignupFormSubmission();
    handleForgotPasswordFormSubmission();
    handleOTPVerificationFormSubmission();
    handleResetPasswordFormSubmission();
});

// Show login form
function showLoginForm() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Login</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showLandingPage()">Back</button>
                        <button type="submit" class="btn btn-submit">Login</button>
                    </div>
                </form>
                <div class="form-footer">
                    <p>Don't have an account? <a href="#" onclick="showSignupForm()">Sign Up</a></p>
                    <p><a href="#" onclick="showForgotPasswordForm()">Forgot Password?</a></p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleLoginFormSubmission();
}

// Show signup form
function showSignupForm() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Sign Up</h2>
                <form id="signupForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showLandingPage()">Back</button>
                        <button type="submit" class="btn btn-submit">Sign Up</button>
                    </div>
                </form>
                <div class="form-footer">
                    <p>Already have an account? <a href="#" onclick="showLoginForm()">Login</a></p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleSignupFormSubmission();
}

// Show forgot password form
function showForgotPasswordForm() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Forgot Password</h2>
                <form id="forgotPasswordForm">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showLandingPage()">Back</button>
                        <button type="submit" class="btn btn-submit">Send Reset Link</button>
                    </div>
                </form>
                <div class="form-footer">
                    <p>Remember your password? <a href="#" onclick="showLoginForm()">Login</a></p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleForgotPasswordFormSubmission();
}

// Show OTP verification form
function showOTPVerificationForm(signupToken) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Verify OTP</h2>
                <p>Please check your email for the verification code.</p>
                <form id="otpVerificationForm">
                    <input type="hidden" id="signupToken" name="signupToken" value="${signupToken}">
                    <div class="form-group">
                        <label for="otp">Verification Code</label>
                        <input type="text" id="otp" name="otp" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showSignupForm()">Back</button>
                        <button type="submit" class="btn btn-submit">Verify</button>
                    </div>
                </form>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleOTPVerificationFormSubmission();
}

// Show reset password OTP verification form
function showResetPasswordOTPForm(resetToken) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Verify Reset OTP</h2>
                <p>Please check your email for the reset code.</p>
                <form id="resetPasswordOTPForm">
                    <input type="hidden" id="resetToken" name="resetToken" value="${resetToken}">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="otp">Verification Code</label>
                        <input type="text" id="otp" name="otp" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showForgotPasswordForm()">Back</button>
                        <button type="submit" class="btn btn-submit">Verify</button>
                    </div>
                </form>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleResetPasswordOTPFormSubmission();
}

// Show reset password form
function showResetPasswordForm(resetToken, email) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <header>
            <h1>DobiTracker</h1>
            <p>Android Notification Capture System</p>
        </header>
        
        <main>
            <div class="form-container">
                <h2>Reset Password</h2>
                <form id="resetPasswordForm">
                    <input type="hidden" id="resetToken" name="resetToken" value="${resetToken}">
                    <input type="hidden" id="email" name="email" value="${email}">
                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input type="password" id="newPassword" name="newPassword" required>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-back" onclick="showForgotPasswordForm()">Back</button>
                        <button type="submit" class="btn btn-submit">Reset Password</button>
                    </div>
                </form>
            </div>
        </main>
        
        <footer>
            <p>&copy; 2025 DobiTracker. All rights reserved.</p>
        </footer>
    `;
    
    handleResetPasswordFormSubmission();
}

// Show landing page
function showLandingPage() {
    window.location.reload();
}

// Handle login form submission
function handleLoginFormSubmission() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful login
            console.log('Login attempt with:', { email, password });
            
            // Simulate API call
            fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Store token in localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect to dashboard
                    showDashboard();
                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            });
        });
    }
}

// Handle signup form submission
function handleSignupFormSubmission() {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful signup
            console.log('Signup attempt with:', { name, email, password });
            
            // Simulate API call
            fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.signupToken) {
                    // Show OTP verification form
                    showOTPVerificationForm(data.signupToken);
                } else {
                    alert('Signup failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
                alert('Signup failed. Please try again.');
            });
        });
    }
}

// Handle forgot password form submission
function handleForgotPasswordFormSubmission() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful request
            console.log('Forgot password request for:', email);
            
            // Simulate API call
            fetch('/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })
            .then(response => response.json())
            .then(data => {
                if (data.resetToken) {
                    // Show OTP verification form
                    showResetPasswordOTPForm(data.resetToken);
                } else {
                    alert('Password reset request failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Password reset request error:', error);
                alert('Password reset request failed. Please try again.');
            });
        });
    }
}

// Handle OTP verification form submission
function handleOTPVerificationFormSubmission() {
    const otpVerificationForm = document.getElementById('otpVerificationForm');
    if (otpVerificationForm) {
        otpVerificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const signupToken = document.getElementById('signupToken').value;
            const otp = document.getElementById('otp').value;
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful verification
            console.log('OTP verification attempt with:', { signupToken, otp });
            
            // Simulate API call
            fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ signupToken, otp })
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    alert('Signup successful! Please login.');
                    showLoginForm();
                } else {
                    alert('OTP verification failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('OTP verification error:', error);
                alert('OTP verification failed. Please try again.');
            });
        });
    }
}

// Handle reset password OTP form submission
function handleResetPasswordOTPFormSubmission() {
    const resetPasswordOTPForm = document.getElementById('resetPasswordOTPForm');
    if (resetPasswordOTPForm) {
        resetPasswordOTPForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const resetToken = document.getElementById('resetToken').value;
            const email = document.getElementById('email').value;
            const otp = document.getElementById('otp').value;
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful verification
            console.log('Reset password OTP verification attempt with:', { resetToken, email, otp });
            
            // Simulate API call
            fetch('/api/auth/verify-password-reset-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp, resetToken })
            })
            .then(response => response.json())
            .then(data => {
                if (data.resetToken) {
                    // Show reset password form
                    showResetPasswordForm(data.resetToken, email);
                } else {
                    alert('OTP verification failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Reset password OTP verification error:', error);
                alert('OTP verification failed. Please try again.');
            });
        });
    }
}

// Handle reset password form submission
function handleResetPasswordFormSubmission() {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const resetToken = document.getElementById('resetToken').value;
            const email = document.getElementById('email').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Check if passwords match
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // In a real application, you would send this to your backend
            // For now, we'll simulate a successful reset
            console.log('Password reset attempt with:', { email, resetToken, newPassword });
            
            // Simulate API call
            fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, resetToken, newPassword })
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    alert('Password reset successful! Please login.');
                    showLoginForm();
                } else {
                    alert('Password reset failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Password reset error:', error);
                alert('Password reset failed. Please try again.');
            });
        });
    }
}

// Show dashboard
function showDashboard() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="dashboard-container">
            <div class="dashboard-header">
                <h1>Dashboard</h1>
                <div class="header-actions">
                    <button class="btn secondary" onclick="refreshAll()">Refresh</button>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="tabs">
                <div class="tab active" onclick="showTab('whatsapp')">WhatsApp</div>
                <div class="tab" onclick="showTab('instagram')">Instagram</div>
                <div class="tab" onclick="showTab('others')">Others</div>
                <div class="tab" onclick="showTab('blog')">Blog</div>
                <div class="tab" onclick="showTab('documents')">Documents</div>
            </div>
            
            <div class="tab-content active" id="whatsapp-tab">
                <div class="notifications-container">
                    <h2>WhatsApp Notifications</h2>
                    <div id="whatsapp-notifications">
                        <div class="loading">Loading notifications...</div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="instagram-tab">
                <div class="notifications-container">
                    <h2>Instagram Notifications</h2>
                    <div id="instagram-notifications">
                        <div class="loading">Loading notifications...</div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="others-tab">
                <div class="notifications-container">
                    <h2>Other Notifications</h2>
                    <div id="others-notifications">
                        <div class="loading">Loading notifications...</div>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="blog-tab">
                <div class="blog-list">
                    <div class="loading">Loading blog posts...</div>
                </div>
            </div>
            
            <div class="tab-content" id="documents-tab">
                <div class="document-content">
                    <h2>Documents</h2>
                    <div id="documents-content">
                        <div class="loading">Loading documents...</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load initial content
    loadNotifications();
    loadBlogPosts();
    loadDocuments();
}

// Show tab
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Refresh notifications if switching to notification tabs
    if (['whatsapp', 'instagram', 'others'].includes(tabName)) {
        loadNotifications();
    }
}

// Load notifications
function loadNotifications() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.deviceId) {
        console.error('User or device ID not found');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Authentication token not found');
        return;
    }

    // Fetch all notifications for the user's device
    fetch(`/api/notifications/fetch-notifications?device_id=${user.deviceId}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.notifications && data.notifications.length > 0) {
            displayNotifications(data.notifications);
        } else {
            displayNoNotifications();
        }
    })
    .catch(error => {
        console.error('Error loading notifications:', error);
        displayNotificationError();
    });
}

// Display notifications in appropriate tabs
function displayNotifications(notifications) {
    // Group notifications by app
    const whatsappNotifications = notifications.filter(n => n.app_name === 'WhatsApp');
    const instagramNotifications = notifications.filter(n => n.app_name === 'Instagram');
    const otherNotifications = notifications.filter(n => 
        n.app_name !== 'WhatsApp' && n.app_name !== 'Instagram'
    );

    // Display WhatsApp notifications
    const whatsappContainer = document.getElementById('whatsapp-notifications');
    if (whatsappNotifications.length > 0) {
        whatsappContainer.innerHTML = whatsappNotifications.map(notification => `
            <div class="notification-item">
                <div class="notification-header">
                    <span class="notification-sender">${notification.sender || 'Unknown'}</span>
                    <span class="notification-time">${new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <div class="notification-message">${notification.message || 'No message content'}</div>
            </div>
        `).join('');
    } else {
        whatsappContainer.innerHTML = '<p class="no-notifications">No WhatsApp notifications found.</p>';
    }

    // Display Instagram notifications
    const instagramContainer = document.getElementById('instagram-notifications');
    if (instagramNotifications.length > 0) {
        instagramContainer.innerHTML = instagramNotifications.map(notification => `
            <div class="notification-item">
                <div class="notification-header">
                    <span class="notification-sender">${notification.sender || 'Unknown'}</span>
                    <span class="notification-time">${new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <div class="notification-message">${notification.message || 'No message content'}</div>
            </div>
        `).join('');
    } else {
        instagramContainer.innerHTML = '<p class="no-notifications">No Instagram notifications found.</p>';
    }

    // Display other notifications
    const othersContainer = document.getElementById('others-notifications');
    if (otherNotifications.length > 0) {
        othersContainer.innerHTML = otherNotifications.map(notification => `
            <div class="notification-item">
                <div class="notification-header">
                    <span class="notification-app">${notification.app_name}</span>
                    <span class="notification-sender">${notification.sender || 'Unknown'}</span>
                    <span class="notification-time">${new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <div class="notification-message">${notification.message || 'No message content'}</div>
            </div>
        `).join('');
    } else {
        othersContainer.innerHTML = '<p class="no-notifications">No other notifications found.</p>';
    }
}

// Display no notifications message
function displayNoNotifications() {
    const containers = ['whatsapp-notifications', 'instagram-notifications', 'others-notifications'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p class="no-notifications">No notifications found. Make sure your Android app is running and capturing notifications.</p>';
        }
    });
}

// Display notification error
function displayNotificationError() {
    const containers = ['whatsapp-notifications', 'instagram-notifications', 'others-notifications'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p class="error-message">Error loading notifications. Please try again later.</p>';
        }
    });
}

// Load blog posts
function loadBlogPosts() {
    const token = localStorage.getItem('token');
    
    fetch('/api/blogs', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const blogList = document.querySelector('.blog-list');
        if (data.blogs && data.blogs.length > 0) {
            blogList.innerHTML = data.blogs.map(blog => `
                <div class="blog-card" onclick="loadBlogPost(${blog.id})">
                    <img src="${blog.featured_image_url || 'https://via.placeholder.com/300x200'}" alt="${blog.title}" class="blog-image">
                    <div class="blog-content">
                        <h3 class="blog-title">${blog.title}</h3>
                        <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            blogList.innerHTML = '<p>No blog posts available.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading blog posts:', error);
        document.querySelector('.blog-list').innerHTML = '<p class="error-message">Error loading blog posts. Please try again later.</p>';
    });
}

// Load blog post
function loadBlogPost(id) {
    const token = localStorage.getItem('token');
    
    fetch(`/api/blogs/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.blog) {
            const blogTab = document.getElementById('blog-tab');
            blogTab.innerHTML = `
                <div class="blog-post">
                    <h1>${data.blog.title}</h1>
                    <img src="${data.blog.featured_image_url || 'https://via.placeholder.com/800x400'}" alt="${data.blog.title}">
                    <div>${data.blog.html_content}</div>
                    <button class="btn primary" onclick="showTab('blog')">Back to Blog List</button>
                </div>
            `;
            showTab('blog');
        } else {
            alert('Blog post not found.');
        }
    })
    .catch(error => {
        console.error('Error loading blog post:', error);
        alert('Error loading blog post. Please try again later.');
    });
}

// Load documents
function loadDocuments() {
    const token = localStorage.getItem('token');
    
    fetch('/api/documents', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const documentsContent = document.getElementById('documents-content');
        if (data.documents && data.documents.length > 0) {
            // Group documents by type
            const documentsByType = {};
            data.documents.forEach(doc => {
                if (!documentsByType[doc.type]) {
                    documentsByType[doc.type] = [];
                }
                documentsByType[doc.type].push(doc);
            });
            
            // Display documents
            documentsContent.innerHTML = Object.keys(documentsByType).map(type => `
                <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                ${documentsByType[type].map(doc => `
                    <div onclick="loadDocument('${doc.type}')" style="cursor: pointer; margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                        <h4>${doc.type}</h4>
                        <p>Last updated: ${new Date(doc.updated_at).toLocaleDateString()}</p>
                    </div>
                `).join('')}
            `).join('');
        } else {
            documentsContent.innerHTML = '<p>No documents available.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading documents:', error);
        document.getElementById('documents-content').innerHTML = '<p class="error-message">Error loading documents. Please try again later.</p>';
    });
}

// Load document
function loadDocument(type) {
    const token = localStorage.getItem('token');
    
    fetch(`/api/documents/${type}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.document) {
            const documentsTab = document.getElementById('documents-tab');
            documentsTab.innerHTML = `
                <div class="document-content">
                    <h1>${data.document.type.charAt(0).toUpperCase() + data.document.type.slice(1)}</h1>
                    <div>${data.document.content}</div>
                    <button class="btn primary" onclick="showTab('documents')">Back to Documents</button>
                </div>
            `;
            showTab('documents');
        } else {
            alert('Document not found.');
        }
    })
    .catch(error => {
        console.error('Error loading document:', error);
        alert('Error loading document. Please try again later.');
    });
}

// Refresh all data
function refreshAll() {
    // Show loading states
    const containers = ['whatsapp-notifications', 'instagram-notifications', 'others-notifications'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="loading">Refreshing notifications...</div>';
        }
    });
    
    const blogList = document.querySelector('.blog-list');
    if (blogList) {
        blogList.innerHTML = '<div class="loading">Refreshing blog posts...</div>';
    }
    
    const documentsContent = document.getElementById('documents-content');
    if (documentsContent) {
        documentsContent.innerHTML = '<div class="loading">Refreshing documents...</div>';
    }
    
    // Reload all data
    loadNotifications();
    loadBlogPosts();
    loadDocuments();
}

// Logout
function logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show landing page
    showLandingPage();
}
