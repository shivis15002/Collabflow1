
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fields: any[];
}

const FormsList = ({ onSelectForm, onNewForm }: { 
  onSelectForm: (form: FormTemplate) => void;
  onNewForm: () => void;
}) => {
  const [forms, setForms] = useState<FormTemplate[]>([]);
  
  useEffect(() => {
    // Load saved forms from localStorage
    const savedForms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    setForms(savedForms);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Forms</h2>
        <Button onClick={onNewForm}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Form
        </Button>
      </div>
      
      {forms.length === 0 ? (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              You don't have any forms yet. Create your first form to get started.
            </p>
            <Button onClick={onNewForm} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectForm(form)}>
              <CardHeader>
                <CardTitle>{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{form.fields.length} fields</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Form</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;
