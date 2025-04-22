
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, onEdit, onDelete }) => (
  <Card className="mb-3">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-sm bg-gradient-tasks p-2">
          <Pencil className="text-white" size={16} />
        </span>
        {title}
      </CardTitle>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil size={18} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 size={18} />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default TaskCard;
