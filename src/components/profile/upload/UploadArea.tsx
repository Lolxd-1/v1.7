import React from 'react';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadAreaProps {
  onFileSelect: () => void;
  onClear: () => void;
  uploadedImage: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export function UploadArea({ 
  onFileSelect, 
  onClear, 
  uploadedImage, 
  fileInputRef,
  isLoading = false 
}: UploadAreaProps) {
  if (!uploadedImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-dashed border-white/20 rounded-2xl p-8
          hover:border-white/40 transition-colors cursor-pointer
          bg-gradient-to-br from-white/5 to-white/[0.02]"
        onClick={onFileSelect}
      >
        <div className="flex flex-col items-center text-center">
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-white/40 mb-4 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-white/40 mb-4" />
          )}
          <h3 className="text-xl font-medium text-white mb-2">Upload Menu Image</h3>
          <p className="text-white/60 mb-4">Click to upload or drag and drop</p>
          <p className="text-white/40 text-sm">Supported formats: PNG, JPG, JPEG</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm
        border border-white/10 p-4 group"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onClear}
          disabled={isLoading}
          className="p-2 bg-red-500/20 rounded-full text-red-400
            hover:bg-red-500/30 transition-colors transform hover:scale-105
            opacity-0 group-hover:opacity-100 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete image"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onFileSelect}
          disabled={isLoading}
          className="p-2 bg-white/10 rounded-full text-white/70
            hover:bg-white/20 hover:text-white transition-colors transform hover:scale-105
            opacity-0 group-hover:opacity-100 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload new image"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <div className="aspect-video relative rounded-lg overflow-hidden">
        <img
          src={uploadedImage}
          alt="Uploaded menu"
          className="w-full h-full object-cover transition-transform duration-300
            group-hover:scale-105"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}