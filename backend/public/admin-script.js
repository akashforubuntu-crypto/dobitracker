document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!user || !token || user.role !== 'admin') {
        // Redirect to login page
        window.location.href = '/';
        return;
    }
    
    // Setup tab event listeners
    setupAdminTabEventListeners();
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup user management event listeners
    setupUserManagementListeners();
    
    // Setup document management event listeners
    setupDocumentManagementListeners();
    
    // Setup blog management event listeners
    setupBlogManagementListeners();
    
    // Setup cleanup management event listeners
    setupCleanupManagementListeners();
    
    // Load initial content
    loadUsers();
    loadDocuments();
    loadBlogPosts();
    loadNotificationsManagement();
});

// Setup admin tab event listeners
function setupAdminTabEventListeners() {
    const tabs = document.querySelectorAll('.admin-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showAdminTab(tabName, this);
        });
    });
}

// Show admin tab
function showAdminTab(tabName, clickedElement = null) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked tab
    if (clickedElement) {
        clickedElement.classList.add('active');
    }
}

// Load users
function loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    fetch('/api/admin/users', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const usersTableBody = document.getElementById('users-table-body');
        if (data.users && data.users.length > 0) {
            // Update user statistics
            updateUserStats(data.users);
            
            // Store users for search functionality
            window.allUsers = data.users;
            
            // Render users table
            renderUsersTable(data.users);
        } else {
            usersTableBody.innerHTML = '<tr><td colspan="8">No users found.</td></tr>';
            updateUserStats([]);
        }
    })
    .catch(error => {
        console.error('Error loading users:', error);
        document.getElementById('users-table-body').innerHTML = '<tr><td colspan="7">Error loading users.</td></tr>';
    });
}


