
import React from 'react';
import { FileText, MessageSquare, Calendar, Cpu, Clock, ChartGantt, ChartBar } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import FeatureCard from '../components/dashboard/FeatureCard';

const features = [
  { 
    title: 'Tasks', 
    route: '/tasks', 
    icon: FileText, 
    gradient: 'bg-gradient-tasks' 
  },
  { 
    title: 'Chat', 
    route: '/chat', 
    icon: MessageSquare, 
    gradient: 'bg-gradient-chat'
  },
  { 
    title: 'Docs', 
    route: '/docs', 
    icon: FileText, 
    gradient: 'bg-gradient-docs'
  },
  { 
    title: 'Calendar', 
    route: '/calendar', 
    icon: Calendar, 
    gradient: 'bg-gradient-calendar'
  },
  { 
    title: 'AI', 
    route: '/ai', 
    icon: Cpu, 
    gradient: 'bg-gradient-ai'
  },
  { 
    title: 'Time Tracking', 
    route: '/time-tracking', 
    icon: Clock, 
    gradient: 'bg-gradient-time'
  },
  { 
    title: 'Gantt', 
    route: '/gantt', 
    icon: ChartGantt, 
    gradient: 'bg-gradient-gantt'
  },
  { 
    title: 'Dashboards', 
    route: '/dashboards', 
    icon: ChartBar, 
    gradient: 'bg-gradient-dashboards'
  },
  { 
    title: 'Forms', 
    route: '/forms', 
    icon: FileText, 
    gradient: 'bg-gradient-forms'
  },
];

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome to CollabFlow</h1>
          <p className="text-muted-foreground text-lg">
            Your collaborative workspace for teams to manage projects efficiently
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              route={feature.route}
              icon={feature.icon}
              gradient={feature.gradient}
              delay={index}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
