document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        // Redirect to login page
        window.location.href = '/';
        return;
    }
    
    // Load initial content
    loadUsers();
    loadDevices();
    loadDocuments();
    loadBlogPosts();
});

// Show admin tab
function showAdminTab(tabName) {
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
    event.target.classList.add('active');
}

// Load users
function loadUsers() {
    // Simulate API call
    fetch('/api/admin/users')
    .then(response => response.json())
    .then(data => {
        const usersTableBody = document.getElementById('users-table-body');
        if (data.users && data.users.length > 0) {
            usersTableBody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.device_id || 'N/A'}</td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn secondary" onclick="editUser(${user.id})">Edit</button>
                        <button class="btn danger" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            usersTableBody.innerHTML = '<tr><td colspan="7">No users found.</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error loading users:', error);
        document.getElementById('users-table-body').innerHTML = '<tr><td colspan="7">Error loading users.</td></tr>';
    });
}

// Load devices
function loadDevices() {
    // Simulate API call
    fetch('/api/admin/devices')
    .then(response => response.json())
    .then(data => {
        const devicesTableBody = document.getElementById('devices-table-body');
        if (data.devices && data.devices.length > 0) {
            devicesTableBody.innerHTML = data.devices.map(device => `
                <tr>
                    <td>${device.device_id}</td>
                    <td>${device.user_name}</td>
                    <td>${new Date(device.last_sync).toLocaleDateString()}</td>
                    <td class="${device.permission_status === 'Enabled' ? 'status-enabled' : 'status-disabled'}">
                        ${device.permission_status}
                    </td>
                </tr>
            `).join('');
        } else {
            devicesTableBody.innerHTML = '<tr><td colspan="4">No devices found.</td></tr>';
        }
    })
    .catch(error => {
        console.error('Error loading devices:', error);
        document.getElementById('devices-table-body').innerHTML = '<tr><td colspan="4">Error loading devices.</td></tr>';
    });
}

// Load documents
function loadDocuments() {
    // Simulate API call
    fetch('/api/documents')
    .then(response => response.json())
    .then(data => {
        const documentsManagement = document.getElementById('documents-management');
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
            documentsManagement.innerHTML = Object.keys(documentsByType).map(type => `
                <h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                ${documentsByType[type].map(doc => `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
                        <h4>${doc.type}</h4>
                        <p>Last updated: ${new Date(doc.updated_at).toLocaleDateString()}</p>
                        <button class="btn primary" onclick="editDocument(${doc.id})">Edit</button>
                        <button class="btn danger" onclick="deleteDocument(${doc.id})">Delete</button>
                    </div>
                `).join('')}
            `).join('');
        } else {
            documentsManagement.innerHTML = '<p>No documents available.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading documents:', error);
        document.getElementById('documents-management').innerHTML = '<p>Error loading documents.</p>';
    });
}

// Load blog posts
function loadBlogPosts() {
    // Simulate API call
    fetch('/api/blogs')
    .then(response => response.json())
    .then(data => {
        const blogManagement = document.getElementById('blog-management');
        if (data.blogs && data.blogs.length > 0) {
            blogManagement.innerHTML = `
                <div class="blog-list">
                    ${data.blogs.map(blog => `
                        <div class="blog-card">
                            <img src="${blog.featured_image_url || 'https://via.placeholder.com/300x200'}" alt="${blog.title}" class="blog-image">
                            <div class="blog-content">
                                <h3 class="blog-title">${blog.title}</h3>
                                <p class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                                <button class="btn primary" onclick="editBlogPost(${blog.id})">Edit</button>
                                <button class="btn danger" onclick="deleteBlogPost(${blog.id})">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
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
                    <button type="button" class="btn btn-back" onclick="loadBlogPosts()">Cancel</button>
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
                            <button type="button" class="btn btn-back" onclick="loadBlogPosts()">Cancel</button>
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

// Edit document
function editDocument(id) {
    // Simulate API call to get document
    fetch(`/api/documents/${id}`)
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
                            <input type="text" id="type" name="type" value="${data.document.type}" required>
                        </div>
                        <div class="form-group">
                            <label for="content">Content (HTML)</label>
                            <textarea id="content" name="content" rows="10" required>${data.document.content}</textarea>
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
                
                const id = document.getElementById('id').value;
                const type = document.getElementById('type').value;
                const content = document.getElementById('content').value;
                
                // Simulate API call
                fetch(`/api/documents/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({ type, content })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.document) {
                        alert('Document updated successfully!');
                        loadDocuments();
                    } else {
                        alert('Failed to update document: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error updating document:', error);
                    alert('Error updating document.');
                });
            });
        } else {
            alert('Document not found.');
        }
    })
    .catch(error => {
        console.error('Error loading document:', error);
        alert('Error loading document.');
    });
}

// Delete document
function deleteDocument(id) {
    if (confirm('Are you sure you want to delete this document?')) {
        // Simulate API call
        fetch(`/api/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Document deleted successfully!');
                loadDocuments();
            } else {
                alert('Failed to delete document: ' + data.message);
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
    // Simulate API call to get user
    fetch(`/api/admin/users/${id}`)
    .then(response => response.json())
    .then(data => {
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
                        <button class="btn primary" onclick="updateUser(${data.user.id})">Save</button>
                        <button class="btn secondary" onclick="loadUsers()">Cancel</button>
                    </td>
                </tr>
            `;
        } else {
            alert('User not found.');
        }
    })
    .catch(error => {
        console.error('Error loading user:', error);
        alert('Error loading user.');
    });
}

// Update user
function updateUser(id) {
    const name = document.getElementById(`name-${id}`).value;
    const email = document.getElementById(`email-${id}`).value;
    const role = document.getElementById(`role-${id}`).value;
    
    // Simulate API call
    fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ role })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            alert('User updated successfully!');
            loadUsers();
        } else {
            alert('Failed to update user: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user.');
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

// Logout
function logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to landing page
    window.location.href = '/';
}
