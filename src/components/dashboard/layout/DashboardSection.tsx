import React from 'react';

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-medium text-white/90 mb-4 truncate">
        {title}
      </h2>
      {children}
    </section>
  );
}