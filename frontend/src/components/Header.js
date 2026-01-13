import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Github } from 'lucide-react';
import { Button } from './ui/button';

const Header = () => {
  return (
    <motion.header 
      className="bg-starlink-white/95 backdrop-blur-md border-b border-starlink-gray-200 sticky top-0 z-50"
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
            <div className="w-10 h-10 bg-starlink-black rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-starlink-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-starlink-black">ReluRay</h1>
              <p className="text-xs text-starlink-gray-600">AI Medical Analysis</p>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
            >
              <a
                href="https://github.com/1cbyc/reluray"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 