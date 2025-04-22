
import React, { useState } from "react";
import { CalendarCheck, Pencil, Trash2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import CalendarNoteModal from "@/components/calendar/CalendarNoteModal";
import CalendarNoteTimeline from "@/components/calendar/CalendarNoteTimeline";
import { useCalendarNotes, CalendarNote } from "@/components/calendar/useCalendarNotes";
import { toast } from "sonner";
import { Calendar3D } from "@/components/calendar/Calendar3D";

function toISO8601(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString().split("T")[0];
}

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CalendarNote | null>(null);

  const { notes, addNote, updateNote, deleteNote, getNotesByDate, getDatesWithNotes } = useCalendarNotes();

  const isoDate = toISO8601(selectedDate);
  const notesForDay = isoDate ? getNotesByDate(isoDate) : [];

  function handleCalendarSelect(date: Date | undefined) {
    setSelectedDate(date);
    setEditingNote(null);
    setModalOpen(!!date);
  }

  // Get all dates with notes for the calendar
  const datesWithNotes = getDatesWithNotes();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-calendar flex items-center justify-center">
            <CalendarCheck className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold">Calendar</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <div className="mb-6 w-full max-w-xs">
            <Calendar3D
              value={selectedDate}
              onChange={handleCalendarSelect}
              datesWithNotes={datesWithNotes}
              className="pointer-events-auto"
            />
          </div>
          
          {selectedDate && (
            <div className="w-full max-w-md">
              <div className="mb-3 flex items-center gap-2 justify-between">
                <div className="text-muted-foreground text-sm">
                  {format(selectedDate, "PPP")}
                </div>
                <Button
                  size="sm"
                  onClick={() => { setEditingNote(null); setModalOpen(true); }}
                  variant="default"
                >
                  <CalendarCheck className="mr-1 w-4 h-4" />
                  Add Note
                </Button>
              </div>
              <div className="space-y-2">
                {notesForDay.length === 0 && (
                  <div className="text-sm text-muted-foreground px-2 py-4 bg-accent rounded">
                    No notes for this day.
                  </div>
                )}
                {notesForDay.map(note => (
                  <div key={note.id} className="bg-gray-50 border rounded p-2 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{note.title}</span>
                        {note.tag && (
                          <span className="px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground">{note.tag}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{note.description}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditingNote(note); setModalOpen(true); }} >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { deleteNote(note.id); toast.success("Note deleted"); }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CalendarNoteModal
            open={modalOpen}
            date={isoDate || ""}
            initial={editingNote}
            onClose={() => setModalOpen(false)}
            onSave={n => { addNote(n); toast.success("Note added"); }}
            onUpdate={n => { updateNote(n); toast.success("Note updated"); }}
            onDelete={id => { deleteNote(id); toast.success("Note deleted"); }}
          />
        </div>

        <CalendarNoteTimeline notes={notes} />
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
