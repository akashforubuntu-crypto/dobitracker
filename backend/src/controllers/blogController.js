const { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} = require('../models/blogModel');

const createBlogHandler = async (req, res) => {
  try {
    const { title, featuredImageUrl, htmlContent } = req.body;
    
    // Validate input
    if (!title || !htmlContent) {
      return res.status(400).json({ message: 'Title and HTML content are required' });
    }
    
    // Create blog
    const blog = await createBlog({ title, featuredImageUrl, htmlContent });
    
    res.status(201).json({
      message: 'Blog created successfully',
      blog: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllBlogsHandler = async (req, res) => {
  try {
    // Get all blogs
    const blogs = await getAllBlogs();
    
    res.status(200).json({
      message: 'Blogs fetched successfully',
      blogs: blogs
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }
    
    // Get blog
    const blog = await getBlogById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json({
      message: 'Blog fetched successfully',
      blog: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBlogHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, featuredImageUrl, htmlContent } = req.body;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }
    
    if (!title || !htmlContent) {
      return res.status(400).json({ message: 'Title and HTML content are required' });
    }
    
    // Update blog
    const blog = await updateBlog(id, { title, featuredImageUrl, htmlContent });
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json({
      message: 'Blog updated successfully',
      blog: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBlogHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }
    
    // Delete blog
    const result = await deleteBlog(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createBlogHandler,
  getAllBlogsHandler,
  getBlog,
  updateBlogHandler,
  deleteBlogHandler
};
