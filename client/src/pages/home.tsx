import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate, reorderTemplates } from '@/lib/api';
import { Template } from '@/lib/types';
import TemplateList from '@/components/templates/TemplateList';
import TemplateForm from '@/components/templates/TemplateForm';
import PromptPreview from '@/components/templates/PromptPreview';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Settings, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Array<{ name: string; value: string }>>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  // Get selected model from localStorage
  const selectedModel = localStorage.getItem('selectedModel') || 'gemini-1.5-pro';

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['/api/templates'],
    queryFn: getTemplates,
  });

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: 'Success',
        description: 'Template created successfully',
      });
      setEditingTemplate(null);
      setActiveTab('templates');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create template',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: 'Success',
        description: 'Template updated successfully',
      });
      setEditingTemplate(null);
      setActiveTab('templates');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update template',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: duplicateTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: 'Success',
        description: 'Template duplicated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to duplicate template',
        variant: 'destructive',
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTemplates,
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/templates'], data);
      toast({
        title: 'Success',
        description: 'Template order updated successfully',
      });
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update template order',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (template: Partial<Template>) => {
    if (editingTemplate?.id) {
      updateMutation.mutate({ ...template, id: editingTemplate.id } as Template);
    } else {
      createMutation.mutate(template as Template);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    throw error; // This will be caught by ErrorBoundary
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt Template Manager</h1>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            Model: {selectedModel}
          </Badge>
          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setEditingTemplate({} as Template);
                setActiveTab('create-edit');
              }} 
              data-testid="template-create-button"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(true)}
              data-testid="settings-button"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow min-h-0">
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
              <TabsTrigger value="create-edit" className="flex-1">
                {editingTemplate?.id ? 'Edit Template' : 'Create Template'}
              </TabsTrigger>
            </TabsList>

            <TabsContent 
              value="templates" 
              className="flex-1 overflow-hidden"
            >
              <TemplateList 
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
                onEdit={(template) => {
                  setSelectedTemplate(null);
                  setEditingTemplate(template);
                  setActiveTab('create-edit');
                }}
                onDelete={(id) => deleteMutation.mutate(id)}
                onDuplicate={(template) => duplicateMutation.mutate(template)}
                onReorder={(reorderedTemplates) => reorderMutation.mutate(reorderedTemplates)}
              />
            </TabsContent>

            <TabsContent 
              value="create-edit"
              className="flex-1 overflow-hidden"
            >
              <TemplateForm
                template={editingTemplate}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setEditingTemplate(null);
                  setActiveTab('templates');
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex flex-col h-[calc(100vh-12rem)]">
          <PromptPreview
            template={selectedTemplate}
            dynamicFields={dynamicFields}
            onDynamicFieldsChange={setDynamicFields}
          />
        </div>
      </div>

      <SettingsDialog 
        open={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}