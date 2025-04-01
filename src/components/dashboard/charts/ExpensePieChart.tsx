import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import type { BusinessReport } from '../../../lib/report';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensePieChartProps {
  report: BusinessReport;
}

export function ExpensePieChart({ report }: ExpensePieChartProps) {
  const expenses = report.financial.expenses;
  const colors = [
    'rgb(59, 130, 246)',  // Blue
    'rgb(239, 68, 68)',   // Red
    'rgb(16, 185, 129)',  // Green
    'rgb(245, 158, 11)',  // Yellow
    'rgb(139, 92, 246)'   // Purple
  ];

  const getExpenseValue = (type: string) => {
    switch (type.toLowerCase()) {
      case 'raw materials/ingredients':
        return 35;
      case 'staffing costs':
        return 25;
      case 'rent/mortgage':
        return 20;
      case 'marketing expenses':
        return 10;
      default:
        return 10;
    }
  };

  const data = {
    labels: expenses,
    datasets: [
      {
        data: expenses.map(getExpenseValue),
        backgroundColor: colors,
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10
      hover:border-white/20 transition-all duration-300">
      <h3 className="text-lg font-medium text-white mb-6">Expense Distribution</h3>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}