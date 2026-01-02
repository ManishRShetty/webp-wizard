import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Sparkles, RefreshCw, Check, ArrowRight, Copy, Archive, X, ChevronDown, ChevronUp } from 'lucide-react';
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
            className="w-full max-w-6xl mx-auto space-y-6"
        >
            {/* --- Control Bar --- */}
            <div className="sticky top-4 z-50">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10" />
                <div className="relative flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl">

                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors px-2"
                    >
                        <RefreshCw size={16} />
                        <span className="hidden sm:inline">Start Over</span>
                    </button>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-400">
                        <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                        <span>{formatBytes(totalOriginalSize)} → {formatBytes(totalConvertedSize)}</span>
                        {totalSavings > 0 && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                <span className="text-green-400">-{totalSavings.toFixed(0)}% saved</span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4 flex-1 justify-end">
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
                                className="w-20 md:w-28 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-colors"
                            />
                            <span className="text-sm font-bold text-white w-8 text-right">{Math.round(quality * 100)}%</span>
                        </div>

                        {/* Download All Button */}
                        <motion.button
                            onClick={handleDownloadAll}
                            disabled={isDownloadingAll || completedFiles.length === 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Archive size={16} strokeWidth={3} />
                            {isDownloadingAll ? 'Creating ZIP...' : `Download All (${completedFiles.length})`}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* --- Image Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ ...springConfig, delay: index * 0.05 }}
            className="relative group rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10 hover:border-white/20 transition-colors"
        >
            {/* Remove Button */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/50 text-gray-400 hover:text-white hover:bg-red-500/50 transition-colors opacity-0 group-hover:opacity-100"
            >
                <X size={14} />
            </button>

            {/* Image Preview */}
            <div className="relative aspect-video overflow-hidden">
                {/* Checkerboard Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                />

                {/* Loading State */}
                {isConverting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-10">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/50 z-10">
                        <span className="text-red-400 text-sm px-4 text-center">{error}</span>
                    </div>
                )}

                {/* Converted Image */}
                {convertedUrl && !isConverting && (
                    <img
                        src={convertedUrl}
                        alt={originalFile.name}
                        className="w-full h-full object-contain relative z-5"
                    />
                )}

                {/* Savings Badge */}
                {savings > 0 && !isConverting && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/20 backdrop-blur-sm">
                        -{savings.toFixed(0)}%
                    </div>
                )}
            </div>

            {/* Info Bar */}
            <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate" title={originalFile.name}>
                            {originalFile.name.split('.')[0]}.webp
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                            {formatBytes(originalFile.size)} → {convertedBlob ? formatBytes(convertedBlob.size) : '...'}
                        </p>
                    </div>

                    {/* Download Button */}
                    {convertedUrl && !isConverting && (
                        <a
                            href={convertedUrl}
                            download={`${originalFile.name.split('.')[0]}.webp`}
                            className="flex-shrink-0 p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Download"
                        >
                            <Download size={16} />
                        </a>
                    )}
                </div>

                {/* AI Alt Text Section */}
                <div className="pt-2 border-t border-white/5">
                    {!aiAltText ? (
                        <button
                            onClick={onGenerateAlt}
                            disabled={isGeneratingAi || isConverting || !convertedBlob}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles size={12} />
                            {isGeneratingAi ? 'Generating...' : 'Generate Alt Text'}
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <button
                                onClick={onToggleExpand}
                                className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                <span className="flex items-center gap-1">
                                    <Sparkles size={12} className="text-blue-400" />
                                    AI Alt Text
                                </span>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-black/30 rounded-lg p-2 flex gap-2 group/copy">
                                            <p className="flex-1 text-xs text-gray-300 leading-relaxed">
                                                {aiAltText}
                                            </p>
                                            <button
                                                onClick={handleCopy}
                                                className="self-start p-1 text-gray-500 hover:text-white transition-colors"
                                                title="Copy"
                                            >
                                                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
