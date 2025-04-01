import React from 'react';

export function Navigation() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-b from-black via-black/80 to-transparent pt-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a 
            href="#contact" 
            className="px-6 py-2 rounded-full bg-[#4A9DFF]/20 text-white hover:bg-[#4A9DFF]/30 transition-colors"
          >
            Contact Us
          </a>
          <div className="flex items-center gap-4">
            <a 
              href="/signin" 
              className="text-white hover:text-white/80 transition-colors"
            >
              Sign in
            </a>
            <a 
              href="/signup" 
              className="px-6 py-2 rounded-full bg-[#4A9DFF]/20 text-white hover:bg-[#4A9DFF]/30 transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}