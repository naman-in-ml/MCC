import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

describe('Three-Column Executive Dashboard Workspace', () => {
  describe('1. Preservation of Original Dashboard', () => {
    it('MainDashboard.tsx should remain preserved intact in the codebase', () => {
      const mainDashboardPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'MainDashboard.tsx'
      );
      assert.ok(fs.existsSync(mainDashboardPath), 'MainDashboard.tsx must exist in codebase');
      const content = fs.readFileSync(mainDashboardPath, 'utf8');
      assert.ok(content.includes('export const MainDashboard'), 'MainDashboard component must be exported');
    });
  });

  describe('2. New ThreeColumnDashboard Component Architecture', () => {
    it('ThreeColumnDashboard.tsx should exist and assemble all 3 columns', () => {
      const threeColPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'ThreeColumnDashboard.tsx'
      );
      assert.ok(fs.existsSync(threeColPath), 'ThreeColumnDashboard.tsx must exist');
      const content = fs.readFileSync(threeColPath, 'utf8');

      // Full-width KPI Ribbon at Top
      assert.ok(content.includes('<section className="w-full">'), 'KPIRibbon must be placed in a full-width section at the top');
      assert.ok(content.includes('<KPIRibbon layout="ribbon" />'), 'ThreeColumnDashboard must render KPIRibbon with layout="ribbon"');

      // Outer Container & Grid
      assert.ok(content.includes('p-6 max-w-[1800px]'), 'ThreeColumnDashboard must use p-6 max-w-[1800px]');
      assert.ok(content.includes('bg-[#f4f6fa]'), 'ThreeColumnDashboard must have bg-[#f4f6fa] background');
      assert.ok(content.includes('lg:grid-cols-12'), 'ThreeColumnDashboard must define desktop 12-column grid at lg breakpoint');
      assert.ok(content.includes('items-start'), 'Grid must use items-start for natural card heights with consistent gaps');
      assert.ok(content.includes('gap-6'), 'Grid must use gap-6 for generous executive whitespace');

      // Column 1 (Left Rail: 4 at lg, 3 at xl) - Analytics & Rankings
      assert.ok(content.includes('lg:col-span-4 xl:col-span-3'), 'Column 1 must span 4 cols at lg and 3 cols at xl');
      assert.ok(content.includes('ScoreDecomposition'), 'Column 1 must include ScoreDecomposition');
      assert.ok(content.includes('TopLowerMatrix'), 'Column 1 must include TopLowerMatrix');

      // Column 2 (Center Rail: 4 at lg, 5 at xl) - Map, Ticker & State Leaderboard
      assert.ok(content.includes('lg:col-span-4 xl:col-span-5'), 'Column 2 must span 4 cols at lg and 5 cols at xl');
      assert.ok(content.includes('GISMap'), 'Column 2 must include GISMap');
      assert.ok(content.includes('BreakingNewsTicker'), 'Column 2 must include BreakingNewsTicker');
      assert.ok(content.includes('DistrictLeaderboard'), 'Column 2 must include DistrictLeaderboard directly below Breaking News');
      assert.ok(content.includes('showChart={false}'), 'ThreeColumnDashboard must pass showChart={false} to DistrictLeaderboard');

      // Column 3 (Right Rail: 4 at lg, 4 at xl) - Live Intelligence & Streaming
      assert.ok(content.includes('lg:col-span-4 xl:col-span-4'), 'Column 3 must span 4 cols at lg and 4 cols at xl');
      assert.ok(content.includes('SocialMediaAnalysis'), 'Column 3 must include SocialMediaAnalysis');
      assert.ok(content.includes('EmergencyAlert'), 'Column 3 must include EmergencyAlert');
      assert.ok(content.includes('LiveStreaming'), 'Column 3 must include LiveStreaming');
      assert.ok(content.includes('LiveNewsQueue'), 'Column 3 must include LiveNewsQueue');
    });
  });

  describe('3. Route Page Module Replacement', () => {
    it('src/app/dashboard/page.tsx should render ThreeColumnDashboard', () => {
      const pagePath = path.join(ROOT_DIR, 'src', 'app', 'dashboard', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');
      assert.ok(content.includes('ThreeColumnDashboard'), '/dashboard page must render ThreeColumnDashboard');
      assert.ok(content.includes('DashboardLayout'), '/dashboard page must wrap with DashboardLayout');
    });

    it('src/app/page.tsx should render ThreeColumnDashboard', () => {
      const pagePath = path.join(ROOT_DIR, 'src', 'app', 'page.tsx');
      const content = fs.readFileSync(pagePath, 'utf8');
      assert.ok(content.includes('ThreeColumnDashboard'), 'Root / page must render ThreeColumnDashboard');
      assert.ok(content.includes('DashboardLayout'), 'Root / page must wrap with DashboardLayout');
    });
  });

  describe('4. Auxiliary Modules Implementation & Responsive Adjustments', () => {
    it('BreakingNewsTicker should be solid red bar with white text, cycling, pausing, and accessibility', () => {
      const tickerPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'BreakingNewsTicker.tsx'
      );
      assert.ok(fs.existsSync(tickerPath), 'BreakingNewsTicker.tsx must exist');
      const content = fs.readFileSync(tickerPath, 'utf8');
      assert.ok(content.includes('bg-red-600'), 'BreakingNewsTicker must have solid red bg-red-600 background');
      assert.ok(content.includes('text-white'), 'BreakingNewsTicker must have white text');
      assert.ok(content.includes('BREAKING NEWS'), 'BreakingNewsTicker must display English BREAKING NEWS badge');
      assert.ok(content.includes('थेट घडामोड'), 'BreakingNewsTicker must display Marathi थेट घडामोड badge');
      assert.ok(content.includes('isPaused'), 'BreakingNewsTicker must support pause state');
      assert.ok(content.includes('role="region"'), 'BreakingNewsTicker must have accessible region role');
    });

    it('LiveStreaming should have enlarged video canvas and 4-column horizontal relay buttons', () => {
      const liveStreamPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'LiveStreaming',
        'LiveStreaming.tsx'
      );
      const content = fs.readFileSync(liveStreamPath, 'utf8');
      assert.ok(content.includes('min-h-[260px]'), 'Video canvas must have min-h-[260px]');
      assert.ok(content.includes('grid-cols-2 sm:grid-cols-4'), 'Relay stream buttons must be in a 4-column row underneath');
    });

    it('SocialMediaAnalysis should use side-by-side streams on XL with max-h-[240px]', () => {
      const socialPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'SocialMediaAnalysis',
        'SocialMediaAnalysis.tsx'
      );
      const content = fs.readFileSync(socialPath, 'utf8');
      assert.ok(content.includes('grid-cols-1 xl:grid-cols-2'), 'Streams must be side-by-side on xl screens');
      assert.ok(content.includes('max-h-[240px]'), 'Streams must be capped at max-h-[240px]');
    });

    it('LiveNewsQueue should be capped at max-h-[220px]', () => {
      const queuePath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'dashboard',
        'LiveNewsQueue.tsx'
      );
      const content = fs.readFileSync(queuePath, 'utf8');
      assert.ok(content.includes('max-h-[220px]'), 'LiveNewsQueue feed list must be capped at max-h-[220px]');
    });

    it('DistrictTable should dock pagination footer to bottom edge and provide vertical row breathing room', () => {
      const tablePath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'zones',
        'DistrictLeaderboard',
        'DistrictTable.tsx'
      );
      const content = fs.readFileSync(tablePath, 'utf8');
      assert.ok(content.includes('py-3 px-3'), 'DistrictTable must use py-3 px-3 for vertical breathing room');
      assert.ok(content.includes('min-w-[500px]'), 'DistrictTable must fit comfortably with zero clipping');
      assert.ok(content.includes('mt-auto'), 'DistrictTable pagination must dock to bottom with mt-auto');
    });

    it('TopLowerMatrix should fit Left Column with comfortable padding and responsive progress bar', () => {
      const matrixPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'leadership',
        'TopLowerMatrix',
        'TopLowerMatrix.tsx'
      );
      const content = fs.readFileSync(matrixPath, 'utf8');
      assert.ok(content.includes('py-3 px-3'), 'TopLowerMatrix must use py-3 px-3 padding');
      assert.ok(content.includes('hidden 2xl:inline-block'), 'Progress bar must hide on narrow column spans');
    });
  });

  describe('5. Skeleton Synchronization (Zero CLS)', () => {
    it('DashboardPageSkeleton should mirror the three-column layout and red ticker', () => {
      const skeletonPath = path.join(
        ROOT_DIR,
        'src',
        'components',
        'skeletons',
        'DashboardPageSkeleton.tsx'
      );
      const content = fs.readFileSync(skeletonPath, 'utf8');
      assert.ok(content.includes('p-6 max-w-[1800px]'), 'DashboardPageSkeleton must mirror outer p-6 max-w-[1800px]');
      assert.ok(content.includes('bg-[#f4f6fa]'), 'DashboardPageSkeleton must mirror bg-[#f4f6fa]');
      assert.ok(content.includes('lg:grid-cols-12'), 'DashboardPageSkeleton must mirror 12-column grid at lg breakpoint');
      assert.ok(content.includes('items-start'), 'DashboardPageSkeleton must use items-start');
      assert.ok(content.includes('gap-6'), 'DashboardPageSkeleton must mirror gap-6');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-3'), 'DashboardPageSkeleton col 1 must match ThreeColumnDashboard');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-5'), 'DashboardPageSkeleton col 2 must match ThreeColumnDashboard');
      assert.ok(content.includes('lg:col-span-4 xl:col-span-4'), 'DashboardPageSkeleton col 3 must match ThreeColumnDashboard');
      assert.ok(content.includes('bg-red-600/90'), 'DashboardPageSkeleton must mirror red ticker banner');
      assert.ok(content.includes('GISMapSkeleton'), 'DashboardPageSkeleton must include GISMapSkeleton in column 2');
      assert.ok(content.includes('SocialMediaSkeleton'), 'DashboardPageSkeleton must include SocialMediaSkeleton in column 3');
      assert.ok(content.includes('TopLowerMatrixSkeleton'), 'DashboardPageSkeleton must include TopLowerMatrixSkeleton in column 1');
      assert.ok(content.includes('LeaderboardSkeleton'), 'DashboardPageSkeleton must include LeaderboardSkeleton in column 2');
    });
  });
});
