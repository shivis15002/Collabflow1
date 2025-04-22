
import React, { useState } from 'react';
import { ChartGantt, Plus } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import GanttChart from '../../components/gantt/GanttChart';
import TaskForm from '../../components/gantt/TaskForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
  dependencies?: string[];
}

const GanttPage: React.FC = () => {
  // Initial sample tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: 'Project Planning',
      startDate: new Date(2025, 3, 20), // Note: month is 0-indexed (3 = April)
      endDate: new Date(2025, 3, 22),
      progress: 100,
      color: '#6366F1'
    },
    {
      id: 'task-2',
      title: 'Design Phase',
      startDate: new Date(2025, 3, 23),
      endDate: new Date(2025, 3, 27),
      progress: 70,
      color: '#22C55E',
      dependencies: ['task-1']
    },
    {
      id: 'task-3',
      title: 'Development',
      startDate: new Date(2025, 3, 28),
      endDate: new Date(2025, 4, 5),
      progress: 20,
      color: '#F97316',
      dependencies: ['task-2']
    }
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  
  const handleAddTask = () => {
    setCurrentTask(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };
  
  const handleSaveTask = (task: Task) => {
    if (currentTask) {
      // Edit existing task
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    } else {
      // Add new task
      setTasks([...tasks, task]);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-gantt flex items-center justify-center">
              <ChartGantt className="text-white" size={20} />
            </div>
            <h1 className="text-3xl font-bold">Gantt Chart</h1>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
        
        {tasks.length > 0 ? (
          <GanttChart 
            tasks={tasks} 
            onTaskClick={handleEditTask}
          />
        ) : (
          <Card>
            <CardContent className="py-10 flex flex-col items-center justify-center">
              <ChartGantt className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                You don't have any tasks yet. Add your first task to get started.
              </p>
              <Button onClick={handleAddTask} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardContent>
          </Card>
        )}
        
        <TaskForm 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveTask}
          task={currentTask}
          tasks={tasks}
        />
      </div>
    </MainLayout>
  );
};

export default GanttPage;
