import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

export function SocialLinks() {
  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4 z-[100]">
      <a 
        href="https://twitter.com/aiconsultant" 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-white/70 hover:text-white transition-colors"
      >
        <Twitter className="w-6 h-6" />
      </a>
      <a 
        href="https://linkedin.com/company/aiconsultant" 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 text-white/70 hover:text-white transition-colors"
      >
        <Linkedin className="w-6 h-6" />
      </a>
    </div>
  );
}