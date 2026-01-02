import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropzone } from './components/Dropzone';
import { MultiResultCard } from './components/MultiResultCard';
import { readFileAsDataURL, loadImage, convertToWebP } from './services/imageService';
import { generateAltText } from './services/geminiService';
import { MultiConversionState, FileConversionItem } from './types';
import { Zap, Command, Sparkles, Terminal } from 'lucide-react';
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

  useEffect(() => {
    qualityRef.current = state.quality;
  }, [state.quality]);

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

  const handleFilesSelect = useCallback(async (files: File[]) => {
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

  const handleQualityChange = useCallback((newQuality: number) => {
    setState(prev => ({ ...prev, quality: newQuality }));
  }, []);

  useEffect(() => {
    if (state.files.length === 0) return;

    const timer = setTimeout(async () => {
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => ({ ...f, isConverting: true })),
      }));

      for (const file of state.files) {
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
  }, [state.quality]);

  useEffect(() => {
    return () => {
      state.files.forEach(file => {
        if (file.convertedUrl) {
          URL.revokeObjectURL(file.convertedUrl);
        }
      });
    };
  }, []);

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

  const handleReset = () => {
    state.files.forEach(file => {
      if (file.convertedUrl) {
        URL.revokeObjectURL(file.convertedUrl);
      }
    });
    setState(initialState);
  };


  return (
    <div className="relative min-h-screen bg-oled-black text-white font-sans overflow-x-hidden selection:bg-matrix-green/30 selection:text-matrix-green">

      {/* Circuit Trace Background */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(#111 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
      <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-oled-black to-transparent z-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col min-h-screen">

        {/* Minimal Header */}
        <header className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group cursor-default"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-matrix-green/50 transition-colors duration-500">
              <Terminal className="w-5 h-5 text-white/50 group-hover:text-matrix-green transition-colors duration-500" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-medium tracking-tight">WebP Wizard</h1>
              <span className="text-xs text-white/30 font-mono tracking-widest uppercase">v2.0.0 // TERMINAL_NOIR</span>
            </div>
          </motion.div>
        </header>

        {/* Main Stage */}
        <main className="flex-grow flex flex-col items-center justify-start w-full">
          <AnimatePresence mode="wait">
            {!state.hasFiles ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-5xl"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    High-End Image Engineering.
                  </h2>
                  <p className="text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
                    Client-side compression with heavy-duty performance. <br className="hidden md:block" />
                    Powered by <span className="text-matrix-green">Gemini Vision</span> for semantic understanding.
                  </p>
                </div>

                <Dropzone onFilesSelect={handleFilesSelect} />

                {/* Benton Grid Features */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Feature
                    icon={<Zap />}
                    title="Parallel Processing"
                    desc="Multi-threaded batch conversion pipeline."
                  />
                  <Feature
                    icon={<Command />}
                    title="Smart Algorithms"
                    desc="Adaptive quantization for 80% size reduction."
                  />
                  <Feature
                    icon={<Sparkles />}
                    title="Neural Vision"
                    desc="Gemini 1.5 Pro generates alt text automatically."
                  />
                </div>
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

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="group p-8 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-matrix-green/30 hover:bg-white/[0.04] transition-all duration-500">
    <div className="mb-6 text-white/40 group-hover:text-matrix-green transition-colors duration-500">
      {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 1 })}
    </div>
    <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
    <p className="text-sm text-white/40 font-light leading-relaxed">{desc}</p>
  </div>
);