import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center text-medical-600 hover:text-medical-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-medical-500" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="medical-card space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to PneumoniaAI, a free AI-powered tool for detecting pneumonia from chest X-ray images. 
                This Privacy Policy explains how we handle your data when you use our service. 
                We are committed to protecting your privacy and ensuring the security of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">2.1 X-Ray Images</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you upload a chest X-ray image for analysis, we process the image to provide 
                    AI-powered detection results. <strong>We do not store your images on our servers.</strong> 
                    Images are processed in memory and immediately deleted after analysis.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">2.2 Usage Data</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may collect anonymous usage statistics such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Number of images processed</li>
                    <li>Types of results generated</li>
                    <li>Technical performance metrics</li>
                    <li>Error logs (without personal information)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">2.3 No Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We do not collect, store, or process any personal information such as:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>Names or contact information</li>
                    <li>Medical records or patient data</li>
                    <li>IP addresses (beyond basic analytics)</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use the information we collect solely for:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Providing AI analysis results for your uploaded X-ray images</li>
                  <li>Improving our AI model accuracy and performance</li>
                  <li>Maintaining and optimizing our service</li>
                  <li>Ensuring service security and preventing abuse</li>
                  <li>Generating anonymous usage statistics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Secure cloud infrastructure with regular security updates</li>
                  <li>Automatic deletion of uploaded images after processing</li>
                  <li>No permanent storage of user data</li>
                  <li>Regular security audits and monitoring</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or otherwise transfer your information to third parties. 
                We may share anonymous, aggregated usage statistics for research and improvement purposes, 
                but this data contains no personal or identifiable information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service may use third-party services for hosting and analytics. These services have their own 
                privacy policies, and we encourage you to review them. We only work with reputable providers 
                who maintain high privacy standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Since we do not store personal information, there is no personal data to access, modify, or delete. 
                  However, you have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use our service anonymously without providing any personal information</li>
                  <li>Stop using our service at any time</li>
                  <li>Contact us with questions about this privacy policy</li>
                  <li>Report any concerns about data handling</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                any personal information from children under 13. If you are a parent or guardian and believe 
                your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of the service after any changes constitutes acceptance of the new policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> ei@nsisong.com<br />
                  <strong>GitHub:</strong> <a href="https://github.com/1cbyc/image_classification" target="_blank" rel="noopener noreferrer" className="text-medical-600 hover:text-medical-700">github.com/1cbyc/image_classification</a><br />
                  <strong>Developer:</strong> <a href="https://github.com/1cbyc" target="_blank" rel="noopener noreferrer" className="text-medical-600 hover:text-medical-700">Isaac Emmanuel</a>
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 text-center">
                © 2024 Nsisong Labs. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 