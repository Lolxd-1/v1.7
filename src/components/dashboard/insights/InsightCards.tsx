import React from 'react';
import { ArrowUpRight, AlertTriangle, CheckCircle } from 'lucide-react';
import type { BusinessReport } from '../../../lib/report';

interface InsightCardProps {
  title: string;
  insights: string[];
  type: 'strength' | 'weakness' | 'opportunity';
}

function InsightCard({ title, insights, type }: InsightCardProps) {
  const colors = {
    strength: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
    weakness: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    opportunity: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[type]} backdrop-blur-xl rounded-xl p-6 
      border transition-all duration-300 hover:-translate-y-1`}>
      <h3 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
        {title}
        {type === 'strength' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
        {type === 'weakness' && <AlertTriangle className="w-5 h-5 text-red-400" />}
        {type === 'opportunity' && <ArrowUpRight className="w-5 h-5 text-blue-400" />}
      </h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="text-white/80 text-sm flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full mt-1.5 flex-shrink-0" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface InsightCardsProps {
  report: BusinessReport;
}

export function InsightCards({ report }: InsightCardsProps) {
  const strengths = [
    `${report.overview.services.length} diverse service offerings`,
    `Strong ${report.overview.targetAudience.join(', ')} customer base`,
    report.marketing.analytics.usage ? 'Data-driven decision making' : 'Traditional approach'
  ];

  const weaknesses = [
    report.financial.debt.exists ? 'Current debt obligations' : 'Limited financial leverage',
    report.marketing.pricing.dynamic ? 'Complex pricing structure' : 'Static pricing model',
    report.operations.staffing.management === 'Shared Responsibility' ? 'Distributed management' : 'Centralized control'
  ];

  const opportunities = [
    ...report.recommendations.slice(0, 3)
  ];

  return (
    <div className="space-y-6">
      <InsightCard title="Key Strengths" insights={strengths} type="strength" />
      <InsightCard title="Areas for Improvement" insights={weaknesses} type="weakness" />
      <InsightCard title="Growth Opportunities" insights={opportunities} type="opportunity" />
    </div>
  );
}