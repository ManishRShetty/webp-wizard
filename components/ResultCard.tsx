import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, RefreshCw, Check, ArrowRight, Image as ImageIcon, Copy } from 'lucide-react';
import { formatBytes } from '../services/imageService';
import { ConversionState } from '../types';

interface ResultCardProps {
  state: ConversionState;
  onQualityChange: (val: number) => void;
  onGenerateAlt: () => void;
  onReset: () => void;
}

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

export const ResultCard: React.FC<ResultCardProps> = ({
  state,
  onQualityChange,
  onGenerateAlt,
  onReset
}) => {
  const {
    originalFile,
    convertedBlob,
    convertedUrl,
    quality,
    savings,
    isConverting,
    aiAltText,
    isGeneratingAi
  } = state;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (aiAltText) {
      navigator.clipboard.writeText(aiAltText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!originalFile || !convertedBlob || !convertedUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* --- Control Bar --- */}
      <div className="sticky top-4 z-50">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-6 p-4 rounded-2xl">

          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors px-2"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">New Conversion</span>
          </button>

          <div className="flex items-center gap-6 flex-1 justify-end">
            {/* Quality Slider */}
            <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-full border border-white/5">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quality</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => onQualityChange(parseFloat(e.target.value))}
                className="w-24 md:w-32 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-colors"
              />
              <span className="text-sm font-bold text-white w-8 text-right">{Math.round(quality * 100)}%</span>
            </div>

            {/* Download Button */}
            <motion.a
              href={convertedUrl}
              download={`${originalFile.name.split('.')[0]}.webp`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              <Download size={16} strokeWidth={3} />
              Download
            </motion.a>
          </div>
        </div>
      </div>

      {/* --- Viewports Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Original Viewport */}
        <ViewportCard
          title="Original"
          fileSize={formatBytes(originalFile.size)}
          type={originalFile.type.split('/')[1].toUpperCase()}
        >
          <img
            src={state.originalPreviewUrl || ''}
            alt="Original"
            className="w-full h-full object-contain"
          />
        </ViewportCard>

        {/* Converted Viewport */}
        <ViewportCard
          title="WebP Output"
          fileSize={formatBytes(convertedBlob.size)}
          type="WEBP"
          highlight={true}
          badge={savings > 0 ? `-${savings.toFixed(0)}%` : undefined}
        >
          <AnimatePresence mode="wait">
            {isConverting ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-20"
              >
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.img
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springConfig}
                src={convertedUrl}
                alt="Converted"
                className="w-full h-full object-contain"
              />
            )}
          </AnimatePresence>
        </ViewportCard>
      </div>

      {/* --- Gemini AI Section --- */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-xl"
      >
        {/* Ambient Gemini Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">

            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="text-blue-400 fill-blue-400/20" size={20} />
                <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">
                  AI Accessibility
                </span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Generate descriptive alt text automatically using <strong>Gemini 2.5 Flash</strong>.
                Perfect for SEO and accessibility compliance.
              </p>
            </div>

            {!aiAltText && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGenerateAlt}
                disabled={isGeneratingAi}
                className="relative group overflow-hidden px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  {isGeneratingAi ? (
                    <>Thinking<span className="animate-pulse">...</span></>
                  ) : (
                    <>Generate with AI <ArrowRight size={16} /></>
                  )}
                </span>
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {aiAltText && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={springConfig}
                className="overflow-hidden"
              >
                <div className="bg-black/30 rounded-xl p-5 border border-white/5 flex gap-4 group">
                  <div className="flex-1 font-mono text-sm text-gray-300 leading-relaxed">
                    {aiAltText}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="self-start p-2 text-gray-500 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Sub-component: Viewport Card ---
// Extracted to keep the main logic clean and ensure visual consistency
interface ViewportCardProps {
  title: string;
  fileSize: string;
  type: string;
  children: React.ReactNode;
  highlight?: boolean;
  badge?: string;
}

const ViewportCard: React.FC<ViewportCardProps> = ({ title, fileSize, type, children, highlight, badge }) => (
  <div className="flex flex-col gap-3 group">
    {/* Header Info */}
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${highlight ? 'text-white' : 'text-gray-400'}`}>{title}</span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">
            {badge}
          </span>
        )}
      </div>
      <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
        <span>{type}</span>
        <span className="w-1 h-1 rounded-full bg-gray-700" />
        <span>{fileSize}</span>
      </div>
    </div>

    {/* The Viewport */}
    <div className={`
      relative aspect-video rounded-2xl overflow-hidden bg-gray-900/50 
      border transition-colors duration-300
      ${highlight
        ? 'border-white/10 group-hover:border-white/20'
        : 'border-white/5 group-hover:border-white/10'
      }
    `}>
      {/* Checkerboard Pattern for Transparency */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
      />

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  </div>
);