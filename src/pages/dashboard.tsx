import { useEffect, useState } from 'react';
import AdminPanelLayout from '../components/admin-panel/admin-panel-layout';
import DashboardCards from './dashboardCards';
import ProfileAlert from '../components/alertt';
import DashboardPageNew from './newdashboard';

const DashboardPage = () => {
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    const hasShownAlert = localStorage.getItem('hasShownProfileAlert');
    if (!hasShownAlert) {
      setDialog(true);
      localStorage.setItem('hasShownProfileAlert', 'true');
    }
  }, []);

  const handleCloseDialog = () => {
    setDialog(false);
  };

  return (
    <div>
      <AdminPanelLayout>
        <DashboardPageNew />
      </AdminPanelLayout>
      <ProfileAlert open={dialog} onClose={handleCloseDialog} />
    </div>
  );
};

export default DashboardPage;