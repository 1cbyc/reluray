import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image, X } from 'lucide-react';

const ImageUpload = ({ onUpload, loading }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false,
    disabled: loading
  });

  const clearImage = () => {
    setPreview(null);
    setFileName('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Chest X-Ray</h2>
        <p className="text-gray-600">Drag and drop your X-ray image or click to browse</p>
      </div>

      {!preview ? (
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive 
              ? 'border-starlink-black bg-starlink-gray-50' 
              : 'border-starlink-gray-300 hover:border-starlink-black hover:bg-starlink-gray-50'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${
              isDragActive ? 'text-starlink-black' : 'text-starlink-gray-400'
            }`} />
          </motion.div>
          <p className="text-lg font-medium text-starlink-black mb-2">
            {isDragActive ? 'Drop the image here' : 'Choose an X-ray image'}
          </p>
          <p className="text-sm text-starlink-gray-500">
            Supports JPEG, PNG, GIF, BMP (Max 10MB)
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="starlink-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image className="w-6 h-6 text-starlink-black" />
                <span className="font-medium text-starlink-black">{fileName}</span>
              </div>
              {!loading && (
                <motion.button
                  onClick={clearImage}
                  className="p-2 text-starlink-gray-400 hover:text-red-500 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
            <div className="relative">
              <img
                src={preview}
                alt="X-ray preview"
                className="w-full h-64 object-contain rounded-lg border border-starlink-gray-200"
              />
              {loading && (
                <div className="absolute inset-0 bg-starlink-white/80 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-starlink-black mx-auto mb-2"></div>
                    <p className="text-sm text-starlink-gray-600">Processing...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-center">
        <p className="text-xs text-starlink-gray-500">
          Your image is processed locally and not stored on our servers
        </p>
      </div>
    </div>
  );
};

export default ImageUpload; 