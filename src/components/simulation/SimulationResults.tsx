import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Send, Loader2 } from 'lucide-react';
import { tabs } from './config/tabs';

interface SimulationResultsProps {
  results: {
    optimistic: string;
    neutral: string;
    disruptive: string;
  };
  idea: string;
  onReset: () => void;
  onAskQuestion: (perspective: string, question: string) => Promise<string>;
}

export function SimulationResults({ results, idea, onReset, onAskQuestion }: SimulationResultsProps) {
  const [activeTab, setActiveTab] = useState<'optimistic' | 'neutral' | 'disruptive'>('optimistic');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{[key: string]: string[]}>({
    optimistic: [results.optimistic],
    neutral: [results.neutral],
    disruptive: [results.disruptive]
  });

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await onAskQuestion(activeTab, question);
      setConversation(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], `Q: ${question}`, `A: ${response}`]
      }));
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTabConfig = tabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Idea Summary */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-2">Your Business Idea</h3>
            <p className="text-white text-lg">{idea}</p>
          </div>
          <button
            onClick={onReset}
            className="p-2 text-white/70 hover:text-white rounded-lg
              hover:bg-white/5 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="grid grid-cols-3 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`p-4 rounded-xl border backdrop-blur-xl transition-all duration-300
              ${activeTab === tab.id 
                ? `bg-gradient-to-br ${tab.color} ${tab.borderColor}` 
                : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <tab.icon className={`w-6 h-6 ${tab.iconColor} mx-auto mb-2`} />
            <span className="text-white font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Analysis Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-8 border
          ${activeTabConfig.bgGradient} ${activeTabConfig.borderGradient}`}
      >
        <div className="prose prose-invert max-w-none">
          {conversation[activeTab].map((text, index) => (
            <div 
              key={index}
              className={`mb-6 ${text.startsWith('Q:') ? 'pl-4 border-l-2 border-white/20' : ''}`}
            >
              <div className="whitespace-pre-wrap text-white/90 leading-relaxed">
                {text}
              </div>
            </div>
          ))}
        </div>

        {/* Question Input */}
        <form onSubmit={handleQuestionSubmit} className="mt-8 flex gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask a question about the ${activeTabConfig.label.toLowerCase()} perspective...`}
            className="flex-1 bg-black/20 rounded-xl px-4 py-2 text-white placeholder-white/50
              border border-white/10 focus:outline-none focus:border-white/30
              transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white
              flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}