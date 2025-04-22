
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIcon, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const StatsCard = ({ title, value, description, icon, colorClass = "bg-blue-500" }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="font-medium">{title}</div>
      <div className={`rounded-full p-2 ${colorClass}`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  // Demo data
  const stats = [
    {
      title: "Total Tasks",
      value: 246,
      description: "12% increase from last month",
      icon: <ChartBarIcon className="h-4 w-4 text-white" />,
      colorClass: "bg-indigo-500"
    },
    {
      title: "Hours Tracked",
      value: "142hrs",
      description: "This month",
      icon: <Clock className="h-4 w-4 text-white" />,
      colorClass: "bg-green-500"
    },
    {
      title: "Active Users",
      value: 18,
      description: "Currently online",
      icon: <ChartBarIcon className="h-4 w-4 text-white" />,
      colorClass: "bg-orange-500"
    },
    {
      title: "Completed Tasks",
      value: 184,
      description: "75% completion rate",
      icon: <ChartBarIcon className="h-4 w-4 text-white" />,
      colorClass: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard 
          key={index} 
          title={stat.title} 
          value={stat.value} 
          description={stat.description} 
          icon={stat.icon} 
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
