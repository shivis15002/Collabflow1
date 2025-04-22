
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import TimeTracker from '../../components/features/TimeTracker';
import TimeReport from '../../components/features/TimeReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the TimeEntry interface
interface TimeEntry {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
  isRunning: boolean;
}

const TimeTrackingPage: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  
  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        const parsedEntries = JSON.parse(savedEntries).map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : null
        }));
        setEntries(parsedEntries);
      } catch (error) {
        console.error('Failed to parse time entries:', error);
      }
    }
  }, []);
  
  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(entries));
  }, [entries]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-time flex items-center justify-center">
            <Clock className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold">Time Tracking</h1>
        </div>
        
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="tracker">Time Tracker</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="space-y-6">
            <TimeTracker entries={entries} setEntries={setEntries} />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6">
            <TimeReport entries={entries} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TimeTrackingPage;