// Load documents
function loadDocuments() {
    const token = localStorage.getItem('token');
    
    fetch('/api/documents', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const documentsManagement = document.getElementById('documents-management');
        if (data.documents && data.documents.length > 0) {
            documentsManagement.innerHTML = `
                <div class="documents-header">
                    <h2>Document Management</h2>
                    <button class="btn primary" id="createDocumentBtn">Create New Document</button>
                    </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Version</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.documents.map(doc => `
                                <tr>
                                    <td>${doc.id}</td>
                                    <td>${doc.type}</td>
                                    <td>${doc.version}</td>
                                    <td>${new Date(doc.updated_at).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn primary" data-document-id="${doc.id}" data-action="edit">Edit</button>
                                        <button class="btn danger" data-document-id="${doc.id}" data-action="delete">Delete</button>
                                    </td>
                                </tr>
                `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            // Setup document management event listeners
            setupDocumentManagementListeners();
        } else {
            documentsManagement.innerHTML = `
                <div class="documents-header">
                    <h2>Document Management</h2>
                    <button class="btn primary" id="createDocumentBtn">Create New Document</button>
                </div>
                <p>No documents available.</p>
            `;
            setupDocumentManagementListeners();
        }
    })
    .catch(error => {
        console.error('Error loading documents:', error);
        document.getElementById('documents-management').innerHTML = '<p>Error loading documents.</p>';
    });
}

// Load blog posts
function loadBlogPosts() {
    fetch('/api/blogs')
    .then(response => response.json())
    .then(data => {
        const blogManagement = document.getElementById('blog-management');
        if (data.blogs && data.blogs.length > 0) {
            blogManagement.innerHTML = `
                <div class="blog-list">
                    ${data.blogs.map(blog => `
                        <div class="blog-card">
                            <img src="${blog.featured_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" alt="${blog.title}" class="blog-image">
                            <div class="blog-content">
                                <h3 class="blog-title">${blog.title}</h3>
                                <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                                <button class="btn primary" data-blog-id="${blog.id}" data-action="edit">Edit</button>
                                <button class="btn danger" data-blog-id="${blog.id}" data-action="delete">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Setup blog management event listeners
            setupBlogManagementListeners();
        } else {
            blogManagement.innerHTML = '<p>No blog posts available.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-management').innerHTML = '<p>Error loading blog posts.</p>';
    });
}

// Show create blog form
function showCreateBlogForm() {
    const blogManagement = document.getElementById('blog-management');
    blogManagement.innerHTML = `
        <div class="form-container">
            <h2>Create New Blog Post</h2>
            <form id="createBlogForm">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="featuredImageUrl">Featured Image URL</label>
                    <input type="text" id="featuredImageUrl" name="featuredImageUrl">
                </div>
                <div class="form-group">
                    <label for="htmlContent">Content (HTML)</label>
                    <textarea id="htmlContent" name="htmlContent" rows="10" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-back" id="cancelCreateBlogBtn">Cancel</button>
                    <button type="submit" class="btn btn-submit">Create Post</button>
                </div>
            </form>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('createBlogForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const featuredImageUrl = document.getElementById('featuredImageUrl').value;
        const htmlContent = document.getElementById('htmlContent').value;
        
        // Simulate API call
        fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ title, featuredImageUrl, htmlContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.blog) {
                alert('Blog post created successfully!');
                loadBlogPosts();
            } else {
                alert('Failed to create blog post: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error creating blog post:', error);
            alert('Error creating blog post.');
        });
    });
    
    // Handle cancel button
    document.getElementById('cancelCreateBlogBtn').addEventListener('click', function() {
        loadBlogPosts();
    });
}

// Edit blog post
function editBlogPost(id) {
    // Simulate API call to get blog post
    fetch(`/api/blogs/${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.blog) {
            const blogManagement = document.getElementById('blog-management');
            blogManagement.innerHTML = `
                <div class="form-container">
                    <h2>Edit Blog Post</h2>
                    <form id="editBlogForm">
                        <input type="hidden" id="id" name="id" value="${data.blog.id}">
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" value="${data.blog.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="featuredImageUrl">Featured Image URL</label>
                            <input type="text" id="featuredImageUrl" name="featuredImageUrl" value="${data.blog.featured_image_url || ''}">
                        </div>
                        <div class="form-group">
                            <label for="htmlContent">Content (HTML)</label>
                            <textarea id="htmlContent" name="htmlContent" rows="10" required>${data.blog.html_content}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-back" id="cancelEditBlogBtn">Cancel</button>
                            <button type="submit" class="btn btn-submit">Update Post</button>
                        </div>
                    </form>
                </div>
            `;
            
            // Handle form submission
            document.getElementById('editBlogForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const id = document.getElementById('id').value;
                const title = document.getElementById('title').value;
                const featuredImageUrl = document.getElementById('featuredImageUrl').value;
                const htmlContent = document.getElementById('htmlContent').value;
                
                // Simulate API call
                fetch(`/api/blogs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ title, featuredImageUrl, htmlContent })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.blog) {
                        alert('Blog post updated successfully!');
                        loadBlogPosts();
                    } else {
                        alert('Failed to update blog post: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error updating blog post:', error);
                    alert('Error updating blog post.');
                });
            });
            
            // Handle cancel button
            document.getElementById('cancelEditBlogBtn').addEventListener('click', function() {
                loadBlogPosts();
            });
        } else {
            alert('Blog post not found.');
        }
    })
    .catch(error => {
        console.error('Error loading blog post:', error);
        alert('Error loading blog post.');
    });
}

// Delete blog post
function deleteBlogPost(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        // Simulate API call
        fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Blog post deleted successfully!');
                loadBlogPosts();
            } else {
                alert('Failed to delete blog post: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting blog post:', error);
            alert('Error deleting blog post.');
        });
    }
}

// Setup document management event listeners
function setupDocumentManagementListeners() {
    const documentsManagement = document.getElementById('documents-management');
    
    // Handle create document button
    const createBtn = documentsManagement.querySelector('#createDocumentBtn');
    if (createBtn) {
        createBtn.addEventListener('click', showCreateDocumentForm);
    }
    
    // Handle edit and delete buttons using event delegation
    documentsManagement.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="edit"]')) {
            const documentId = e.target.getAttribute('data-document-id');
            editDocument(documentId);
        } else if (e.target.matches('[data-action="delete"]')) {
            const documentId = e.target.getAttribute('data-document-id');
            deleteDocument(documentId);
        }
    });
}

