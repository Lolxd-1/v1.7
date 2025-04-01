import React from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import type { BusinessReport } from '../../../lib/report';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10
      hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-white">{value}</h3>
          {trend && (
            <p className="text-sm text-emerald-400 mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className="text-white/40 group-hover:text-white/60 transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

interface BusinessMetricsProps {
  report: BusinessReport;
}

export function BusinessMetrics({ report }: BusinessMetricsProps) {
  const metrics = [
    {
      title: 'Revenue Streams',
      value: report.financial.revenue.streams.length.toString(),
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'Active income sources'
    },
    {
      title: 'Target Achievement',
      value: report.financial.revenue.targetAchievement,
      icon: <Target className="w-6 h-6" />,
      trend: 'Sales performance'
    },
    {
      title: 'Customer Base',
      value: report.overview.targetAudience.length.toString(),
      icon: <Users className="w-6 h-6" />,
      trend: 'Audience segments'
    },
    {
      title: 'Growth Rate',
      value: report.financial.seasonalVariations?.exists ? 'Variable' : 'Stable',
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'Revenue pattern'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}