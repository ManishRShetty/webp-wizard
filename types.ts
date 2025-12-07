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
  onFileSelect: (file: File) => void;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
