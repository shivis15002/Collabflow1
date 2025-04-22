
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const barData = [
  { name: 'Jan', tasks: 40, completed: 24 },
  { name: 'Feb', tasks: 30, completed: 22 },
  { name: 'Mar', tasks: 20, completed: 18 },
  { name: 'Apr', tasks: 27, completed: 23 },
  { name: 'May', tasks: 18, completed: 12 },
  { name: 'Jun', tasks: 23, completed: 18 },
];

const pieData = [
  { name: 'High Priority', value: 40 },
  { name: 'Medium Priority', value: 30 },
  { name: 'Low Priority', value: 30 },
];

const COLORS = ['#FF7676', '#FFB76B', '#6DC3F2'];

const BarChartWidget = () => (
  <Card className="col-span-2">
    <CardHeader>
      <CardTitle>Task Overview</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" fill="#6366F1" />
            <Bar dataKey="completed" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const PieChartWidget = () => (
  <Card>
    <CardHeader>
      <CardTitle>Task Priority</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
      <BarChartWidget />
      <PieChartWidget />
    </div>
  );
};

export default DashboardCharts;
