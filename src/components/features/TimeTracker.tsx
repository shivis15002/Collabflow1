
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlayCircle, PauseCircle, StopCircle, Clock, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TimeEntry {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in milliseconds
  isRunning: boolean;
}

interface TimeTrackerProps {
  entries: TimeEntry[];
  setEntries: React.Dispatch<React.SetStateAction<TimeEntry[]>>;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ entries, setEntries }) => {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [manualHours, setManualHours] = useState('0');
  const [manualMinutes, setManualMinutes] = useState('0');

  // Find any running entry when component mounts
  useEffect(() => {
    const running = entries.find(entry => entry.isRunning);
    if (running) {
      setActiveEntry(running);
    }
  }, []);

  // Update running timer
  useEffect(() => {
    if (!activeEntry) return;
    
    const timer = setInterval(() => {
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === activeEntry.id 
            ? { 
                ...entry, 
                duration: Date.now() - entry.startTime.getTime() 
              } 
            : entry
        )
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeEntry, setEntries]);

  // Format time (hh:mm:ss)
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start new timer
  const handleStart = () => {
    if (!title) return;
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      title,
      description,
      startTime: new Date(),
      endTime: null,
      duration: 0,
      isRunning: true
    };
    
    setEntries([...entries, newEntry]);
    setActiveEntry(newEntry);
    setTitle('');
    setDescription('');
  };

  // Pause active timer
  const handlePause = () => {
    if (!activeEntry) return;
    
    setEntries(entries.map(entry => 
      entry.id === activeEntry.id 
        ? { ...entry, isRunning: false } 
        : entry
    ));
    
    setActiveEntry(null);
  };

  // Resume timer
  const handleResume = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { ...entry, isRunning: true } 
        : entry
    ));
    
    setActiveEntry({...entry, isRunning: true});
  };

  // Stop timer
  const handleStop = (id: string) => {
    const now = new Date();
    
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { 
            ...entry, 
            isRunning: false, 
            endTime: now,
          } 
        : entry
    ));
    
    setActiveEntry(null);
  };

  // Delete entry
  const handleDelete = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (activeEntry?.id === id) {
      setActiveEntry(null);
    }
  };

  // Edit entry
  const handleEdit = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    setEditing(id);
    setTitle(entry.title);
    setDescription(entry.description);

    // If this is the active entry, pause it
    if (activeEntry?.id === id) {
      handlePause();
    }
  };

  // Update entry
  const handleUpdate = () => {
    if (!editing) return;
    
    setEntries(entries.map(entry => 
      entry.id === editing 
        ? { ...entry, title, description } 
        : entry
    ));
    
    setEditing(null);
    setTitle('');
    setDescription('');
  };

  // Add manual time entry
  const handleManualEntry = () => {
    if (!title) return;
    
    const hours = parseInt(manualHours) || 0;
    const minutes = parseInt(manualMinutes) || 0;
    const duration = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    
    if (duration <= 0) return;
    
    const now = new Date();
    const startTime = new Date(now.getTime() - duration);
    
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      title,
      description,
      startTime,
      endTime: now,
      duration,
      isRunning: false
    };
    
    setEntries([...entries, newEntry]);
    setTitle('');
    setDescription('');
    setManualHours('0');
    setManualMinutes('0');
  };

  // Calculate total duration
  const totalDuration = entries.reduce((total, entry) => total + entry.duration, 0);

  return (
    <div className="space-y-6">
      {/* Timer Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Time Entry" : "Start New Timer"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input 
              placeholder="What are you working on?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input 
              placeholder="Add description (optional)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={handleUpdate}>Update</Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditing(null);
                    setTitle('');
                    setDescription('');
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : activeEntry ? (
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handlePause()}
                >
                  <PauseCircle className="mr-2" /> Pause
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleStop(activeEntry.id)}
                >
                  <StopCircle className="mr-2" /> Stop
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleStart} 
                disabled={!title}
              >
                <PlayCircle className="mr-2" /> Start Timer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Time Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Add Time Manually</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input 
                placeholder="What did you work on?" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input 
                placeholder="Add description (optional)" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Input 
                type="number" 
                min="0"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                className="w-24"
              />
              <span>hours</span>
              <Input 
                type="number" 
                min="0"
                max="59"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(e.target.value)}
                className="w-24"
              />
              <span>minutes</span>
              <Button 
                onClick={handleManualEntry} 
                disabled={!title || (parseInt(manualHours) === 0 && parseInt(manualMinutes) === 0)}
              >
                Add Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Time */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 text-muted-foreground" />
              <span>Total time tracked:</span>
            </div>
            <div className="text-xl font-bold">{formatTime(totalDuration)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Time Entries */}
      <h3 className="text-lg font-semibold mt-6">Recent Time Entries</h3>
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No time entries yet.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <Card key={entry.id} className={entry.isRunning ? "border-primary" : ""}>
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold">{entry.title}</h3>
                    {entry.description && (
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {entry.startTime.toLocaleTimeString()} - {entry.endTime ? entry.endTime.toLocaleTimeString() : 'Running'}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-xl font-mono ${entry.isRunning ? 'text-primary' : ''}`}>
                      {formatTime(entry.duration)}
                    </div>
                    <div className="flex gap-1">
                      {entry.isRunning ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleStop(entry.id)}
                        >
                          <StopCircle size={18} />
                        </Button>
                      ) : !entry.endTime && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleResume(entry.id)}
                        >
                          <PlayCircle size={18} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(entry.id)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
