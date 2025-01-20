import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/lib/api';
import { Template } from '@/lib/types';
import TemplateList from '@/components/templates/TemplateList';
import TemplateForm from '@/components/templates/TemplateForm';
import PromptPreview from '@/components/templates/PromptPreview';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Settings, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Array<{ name: string; value: string }>>([]);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleSubmit = (template: Partial<Template>) => {
    if (editingTemplate?.id) {
      updateMutation.mutate({ ...template, id: editingTemplate.id } as Template);
    } else {
      createMutation.mutate(template as Template);
    }
  };

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  if (error) {
    return <div>Error loading templates</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt Template Manager</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setEditingTemplate({} as Template)} 
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <TemplateList 
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
            onEdit={(template) => {
              setSelectedTemplate(null);
              setEditingTemplate(template);
            }}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          {editingTemplate && (
            <TemplateForm
              template={editingTemplate}
              onSubmit={handleSubmit}
              onCancel={() => setEditingTemplate(null)}
            />
          )}
        </div>

        <div>
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