import React, { useState, useEffect } from 'react';
import { SimulationInput } from './SimulationInput';
import { SimulationResults } from './SimulationResults';
import { fetchAnalysis } from './utils/api';
import { getReport } from '../../lib/report';
import { getOrCreateSession } from '../../lib/supabase';
import type { BusinessReport } from '../../lib/report';

export function SimulationView() {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [businessReport, setBusinessReport] = useState<BusinessReport | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const sessionId = await getOrCreateSession();
        const report = await getReport(sessionId);
        setBusinessReport(report);
      } catch (error) {
        console.error('Error loading business report:', error);
      }
    };

    loadReport();
  }, []);

  const handleSubmit = async (value: string) => {
    setIsLoading(true);
    setIdea(value);
    
    try {
      const [optimistic, neutral, disruptive] = await Promise.all([
        fetchAnalysis(value, 'optimistic', businessReport),
        fetchAnalysis(value, 'neutral', businessReport),
        fetchAnalysis(value, 'disruptive', businessReport)
      ]);

      setResults({
        optimistic,
        neutral,
        disruptive
      });
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestion = async (perspective: string, question: string) => {
    return await fetchAnalysis(idea, perspective, businessReport, question);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-4 py-6">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Business Idea Simulator
        </h1>
        <p className="text-white/70">
          Analyze your business idea from multiple perspectives
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {!results ? (
          <SimulationInput onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <SimulationResults 
            results={results} 
            idea={idea}
            onReset={() => {
              setResults(null);
              setIdea('');
            }}
            onAskQuestion={handleQuestion}
          />
        )}
      </div>
    </div>
  );
}