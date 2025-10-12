const db = require('../database/db');
const { createDocument } = require('../src/models/documentModel');

const createLegalDocuments = async () => {
  try {
    console.log('🚀 Creating Legal Documents for DobiTracker');
    console.log('==========================================');

    // Disclaimer
    const disclaimerContent = `
      <h1>Disclaimer</h1>
      <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>General Information</h2>
      <p>DobiTracker is an Android notification capture system designed to help users track and manage their notifications. This service is provided "as is" without any warranties or guarantees.</p>
      
      <h2>Service Availability</h2>
      <p>We strive to maintain high service availability, but we do not guarantee uninterrupted access to our services. The service may be temporarily unavailable due to maintenance, updates, or technical issues.</p>
      
      <h2>Data Accuracy</h2>
      <p>While we make every effort to ensure the accuracy of notification data captured and stored, we cannot guarantee 100% accuracy. Users should verify important information independently.</p>
      
      <h2>Third-Party Services</h2>
      <p>Our service may integrate with third-party applications and services. We are not responsible for the availability, content, or privacy practices of these third-party services.</p>
      
      <h2>Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, DobiTracker shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to the use of our service.</p>
      
      <h2>Contact Information</h2>
      <p>If you have any questions about this disclaimer, please contact us through our support channels.</p>
    `;

    // Terms and Conditions
    const termsContent = `
      <h1>Terms and Conditions</h1>
      <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>Acceptance of Terms</h2>
      <p>By using DobiTracker, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
      
      <h2>Service Description</h2>
      <p>DobiTracker is a notification capture and management system that allows users to:</p>
      <ul>
        <li>Capture notifications from Android devices</li>
        <li>View and manage captured notifications through a web portal</li>
        <li>Access administrative features (for admin users)</li>
      </ul>
      
      <h2>User Responsibilities</h2>
      <p>Users are responsible for:</p>
      <ul>
        <li>Providing accurate information during registration</li>
        <li>Maintaining the security of their account credentials</li>
        <li>Using the service in compliance with applicable laws</li>
        <li>Not attempting to circumvent security measures</li>
      </ul>
      
      <h2>Prohibited Uses</h2>
      <p>You may not use DobiTracker to:</p>
      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on the rights of others</li>
        <li>Transmit malicious code or harmful content</li>
        <li>Attempt to gain unauthorized access to our systems</li>
        <li>Use the service for any illegal or unauthorized purpose</li>
      </ul>
      
      <h2>Privacy and Data Protection</h2>
      <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
      
      <h2>Account Termination</h2>
      <p>We reserve the right to terminate or suspend your account at any time for violation of these terms or for any other reason at our discretion.</p>
      
      <h2>Changes to Terms</h2>
      <p>We may update these Terms and Conditions from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
    `;

    // Privacy Policy
    const privacyContent = `
      <h1>Privacy Policy</h1>
      <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h2>Information We Collect</h2>
      <p>DobiTracker collects the following types of information:</p>
      
      <h3>Personal Information</h3>
      <ul>
        <li>Name and email address (during registration)</li>
        <li>Device ID and Android ID (for device verification)</li>
        <li>Account credentials and preferences</li>
      </ul>
      
      <h3>Notification Data</h3>
      <ul>
        <li>Notification content and metadata</li>
        <li>App names and package information</li>
        <li>Timestamps and notification types</li>
      </ul>
      
      <h3>Usage Information</h3>
      <ul>
        <li>Login times and session data</li>
        <li>Feature usage and interaction patterns</li>
        <li>Device status and connectivity information</li>
      </ul>
      
      <h2>How We Use Your Information</h2>
      <p>We use the collected information to:</p>
      <ul>
        <li>Provide and maintain our notification capture service</li>
        <li>Authenticate users and verify device ownership</li>
        <li>Display notifications in your personal dashboard</li>
        <li>Provide administrative features for admin users</li>
        <li>Improve our service and develop new features</li>
        <li>Ensure security and prevent abuse</li>
      </ul>
      
      <h2>Data Storage and Security</h2>
      <p>We implement appropriate security measures to protect your information:</p>
      <ul>
        <li>Data is encrypted in transit and at rest</li>
        <li>Access controls limit who can view your data</li>
        <li>Regular security audits and updates</li>
        <li>Secure database storage with backup systems</li>
      </ul>
      
      <h2>Data Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
      <ul>
        <li>When required by law or legal process</li>
        <li>To protect our rights and prevent fraud</li>
        <li>With your explicit consent</li>
      </ul>
      
      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your account and data</li>
        <li>Opt out of certain data processing activities</li>
      </ul>
      
      <h2>Data Retention</h2>
      <p>We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time.</p>
      
      <h2>Contact Us</h2>
      <p>If you have questions about this Privacy Policy, please contact us through our support channels.</p>
    `;

    // Create the documents
    console.log('📄 Creating Disclaimer...');
    const disclaimer = await createDocument({
      type: 'disclaimer',
      title: 'Disclaimer',
      html_content: disclaimerContent.trim()
    });
    console.log(`✅ Disclaimer created with ID: ${disclaimer.id}`);

    console.log('📄 Creating Terms and Conditions...');
    const terms = await createDocument({
      type: 'terms-and-conditions',
      title: 'Terms and Conditions',
      html_content: termsContent.trim()
    });
    console.log(`✅ Terms and Conditions created with ID: ${terms.id}`);

    console.log('📄 Creating Privacy Policy...');
    const privacy = await createDocument({
      type: 'privacy-policy',
      title: 'Privacy Policy',
      html_content: privacyContent.trim()
    });
    console.log(`✅ Privacy Policy created with ID: ${privacy.id}`);

    console.log('🎉 All legal documents created successfully!');
    console.log('📋 Documents available:');
    console.log('   - Disclaimer');
    console.log('   - Terms and Conditions');
    console.log('   - Privacy Policy');
    console.log('🔧 These documents can now be managed through the admin panel.');

  } catch (error) {
    console.error('❌ Error creating legal documents:', error);
    throw error;
  }
};

// Run the script if executed directly
if (require.main === module) {
  createLegalDocuments()
    .then(() => {
      console.log('✅ Legal documents creation completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Unhandled error during legal documents creation:', err);
      process.exit(1);
    });
}

module.exports = createLegalDocuments;
