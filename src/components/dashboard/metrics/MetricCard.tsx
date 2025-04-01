import React from 'react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  currency?: boolean;
}

export function MetricCard({ title, value, icon, trend, currency }: MetricCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl 
        blur-xl opacity-75 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl 
        rounded-2xl p-6 border border-white/10 transition-all duration-300
        hover:border-white/20 hover:shadow-lg hover:shadow-white/5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-white/60 text-sm mb-1 truncate" title={title}>
              {title}
            </p>
            <h3 className="text-2xl font-semibold text-white flex items-center gap-1 truncate">
              {currency && <span className="text-lg flex-shrink-0">₹</span>}
              <span className="truncate">{value}</span>
              {currency && <span className="text-lg text-white/60 flex-shrink-0">L</span>}
            </h3>
            {trend && (
              <p className="text-sm text-emerald-400 mt-2 flex items-center gap-1 truncate" 
                title={trend}>
                <TrendingUp className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{trend}</span>
              </p>
            )}
          </div>
          <div className="text-white/40 group-hover:text-white/60 transition-colors p-2 
            bg-white/5 rounded-lg flex-shrink-0">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}