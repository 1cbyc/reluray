import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
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
              <FileText className="w-8 h-8 text-medical-500" />
              <h1 className="text-3xl font-bold text-gray-900">Terms of Use</h1>
            </div>
            <p className="text-gray-600">Last updated: December 2024</p>
          </div>

          {/* Important Notice */}
          <div className="medical-card mb-8 border-l-4 border-health-warning bg-yellow-50">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-health-warning mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Medical Disclaimer</h3>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  This tool is for educational and research purposes only. It is not intended to replace professional medical diagnosis. 
                  Always consult with a qualified healthcare provider for medical decisions. Results should not be used as the sole basis 
                  for treatment decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="medical-card space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using PneumoniaAI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                PneumoniaAI is a free, AI-powered tool that analyzes chest X-ray images to detect signs of pneumonia. 
                The service uses machine learning algorithms to provide preliminary analysis results. 
                The Service is provided "as is" and "as available" without any warranties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Medical Disclaimer</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>IMPORTANT:</strong> This tool is designed for educational and research purposes only. 
                  It is not intended to replace professional medical diagnosis, treatment, or advice.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Results should not be used as the sole basis for medical decisions</li>
                  <li>Always consult with qualified healthcare professionals for diagnosis and treatment</li>
                  <li>The accuracy of AI predictions may vary and should not be considered definitive</li>
                  <li>We are not responsible for any medical decisions made based on our analysis</li>
                  <li>In case of medical emergency, contact emergency services immediately</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  By using this service, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use the service only for legitimate medical research or educational purposes</li>
                  <li>Not upload images that contain personal identifying information</li>
                  <li>Not use the service for commercial purposes without permission</li>
                  <li>Not attempt to reverse engineer or compromise the service</li>
                  <li>Not upload malicious files or attempt to harm the service</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Nsisong Labs and are protected by international copyright, 
                  trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You retain ownership of any images you upload. By uploading images, you grant us a limited, non-exclusive license to process 
                  the images solely for the purpose of providing analysis results.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Nsisong Labs, its developers, or contributors be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your use or inability to use the Service</li>
                  <li>Any medical decisions made based on our analysis</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to or from the Service</li>
                  <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Nsisong Labs makes no warranties, expressed or implied, 
                  and hereby disclaims all warranties, including without limitation:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of results</li>
                  <li>Warranties that defects will be corrected</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain the Service's availability but cannot guarantee uninterrupted access. 
                The Service may be temporarily unavailable due to maintenance, updates, or technical issues. 
                We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms of Use at any time. We will notify users of any material changes 
                by posting the new Terms of Use on this page and updating the "Last updated" date. 
                Your continued use of the Service after any changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction 
                where Nsisong Labs operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Use, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> contact@pneumoniaai.com<br />
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

export default TermsOfUse; 