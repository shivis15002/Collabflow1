
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format, addDays, startOfWeek, addWeeks, isSameDay, isWithinInterval } from 'date-fns';

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
  dependencies?: string[]; // IDs of tasks that this task depends on
}

interface GanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskClick }) => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [numWeeks, setNumWeeks] = useState<number>(4);

  const handlePrevWeek = () => {
    setStartDate(addDays(startDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };

  const handleZoomIn = () => {
    if (numWeeks > 2) setNumWeeks(numWeeks - 1);
  };

  const handleZoomOut = () => {
    setNumWeeks(numWeeks + 1);
  };

  // Generate dates for the header
  const dates: Date[] = [];
  for (let i = 0; i < numWeeks * 7; i++) {
    dates.push(addDays(startDate, i));
  }

  const handleTaskClick = (task: Task) => {
    if (onTaskClick) onTaskClick(task);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Gantt Controls */}
        <div className="flex justify-between p-4 border-b">
          <div>
            <button 
              className="px-3 py-1 border rounded-md mr-2"
              onClick={handlePrevWeek}
            >
              ←
            </button>
            <button 
              className="px-3 py-1 border rounded-md"
              onClick={handleNextWeek}
            >
              →
            </button>
          </div>
          <div>
            <span className="text-muted-foreground">
              {format(startDate, 'MMM d, yyyy')} - {format(addDays(startDate, numWeeks * 7 - 1), 'MMM d, yyyy')}
            </span>
          </div>
          <div>
            <button 
              className="px-3 py-1 border rounded-md mr-2"
              onClick={handleZoomIn}
              disabled={numWeeks <= 2}
            >
              -
            </button>
            <button 
              className="px-3 py-1 border rounded-md"
              onClick={handleZoomOut}
            >
              +
            </button>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="overflow-x-auto">
          <div className="flex">
            {/* Task Names */}
            <div className="min-w-[200px] border-r">
              <div className="h-10 border-b bg-muted/50 px-4 flex items-center font-medium">
                Task
              </div>
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className="h-12 border-b px-4 flex items-center cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTaskClick(task)}
                >
                  {task.title}
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="flex flex-1">
              {/* Date Headers */}
              <div className="flex">
                {dates.map((date, index) => (
                  <div 
                    key={index} 
                    className={`w-16 flex-shrink-0 h-10 border-r border-b flex flex-col items-center justify-center text-xs ${
                      isSameDay(date, new Date()) ? 'bg-blue-50' : 
                      date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : 'bg-muted/50'
                    }`}
                  >
                    <div>{format(date, 'EEE')}</div>
                    <div>{format(date, 'd')}</div>
                  </div>
                ))}
              </div>

              {/* Task Bars */}
              <div className="absolute" style={{ marginTop: '40px' }}>
                {tasks.map((task, taskIndex) => {
                  // Calculate position
                  const startDateDiff = differenceInDays(task.startDate, startDate);
                  const taskDuration = differenceInDays(task.endDate, task.startDate) + 1;
                  
                  // Skip if the task is completely outside our visible range
                  if (startDateDiff + taskDuration < 0 || startDateDiff > numWeeks * 7) {
                    return null;
                  }

                  // Adjust for tasks that start before our visible range
                  const visibleStartDateDiff = Math.max(0, startDateDiff);
                  const visibleDuration = Math.min(
                    taskDuration - Math.max(0, -startDateDiff),
                    numWeeks * 7 - visibleStartDateDiff
                  );

                  return (
                    <div 
                      key={task.id}
                      className="absolute h-8 rounded-md flex items-center justify-center text-xs text-white font-medium cursor-pointer hover:opacity-90"
                      style={{
                        left: `${visibleStartDateDiff * 64}px`,
                        top: `${taskIndex * 48 + 2}px`,
                        width: `${visibleDuration * 64 - 4}px`,
                        backgroundColor: task.color,
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      {task.title} - {task.progress}%
                    </div>
                  );
                })}

                {/* Dependency Lines */}
                {tasks.map(task => {
                  if (!task.dependencies || task.dependencies.length === 0) return null;
                  
                  return task.dependencies.map(depId => {
                    const dependencyTask = tasks.find(t => t.id === depId);
                    if (!dependencyTask) return null;
                    
                    // Calculate positions for SVG line
                    const dependencyTaskIndex = tasks.findIndex(t => t.id === depId);
                    const taskIndex = tasks.findIndex(t => t.id === task.id);
                    
                    const startX = (differenceInDays(dependencyTask.endDate, startDate) + 1) * 64 - 2;
                    const startY = dependencyTaskIndex * 48 + 6;
                    
                    const endX = differenceInDays(task.startDate, startDate) * 64;
                    const endY = taskIndex * 48 + 6;
                    
                    // Skip if either task is not in view
                    if (startX < 0 || startX > numWeeks * 7 * 64 || endX < 0 || endX > numWeeks * 7 * 64) {
                      return null;
                    }

                    return (
                      <svg 
                        key={`${task.id}-${depId}`} 
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      >
                        <line 
                          x1={startX} 
                          y1={startY} 
                          x2={endX} 
                          y2={endY} 
                          stroke="#888"
                          strokeDasharray="4"
                          markerEnd="url(#arrowhead)"
                        />
                        <defs>
                          <marker 
                            id="arrowhead" 
                            markerWidth="10" 
                            markerHeight="7" 
                            refX="9" 
                            refY="3.5" 
                            orient="auto"
                          >
                            <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                          </marker>
                        </defs>
                      </svg>
                    );
                  });
                })}
              </div>

              {/* Task Rows Background */}
              <div className="relative">
                {tasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className="h-12 border-b"
                    style={{
                      width: `${dates.length * 64}px`,
                    }}
                  >
                    {dates.map((date, dateIndex) => (
                      <div 
                        key={dateIndex} 
                        className={`absolute w-16 h-12 border-r ${
                          isSameDay(date, new Date()) ? 'bg-blue-50' : 
                          date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-50' : ''
                        }`}
                        style={{
                          left: `${dateIndex * 64}px`,
                          top: `${index * 48}px`,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate difference in days
function differenceInDays(date1: Date, date2: Date): number {
  return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
}

export default GanttChart;
