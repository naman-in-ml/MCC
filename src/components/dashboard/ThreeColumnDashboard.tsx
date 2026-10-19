'use client';

import React from 'react';
import { KPIRibbon } from '@/components/zones/KPIRibbon/KPIRibbon';
import { DistrictLeaderboard } from '@/components/zones/DistrictLeaderboard/DistrictLeaderboard';
import { ScoreDecomposition } from '@/components/zones/ScoreDecomposition/ScoreDecomposition';
import { GISMap } from '@/components/leadership/GISMap/GISMap';
import { BreakingNewsTicker } from '@/components/dashboard/BreakingNewsTicker';
import { TopLowerMatrix } from '@/components/leadership/TopLowerMatrix/TopLowerMatrix';
import { SocialMediaAnalysis } from '@/components/leadership/SocialMediaAnalysis/SocialMediaAnalysis';
import { EmergencyAlert } from '@/components/zones/EmergencyAlert/EmergencyAlert';
import { LiveNewsQueue } from '@/components/dashboard/LiveNewsQueue';
import { LiveStreaming } from '@/components/leadership/LiveStreaming/LiveStreaming';

export const ThreeColumnDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-[1800px] w-full mx-auto flex flex-col gap-6 bg-[#f4f6fa]">
      {/* 1. FULL-WIDTH KPI RIBBON AT TOP */}
      <section className="w-full">
        <KPIRibbon layout="ribbon" />
      </section>

      {/* 2. DECONGESTED 3-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* LEFT COLUMN (3/12 on XL, 4/12 on LG) - Analytics & Rankings */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 min-w-0">
          <ScoreDecomposition />
          <TopLowerMatrix />
        </div>

        {/* CENTER COLUMN (5/12 on XL, 4/12 on LG) - Map, Ticker & State Leaderboard */}
        <div className="lg:col-span-4 xl:col-span-5 flex flex-col gap-6 min-w-0">
          <GISMap />
          <BreakingNewsTicker />
          <DistrictLeaderboard showChart={false} />
        </div>

        {/* RIGHT COLUMN (4/12 on XL, 4/12 on LG) - Live Intelligence & Streaming */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 min-w-0">
          <SocialMediaAnalysis />
          <EmergencyAlert />
          <LiveStreaming />
          <LiveNewsQueue />
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnDashboard;