// Show create document form
function showCreateDocumentForm() {
    const documentsManagement = document.getElementById('documents-management');
    documentsManagement.innerHTML = `
        <div class="form-container">
            <h2>Create New Document</h2>
            <form id="createDocumentForm">
                <div class="form-group">
                    <label for="type">Type</label>
                    <input type="text" id="type" name="type" required placeholder="e.g., privacy-policy, terms-of-service">
                </div>
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required placeholder="Document title">
                </div>
                <div class="form-group">
                    <label for="content">Content (HTML)</label>
                    <textarea id="content" name="content" rows="10" required placeholder="Enter HTML content..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-back" onclick="loadDocuments()">Cancel</button>
                    <button type="submit" class="btn btn-submit">Create Document</button>
                </div>
            </form>
        </div>
    `;
    
    // Handle form submission
    document.getElementById('createDocumentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createDocument();
    });
}

// Create document
function createDocument() {
    const token = localStorage.getItem('token');
    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value;
    const html_content = document.getElementById('content').value;
    
    fetch('/api/documents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type, title, html_content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Document created successfully!');
            loadDocuments();
        } else {
            alert('Error creating document: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error creating document:', error);
        alert('Error creating document.');
    });
}

// Edit document
function editDocument(id) {
    const token = localStorage.getItem('token');
    
    fetch(`/api/documents/admin/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.document) {
            const documentsManagement = document.getElementById('documents-management');
            documentsManagement.innerHTML = `
                <div class="form-container">
                    <h2>Edit Document</h2>
                    <form id="editDocumentForm">
                        <input type="hidden" id="id" name="id" value="${data.document.id}">
                        <div class="form-group">
                            <label for="type">Type</label>
                            <input type="text" id="type" name="type" value="${data.document.type}" readonly>
                        </div>
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" value="${data.document.title}" required>
                        </div>
                        <div class="form-group">
                            <label for="content">Content (HTML)</label>
                            <textarea id="content" name="content" rows="10" required>${data.document.html_content}</textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-back" onclick="loadDocuments()">Cancel</button>
                            <button type="submit" class="btn btn-submit">Update Document</button>
                        </div>
                    </form>
                </div>
            `;
            
            // Handle form submission
            document.getElementById('editDocumentForm').addEventListener('submit', function(e) {
                e.preventDefault();
                updateDocument(data.document.id);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching document:', error);
        alert('Error fetching document.');
    });
}

// Update document
function updateDocument(id) {
    const token = localStorage.getItem('token');
    const title = document.getElementById('title').value;
    const html_content = document.getElementById('content').value;
    
                fetch(`/api/documents/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
                    },
        body: JSON.stringify({ title, html_content })
                })
                .then(response => response.json())
                .then(data => {
        if (data.message) {
                        alert('Document updated successfully!');
                        loadDocuments();
                    } else {
            alert('Error updating document: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error updating document:', error);
                    alert('Error updating document.');
    });
}

// Delete document
function deleteDocument(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        const token = localStorage.getItem('token');
        
        fetch(`/api/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Document deleted successfully!');
                loadDocuments();
            } else {
                alert('Error deleting document: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error deleting document:', error);
            alert('Error deleting document.');
        });
    }
}

// Edit user
function editUser(id) {
    console.log('Editing user with ID:', id);
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    fetch(`/api/admin/users/${id}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('User data received:', data);
        if (data.user) {
            const usersTableBody = document.getElementById('users-table-body');
            usersTableBody.innerHTML = `
                <tr>
                    <td>${data.user.id}</td>
                    <td><input type="text" id="name-${data.user.id}" value="${data.user.name}"></td>
                    <td><input type="email" id="email-${data.user.id}" value="${data.user.email}"></td>
                    <td>
                        <select id="role-${data.user.id}">
                            <option value="user" ${data.user.role === 'user' ? 'selected' : ''}>User</option>
                            <option value="admin" ${data.user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                    </td>
                    <td>${data.user.device_id || 'N/A'}</td>
                    <td>${new Date(data.user.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn primary save-user-btn" data-user-id="${data.user.id}">Save</button>
                        <button class="btn secondary cancel-edit-btn">Cancel</button>
                    </td>
                </tr>
            `;
        } else {
            console.log('No user found in response:', data);
            alert('User not found.');
        }
    })
    .catch(error => {
        console.error('Error loading user:', error);
        alert('Error loading user: ' + error.message);
    });
}

// Update user
function updateUser(id) {
    const name = document.getElementById(`name-${id}`).value;
    const email = document.getElementById(`email-${id}`).value;
    const role = document.getElementById(`role-${id}`).value;
    
    console.log('Updating user:', { id, name, email, role });
    
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
    
    fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name, email, role })
    })
    .then(response => {
        console.log('Update response status:', response.status);
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Update response data:', data);
        if (data.user) {
            alert('User updated successfully!');
            loadUsers();
        } else {
            alert('Failed to update user: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user: ' + error.message);
    });
}

