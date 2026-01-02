import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropzone } from './components/Dropzone';
import { MultiResultCard } from './components/MultiResultCard';
import { readFileAsDataURL, loadImage, convertToWebP } from './services/imageService';
import { generateAltText } from './services/geminiService';
import { MultiConversionState, FileConversionItem } from './types';
import { Zap, Command, Sparkles, Wand2 } from 'lucide-react';
import Footer from './components/Footer';

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialState: MultiConversionState = {
  files: [],
  quality: 0.8,
  hasFiles: false,
};

export default function App() {
  const [state, setState] = useState<MultiConversionState>(initialState);
  const qualityRef = useRef(state.quality);

  // Keep quality ref in sync
  useEffect(() => {
    qualityRef.current = state.quality;
  }, [state.quality]);

  // Process a single file
  const processFile = useCallback(async (file: File, quality: number): Promise<Partial<FileConversionItem>> => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      const img = await loadImage(dataUrl);
      const webpBlob = await convertToWebP(img, quality);
      const webpUrl = URL.createObjectURL(webpBlob);
      const savings = ((file.size - webpBlob.size) / file.size) * 100;

      return {
        originalPreviewUrl: dataUrl,
        convertedBlob: webpBlob,
        convertedUrl: webpUrl,
        isConverting: false,
        savings,
        error: null,
      };
    } catch (err) {
      console.error(err);
      return {
        isConverting: false,
        error: "Failed to convert. File might be corrupted.",
      };
    }
  }, []);

  // Handle multiple file selection
  const handleFilesSelect = useCallback(async (files: File[]) => {
    // Create initial file items
    const initialItems: FileConversionItem[] = files.map(file => ({
      id: generateId(),
      originalFile: file,
      originalPreviewUrl: null,
      convertedBlob: null,
      convertedUrl: null,
      isConverting: true,
      error: null,
      savings: 0,
      aiAltText: null,
      isGeneratingAi: false,
    }));

    setState(prev => ({
      ...prev,
      files: [...prev.files, ...initialItems],
      hasFiles: true,
    }));

    // Process all files in parallel
    for (const item of initialItems) {
      const result = await processFile(item.originalFile, qualityRef.current);

      setState(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === item.id ? { ...f, ...result } : f
        ),
      }));
    }
  }, [processFile]);

  // Handle quality change
  const handleQualityChange = useCallback((newQuality: number) => {
    setState(prev => ({ ...prev, quality: newQuality }));
  }, []);

  // Re-process all files when quality changes (debounced)
  useEffect(() => {
    if (state.files.length === 0) return;

    const timer = setTimeout(async () => {
      // Mark all files as converting
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => ({ ...f, isConverting: true })),
      }));

      // Re-process each file
      for (const file of state.files) {
        // Revoke old URL
        if (file.convertedUrl) {
          URL.revokeObjectURL(file.convertedUrl);
        }

        const result = await processFile(file.originalFile, state.quality);

        setState(prev => ({
          ...prev,
          files: prev.files.map(f =>
            f.id === file.id ? { ...f, ...result } : f
          ),
        }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state.quality]); // Only trigger on quality change

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      state.files.forEach(file => {
        if (file.convertedUrl) {
          URL.revokeObjectURL(file.convertedUrl);
        }
      });
    };
  }, []);

  // Generate alt text for a specific file
  const handleGenerateAlt = async (fileId: string) => {
    const file = state.files.find(f => f.id === fileId);
    if (!file?.convertedBlob) return;

    setState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === fileId ? { ...f, isGeneratingAi: true } : f
      ),
    }));

    try {
      const text = await generateAltText(file.convertedBlob);
      setState(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileId ? { ...f, aiAltText: text, isGeneratingAi: false } : f
        ),
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileId ? {
            ...f,
            isGeneratingAi: false,
            aiAltText: "Error: Could not reach Gemini API."
          } : f
        ),
      }));
    }
  };

  // Remove a specific file
  const handleRemoveFile = (fileId: string) => {
    const file = state.files.find(f => f.id === fileId);
    if (file?.convertedUrl) {
      URL.revokeObjectURL(file.convertedUrl);
    }

    setState(prev => {
      const newFiles = prev.files.filter(f => f.id !== fileId);
      return {
        ...prev,
        files: newFiles,
        hasFiles: newFiles.length > 0,
      };
    });
  };

  // Reset all
  const handleReset = () => {
    state.files.forEach(file => {
      if (file.convertedUrl) {
        URL.revokeObjectURL(file.convertedUrl);
      }
    });
    setState(initialState);
  };

  return (
    <div className="relative min-h-screen bg-gray-950 text-slate-200 selection:bg-blue-500/30 overflow-x-hidden font-sans">

      {/* --- Atmospheric Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grainy Noise Texture (adds materiality) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Deep Ambient Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">

        {/* --- Header --- */}
        <motion.header
          initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
            <Wand2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium tracking-wide text-blue-200/80 uppercase">AI-Powered Compression</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
            WebP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Wizard</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Client-side image optimization with semantic understanding.
            <br className="hidden md:block" />
            Faster load times, zero server latency.
          </p>
        </motion.header>

        {/* --- Main Stage --- */}
        <main className="flex-grow flex flex-col items-center justify-start w-full">
          <AnimatePresence mode="wait">
            {!state.hasFiles ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-4xl"
              >
                <Dropzone onFilesSelect={handleFilesSelect} />

                {/* Feature Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <Feature
                    icon={<Zap />}
                    title="Batch Processing"
                    desc="Upload multiple images at once. Convert them all in parallel with a single click."
                    delay={0}
                  />
                  <Feature
                    icon={<Command />}
                    title="Smart Compression"
                    desc="Adaptive algorithms reduce size up to 80% while preserving visual fidelity."
                    delay={0.1}
                  />
                  <Feature
                    icon={<Sparkles />}
                    title="Gemini Vision"
                    desc="Google's multimodal AI sees your images and writes the alt text for you."
                    delay={0.2}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className="w-full"
                layout
              >
                <MultiResultCard
                  state={state}
                  onQualityChange={handleQualityChange}
                  onGenerateAlt={handleGenerateAlt}
                  onRemoveFile={handleRemoveFile}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
}

// --- Glass Feature Tile ---
const Feature = ({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + delay, type: "spring", stiffness: 300, damping: 20 }}
    className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/10 transition-colors"
  >
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
      {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 1.5 })}
    </div>
    <h3 className="text-lg font-medium text-white mb-3 tracking-wide">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed font-light">{desc}</p>
  </motion.div>
);