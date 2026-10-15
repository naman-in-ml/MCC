'use client';

import React, { useMemo, useState } from 'react';
import { useDashboardStore } from '@/stores/dashboardStore';
import { LeaderboardTabs, LeaderboardTab } from './LeaderboardTabs';
import { DistrictPerformanceChart } from './DistrictPerformanceChart';
import { DistrictSearchBar } from './DistrictSearchBar';
import { DistrictTable } from './DistrictTable';

export const DistrictLeaderboard: React.FC = () => {
  const {
    districts,
    selectedDistrictId,
    setSelectedDistrictId,
    selectedDivision,
    searchDistrict,
    setSearchDistrict,
  } = useDashboardStore();

  const [activeTab, setActiveTab] = useState<LeaderboardTab>('cpi');

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesDivision =
        selectedDivision === 'All Maharashtra' || d.division === selectedDivision;
      const matchesSearch = d.name.toLowerCase().includes(searchDistrict.toLowerCase());
      return matchesDivision && matchesSearch;
    });
  }, [districts, selectedDivision, searchDistrict]);

  return (
<<<<<<< HEAD
    <div className="bg-surface border border-borderLine-standard rounded-md flex flex-col">
      {/* Header and Sub-tabs */}
      <div className="px-4 py-3 border-b border-borderLine-subtle">
        <h3 className="text-xl font-bold text-content-primary mb-2">
          District Performance & Leaderboard
        </h3>
=======
    <div className="bg-surface border border-slate-200 rounded-lg flex flex-col shadow-xs overflow-hidden">
      {/* Header and Sub-tabs */}
      <div className="px-4 py-3 border-b border-slate-200 bg-surface">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-gov-primary tracking-tight">
            {t.zone2.title}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            {t.zone2.subtitle}
          </span>
        </div>
>>>>>>> d388acd7d9c13d47f4f611ec471fadaa4d324bd5
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Top 5 Bar Chart */}
        <DistrictPerformanceChart
          districts={districts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />

        {/* Controls: Search and Division Counter */}
        <DistrictSearchBar
          searchDistrict={searchDistrict}
          onSearchChange={setSearchDistrict}
          filteredCount={filteredDistricts.length}
          totalCount={districts.length}
        />

        {/* Ranked District Table */}
        <DistrictTable
          districts={filteredDistricts}
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={setSelectedDistrictId}
        />
      </div>
    </div>
  );
};
