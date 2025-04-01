import React, { useState, useRef, useEffect } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExtractedText } from './upload/ExtractedText';
import { UploadArea } from './upload/UploadArea';
import { useImageUpload } from '../../hooks/useImageUpload';
import { performOCR } from '../../lib/ocr';
import type { UploadedImage } from '../../lib/storage';

interface UploadProps {}

export const Upload: React.FC<UploadProps> = () => {
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    images,
    isLoading,
    error: uploadError,
    loadImages,
    uploadImage,
    deleteImage,
    updateImageText
  } = useImageUpload();

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setExtractedText('');
    setIsProcessing(false);
    const file = e.target.files?.[0];

    if (!file) {
      setError('No file selected.');
      return;
    }

    try {
      const uploadedImage = await uploadImage(file);
      setCurrentImage(uploadedImage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    }
  };

  const handleExtract = async () => {
    if (!currentImage) {
      setError('Please upload an image first.');
      return;
    }

    if (!canvasRef.current) {
      setError('Canvas not initialized.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentImage.url;

      img.onload = async () => {
        try {
          const result = await performOCR(img, canvasRef.current!);
          setExtractedText(result.formatted);
          
          if (currentImage.id) {
            await updateImageText(currentImage.id, result.formatted);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to process image');
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load image');
        setIsProcessing(false);
      };
    } catch (err) {
      setError('Failed to start image processing');
      setIsProcessing(false);
    }
  };

  const handleClear = async () => {
    if (currentImage?.id) {
      try {
        await deleteImage(currentImage.id);
        setCurrentImage(null);
        setExtractedText('');
        setError('');
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete image');
      }
    }
  };

  // Display previously uploaded images if available
  useEffect(() => {
    if (images.length > 0 && !currentImage) {
      const lastImage = images[0];
      setCurrentImage(lastImage);
      if (lastImage.extractedText) {
        setExtractedText(lastImage.extractedText);
      }
    }
  }, [images, currentImage]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-4 py-6">
        <h1 className="text-3xl font-semibold text-white mb-2">Menu Upload & Extraction</h1>
        <p className="text-white/70">Upload your menu images and extract text content automatically</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-8">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <UploadArea
            onFileSelect={() => fileInputRef.current?.click()}
            onClear={handleClear}
            uploadedImage={currentImage?.url || null}
            fileInputRef={fileInputRef}
            isLoading={isLoading}
          />

          {currentImage && (
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg
                  hover:bg-red-500/30 transition-colors flex items-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Image
              </button>
              <button
                onClick={handleExtract}
                disabled={isProcessing || isLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg
                  hover:bg-blue-600 transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Extract Text
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {(error || uploadError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-4 bg-red-500/10 text-red-400
                rounded-lg border border-red-500/20"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error || uploadError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {extractedText && <ExtractedText text={extractedText} />}
        </AnimatePresence>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};