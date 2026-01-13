import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github } from 'lucide-react';

const Header = () => {
  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PneumoniaAI</h1>
              <p className="text-xs text-gray-500">Free Medical Analysis</p>
            </div>
          </motion.div>
          
          <motion.a
            href="https://github.com/1cbyc/reluray"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-medical-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">GitHub</span>
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 