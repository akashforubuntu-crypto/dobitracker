const dotenv = require('dotenv');
dotenv.config();

const { createDocument } = require('../src/models/documentModel');

const createSampleDocuments = async () => {
  try {
    // Sample Terms and Conditions
    const termsData = {
      type: 'terms',
      content: `
        <h1>Terms and Conditions</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using DobiTracker, you accept and agree to be bound by these Terms and Conditions.</p>
        
        <h2>2. Description of Service</h2>
        <p>DobiTracker provides a service for capturing and managing Android device notifications.</p>
        
        <h2>3. User Responsibilities</h2>
        <p>Users are responsible for maintaining the confidentiality of their account and password.</p>
        
        <h2>4. Intellectual Property</h2>
        <p>All content included in DobiTracker is the property of DobiTracker or its licensors.</p>
        
        <h2>5. Limitation of Liability</h2>
        <p>DobiTracker shall not be liable for any indirect, incidental, special, consequential or punitive damages.</p>
        
        <h2>6. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time.</p>
      `
    };
    
    // Sample Privacy Policy
    const privacyData = {
      type: 'privacy',
      content: `
        <h1>Privacy Policy</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account.</p>
        
        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services.</p>
        
        <h2>3. Information Sharing</h2>
        <p>We do not share personal information with companies, organizations, or individuals.</p>
        
        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your information.</p>
        
        <h2>5. Data Retention</h2>
        <p>We retain information for as long as necessary to provide our services.</p>
        
        <h2>6. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information.</p>
      `
    };
    
    // Sample Disclaimer
    const disclaimerData = {
      type: 'disclaimer',
      content: `
        <h1>Disclaimer</h1>
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
        
        <h2>1. No Warranty</h2>
        <p>DobiTracker is provided "as is" without any warranties of any kind.</p>
        
        <h2>2. Limitation of Liability</h2>
        <p>In no event shall DobiTracker be liable for any direct, indirect, incidental, special, or consequential damages.</p>
        
        <h2>3. Third-Party Services</h2>
        <p>DobiTracker may include links to third-party websites or services that are not owned or controlled by us.</p>
        
        <h2>4. Android Permissions</h2>
        <p>The Android app requires notification access permission to function properly.</p>
        
        <h2>5. User Content</h2>
        <p>Users are responsible for the content they capture and store through our service.</p>
      `
    };
    
    // Create the documents
    const terms = await createDocument(termsData);
    console.log('Terms and Conditions created successfully:', terms);
    
    const privacy = await createDocument(privacyData);
    console.log('Privacy Policy created successfully:', privacy);
    
    const disclaimer = await createDocument(disclaimerData);
    console.log('Disclaimer created successfully:', disclaimer);
  } catch (error) {
    console.error('Error creating sample documents:', error);
  }
};

// Run the function if this file is executed directly
if (require.main === module) {
  createSampleDocuments();
}

module.exports = createSampleDocuments;
