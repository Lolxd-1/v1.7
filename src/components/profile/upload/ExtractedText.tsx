import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExtractedTextProps {
  text: string;
}

export function ExtractedText({ text }: ExtractedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Extracted Text
      </h3>
      <div className="bg-black/20 rounded-lg p-8 max-h-[600px] overflow-y-auto
        whitespace-pre-wrap text-white/90 font-mono leading-relaxed
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
        hover:scrollbar-thumb-white/20">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {text.split('\n\n').map((section, index) => (
              <div key={index} className="space-y-3">
                {section.split('\n').map((line, lineIndex) => {
                  // Main heading (all caps)
                  if (line.toUpperCase() === line && line.length > 3) {
                    return (
                      <h2 key={lineIndex} className="text-2xl font-bold text-white">
                        {line}
                      </h2>
                    );
                  }
                  // Subheading (ends with colon)
                  else if (line.endsWith(':')) {
                    return (
                      <h3 key={lineIndex} className="text-lg font-semibold text-white/90">
                        {line}
                      </h3>
                    );
                  }
                  // List items
                  else if (line.startsWith('-') || line.startsWith('•')) {
                    return (
                      <div key={lineIndex} className="pl-4 text-sm">
                        {line}
                      </div>
                    );
                  }
                  // Regular text
                  else {
                    return (
                      <p key={lineIndex} className="text-sm leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="border-l border-white/10 pl-8 space-y-8">
            {text.split('\n\n').slice(Math.ceil(text.split('\n\n').length / 2)).map((section, index) => (
              <div key={index} className="space-y-3">
                {section.split('\n').map((line, lineIndex) => {
                  // Main heading (all caps)
                  if (line.toUpperCase() === line && line.length > 3) {
                    return (
                      <h2 key={lineIndex} className="text-2xl font-bold text-white">
                        {line}
                      </h2>
                    );
                  }
                  // Subheading (ends with colon)
                  else if (line.endsWith(':')) {
                    return (
                      <h3 key={lineIndex} className="text-lg font-semibold text-white/90">
                        {line}
                      </h3>
                    );
                  }
                  // List items
                  else if (line.startsWith('-') || line.startsWith('•')) {
                    return (
                      <div key={lineIndex} className="pl-4 text-sm">
                        {line}
                      </div>
                    );
                  }
                  // Regular text
                  else {
                    return (
                      <p key={lineIndex} className="text-sm leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}