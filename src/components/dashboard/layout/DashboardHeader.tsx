import React from 'react';

interface DashboardHeaderProps {
  businessType: string;
}

export function DashboardHeader({ businessType }: DashboardHeaderProps) {
  return (
    <div className="flex-shrink-0 px-6 py-8 bg-gradient-to-b from-black/40 to-transparent">
      <h1 className="text-3xl font-semibold text-white mb-3 truncate">
        Business Health Dashboard
      </h1>
      <p className="text-white/70 text-lg line-clamp-2">
        Comprehensive overview of your {businessType.toLowerCase()} business performance
      </p>
    </div>
  );
}