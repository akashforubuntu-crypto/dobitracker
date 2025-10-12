// Blog functionality for both blog listing and individual post pages

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    
    if (currentPage === '/blog.html') {
        loadBlogList();
    } else if (currentPage === '/blog-post.html') {
        loadBlogPost();
    } else if (currentPage === '/') {
        loadBlogPreview();
    }
});

// Load blog preview for home page
function loadBlogPreview() {
    fetch('/api/blogs')
    .then(response => response.json())
    .then(data => {
        const blogPreview = document.getElementById('blog-preview');
        if (data.blogs && data.blogs.length > 0) {
            // Show only the latest 3 blogs
            const latestBlogs = data.blogs.slice(0, 3);
            blogPreview.innerHTML = latestBlogs.map(blog => `
                <div class="blog-preview-item">
                    <div class="blog-preview-image">
                        <img src="${blog.featured_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" alt="${blog.title}">
                    </div>
                    <div class="blog-preview-content">
                        <h3><a href="/blog-post.html?id=${blog.id}">${blog.title}</a></h3>
                        <p class="blog-preview-date">${new Date(blog.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            blogPreview.innerHTML = '<p>No blog posts available yet.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading blog preview:', error);
        document.getElementById('blog-preview').innerHTML = '<p>Error loading blog posts.</p>';
    });
}

// Load blog list for blog page
function loadBlogList() {
    fetch('/api/blogs')
    .then(response => response.json())
    .then(data => {
        const blogList = document.getElementById('blog-list');
        if (data.blogs && data.blogs.length > 0) {
            blogList.innerHTML = `
                <div class="blog-grid">
                    ${data.blogs.map(blog => `
                        <article class="blog-card" data-blog-id="${blog.id || ''}">
                            <div class="blog-card-image">
                                <img src="${blog.featured_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" alt="${blog.title || 'Blog Post'}">
                            </div>
                            <div class="blog-card-content">
                                <h3>${blog.title || 'Untitled'}</h3>
                                <p class="blog-card-date">${blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'No date'}</p>
                                <p class="blog-card-excerpt">${getExcerpt(blog.html_content)}</p>
                                <button class="btn primary blog-read-more" data-blog-id="${blog.id || ''}">Read More</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
            
            // Add event listeners for blog cards
            setupBlogPageEventListeners();
        } else {
            blogList.innerHTML = '<p>No blog posts available yet.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading blog list:', error);
        document.getElementById('blog-list').innerHTML = '<p>Error loading blog posts.</p>';
    });
}

// Load individual blog post
function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (!blogId) {
        document.getElementById('blog-post-content').innerHTML = '<p>Blog post not found.</p>';
        return;
    }
    
    fetch(`/api/blogs/${blogId}`)
    .then(response => response.json())
    .then(data => {
        const blogPostContent = document.getElementById('blog-post-content');
        if (data.blog) {
            // Update page title
            document.title = `${data.blog.title} - DobiTracker Blog`;
            
            blogPostContent.innerHTML = `
                <header class="blog-post-header">
                    <h1>${data.blog.title}</h1>
                    <p class="blog-post-meta">
                        Published on ${new Date(data.blog.created_at).toLocaleDateString()}
                        ${data.blog.updated_at !== data.blog.created_at ? 
                            ` • Updated on ${new Date(data.blog.updated_at).toLocaleDateString()}` : ''}
                    </p>
                </header>
                
                ${data.blog.featured_image_url ? `
                    <div class="blog-post-featured-image">
                        <img src="${data.blog.featured_image_url}" alt="${data.blog.title}">
                    </div>
                ` : ''}
                
                <div class="blog-post-body">
                    ${data.blog.html_content}
                </div>
            `;
        } else {
            blogPostContent.innerHTML = '<p>Blog post not found.</p>';
        }
    })
    .catch(error => {
        console.error('Error loading blog post:', error);
        document.getElementById('blog-post-content').innerHTML = '<p>Error loading blog post.</p>';
    });
}

// Helper function to get excerpt from HTML content
function getExcerpt(htmlContent, maxLength = 150) {
    // Check if htmlContent exists and is a string
    if (!htmlContent || typeof htmlContent !== 'string') {
        return 'No content available';
    }
    
    // Remove HTML tags and get plain text
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    
    if (textContent.length <= maxLength) {
        return textContent;
    }
    
    return textContent.substring(0, maxLength).trim() + '...';
}

// Setup blog page event listeners
function setupBlogPageEventListeners() {
    // Add click listeners to blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const blogId = this.getAttribute('data-blog-id');
            if (blogId) {
                window.location.href = `/blog-post.html?id=${blogId}`;
            }
        });
    });
    
    // Add click listeners to read more buttons
    const readMoreButtons = document.querySelectorAll('.blog-read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const blogId = this.getAttribute('data-blog-id');
            if (blogId) {
                window.location.href = `/blog-post.html?id=${blogId}`;
            }
        });
    });
}
