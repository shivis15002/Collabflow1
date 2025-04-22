
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

interface TimeEntry {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
  isRunning: boolean;
}

interface TimeReportProps {
  entries: TimeEntry[];
}

const TimeReport: React.FC<TimeReportProps> = ({ entries }) => {
  // Calculate data for daily report
  const dailyData = useMemo(() => {
    const days: Record<string, number> = {};
    
    entries.forEach(entry => {
      const date = entry.startTime.toLocaleDateString();
      days[date] = (days[date] || 0) + entry.duration;
    });
    
    return Object.entries(days).map(([date, duration]) => ({
      date,
      hours: Math.round((duration / (1000 * 60 * 60)) * 100) / 100
    })).slice(-7); // Last 7 days
  }, [entries]);

  // Calculate data for task breakdown
  const taskData = useMemo(() => {
    const tasks: Record<string, number> = {};
    
    entries.forEach(entry => {
      tasks[entry.title] = (tasks[entry.title] || 0) + entry.duration;
    });
    
    return Object.entries(tasks).map(([name, duration]) => ({
      name,
      value: Math.round((duration / (1000 * 60 * 60)) * 100) / 100
    }));
  }, [entries]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF85C0', '#4BC0C0'];

  // Calculate total hours
  const totalHours = useMemo(() => {
    const total = entries.reduce((sum, entry) => sum + entry.duration, 0);
    return (total / (1000 * 60 * 60)).toFixed(2);
  }, [entries]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Time Tracking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="border rounded-md p-4 flex-1 min-w-[200px]">
              <div className="text-sm text-muted-foreground">Total Hours</div>
              <div className="text-3xl font-bold">{totalHours}</div>
            </div>
            <div className="border rounded-md p-4 flex-1 min-w-[200px]">
              <div className="text-sm text-muted-foreground">Total Entries</div>
              <div className="text-3xl font-bold">{entries.length}</div>
            </div>
            <div className="border rounded-md p-4 flex-1 min-w-[200px]">
              <div className="text-sm text-muted-foreground">Active Timers</div>
              <div className="text-3xl font-bold">
                {entries.filter(e => e.isRunning).length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Time Report</CardTitle>
        </CardHeader>
        <CardContent>
          {dailyData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Tracked']} />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No data available for the selected period.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Task Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Time Distribution by Task</CardTitle>
        </CardHeader>
        <CardContent>
          {taskData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hours`, 'Time Spent']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">
              No data available for tasks.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeReport;
