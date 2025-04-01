import React from 'react';
import type { BusinessReport } from '../../../lib/report';

interface PerformanceChartsProps {
  report: BusinessReport;
}

export function PerformanceCharts({ report }: PerformanceChartsProps) {
  const revenueData = report.financial.revenue.streams.map(stream => ({
    label: stream,
    value: Math.floor(Math.random() * 100) // Simulated data
  }));

  const expenseData = report.financial.expenses.map(expense => ({
    label: expense,
    value: Math.floor(Math.random() * 100) // Simulated data
  }));

  const maxValue = Math.max(
    ...revenueData.map(d => d.value),
    ...expenseData.map(d => d.value)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-medium text-white mb-6">Revenue Distribution</h3>
        <div className="space-y-4">
          {revenueData.map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">{label}</span>
                <span className="text-white">{value}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-medium text-white mb-6">Expense Breakdown</h3>
        <div className="space-y-4">
          {expenseData.map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">{label}</span>
                <span className="text-white">{value}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}