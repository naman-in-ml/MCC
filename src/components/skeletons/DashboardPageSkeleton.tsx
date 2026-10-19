import React from 'react';
import { KPIRibbonSkeleton } from './KPIRibbonSkeleton';
import { LeaderboardSkeleton } from './LeaderboardSkeleton';
import { ScoreDecompositionSkeleton } from './ScoreDecompositionSkeleton';
import { EmergencyAlertSkeleton } from './EmergencyAlertSkeleton';
import { LiveNewsQueueSkeleton } from './LiveNewsQueueSkeleton';
import { GISMapSkeleton } from './GISMapSkeleton';
import { TopLowerMatrixSkeleton } from './TopLowerMatrixSkeleton';
import { SocialMediaSkeleton } from './SocialMediaSkeleton';
import { LiveStreamingSkeleton } from './LiveStreamingSkeleton';

export const DashboardPageSkeleton: React.FC = () => {
  return (
    <div className="p-6 max-w-[1800px] w-full mx-auto flex flex-col gap-6 bg-[#f4f6fa]">
      {/* 1. Full-Width KPI Ribbon at Top */}
      <section className="w-full">
        <KPIRibbonSkeleton cardsCount={4} />
      </section>

      {/* 2. Decongested 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Column 1: Left Rail (3/12 on XL, 4/12 on LG) - Analytics & Rankings */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 min-w-0">
          <ScoreDecompositionSkeleton />
          <TopLowerMatrixSkeleton />
        </div>

        {/* Column 2: Center Rail (5/12 on XL, 4/12 on LG) - Map, Ticker & State Leaderboard */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-6 min-w-0">
          <GISMapSkeleton />

          {/* Breaking News Ticker Skeleton */}
          <div className="w-full h-11 bg-red-600/90 rounded-lg p-3 flex items-center justify-between gap-3 shadow-sm border border-red-700 overflow-hidden animate-pulse">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white/80" />
              <span className="h-4 w-24 bg-white/80 rounded" />
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="h-4 w-16 bg-red-700/80 rounded shrink-0" />
              <span className="h-4 w-64 bg-white/40 rounded" />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="h-4 w-12 bg-white/60 rounded" />
            </div>
          </div>

          <LeaderboardSkeleton />
        </div>

        {/* Column 3: Right Rail (4/12 on XL, 4/12 on LG) - Live Intelligence & Streaming */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 min-w-0">
          <SocialMediaSkeleton />
          <EmergencyAlertSkeleton isCollapsed={true} isCrisisRoute={false} />
          <LiveStreamingSkeleton />
          <LiveNewsQueueSkeleton />
        </div>
      </div>
    </div>
  );
};
