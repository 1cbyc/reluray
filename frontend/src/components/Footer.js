import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Mail, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-starlink-white/95 backdrop-blur-md border-t border-starlink-gray-200 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-starlink-black rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-starlink-white" />
              </div>
              <span className="text-xl font-bold text-starlink-black">ReluRay</span>
            </div>
            <p className="text-starlink-gray-600 text-sm mb-4">
              Free AI-powered medical image analysis. 
              Built with cutting-edge deep learning technology.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4">
              <motion.a
                href="https://github.com/1cbyc/reluray"
                target="_blank"
                rel="noopener noreferrer"
                className="text-starlink-gray-400 hover:text-starlink-black transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="mailto:contact@reluray.com"
                className="text-starlink-gray-400 hover:text-starlink-black transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-starlink-black mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#upload" className="text-starlink-gray-600 hover:text-starlink-black transition-colors">
                  Upload X-Ray
                </a>
              </li>
              <li>
                <a href="#about" className="text-starlink-gray-600 hover:text-starlink-black transition-colors">
                  About the AI
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-starlink-gray-600 hover:text-starlink-black transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-starlink-gray-600 hover:text-starlink-black transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          {/* Medical Disclaimer */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <Shield className="w-5 h-5 text-starlink-gray-700" />
              <h3 className="font-semibold text-starlink-black">Medical Disclaimer</h3>
            </div>
            <p className="text-xs text-starlink-gray-500 leading-relaxed">
              This tool is for educational and research purposes only. 
              It is not intended to replace professional medical diagnosis. 
              Always consult with qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-starlink-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-starlink-gray-500">
              © 2025 ReluRay. Open source under MIT License.
            </p>
            <div className="flex items-center space-x-6 text-sm text-starlink-gray-500">
              <span>Made with ❤️ by <a href="https://github.com/1cbyc" target="_blank" rel="noopener noreferrer" className="text-starlink-black hover:underline font-medium">Isaac</a> for the medical community</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 