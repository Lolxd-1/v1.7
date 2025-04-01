import React from 'react';
import { ArrowRight } from 'lucide-react';

export function SelectionPage() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="object-cover w-full h-full opacity-40"
        >
          <source 
            src="https://www.apple.com/105/media/us/mac-pro/2019/466faaf3-8832-4c34-8178-59c4f1af8e5e/anim/hero/large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black" />
      </div>

      <div className="relative z-10 px-4 lg:px-8 pt-32">
        <h1 className="text-4xl md:text-5xl font-semibold text-white text-center mb-4">
          Start Your Business Analysis Journey
        </h1>
        <p className="text-lg text-white/70 text-center mb-16 max-w-2xl mx-auto">
          Create an account to get personalized insights and recommendations for your business
        </p>

        <div className="max-w-md mx-auto">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl 
              blur-xl transition-all duration-500 group-hover:scale-105" />
            <div className="relative h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl 
              rounded-3xl p-8 border border-blue-500/30
              transition-all duration-500 hover:border-blue-400/50
              hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)]">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Get Started
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Sign up now to receive a comprehensive analysis tailored to your business needs
              </p>
              <a 
                href="/signup"
                className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 
                  text-white rounded-full transition-all duration-300 group-hover:scale-105"
              >
                Create Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}