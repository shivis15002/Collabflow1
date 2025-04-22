
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from '../../components/layout/MainLayout';
import DocCard from '../../components/features/DocCard';
import DocUploadCard, { DocFile } from '../../components/features/DocUploadCard';

interface Doc {
  id: string;
  title: string;
  content: string;
}

const DocsPage: React.FC = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState<null | string>(null);

  // File upload state
  const [files, setFiles] = useState<DocFile[]>([]);
  const fileDownloadLinks = useRef<{[id: string]: HTMLAnchorElement | null}>({});

  React.useEffect(() => {
    if (editing) {
      const doc = docs.find(d => d.id === editing);
      if (doc) {
        setTitle(doc.title);
        setContent(doc.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
  }, [editing]);

  // --- File Upload Handlers ---
  const handleFileUpload = (file: File) => {
    const id = Date.now().toString() + Math.random();
    const url = URL.createObjectURL(file);
    setFiles(f => [...f, { id, name: file.name, url, file }]);
  };

  const handleFileRename = (id: string, name: string) => {
    setFiles(files =>
      files.map(f => (f.id === id ? { ...f, name } : f))
    );
  };

  const handleFileDelete = (id: string) => {
    setFiles(files => files.filter(f => f.id !== id));
  };

  const handleFileDownload = (id: string) => {
    const fileObj = files.find(f => f.id === id);
    if (fileObj) {
      const link = document.createElement('a');
      link.href = fileObj.url;
      link.download = fileObj.name;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // --- Doc CRUD ---
  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (editing) {
      setDocs(docs =>
        docs.map(d =>
          d.id === editing ? { ...d, title, content } : d
        )
      );
      setEditing(null);
    } else {
      setDocs(docs => [
        ...docs,
        { id: Date.now().toString(), title, content }
      ]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (id: string) => setEditing(id);
  const handleDelete = (id: string) => {
    setDocs(docs => docs.filter(d => d.id !== id));
    if (editing === id) setEditing(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-docs flex items-center justify-center">
            {/* Icon */}
            <svg className="text-white" width={20} height={20}><rect width={20} height={20} fill="currentColor" /></svg>
          </div>
          <h1 className="text-3xl font-bold">Docs</h1>
        </div>

        {/* File Upload & Listing */}
        <DocUploadCard
          files={files}
          onUpload={handleFileUpload}
          onRename={handleFileRename}
          onDelete={handleFileDelete}
          onDownload={handleFileDownload}
        />

        {/* Regular DOC CRUD */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editing ? "Edit Document" : "Add Document"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleCreateOrUpdate}>
              <Input
                placeholder="Document Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write document contents here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Add"}</Button>
                {editing && (
                  <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4">
          {docs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No documents yet.</p>
          ) : (
            docs.map(d => (
              <DocCard
                key={d.id}
                title={d.title}
                content={d.content}
                onEdit={() => handleEdit(d.id)}
                onDelete={() => handleDelete(d.id)}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DocsPage;
