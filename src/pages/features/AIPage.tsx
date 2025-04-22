
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Key } from "lucide-react";

// Define Message type to fix the TypeScript error
type Message = {
  role: "user" | "ai";
  content: string;
};

const AIPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || '';
    }
    return '';
  });
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to the state
    setMessages(prev => [...prev, { role: "user", content: input }]);
    
    setIsLoading(true);
    
    try {
      // Simulate AI response - here you would make an API call to OpenAI API
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "ai", 
          content: "This is a simulated response. Connect to OpenAI API for real answers." 
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsLoading(false);
    }
    
    setInput("");
  };

  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
    alert('API key saved successfully!');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-ai flex items-center justify-center">
            <svg className="text-white" width={20} height={20}><rect width={20} height={20} fill="currentColor" /></svg>
          </div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
            </CardHeader>
            <CardContent className="h-[50vh] overflow-y-auto flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Start a conversation with the AI assistant.
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    AI is thinking...
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <form onSubmit={handleSubmit} className="w-full flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the AI assistant..."
                  disabled={!apiKey || isLoading}
                />
                <Button type="submit" disabled={!apiKey || isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                </Button>
              </form>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Key size={16} />
                  OpenAI API Key
                </h3>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>Save API Key</Button>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">System Prompt</h3>
                <Textarea 
                  placeholder="You are a helpful assistant..."
                  rows={3}
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Customize how the AI responds (coming soon)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AIPage;
