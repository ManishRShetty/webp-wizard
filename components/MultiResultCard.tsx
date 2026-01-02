import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, RefreshCw, Check, ArrowRight, Copy, Archive, X, ChevronDown, ChevronUp, Layers, Terminal } from 'lucide-react';
import { formatBytes } from '../services/imageService';
import { FileConversionItem, MultiConversionState } from '../types';
import JSZip from 'jszip';

interface MultiResultCardProps {
    state: MultiConversionState;
    onQualityChange: (val: number) => void;
    onGenerateAlt: (fileId: string) => void;
    onRemoveFile: (fileId: string) => void;
    onReset: () => void;
}

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

export const MultiResultCard: React.FC<MultiResultCardProps> = ({
    state,
    onQualityChange,
    onGenerateAlt,
    onRemoveFile,
    onReset
}) => {
    const { files, quality } = state;
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const completedFiles = files.filter(f => f.convertedBlob && !f.isConverting);
    const totalOriginalSize = files.reduce((acc, f) => acc + f.originalFile.size, 0);
    const totalConvertedSize = completedFiles.reduce((acc, f) => acc + (f.convertedBlob?.size || 0), 0);
    const totalSavings = totalOriginalSize > 0 ? ((totalOriginalSize - totalConvertedSize) / totalOriginalSize) * 100 : 0;

    const handleDownloadAll = async () => {
        if (completedFiles.length === 0) return;

        setIsDownloadingAll(true);
        try {
            const zip = new JSZip();

            completedFiles.forEach(file => {
                if (file.convertedBlob) {
                    const fileName = `${file.originalFile.name.split('.')[0]}.webp`;
                    zip.file(fileName, file.convertedBlob);
                }
            });

            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'webp-images.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to create ZIP:', error);
        }
        setIsDownloadingAll(false);
    };

    if (files.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-6xl mx-auto space-y-8"
        >
            {/* --- Control Deck --- */}
            <div className="sticky top-6 z-50">
                <div className="absolute inset-0 bg-oled-black/80 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)]" />
                <div className="relative p-2 rounded-[24px] flex flex-col md:flex-row items-center gap-2 md:gap-4">

                    {/* Reset Action */}
                    <button
                        onClick={onReset}
                        className="group flex items-center justify-center w-12 h-12 rounded-[18px] bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-300"
                        title="Start Over"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    </button>

                    {/* Stats Display */}
                    <div className="hidden md:flex flex-col gap-1 px-4 border-l border-white/10">
                        <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Total Savings</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-medium text-matrix-green">-{totalSavings.toFixed(0)}%</span>
                            <span className="text-xs text-white/40 font-mono">{formatBytes(totalOriginalSize)} → {formatBytes(totalConvertedSize)}</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto h-[1px] md:h-8 bg-white/5 md:bg-transparent" />

                    {/* Quality Slider */}
                    <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-[18px] border border-white/5 w-full md:w-auto">
                        <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Quality</span>
                        <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={quality}
                            onChange={(e) => onQualityChange(parseFloat(e.target.value))}
                            className="w-full md:w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-matrix-green hover:accent-matrix-green/80 transition-colors"
                        />
                        <span className="text-sm font-mono text-matrix-green w-10 text-right">{Math.round(quality * 100)}%</span>
                    </div>

                    {/* Download Action */}
                    <motion.button
                        onClick={handleDownloadAll}
                        disabled={isDownloadingAll || completedFiles.length === 0}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-[18px] font-bold text-sm hover:bg-matrix-green transition-colors shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <Archive size={18} strokeWidth={2.5} />
                        <span className="tracking-tight">{isDownloadingAll ? 'Archiving...' : 'Download All'}</span>
                    </motion.button>
                </div>
            </div>

            {/* --- Bento Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {files.map((file, index) => (
                        <ImageCard
                            key={file.id}
                            file={file}
                            index={index}
                            isExpanded={expandedCard === file.id}
                            onToggleExpand={() => setExpandedCard(expandedCard === file.id ? null : file.id)}
                            onGenerateAlt={() => onGenerateAlt(file.id)}
                            onRemove={() => onRemoveFile(file.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// --- Individual Image Card ---
interface ImageCardProps {
    file: FileConversionItem;
    index: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onGenerateAlt: () => void;
    onRemove: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
    file,
    index,
    isExpanded,
    onToggleExpand,
    onGenerateAlt,
    onRemove
}) => {
    const [copied, setCopied] = useState(false);
    const { originalFile, convertedBlob, convertedUrl, isConverting, savings, aiAltText, isGeneratingAi, error } = file;

    const handleCopy = () => {
        if (aiAltText) {
            navigator.clipboard.writeText(aiAltText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ ...springConfig, delay: index * 0.05 }}
            className="group relative rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-matrix-green/30 transition-all duration-500 hover:bg-white/[0.04]"
        >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <div className="pointer-events-auto">
                    {savings > 0 && !isConverting && (
                        <div className="px-3 py-1 rounded-full text-[10px] font-bold bg-matrix-green/10 text-matrix-green border border-matrix-green/20 backdrop-blur-md font-mono">
                            SAVED {savings.toFixed(0)}%
                        </div>
                    )}
                </div>
                <button
                    onClick={onRemove}
                    className="pointer-events-auto p-2 rounded-full bg-black/40 text-white/40 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Image Preview */}
            <div className="relative aspect-[4/3] bg-black/50 overflow-hidden">
                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.1]"
                    style={{
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {isConverting ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 backdrop-blur-sm z-10">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-matrix-green rounded-full animate-spin" />
                        <span className="text-xs font-mono text-matrix-green animate-pulse">PROCESSING_MATRIX...</span>
                    </div>
                ) : convertedUrl ? (
                    <img
                        src={convertedUrl}
                        alt={originalFile.name}
                        className="w-full h-full object-contain relative z-5 p-8 transition-transform duration-700 group-hover:scale-105"
                    />
                ) : null}
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h4 className="text-sm font-medium text-white truncate w-40" title={originalFile.name}>
                            {originalFile.name.split('.')[0]}.webp
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-white/30 font-mono">{formatBytes(originalFile.size)}</span>
                            <ArrowRight size={10} className="text-white/20" />
                            <span className="text-[10px] text-matrix-green font-mono">{convertedBlob ? formatBytes(convertedBlob.size) : '...'}</span>
                        </div>
                    </div>

                    {convertedUrl && !isConverting && (
                        <a
                            href={convertedUrl}
                            download={`${originalFile.name.split('.')[0]}.webp`}
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                            title="Download"
                        >
                            <Download size={18} />
                        </a>
                    )}
                </div>

                {/* AI Section with Glassmorphism */}
                <div className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/5">
                    {!aiAltText ? (
                        <button
                            onClick={onGenerateAlt}
                            disabled={isGeneratingAi || isConverting || !convertedBlob}
                            className="w-full h-10 flex items-center justify-center gap-2 text-xs font-medium text-white/50 hover:text-matrix-green hover:bg-matrix-green/5 transition-all disabled:opacity-50"
                        >
                            <Sparkles size={14} />
                            {isGeneratingAi ? 'Analyzing Vision Model...' : 'Generate Alt Text'}
                        </button>
                    ) : (
                        <div>
                            <div className="p-3 bg-black/20 text-xs text-white/70 leading-relaxed font-light border-b border-white/5">
                                "{aiAltText}"
                            </div>
                            <div className="flex">
                                <button
                                    onClick={handleCopy}
                                    className="flex-1 py-2 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider text-white/40 hover:text-white hover:bg-white/5 transition-colors border-r border-white/5"
                                >
                                    {copied ? <Check size={12} className="text-matrix-green" /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy Text'}
                                </button>
                                <div className="px-3 py-2 flex items-center justify-center text-white/20 bg-black/20">
                                    <Terminal size={12} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
