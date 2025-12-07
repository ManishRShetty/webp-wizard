import React, { useState, useEffect, useCallback } from 'react';
import { Dropzone } from './components/Dropzone';
import { ResultCard } from './components/ResultCard';
import { readFileAsDataURL, loadImage, convertToWebP } from './services/imageService';
import { generateAltText } from './services/geminiService';
import { ConversionState } from './types';
import { Zap, Command, Sparkles } from 'lucide-react';

const initialState: ConversionState = {
  originalFile: null,
  originalPreviewUrl: null,
  convertedBlob: null,
  convertedUrl: null,
  isConverting: false,
  quality: 0.8,
  error: null,
  savings: 0,
  aiAltText: null,
  isGeneratingAi: false,
};

export default function App() {
  const [state, setState] = useState<ConversionState>(initialState);

  // Process image conversion
  const processImage = useCallback(async (file: File, quality: number) => {
    setState(prev => ({ ...prev, isConverting: true, error: null }));
    
    try {
      const dataUrl = await readFileAsDataURL(file);
      const img = await loadImage(dataUrl);
      const webpBlob = await convertToWebP(img, quality);
      const webpUrl = URL.createObjectURL(webpBlob);

      // Calculate savings
      const savings = ((file.size - webpBlob.size) / file.size) * 100;

      setState(prev => ({
        ...prev,
        originalFile: file,
        originalPreviewUrl: dataUrl,
        convertedBlob: webpBlob,
        convertedUrl: prev.convertedUrl ? (URL.revokeObjectURL(prev.convertedUrl), webpUrl) : webpUrl,
        isConverting: false,
        savings,
        quality
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isConverting: false, 
        error: "Failed to convert image. The file might be corrupted or unsupported." 
      }));
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Reset AI state when new file is loaded
    setState(prev => ({ ...initialState, quality: prev.quality }));
    processImage(file, state.quality);
  };

  // Handle quality change with debounce-like behavior
  const handleQualityChange = (newQuality: number) => {
    setState(prev => ({ ...prev, quality: newQuality }));
  };

  // Trigger re-conversion when quality changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.originalFile) {
        processImage(state.originalFile, state.quality);
      }
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [state.quality, state.originalFile, processImage]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (state.convertedUrl) URL.revokeObjectURL(state.convertedUrl);
    };
  }, [state.convertedUrl]);

  // Handle AI Alt Text Generation
  const handleGenerateAlt = async () => {
    if (!state.convertedBlob) return;

    setState(prev => ({ ...prev, isGeneratingAi: true }));

    try {
      const text = await generateAltText(state.convertedBlob);
      setState(prev => ({ ...prev, aiAltText: text, isGeneratingAi: false }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        isGeneratingAi: false, 
        aiAltText: "Error: Could not reach Gemini API. Please check your configuration." 
      }));
    }
  };

  const handleReset = () => {
    if (state.convertedUrl) URL.revokeObjectURL(state.convertedUrl);
    setState(initialState);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 transition-colors duration-300">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-16">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4 pt-8 md:pt-0">
          <div className="inline-flex items-center justify-center p-3 bg-white/80 dark:bg-slate-800/50 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700/50 mb-4 shadow-xl backdrop-blur-md transition-colors duration-300">
            <Zap className="text-blue-500 dark:text-blue-400 mr-2" size={28} />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              WebP Wizard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto transition-colors duration-300">
            Transform your images into high-performance WebP format instantly. 
            Secure, client-side conversion with <span className="text-purple-600 dark:text-purple-400 font-medium">Gemini AI</span> accessibility powers.
          </p>
        </header>

        {/* Main Content */}
        <main className="transition-all duration-500 ease-in-out">
          {!state.originalFile ? (
            <div className="animate-fade-in-up">
              <Dropzone onFileSelect={handleFileSelect} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
                <Feature 
                  icon={<Zap size={20} />} 
                  title="Blazing Fast" 
                  desc="Client-side processing. Your images never leave your device." 
                />
                <Feature 
                  icon={<Command size={20} />} 
                  title="High Efficiency" 
                  desc="Reduce file size by up to 80% without visible quality loss." 
                />
                <Feature 
                  icon={<Sparkles size={20} />} 
                  title="AI Enhanced" 
                  desc="Generate SEO-friendly alt text automatically using Google Gemini." 
                />
              </div>
            </div>
          ) : (
            <ResultCard 
              state={state} 
              onQualityChange={handleQualityChange}
              onGenerateAlt={handleGenerateAlt}
              onReset={handleReset}
            />
          )}
        </main>
        
        {/* Footer */}
        <footer className="mt-24 text-center text-slate-500 dark:text-slate-600 text-sm pb-8">
          <p>© {new Date().getFullYear()} WebP Wizard. Built with React, Tailwind & Gemini.</p>
        </footer>
      </div>
    </div>
  );
}

// Helper component for features
const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/60 transition-colors shadow-sm">
    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-500 dark:text-blue-400 transition-colors">
      {icon}
    </div>
    <h3 className="text-slate-900 dark:text-white font-semibold mb-2 transition-colors">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">{desc}</p>
  </div>
);