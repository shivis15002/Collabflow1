
import React from 'react';
import { ChartBar } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import DashboardStats from '../../components/dashboard/DashboardStats';
import DashboardCharts from '../../components/dashboard/DashboardCharts';

const DashboardsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-dashboards flex items-center justify-center">
            <ChartBar className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold">Dashboards</h1>
        </div>
        
        <div className="space-y-8">
          <DashboardStats />
          <DashboardCharts />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardsPage;
