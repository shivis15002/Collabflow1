
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Flag, User } from "lucide-react";
import MainLayout from '../../components/layout/MainLayout';
import Task3DCard from '../../components/features/Task3DCard';

interface Task {
  id: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
}

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [editing, setEditing] = useState<null | string>(null);
  const { toast } = useToast();

  // Prefill for editing
  React.useEffect(() => {
    if (editing) {
      const task = tasks.find(t => t.id === editing);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority || 'medium');
        setDueDate(task.dueDate || '');
        setAssignee(task.assignee || '');
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setAssignee('');
    }
  }, [editing]);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    if (editing) {
      setTasks(tasks => tasks.map(t =>
        t.id === editing ? { 
          ...t, 
          title, 
          description, 
          priority,
          dueDate: dueDate || undefined,
          assignee: assignee || undefined
        } : t
      ));
      setEditing(null);
      toast({
        title: "Task updated",
        description: `"${title}" has been updated successfully.`
      });
    } else {
      setTasks(tasks => [
        ...tasks,
        { 
          id: Date.now().toString(), 
          title, 
          description, 
          priority,
          dueDate: dueDate || undefined,
          assignee: assignee || undefined
        }
      ]);
      toast({
        title: "Task created",
        description: `"${title}" has been added to your tasks.`
      });
    }
    
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setAssignee('');
  };

  const handleEdit = (id: string) => setEditing(id);

  const handleDelete = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(tasks => tasks.filter(t => t.id !== id));
    if (editing === id) setEditing(null);
    
    toast({
      title: "Task deleted",
      description: taskToDelete ? `"${taskToDelete.title}" has been removed.` : "Task has been removed."
    });
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTasks(items);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-tasks flex items-center justify-center">
            {/* Use Lucide icon */}
            <svg className="text-white" width={20} height={20}><rect width={20} height={20} fill="currentColor" /></svg>
          </div>
          <h1 className="text-3xl font-bold">3D Tasks</h1>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editing ? "Edit Task" : "Add Task"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleCreateOrUpdate}>
              <Input
                placeholder="Task Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Task Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  <Select value={priority} onValueChange={(val: 'low' | 'medium' | 'high') => setPriority(val)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-[180px]"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Assignee"
                    value={assignee}
                    onChange={e => setAssignee(e.target.value)}
                    className="w-[180px]"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Add"}</Button>
                {editing && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div 
                className="grid gap-4" 
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No tasks added yet. Create a task to get started.</p>
                ) : (
                  tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Task3DCard
                            id={task.id}
                            title={task.title}
                            description={task.description}
                            priority={task.priority}
                            dueDate={task.dueDate}
                            assignee={task.assignee}
                            onEdit={() => handleEdit(task.id)}
                            onDelete={() => handleDelete(task.id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </MainLayout>
  );
};

export default TasksPage;
