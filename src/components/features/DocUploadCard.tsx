
import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Pencil, Trash2 } from "lucide-react";

interface DocFile {
  id: string;
  name: string;
  file: File;
  url: string;
}

interface DocUploadCardProps {
  files: DocFile[];
  onUpload: (file: File) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const DocUploadCard: React.FC<DocUploadCardProps> = ({ files, onUpload, onRename, onDelete, onDownload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [rename, setRename] = React.useState("");

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        onUpload(e.dataTransfer.files[i]);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-sm bg-gradient-docs p-2">
            <Upload className="text-white" size={18} />
          </span>
          Upload Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer mb-4"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <Upload className="text-muted-foreground mb-2" size={28} />
          <span className="text-muted-foreground">Click or drag files here to upload</span>
          <Input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple
            onChange={e => {
              if (e.target.files) {
                for (let i = 0; i < e.target.files.length; i++) {
                  onUpload(e.target.files[i]);
                }
              }
            }}
          />
        </div>
        <div className="grid gap-2">
          {files.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No files uploaded yet.</p>
          ) : (
            files.map(file => (
              <Card key={file.id} className="flex flex-row items-center justify-between p-4 border mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="text-violet-500" size={20} />
                  {editingId === file.id ? (
                    <form
                      className="flex items-center gap-2 flex-1"
                      onSubmit={e => {
                        e.preventDefault();
                        setEditingId(null);
                        onRename(file.id, rename.trim() ? rename : file.name);
                      }}
                    >
                      <Input
                        autoFocus
                        value={rename}
                        onChange={e => setRename(e.target.value)}
                        className="w-full px-2 py-1 text-base"
                        onBlur={() => setEditingId(null)}
                      />
                      <Button type="submit" size="sm" className="ml-1">Save</Button>
                    </form>
                  ) : (
                    <span className="truncate">{file.name}</span>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => onDownload(file.id)}>
                    <Download size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingId(file.id);
                      setRename(file.name);
                    }}
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(file.id)}>
                    <Trash2 size={18} />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export type { DocFile };
export default DocUploadCard;
