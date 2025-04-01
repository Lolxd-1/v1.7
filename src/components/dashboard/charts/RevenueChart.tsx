import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import type { BusinessReport } from '../../../lib/report';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  report: BusinessReport;
}

export function RevenueChart({ report }: RevenueChartProps) {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const baseValue = 100;
  
  const data = {
    labels: months,
    datasets: [
      {
        label: 'Revenue Trend (₹ Lakhs)',
        data: months.map((_, index) => {
          let value = baseValue;
          
          if (report.operations.peakHours.length > 0) {
            value *= (1 + (report.operations.peakHours.length * 0.1));
          }

          if (report.financial.seasonalVariations?.exists) {
            if (['Oct', 'Nov', 'Dec'].includes(months[index])) {
              value *= 1.3;
            } else if (['Jul', 'Aug'].includes(months[index])) {
              value *= 1.2;
            }
          }

          return value + Math.random() * 20;
        }),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `₹ ${context.parsed.y.toFixed(2)} Lakhs`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: function(value: any) {
            return `₹${value}L`;
          },
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10
      hover:border-white/20 transition-all duration-300">
      <h3 className="text-lg font-medium text-white mb-6">Annual Revenue Trend</h3>
      <div className="h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}