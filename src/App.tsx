
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TasksPage from "./pages/features/TasksPage";
import ChatPage from "./pages/features/ChatPage";
import DocsPage from "./pages/features/DocsPage";
import CalendarPage from "./pages/features/CalendarPage";
import AIPage from "./pages/features/AIPage";
import TimeTrackingPage from "./pages/features/TimeTrackingPage";
import GanttPage from "./pages/features/GanttPage";
import DashboardsPage from "./pages/features/DashboardsPage";
import FormsPage from "./pages/features/FormsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/time-tracking" element={<TimeTrackingPage />} />
            <Route path="/gantt" element={<GanttPage />} />
            <Route path="/dashboards" element={<DashboardsPage />} />
            <Route path="/forms" element={<FormsPage />} />
            {/* Sign Up & Sign In routes removed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
