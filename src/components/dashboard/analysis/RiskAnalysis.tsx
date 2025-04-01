import React from 'react';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import type { BusinessReport } from '../../../lib/report';

interface RiskCardProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

function RiskCard({ title, description, severity, recommendation }: RiskCardProps) {
  const severityColors = {
    low: 'border-emerald-500/30 from-emerald-500/10 to-emerald-500/5',
    medium: 'border-yellow-500/30 from-yellow-500/10 to-yellow-500/5',
    high: 'border-red-500/30 from-red-500/10 to-red-500/5'
  };

  const iconColors = {
    low: 'text-emerald-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  return (
    <div className={`border ${severityColors[severity]} bg-gradient-to-br 
      backdrop-blur-xl rounded-xl p-6 transition-all duration-300
      hover:scale-[1.02] hover:-translate-y-1`}>
      <div className="flex items-start gap-4">
        <div className={`${iconColors[severity]} p-2 bg-white/5 rounded-lg`}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium text-white mb-2">{title}</h4>
          <p className="text-white/70 text-sm mb-4">{description}</p>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <TrendingUp className="w-4 h-4" />
              <span>Recommendation:</span>
            </div>
            <p className="text-sm text-white/70 mt-2">{recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RiskAnalysisProps {
  report: BusinessReport;
}

export function RiskAnalysis({ report }: RiskAnalysisProps) {
  const risks = [
    {
      title: 'Financial Health',
      description: report.financial.debt.exists 
        ? 'Current debt obligations may impact cash flow'
        : 'Strong financial position with no significant debt',
      severity: report.financial.debt.exists ? 'medium' : 'low' as const,
      recommendation: report.financial.debt.exists
        ? 'Develop a structured debt management strategy'
        : 'Consider strategic investments for growth'
    },
    {
      title: 'Market Competition',
      description: report.competition.mainCompetitor
        ? `Direct competition from ${report.competition.mainCompetitor}`
        : 'Limited information about competitive landscape',
      severity: report.competition.mainCompetitor ? 'high' : 'medium' as const,
      recommendation: 'Implement competitive analysis and differentiation strategy'
    },
    {
      title: 'Operational Efficiency',
      description: `${report.operations.peakHours.length} identified peak hours requiring resource optimization`,
      severity: report.operations.peakHours.length > 2 ? 'medium' : 'low' as const,
      recommendation: 'Optimize staffing levels during peak hours'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Risk Analysis
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {risks.map((risk, index) => (
          <RiskCard key={index} {...risk} />
        ))}
      </div>
    </div>
  );
}