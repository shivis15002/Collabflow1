
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MainLayout from '../../components/layout/MainLayout';
import ChatMessageCard from '../../components/features/ChatMessageCard';

interface Message {
  id: string;
  username: string;
  message: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<null | string>(null);

  // Prefill for editing
  React.useEffect(() => {
    if (editing) {
      const msg = messages.find(m => m.id === editing);
      if (msg) {
        setUsername(msg.username);
        setMessage(msg.message);
      }
    } else {
      setUsername('');
      setMessage('');
    }
  }, [editing]);

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !message.trim()) return;
    if (editing) {
      setMessages(messages =>
        messages.map(m =>
          m.id === editing ? { ...m, username, message } : m
        )
      );
      setEditing(null);
    } else {
      setMessages(messages => [
        ...messages,
        { id: Date.now().toString(), username, message }
      ]);
    }
    setUsername('');
    setMessage('');
  };

  const handleEdit = (id: string) => setEditing(id);
  const handleDelete = (id: string) => {
    setMessages(messages => messages.filter(m => m.id !== id));
    if (editing === id) setEditing(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-chat flex items-center justify-center">
            {/* Use Lucide icon */}
            <svg className="text-white" width={20} height={20}><rect width={20} height={20} fill="currentColor" /></svg>
          </div>
          <h1 className="text-3xl font-bold">Chat</h1>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editing ? "Edit Message" : "New Message"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3" onSubmit={handleCreateOrUpdate}>
              <Input
                placeholder="Your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <Textarea
                placeholder="Write a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">{editing ? "Update" : "Send"}</Button>
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
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No messages yet.</p>
          ) : (
            messages.map(m => (
              <ChatMessageCard
                key={m.id}
                username={m.username}
                message={m.message}
                onEdit={() => handleEdit(m.id)}
                onDelete={() => handleDelete(m.id)}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
