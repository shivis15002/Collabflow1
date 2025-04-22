
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FormField, Form, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PlusCircle, Save, Calendar, FileUp, ListPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FieldType = 'text' | 'textarea' | 'date' | 'dropdown' | 'file';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For dropdown fields
}

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

const FormBuilder = () => {
  const [formTemplate, setFormTemplate] = useState<FormTemplate>({
    id: `form-${Date.now()}`,
    title: "Untitled Form",
    description: "Form description",
    fields: []
  });
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [fieldLabel, setFieldLabel] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [fieldRequired, setFieldRequired] = useState(false);
  const [fieldOptions, setFieldOptions] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const { toast } = useToast();
  const form = useForm();
  
  const addField = () => {
    if (!fieldLabel.trim()) {
      toast({
        title: "Error",
        description: "Field label cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: fieldType,
      label: fieldLabel,
      placeholder: fieldPlaceholder,
      required: fieldRequired,
    };
    
    if (fieldType === 'dropdown' && fieldOptions.trim()) {
      newField.options = fieldOptions.split(',').map(opt => opt.trim());
    }
    
    setFormTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    
    // Reset field inputs
    setFieldLabel('');
    setFieldPlaceholder('');
    setFieldRequired(false);
    setFieldOptions('');
  };
  
  const saveForm = () => {
    // Here we would typically save to a database
    // For now we'll save to localStorage as a demo
    const savedForms = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    const updatedForms = [...savedForms, formTemplate];
    localStorage.setItem('formTemplates', JSON.stringify(updatedForms));
    
    toast({
      title: "Success",
      description: "Form template saved successfully"
    });
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTemplate(prev => ({ ...prev, title: e.target.value }));
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormTemplate(prev => ({ ...prev, description: e.target.value }));
  };
  
  const removeField = (id: string) => {
    setFormTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Form Builder</CardTitle>
              <CardDescription>Create custom forms to collect data</CardDescription>
            </div>
            <Button 
              variant={isPreview ? "outline" : "default"} 
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? "Edit Form" : "Preview Form"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isPreview ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input 
                    id="form-title" 
                    value={formTemplate.title} 
                    onChange={handleTitleChange} 
                    placeholder="Enter form title" 
                  />
                </div>
                <div>
                  <Label htmlFor="form-description">Form Description</Label>
                  <Textarea 
                    id="form-description" 
                    value={formTemplate.description} 
                    onChange={handleDescriptionChange} 
                    placeholder="Enter form description" 
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Field</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="field-type">Field Type</Label>
                    <Select 
                      value={fieldType} 
                      onValueChange={(value) => setFieldType(value as FieldType)}
                    >
                      <SelectTrigger id="field-type">
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="date">Date Picker</SelectItem>
                        <SelectItem value="dropdown">Dropdown</SelectItem>
                        <SelectItem value="file">File Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="field-label">Field Label</Label>
                    <Input 
                      id="field-label" 
                      value={fieldLabel} 
                      onChange={(e) => setFieldLabel(e.target.value)} 
                      placeholder="Enter field label" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="field-placeholder">Placeholder (optional)</Label>
                    <Input 
                      id="field-placeholder" 
                      value={fieldPlaceholder} 
                      onChange={(e) => setFieldPlaceholder(e.target.value)} 
                      placeholder="Enter placeholder text" 
                    />
                  </div>
                  {fieldType === 'dropdown' && (
                    <div>
                      <Label htmlFor="field-options">Options (comma separated)</Label>
                      <Input 
                        id="field-options" 
                        value={fieldOptions} 
                        onChange={(e) => setFieldOptions(e.target.value)} 
                        placeholder="Option 1, Option 2, Option 3" 
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="field-required"
                      checked={fieldRequired}
                      onChange={(e) => setFieldRequired(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="field-required">Required Field</Label>
                  </div>
                </div>
                <Button 
                  className="mt-4" 
                  onClick={addField}
                  variant="outline"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>
              
              {formTemplate.fields.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Form Fields</h3>
                  <div className="space-y-4">
                    {formTemplate.fields.map((field) => (
                      <div key={field.id} className="border rounded-md p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{field.label}</p>
                          <p className="text-sm text-muted-foreground">
                            Type: {field.type.charAt(0).toUpperCase() + field.type.slice(1)}
                            {field.required ? ' (Required)' : ''}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeField(field.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animated-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{formTemplate.title}</h2>
                <p className="text-muted-foreground mt-1">{formTemplate.description}</p>
              </div>
              
              <Form {...form}>
                <form className="space-y-6">
                  {formTemplate.fields.map((field) => (
                    <FormField
                      key={field.id}
                      name={field.id}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                          <FormControl>
                            {field.type === 'text' && (
                              <Input placeholder={field.placeholder} />
                            )}
                            {field.type === 'textarea' && (
                              <Textarea placeholder={field.placeholder} />
                            )}
                            {field.type === 'date' && (
                              <div className="flex">
                                <Input type="date" />
                                <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            {field.type === 'dropdown' && field.options && (
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={field.placeholder || "Select an option"} />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {field.type === 'file' && (
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted border-border">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileUp className="w-8 h-8 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                      Click to upload or drag and drop
                                    </p>
                                  </div>
                                  <input type="file" className="hidden" />
                                </label>
                              </div>
                            )}
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  
                  <Button type="submit" className="w-full">Submit Form</Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
        
        {!isPreview && formTemplate.fields.length > 0 && (
          <CardFooter>
            <Button onClick={saveForm}>
              <Save className="mr-2 h-4 w-4" />
              Save Form Template
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default FormBuilder;
