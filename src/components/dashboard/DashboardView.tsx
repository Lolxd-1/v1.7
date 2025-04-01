import React from 'react';
import { IndianBusinessMetrics } from './metrics/IndianBusinessMetrics';
import { InsightCards } from './insights/InsightCards';
import { RevenueChart } from './charts/RevenueChart';
import { ExpensePieChart } from './charts/ExpensePieChart';
import { RiskAnalysis } from './analysis/RiskAnalysis';
import { DashboardHeader } from './layout/DashboardHeader';
import { DashboardSection } from './layout/DashboardSection';
import { useReport } from '../../hooks/useReport';

export function DashboardView() {
  const { report, isLoading, error } = useReport();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="h-full flex items-center justify-center text-white/70">
        {error || 'No report data available'}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <DashboardHeader businessType={report.overview.businessType} />

      <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-8 scrollbar-thin 
        scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <DashboardSection title="Key Metrics">
          <IndianBusinessMetrics report={report} />
        </DashboardSection>
        
        <DashboardSection title="Performance Analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 min-h-[400px]">
              <RevenueChart report={report} />
            </div>
            <div className="lg:col-span-1 min-h-[400px]">
              <ExpensePieChart report={report} />
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Business Insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <InsightCards report={report} />
            </div>
            <div className="lg:col-span-1">
              <RiskAnalysis report={report} />
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}