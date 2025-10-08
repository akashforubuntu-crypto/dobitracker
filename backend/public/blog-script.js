document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on blog listing page or individual post page
    if (window.location.pathname === '/blog.html' || window.location.pathname === '/blog') {
        loadBlogPosts();
    } else if (window.location.pathname === '/blog-post.html' || window.location.pathname === '/blog-post') {
        loadBlogPost();
    }
});

// Load all blog posts for the blog listing page
function loadBlogPosts() {
    fetch('/api/blogs')
        .then(response => response.json())
        .then(data => {
            const blogGrid = document.getElementById('blog-grid');
            if (data.blogs && data.blogs.length > 0) {
                blogGrid.innerHTML = data.blogs.map(blog => `
                    <article class="blog-card">
                        <div class="blog-card-image">
                            ${blog.featured_image_url ? `<img src="${blog.featured_image_url}" alt="${blog.title}">` : ''}
                        </div>
                        <div class="blog-card-content">
                            <h3><a href="/blog-post.html?id=${blog.id}">${blog.title}</a></h3>
                            <p class="blog-card-excerpt">${blog.content.substring(0, 150)}...</p>
                            <div class="blog-card-meta">
                                <span class="blog-date">${new Date(blog.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </article>
                `).join('');
            } else {
                blogGrid.innerHTML = '<p>No blog posts available.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading blog posts:', error);
            document.getElementById('blog-grid').innerHTML = '<p>Error loading blog posts.</p>';
        });
}

// Load individual blog post
function loadBlogPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (!blogId) {
        document.getElementById('blog-title').textContent = 'Blog Post Not Found';
        document.getElementById('blog-content').innerHTML = '<p>No blog post ID provided.</p>';
        return;
    }
    
    fetch(`/api/blogs/${blogId}`)
        .then(response => response.json())
        .then(data => {
            if (data.blog) {
                const blog = data.blog;
                
                // Update page title
                document.title = `${blog.title} - DobiTracker Blog`;
                
                // Update blog post content
                document.getElementById('blog-title').textContent = blog.title;
                document.getElementById('blog-date').textContent = new Date(blog.created_at).toLocaleDateString();
                document.getElementById('blog-content').innerHTML = blog.content;
                
                // Update featured image if available
                const featuredImage = document.getElementById('blog-featured-image');
                if (blog.featured_image_url) {
                    featuredImage.src = blog.featured_image_url;
                    featuredImage.alt = blog.title;
                    featuredImage.style.display = 'block';
                } else {
                    featuredImage.style.display = 'none';
                }
            } else {
                document.getElementById('blog-title').textContent = 'Blog Post Not Found';
                document.getElementById('blog-content').innerHTML = '<p>The requested blog post could not be found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading blog post:', error);
            document.getElementById('blog-title').textContent = 'Error Loading Post';
            document.getElementById('blog-content').innerHTML = '<p>There was an error loading the blog post.</p>';
        });
}
