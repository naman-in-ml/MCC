import React from 'react';
import { Skeleton } from '@/components/shared/Skeleton';

export const GISMapSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden h-full min-h-[380px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between flex-wrap gap-2">
        <div className="space-y-1">
          <Skeleton className="h-4 w-44 rounded" />
          <Skeleton variant="subtle" className="h-3 w-56 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton variant="subtle" className="h-3 w-20 rounded" />
        </div>
      </div>

      {/* Main Body */}
      <div className="p-3 flex-1 flex flex-col md:flex-row gap-3.5 items-stretch min-w-0">
        {/* Left: Map Canvas Column (58% width, aspect locked) */}
        <div className="w-full md:w-[58%] flex flex-col justify-between gap-2 min-w-0">
          <div className="relative w-full aspect-[800/664] bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col items-center justify-center p-6">
            <Skeleton className="w-48 h-40 rounded-xl" />
            <div className="absolute bottom-2 left-2 flex gap-1">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-2">
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
              <Skeleton variant="subtle" className="h-2.5 w-16 rounded" />
            </div>
            <Skeleton variant="subtle" className="h-2.5 w-24 rounded" />
          </div>
        </div>

        {/* Right: District Live State Info Column */}
        <div className="w-full md:w-[42%] flex flex-col justify-between gap-3 min-w-0 p-3 bg-slate-50/70 rounded-lg border border-slate-200/80">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton variant="subtle" className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex justify-between">
                <Skeleton variant="subtle" className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-16 rounded font-mono" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="subtle" className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-20 rounded font-mono" />
              </div>
              <div className="flex justify-between">
                <Skeleton variant="subtle" className="h-3 w-20 rounded" />
                <Skeleton className="h-3 w-14 rounded font-mono" />
              </div>
            </div>
          </div>

          <Skeleton className="h-8 w-full rounded-md mt-auto" />
        </div>
      </div>
    </div>
  );
};
