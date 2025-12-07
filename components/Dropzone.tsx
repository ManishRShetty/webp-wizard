import React, { useCallback, useState } from 'react';
import { Upload, FileImage, AlertCircle } from 'lucide-react';
import { DragDropProps } from '../types';

export const Dropzone: React.FC<DragDropProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateAndProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, BMP, etc.)');
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`
        relative w-full max-w-2xl mx-auto h-80 rounded-3xl border-4 border-dashed transition-all duration-300 ease-out
        flex flex-col items-center justify-center cursor-pointer overflow-hidden group
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800/50 bg-white/50 dark:bg-slate-900/50'
        }
      `}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleInputChange}
      />
      
      <div className="z-10 text-center p-6 space-y-4">
        <div className={`
          w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
          ${isDragging ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-500 dark:text-blue-400 group-hover:scale-110'}
        `}>
          {isDragging ? <Upload size={40} /> : <FileImage size={40} />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors">
            {isDragging ? 'Drop it like it\'s hot!' : 'Drag & Drop your image'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
            Supports PNG, JPEG, BMP, GIF, TIFF
          </p>
        </div>

        <label 
          htmlFor="file-upload"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-full transition-colors cursor-pointer"
        >
          Or browse files
        </label