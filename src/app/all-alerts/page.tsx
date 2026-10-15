import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AllAlertsCrisisScreen } from '@/components/portal/AllAlertsCrisisScreen';

export const metadata = {
  title: 'All Alerts & Crisis | Maharashtra Command Center',
  description: 'Statewide Rapid Rumor Refutation & Crisis Alert Registry',
};

export default function AllAlertsPage() {
  return (
    <DashboardLayout>
      <AllAlertsCrisisScreen />
    </DashboardLayout>
  );
}
