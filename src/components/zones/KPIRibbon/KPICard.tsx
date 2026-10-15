'use client';

import React from 'react';
import { MaterialIcon, MaterialIconName } from '@/components/shared/MaterialIcon';

export interface KPICardProps {
  icon: MaterialIconName;
  title: string;
  value: string | number;
  unit?: string;
  targetText: string;
  trendDirection?: 'up' | 'down';
  trendValue: string;
  positiveTrend?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  icon,
  title,
  value,
  unit,
  targetText,
  trendDirection,
  trendValue,
  positiveTrend = true,
}) => {
<<<<<<< HEAD
  return (
    <div className="bg-surface border border-borderLine-standard rounded-md p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between text-content-secondary mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-content-primary" />
          <span className="text-sm font-medium text-content-primary">{title}</span>
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-content-primary">
          {value}
          {unit && <span className="text-sm font-normal text-content-secondary ml-1">{unit}</span>}
        </div>
        <div className="flex items-center justify-between text-xs mt-2 text-content-muted">
          <span>{targetText}</span>
          <div
            className={`flex items-center gap-0.5 font-medium ${
              positiveTrend ? 'text-green-600' : 'text-red-600'
=======
  const isHealthy =
    (trendDirection === 'up' && positiveTrend) ||
    (trendDirection === 'down' && !positiveTrend);

  const isTargetMet =
    targetText.toLowerCase().includes('met') ||
    targetText.includes('साध्य') ||
    targetText.includes('सफल');

  return (
    <div className="bg-surface border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors">
      {/* 1. Header: Icon + Title */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MaterialIcon name={icon} size="sm" className="text-slate-500" />
          <div>
            <div className="text-xs font-semibold text-slate-700 leading-tight">{title}</div>
            {marathiTitle && (
              <div className="text-[10px] text-slate-500 font-medium">{marathiTitle}</div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Primary Metric */}
      <div className="mt-1">
        <div className="flex items-baseline gap-1.5 text-2xl font-bold font-mono tracking-tight text-slate-900">
          <span>{value}</span>
          {unit && <span className="text-xs font-semibold font-sans text-slate-500">{unit}</span>}
        </div>

        {/* 3. Supporting Context Footer */}
        <div className="flex items-center justify-between text-[11px] mt-2.5 pt-2 border-t border-slate-100">
          <span
            className={`font-medium px-1.5 py-0.5 rounded text-[10px] ${
              isTargetMet
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                : 'bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            {targetText}
          </span>
          <div
            className={`flex items-center gap-0.5 font-mono text-[10px] font-bold ${
              isHealthy ? 'text-emerald-700' : 'text-rose-600'
>>>>>>> d388acd7d9c13d47f4f611ec471fadaa4d324bd5
            }`}
          >
            {trendDirection === 'up' && <MaterialIcon name="arrow_upward" size="xs" />}
            {trendDirection === 'down' && <MaterialIcon name="arrow_downward" size="xs" />}
            <span>{trendValue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
