import React from 'react';
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { SocialLinks } from './SocialLinks';

export function HeroContent() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black pointer-events-none" />

      <Navigation />

      <motion.div 
        className="relative z-[1] max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1 className="text-[8.5rem] font-bold text-white leading-none tracking-tight mb-6">
          AI Consultant
        </h1>

        <h2 className="text-4xl text-white/90 font-medium leading-tight mb-32">
          Your end-to-end personal<br />
          business <span className="text-[#FF4545]">ai</span> consultant
        </h2>

        <div className="space-y-8">
          <p className="text-4xl text-white font-medium">
            Ready to Improve your business in{' '}
            <span className="text-[#4A9DFF]">20 mins</span> ?
          </p>

          <motion.a 
            href="/select"
            className="inline-block px-12 py-4 text-xl font-medium text-black bg-white rounded-full
              hover:bg-white/90 transition-all duration-300 transform hover:scale-105"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Let's Dive in
          </motion.a>
        </div>
      </motion.div>

      <SocialLinks />
    </div>
  );
}