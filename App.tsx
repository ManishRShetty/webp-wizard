import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dropzone } from './components/Dropzone';
import { ResultCard } from './components/ResultCard';
import { readFileAsDataURL, loadImage, convertToWebP } from './services/imageService';
import { generateAltText } from './services/geminiService';
import { ConversionState } from './types';
import { Zap, Command, Sparkles, Wand2 } from 'lucide-react';
import Footer from './components/footer';
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

  // --- Logic (Unchanged) ---
  const processImage = useCallback(async (file: File, quality: number) => {
    setState(prev => ({ ...prev, isConverting: true, error: null }));
    try {
      const dataUrl = await readFileAsDataURL(file);
      const img = await loadImage(dataUrl);
      const webpBlob = await convertToWebP(img, quality);
      const webpUrl = URL.createObjectURL(webpBlob);
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

  const handleFileSelect = (file: File) => {
    setState(prev => ({ ...initialState, quality: prev.quality }));
    processImage(file, state.quality);
  };

  const handleQualityChange = (newQuality: number) => {
    setState(prev => ({ ...prev, quality: newQuality }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.originalFile) processImage(state.originalFile, state.quality);
    }, 300);
    return () => clearTimeout(timer);
  }, [state.quality, state.originalFile, processImage]);

  useEffect(() => {
    return () => {
      if (state.convertedUrl) URL.revokeObjectURL(state.convertedUrl);
    };
  }, [state.convertedUrl]);

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
            {!state.originalFile ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full max-w-4xl"
              >
                <Dropzone onFileSelect={handleFileSelect} />

                {/* Feature Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <Feature
                    icon={<Zap />}
                    title="Instant Processing"
                    desc="Local WASM conversion. Your images never leave this browser tab."
                    delay={0}
                  />
                  <Feature
                    icon={<Command />}
                    title="Lossless Logic"
                    desc="Smart compression algorithms reduce size up to 80% with visual fidelity."
                    delay={0.1}
                  />
                  <Feature
                    icon={<Sparkles />}
                    title="Gemini Vision"
                    desc="Google's multimodal AI sees your image and writes the alt text for you."
                    delay={0.2}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className="w-full"
                // The ResultCard has its own internal animations, 
                // so we just handle the layout transition here
                layout
              >
                <ResultCard
                  state={state}
                  onQualityChange={handleQualityChange}
                  onGenerateAlt={handleGenerateAlt}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* --- Footer --- */}
        {/* <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 text-center"
        >
          <div className="inline-block px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="text-xs text-slate-500 font-mono">
              Designed for performance. Built with Next.js & Framer Motion.
            </p>
          </div>
        </motion.footer> */}
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