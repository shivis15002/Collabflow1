
import React from "react";
import { CalendarNote } from "./useCalendarNotes";
import { CalendarCheck } from "lucide-react";

export default function CalendarNoteTimeline({ notes }: { notes: CalendarNote[] }) {
  // Newest first
  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="mt-8">
      <h2 className="mb-2 text-lg font-semibold flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-primary" />
        Notes Timeline
      </h2>
      <div className="divide-y rounded-lg border bg-white">
        {sorted.length === 0 && <div className="text-sm text-muted-foreground px-4 py-6 text-center">No notes yet.</div>}
        {sorted.map(note => (
          <div key={note.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <div className="font-semibold w-32 text-xs text-muted-foreground">{new Date(note.date).toLocaleDateString()}</div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="font-medium">{note.title}</span>
                {note.tag && (
                  <span className="px-2 py-0.5 rounded text-xs bg-accent text-accent-foreground">{note.tag}</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{note.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
