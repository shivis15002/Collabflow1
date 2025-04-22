
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import FormBuilder from '../../components/forms/FormBuilder';
import FormsList from '../../components/forms/FormsList';

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fields: any[];
}

const FormsPage: React.FC = () => {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  
  const handleSelectForm = (form: FormTemplate) => {
    setSelectedForm(form);
    setMode('create');
  };
  
  const handleNewForm = () => {
    setSelectedForm(null);
    setMode('create');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center mb-8 gap-3">
          <div className="h-10 w-10 rounded-md bg-gradient-forms flex items-center justify-center">
            <FileText className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold">Forms</h1>
        </div>
        
        {mode === 'list' ? (
          <FormsList onSelectForm={handleSelectForm} onNewForm={handleNewForm} />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button 
                className="text-primary hover:underline flex items-center"
                onClick={() => setMode('list')}
              >
                ← Back to Forms
              </button>
            </div>
            <FormBuilder />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FormsPage;
