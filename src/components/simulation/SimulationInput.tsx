import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface SimulationInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export function SimulationInput({ onSubmit, isLoading }: SimulationInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-xl font-medium text-white mb-6">
          What's your business idea?
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe your business idea or concept..."
            disabled={isLoading}
            className="w-full h-40 p-4 bg-black/20 rounded-xl border border-white/10 
              text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 
              focus:ring-blue-500/50 focus:border-blue-500/50"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!value.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl flex items-center gap-2
                hover:bg-blue-600 transition-all duration-300 disabled:opacity-50
                disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Idea
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}