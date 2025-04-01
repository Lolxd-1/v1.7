import React from 'react';
import { IndianRupee, Users, TrendingUp, Clock } from 'lucide-react';
import { MetricCard } from './MetricCard';
import type { BusinessReport } from '../../../lib/report';

interface IndianBusinessMetricsProps {
  report: BusinessReport;
}

export function IndianBusinessMetrics({ report }: IndianBusinessMetricsProps) {
  const getMonthlyRevenue = () => {
    const base = 10;
    switch (report.financial.revenue.targetAchievement) {
      case 'Always (≥90%)':
        return (base * 1.2).toFixed(1);
      case 'Most of the Time (70-89%)':
        return base.toFixed(1);
      case 'Sometimes (50-69%)':
        return (base * 0.8).toFixed(1);
      default:
        return (base * 0.6).toFixed(1);
    }
  };

  const metrics = [
    {
      title: 'Monthly Revenue',
      value: getMonthlyRevenue(),
      icon: <IndianRupee className="w-6 h-6" />,
      trend: 'Based on target achievement',
      currency: true
    },
    {
      title: 'Peak Hours',
      value: report.operations.peakHours.length.toString(),
      icon: <Clock className="w-6 h-6" />,
      trend: 'High traffic periods'
    },
    {
      title: 'Target Segments',
      value: report.overview.targetAudience.length.toString(),
      icon: <Users className="w-6 h-6" />,
      trend: 'Customer demographics'
    },
    {
      title: 'Service Types',
      value: report.overview.services.length.toString(),
      icon: <TrendingUp className="w-6 h-6" />,
      trend: 'Revenue streams'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}