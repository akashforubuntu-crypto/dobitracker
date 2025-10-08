const db = require('../../database/db');

const createBlogsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      featured_image_url TEXT,
      html_content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await db.query(query);
    console.log('Blogs table created successfully');
  } catch (err) {
    console.error('Error creating blogs table:', err);
  }
};

const createBlog = async (blogData) => {
  const { title, featuredImageUrl, htmlContent } = blogData;
  
  const query = `
    INSERT INTO blogs (title, featured_image_url, html_content)
    VALUES ($1, $2, $3)
    RETURNING id, title, featured_image_url, html_content, created_at, updated_at
  `;
  
  const values = [title, featuredImageUrl, htmlContent];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const getAllBlogs = async () => {
  const query = `
    SELECT id, title, featured_image_url, created_at, updated_at 
    FROM blogs 
    ORDER BY created_at DESC
  `;
  
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

const getBlogById = async (id) => {
  const query = `
    SELECT * FROM blogs 
    WHERE id = $1
  `;
  
  const values = [id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const updateBlog = async (id, blogData) => {
  const { title, featuredImageUrl, htmlContent } = blogData;
  
  const query = `
    UPDATE blogs 
    SET title = $1, featured_image_url = $2, html_content = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING id, title, featured_image_url, html_content, created_at, updated_at
  `;
  
  const values = [title, featuredImageUrl, htmlContent, id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

const deleteBlog = async (id) => {
  const query = 'DELETE FROM blogs WHERE id = $1 RETURNING id';
  const values = [id];
  
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createBlogsTable,
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog
};
