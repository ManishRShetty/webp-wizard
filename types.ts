// Individual file conversion state
export interface FileConversionItem {
  id: string;
  originalFile: File;
  originalPreviewUrl: string | null;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  isConverting: boolean;
  error: string | null;
  savings: number;
  aiAltText: string | null;
  isGeneratingAi: boolean;
}

// Multi-file conversion state
export interface MultiConversionState {
  files: FileConversionItem[];
  quality: number; // 0.1 to 1.0
  hasFiles: boolean;
}

// Legacy single file state (kept for backwards compatibility)
export interface ConversionState {
  originalFile: File | null;
  originalPreviewUrl: string | null;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  isConverting: boolean;
  quality: number; // 0.1 to 1.0
  error: string | null;
  savings: number; // Percentage saved
  aiAltText: string | null;
  isGeneratingAi: boolean;
}

export interface DragDropProps {
  onFilesSelect: (files: File[]) => void;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