// Delete user
function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        const token = localStorage.getItem('token');
        
        fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
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
            if (data.message) {
                alert('User deleted successfully!');
                loadUsers();
            } else {
                alert('Failed to delete user: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again later.');
        });
    }
}

// Setup logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = '/';
        });
    }
}

// Setup user management event listeners
function setupUserManagementListeners() {
    // Use event delegation for dynamically created buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-user-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            editUser(userId);
        } else if (e.target.classList.contains('delete-user-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            deleteUser(userId);
        } else if (e.target.classList.contains('save-user-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            updateUser(userId);
        } else if (e.target.classList.contains('cancel-edit-btn')) {
            loadUsers();
        } else if (e.target.classList.contains('create-user-btn')) {
            showCreateUserForm();
        } else if (e.target.id === 'clearSearch') {
            document.getElementById('userSearch').value = '';
            if (window.allUsers) {
                renderUsersTable(window.allUsers);
            }
        }
    });
    
    // Setup search functionality
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (window.allUsers) {
                const filteredUsers = window.allUsers.filter(user => 
                    user.name.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm) ||
                    user.role.toLowerCase().includes(searchTerm)
                );
                renderUsersTable(filteredUsers);
            }
        });
    }
}

// Update user statistics
function updateUserStats(users) {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'admin').length;
    const regularUsers = users.filter(user => user.role === 'user').length;
    const usersWithDevices = users.filter(user => user.device_id).length;
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('adminUsers').textContent = adminUsers;
    document.getElementById('regularUsers').textContent = regularUsers;
    document.getElementById('usersWithDevices').textContent = usersWithDevices;
}

// Render users table
function renderUsersTable(users) {
    const usersTableBody = document.getElementById('users-table-body');
    if (users.length > 0) {
        usersTableBody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </td>
                <td>${user.device_id || 'N/A'}</td>
                <td>
                    <span class="status-badge ${user.device_id ? 'status-active' : 'status-inactive'}">
                        ${user.device_id ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn secondary edit-user-btn" data-user-id="${user.id}">Edit</button>
                    <button class="btn danger delete-user-btn" data-user-id="${user.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    } else {
        usersTableBody.innerHTML = '<tr><td colspan="8">No users found.</td></tr>';
    }
}

// Show create user form
function showCreateUserForm() {
    const usersTab = document.getElementById('users-tab');
    usersTab.innerHTML = `
        <div class="create-user-form">
            <div class="form-header">
                <h2>Create New User</h2>
                <button class="btn secondary" id="backToUsers">Back to Users</button>
            </div>
            
            <form id="createUserForm" class="user-form">
                <div class="form-group">
                    <label for="newUserName">Full Name</label>
                    <input type="text" id="newUserName" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="newUserEmail">Email</label>
                    <input type="email" id="newUserEmail" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="newUserPassword">Password</label>
                    <input type="password" id="newUserPassword" name="password" required minlength="6">
                </div>
                
                <div class="form-group">
                    <label for="newUserRole">Role</label>
                    <select id="newUserRole" name="role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn secondary" id="cancelCreateUser">Cancel</button>
                    <button type="submit" class="btn primary">Create User</button>
                </div>
            </form>
        </div>
    `;
    
    // Setup form event listeners
    setupCreateUserFormListeners();
}

// Setup create user form listeners
function setupCreateUserFormListeners() {
    const backBtn = document.getElementById('backToUsers');
    const cancelBtn = document.getElementById('cancelCreateUser');
    const form = document.getElementById('createUserForm');
    
    if (backBtn) {
        backBtn.addEventListener('click', loadUsers);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', loadUsers);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            createUser();
        });
    }
}

// Create new user
function createUser() {
    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    
    const token = localStorage.getItem('token');
    
    fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ name, email, password, role })
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.user) {
            alert('User created successfully!');
            loadUsers();
        } else {
            alert('Failed to create user: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user. Please try again.');
    });
}

// Logout function (for compatibility)
function logout() {
    localStorage.clear();
    window.location.href = '/';
}

