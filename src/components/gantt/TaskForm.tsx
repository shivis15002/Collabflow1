
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  color: string;
  dependencies?: string[];
}

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  task?: Task;
  tasks: Task[];
}

// Helper function to format date for input
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, onSave, task, tasks }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [startDate, setStartDate] = useState(task?.startDate ? formatDateForInput(task.startDate) : formatDateForInput(new Date()));
  const [endDate, setEndDate] = useState(task?.endDate ? formatDateForInput(task.endDate) : formatDateForInput(new Date()));
  const [progress, setProgress] = useState(task?.progress || 0);
  const [color, setColor] = useState(task?.color || '#6366F1');
  const [dependencies, setDependencies] = useState<string[]>(task?.dependencies || []);

  const handleSave = () => {
    if (!title.trim() || !startDate || !endDate) return;

    const newTask: Task = {
      id: task?.id || `task-${Date.now()}`,
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      progress: progress,
      color,
      dependencies: dependencies.length > 0 ? dependencies : undefined
    };
    
    onSave(newTask);
    onClose();
  };

  const handleDependencyChange = (taskId: string) => {
    if (dependencies.includes(taskId)) {
      setDependencies(dependencies.filter(id => id !== taskId));
    } else {
      setDependencies([...dependencies, taskId]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">Start Date</Label>
            <Input 
              id="start-date" 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">End Date</Label>
            <Input 
              id="end-date" 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="progress" className="text-right">Progress</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input 
                id="progress" 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={e => setProgress(parseInt(e.target.value))} 
                className="flex-grow" 
              />
              <span>{progress}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">Color</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input 
                id="color" 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="w-12 h-8 p-0 border-none" 
              />
              <Input 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="flex-grow" 
              />
            </div>
          </div>
          
          {task && tasks.filter(t => t.id !== task.id).length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Dependencies</Label>
              <div className="col-span-3 border rounded-md p-2 max-h-40 overflow-auto space-y-2">
                {tasks.filter(t => t.id !== task.id).map(t => (
                  <div key={t.id} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`dep-${t.id}`} 
                      checked={dependencies.includes(t.id)} 
                      onChange={() => handleDependencyChange(t.id)} 
                      className="mr-2"
                    />
                    <Label htmlFor={`dep-${t.id}`} className="text-sm">{t.title}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
