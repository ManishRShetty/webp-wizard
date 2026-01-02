import React, { useCallback, useState } from 'react';
import { Upload, FileUp, Sparkles } from 'lucide-react';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelect }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files?.length) {
      const pFiles = Array.from<File>(e.dataTransfer.files).filter(file =>
        file.type.startsWith('image/')
      );
      if (pFiles.length > 0) {
        onFilesSelect(pFiles);
      }
    }
  }, [onFilesSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const pFiles = Array.from(e.target.files!).filter((file: File) =>
        file.type.startsWith('image/')
      );
      if (pFiles.length > 0) {
        onFilesSelect(pFiles);
      }
    }
  }, [onFilesSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        group relative w-full h-80 rounded-[32px] border-2 border-dashed transition-all duration-500 ease-out cursor-pointer overflow-hidden
        flex flex-col items-center justify-center gap-6
        ${isDragActive
          ? 'border-matrix-green/80 bg-matrix-green/5 shadow-[0_0_50px_-10px_rgba(0,255,65,0.2)]'
          : 'border-white/10 bg-white/[0.02] hover:border-matrix-green/40 hover:bg-white/[0.04]'
        }
      `}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
      />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className={`relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 transition-transform duration-500 ${isDragActive ? 'scale-110 border-matrix-green/50' : 'group-hover:scale-105 group-hover:border-white/20'}`}>
        {isDragActive ? (
          <FileUp className="w-8 h-8 text-matrix-green animate-bounce" />
        ) : (
          <Upload className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
        )}
      </div>

      <div className="relative z-10 text-center space-y-2">
        <h3 className="text-2xl font-medium tracking-tight text-white group-hover:text-matrix-green transition-colors duration-300">
          {isDragActive ? "Release to Initialize" : "Drop Images Here"}
        </h3>
        <p className="text-sm text-white/40 font-mono tracking-wide">
          OR CLICK TO BROWSE SYSTEM
        </p>
      </div>

      {/* Floating Sparkle Hint */}
      <div className="absolute bottom-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-matrix-green/10 border border-matrix-green/20 text-[10px] font-mono tracking-widest text-matrix-green uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <Sparkles className="w-3 h-3" />
        <span>Supports JPG, PNG, TIFF</span>
      </div>
    </div>
  );
};