// Load notifications management interface
function loadNotificationsManagement() {
    // Setup event listeners
    setupNotificationEventListeners();
}

// Global variables for notification management
let currentUser = null;
let currentApp = '';
let currentPage = 1;
const notificationsPerPage = 25;

// Setup notification event listeners
function setupNotificationEventListeners() {
    const loadBtn = document.getElementById('load-notifications-btn');
    const userIdInput = document.getElementById('user-id-input');
    const notificationTabs = document.getElementById('notification-tabs');
    
    if (loadBtn) {
        loadBtn.addEventListener('click', handleLoadNotifications);
    }
    
    if (userIdInput) {
        userIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLoadNotifications();
            }
        });
    }
    
    if (notificationTabs) {
        notificationTabs.addEventListener('click', function(e) {
            if (e.target.classList.contains('notification-tab')) {
                const app = e.target.getAttribute('data-app');
                handleNotificationTabChange(app);
            }
        });
    }
}

// Handle load notifications button click
function handleLoadNotifications() {
    const userIdInput = document.getElementById('user-id-input');
    const notificationTabs = document.getElementById('notification-tabs');
    const notificationsContainer = document.getElementById('notifications-container');
    
    const userId = userIdInput.value.trim();
    
    if (!userId) {
        alert('Please enter a user ID');
        return;
    }
    
    currentUser = userId;
    currentPage = 1;
    currentApp = '';
    
    // Show tabs and container
    notificationTabs.style.display = 'flex';
    notificationsContainer.style.display = 'block';
    
    // Reset active tab
    document.querySelectorAll('.notification-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector('.notification-tab[data-app=""]').classList.add('active');
    
    // Load notifications
    loadNotifications();
}

// Handle notification tab change
function handleNotificationTabChange(app) {
    currentApp = app;
    currentPage = 1;
    
    // Update active tab
    document.querySelectorAll('.notification-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.notification-tab[data-app="${app}"]`).classList.add('active');
    
    // Load notifications
    loadNotifications();
}

// Load notifications with pagination
function loadNotifications() {
    if (!currentUser) return;
    
    const token = localStorage.getItem('token');
    let url = `/api/admin/notifications/${currentUser}?page=${currentPage}&limit=${notificationsPerPage}`;
    
    if (currentApp && currentApp !== 'other') {
        url += `&app=${encodeURIComponent(currentApp)}`;
    }
    
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.notifications) {
            displayNotifications(data.notifications, data.pagination, data.user);
        }
    })
    .catch(error => {
        console.error('Error loading notifications:', error);
    });
}

// Display notifications with pagination
function displayNotifications(notifications, pagination, user) {
    const container = document.getElementById('notifications-list');
    const paginationContainer = document.getElementById('pagination');
    
    if (!container) return;
    
    // Display user information if available
    let userInfo = '';
    if (user) {
        userInfo = `
            <div class="user-info" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #007bff;">
                <h3 style="margin: 0 0 10px 0; color: #333;">User Information</h3>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
                <p style="margin: 5px 0;"><strong>User ID:</strong> ${user.id}</p>
                <p style="margin: 5px 0;"><strong>Device ID:</strong> ${user.device_id}</p>
            </div>
        `;
    }
    
    if (notifications.length === 0) {
        container.innerHTML = userInfo + '<p>No notifications found.</p>';
        paginationContainer.innerHTML = '';
        return;
    }
    
    // Filter for "other" apps if needed
    let displayNotifications = notifications;
    if (currentApp === 'other') {
        displayNotifications = notifications.filter(notification => 
            notification.app_name !== 'WhatsApp' && 
            notification.app_name !== 'Instagram'
        );
    }
    
    container.innerHTML = userInfo + displayNotifications.map(notification => `
        <div class="notification-item">
            <div class="notification-content">
                <div class="notification-app">${notification.app_name || 'Unknown App'}</div>
                <div class="notification-sender">From: ${notification.sender || 'Unknown'}</div>
                <div class="notification-message">${notification.message || 'No message'}</div>
                <div class="notification-time">${new Date(notification.timestamp).toLocaleString()}</div>
            </div>
        </div>
    `).join('');
    
    // Display pagination
    displayPagination(pagination);
}

