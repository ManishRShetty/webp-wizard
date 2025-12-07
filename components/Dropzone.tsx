import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileImage, AlertCircle, Sparkles } from 'lucide-react';
import { DragDropProps } from '../types';

export const Dropzone = ({ onFileSelect }: DragDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Physics Configuration
  const springConfig = { type: "spring", stiffness: 400, damping: 25 };
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  };

  const validateAndProcessFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type');
      // Clear error after 2 seconds
      setTimeout(() => setError(null), 2000);
      return;
    }
    setError(null);
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent flickering when dragging over child elements
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, [validateAndProcessFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={error ? shakeAnimation : isDragging ? { scale: 1.02, y: -5 } : { scale: 1, y: 0 }}
      transition={springConfig}
      className={`
        relative group cursor-pointer w-full max-w-2xl mx-auto h-80 rounded-[32px] overflow-hidden
        border transition-colors duration-500
        ${isDragging
          ? 'border-blue-500/50 bg-blue-500/10'
          : error
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-white/10 bg-gray-900/40 hover:border-white/20 hover:bg-gray-900/60'
        }
        backdrop-blur-xl shadow-2xl
      `}
    >
      {/* Background Grid Pattern for Technical Depth */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleInputChange}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">

        {/* Dynamic Icon Container */}
        <div className="mb-6 relative">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={springConfig}
                className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]"
              >
                <AlertCircle className="w-10 h-10 text-red-500" />
              </motion.div>
            ) : isDragging ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                transition={springConfig}
                className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
              >
                <Upload className="w-10 h-10 text-blue-500" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={springConfig}
                className="group-hover:scale-110 transition-transform duration-300 w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
              >
                <FileImage className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
                {/* Subtle sparkle decoration */}
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <motion.h3
            layout
            className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${error ? 'text-red-400' : isDragging ? 'text-blue-400' : 'text-white'}`}
          >
            {error ? 'Invalid format' : isDragging ? 'Drop to upload' : 'Upload an image'}
          </motion.h3>

          <motion.p
            layout
            className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed"
          >
            {error
              ? 'Please strictly use PNG, JPG, or BMP formats.'
              : 'Drag and drop your file here, or click anywhere to browse.'
            }
          </motion.p>
        </div>

        {/* Active State Border Pulse (Only visible when dragging) */}
        {isDragging && (
          <motion.div
            layoutId="active-ring"
            className="absolute inset-4 rounded-2xl border-2 border-dashed border-blue-500/30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          />
        )}
      </div>
    </motion.div>
  );
};