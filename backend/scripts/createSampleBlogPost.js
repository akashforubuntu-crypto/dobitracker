const dotenv = require('dotenv');
dotenv.config();

const { createBlog } = require('../src/models/blogModel');

const createSampleBlogPost = async () => {
  try {
    // Sample blog post data
    const blogData = {
      title: 'Welcome to DobiTracker',
      featuredImageUrl: 'https://via.placeholder.com/800x400',
      htmlContent: `
        <h2>Introduction to DobiTracker</h2>
        <p>Welcome to DobiTracker, your comprehensive solution for tracking and managing Android notifications.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Real-time notification capture</li>
          <li>Intuitive web dashboard</li>
          <li>Secure user authentication</li>
          <li>Comprehensive admin panel</li>
          <li>Blog and document management</li>
        </ul>
        
        <h3>How It Works</h3>
        <p>DobiTracker captures notifications from your Android device and securely stores them in our cloud database. 
        You can then access these notifications through our web portal, where you can view, search, and manage them.</p>
        
        <h3>Getting Started</h3>
        <p>To get started with DobiTracker:</p>
        <ol>
          <li>Sign up for an account on our web portal</li>
          <li>Download and install our Android app</li>
          <li>Follow the setup instructions in the app</li>
          <li>Start tracking your notifications!</li>
        </ol>
        
        <p>We're excited to help you take control of your Android notifications!</p>
      `
    };
    
    // Create the blog post
    const blogPost = await createBlog(blogData);
    
    console.log('Sample blog post created successfully:', blogPost);
  } catch (error) {
    console.error('Error creating sample blog post:', error);
  }
};

// Run the function if this file is executed directly
if (require.main === module) {
  createSampleBlogPost();
}

module.exports = createSampleBlogPost;