// Display pagination controls
function displayPagination(pagination) {
    const container = document.getElementById('pagination');
    if (!container || !pagination) return;
    
    const { currentPage, totalPages, totalCount, hasNext, hasPrev } = pagination;
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button ${!hasPrev ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">Previous</button>`;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span>...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `<button ${!hasNext ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next</button>`;
    
    // Info
    paginationHTML += `<div class="pagination-info">Page ${currentPage} of ${totalPages} (${totalCount} total)</div>`;
    
    container.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadNotifications();
}



// Setup blog management event listeners
function setupBlogManagementListeners() {
    const blogManagement = document.getElementById('blog-management');
    
    // Handle create blog button
    const createBtn = document.getElementById('createBlogBtn');
    if (createBtn) {
        createBtn.addEventListener('click', showCreateBlogForm);
    }
    
    // Handle edit and delete buttons using event delegation
    blogManagement.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="edit"]')) {
            const blogId = e.target.getAttribute('data-blog-id');
            editBlogPost(blogId);
        } else if (e.target.matches('[data-action="delete"]')) {
            const blogId = e.target.getAttribute('data-blog-id');
            deleteBlogPost(blogId);
        }
    });
}

// Setup cleanup management event listeners
function setupCleanupManagementListeners() {
    const cleanupDateInput = document.getElementById('cleanup-date');
    const previewBtn = document.getElementById('preview-cleanup-btn');
    const executeBtn = document.getElementById('execute-cleanup-btn');
    
    // Set max date to today
    if (cleanupDateInput) {
        const today = new Date().toISOString().split('T')[0];
        cleanupDateInput.setAttribute('max', today);
    }
    
    // Preview cleanup button
    if (previewBtn) {
        previewBtn.addEventListener('click', previewCleanup);
    }
    
    // Execute cleanup button
    if (executeBtn) {
        executeBtn.addEventListener('click', executeCleanup);
    }
}

// Preview cleanup - show how many notifications will be deleted
async function previewCleanup() {
    const dateInput = document.getElementById('cleanup-date');
    const executeBtn = document.getElementById('execute-cleanup-btn');
    const previewSection = document.getElementById('cleanup-preview');
    const resultsSection = document.getElementById('cleanup-results');
    
    if (!dateInput || !dateInput.value) {
        alert('Please select a date first.');
        return;
    }
    
    const cutoffDate = dateInput.value;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/cleanup/preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cutoffDate })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show preview
            document.getElementById('preview-date').textContent = new Date(cutoffDate).toLocaleDateString();
            document.getElementById('preview-count').textContent = data.notificationsToDelete;
            
            previewSection.style.display = 'block';
            resultsSection.style.display = 'none';
            
            // Enable execute button
            if (executeBtn) {
                executeBtn.disabled = false;
            }
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Preview cleanup error:', error);
        alert('Failed to preview cleanup. Please try again.');
    }
}

// Execute cleanup - actually delete the notifications
async function executeCleanup() {
    const dateInput = document.getElementById('cleanup-date');
    const executeBtn = document.getElementById('execute-cleanup-btn');
    const previewSection = document.getElementById('cleanup-preview');
    const resultsSection = document.getElementById('cleanup-results');
    
    if (!dateInput || !dateInput.value) {
        alert('Please select a date first.');
        return;
    }
    
    const cutoffDate = dateInput.value;
    const count = document.getElementById('preview-count').textContent;
    
    // Confirm the action
    const confirmed = confirm(
        `Are you sure you want to delete ${count} notifications older than ${new Date(cutoffDate).toLocaleDateString()}?\n\nThis action cannot be undone!`
    );
    
    if (!confirmed) {
        return;
    }
    
    // Disable execute button during operation
    if (executeBtn) {
        executeBtn.disabled = true;
        executeBtn.textContent = 'Deleting...';
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/cleanup/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ cutoffDate })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show results
            document.getElementById('results-date').textContent = new Date(cutoffDate).toLocaleDateString();
            document.getElementById('results-count').textContent = data.notificationsDeleted;
            
            previewSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Reset form
            dateInput.value = '';
            
            alert(`Successfully deleted ${data.notificationsDeleted} notifications!`);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Execute cleanup error:', error);
        alert('Failed to execute cleanup. Please try again.');
    } finally {
        // Re-enable execute button
        if (executeBtn) {
            executeBtn.disabled = true; // Keep disabled until new preview
            executeBtn.textContent = 'Execute Cleanup';
        }
    }
}
