import React from 'react';
import { Download, Sparkles, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { formatBytes } from '../services/imageService';
import { ConversionState } from '../types';

interface ResultCardProps {
  state: ConversionState;
  onQualityChange: (val: number) => void;
  onGenerateAlt: () => void;
  onReset: () => void;
}

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

  if (!originalFile || !convertedBlob || !convertedUrl) return null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-700">
        <button 
          onClick={onReset}
          className="text-slate-400 hover:text-white flex items-center text-sm font-medium transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Start Over
        </button>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">Quality: {Math.round(quality * 100)}%</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => onQualityChange(parseFloat(e.target.value))}
              className="w-32 md:w-48 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          
          <a
            href={convertedUrl}
            download={`${originalFile.name.split('.')[0]}.webp`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            <Download size={18} />
            Download WebP
          </a>
        </div>
      </div>

      {/* Main Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Original */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-slate-400 font-medium text-sm">Original</span>
            <span className="text-slate-500 text-xs">{formatBytes(originalFile.size)} • {originalFile.type}</span>
          </div>
          <div className="relative group rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-slate-900 border border-slate-700 aspect-video flex items-center justify-center">
             <img 
               src={state.originalPreviewUrl || ''} 
               alt="Original" 
               className="max-w-full max-h-full object-contain p-2"
             />
          </div>
        </div>

        {/* Converted */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-green-400 font-medium text-sm flex items-center gap-2">
              <Check size={14} /> Converted WebP
            </span>
            <div className="flex items-center gap-2">
              {savings > 0 && (
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-bold">
                  -{savings.toFixed(0)}% Size
                </span>
              )}
              <span className="text-slate-300 text-xs font-bold">{formatBytes(convertedBlob.size)}</span>
            </div>
          </div>
          <div className="relative group rounded-2xl overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-slate-900 border border-green-900/30 ring-2 ring-green-500/20 aspect-video flex items-center justify-center">
             {isConverting ? (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
             ) : (
               <img 
                 src={convertedUrl} 
                 alt="Converted WebP" 
                 className="max-w-full max-h-full object-contain p-2"
               />
             )}
          </div>
        </div>

      </div>

      {/* AI Features */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-4">
            <div>
               <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                 <Sparkles className="text-purple-400" size={20} />
                 AI Accessibility Assistant
               </h3>
               <p className="text-slate-400 text-sm mt-1">
                 Use Gemini 2.5 Flash to automatically generate descriptive alt text for your new WebP image.
               </p>
            </div>
            
            {!aiAltText && (
              <button
                onClick={onGenerateAlt}
                disabled={isGeneratingAi}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all
                  ${isGeneratingAi 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                  }
                `}
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Alt Text
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}
          </div>

          {aiAltText && (
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Generated Alt Text</span>
              <p className="text-slate-200 font-mono text-sm leading-relaxed select-all">
                {aiAltText}
              </p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(aiAltText)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                >
                  <span className="hover:underline">Copy to clipboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
