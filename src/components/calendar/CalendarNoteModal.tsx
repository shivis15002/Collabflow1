
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tag } from "lucide-react";
import type { CalendarNote } from "./useCalendarNotes";

type Props = {
  open: boolean;
  onClose: () => void;
  date: string;
  initial?: CalendarNote | null;
  onSave: (note: Omit<CalendarNote, "id">) => void;
  onUpdate: (note: CalendarNote) => void;
  onDelete: (id: string) => void;
};

const tags = [
  "Task", "Meeting", "Personal", "Reminder", "Event"
];

export default function CalendarNoteModal({ open, onClose, date, initial, onSave, onUpdate, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");

  React.useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setTag(initial?.tag ?? "");
  }, [initial, open]);

  const handleSave = () => {
    if (!title.trim()) return;
    if (initial)
      onUpdate({ ...initial, title, description, tag });
    else
      onSave({ date, title, description, tag });
    onClose();
  };

  const handleDelete = () => {
    if (initial) {
      onDelete(initial.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Note" : "Add Note"}</DialogTitle>
          <DialogDescription>
            {new Date(date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} maxLength={48} />
          <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <select value={tag} onChange={e => setTag(e.target.value)} className="border rounded p-1 text-sm bg-background">
              <option value="">No tag</option>
              {tags.map(t => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          {initial && (
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={handleSave}>{initial ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
