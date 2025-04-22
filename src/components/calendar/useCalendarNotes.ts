
import { useEffect, useState } from "react";

export type CalendarNote = {
  id: string;
  date: string; // ISO date string (yyyy-MM-dd)
  title: string;
  description: string;
  tag?: string;
};

function getLocalNotes(): CalendarNote[] {
  try {
    const raw = localStorage.getItem("calendar_notes");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalNotes(notes: CalendarNote[]) {
  localStorage.setItem("calendar_notes", JSON.stringify(notes));
}

export function useCalendarNotes() {
  const [notes, setNotes] = useState<CalendarNote[]>(getLocalNotes());

  useEffect(() => {
    saveLocalNotes(notes);
  }, [notes]);

  // CRUD operations
  function addNote(note: Omit<CalendarNote, "id">) {
    setNotes([...notes, { ...note, id: crypto.randomUUID() }]);
  }
  
  function updateNote(note: CalendarNote) {
    setNotes(notes.map(n => n.id === note.id ? note : n));
  }
  
  function deleteNote(id: string) {
    setNotes(notes.filter(n => n.id !== id));
  }
  
  function getNotesByDate(date: string) {
    return notes.filter(n => n.date === date);
  }
  
  function getDatesWithNotes() {
    return new Set(notes.map(n => n.date));
  }
  
  function getRecentNotes(limit: number = 5) {
    return [...notes]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }
  
  function getNotesByTag(tag: string) {
    return notes.filter(n => n.tag === tag);
  }
  
  function getTags() {
    const tags = new Set<string>();
    notes.forEach(note => {
      if (note.tag) tags.add(note.tag);
    });
    return Array.from(tags);
  }

  return { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote, 
    getNotesByDate, 
    getDatesWithNotes,
    getRecentNotes,
    getNotesByTag,
    getTags
  };
}
