import { useState } from 'react';
import { Template } from '@/lib/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import TemplateList from '@/components/templates/TemplateList';
import TemplateForm from '@/components/templates/TemplateForm';
import PromptPreview from '@/components/templates/PromptPreview';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function TemplatesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Array<{ name: string; value: string }>>([]);

  const templatesQuery = useQuery<Template[]>({
    queryKey: ['/api/templates'],
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
      if (selectedTemplate) setSelectedTemplate(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setSelectedTemplate(null); 
  };

  const handleSubmit = async (template: Partial<Template>) => {
    if (editingTemplate?.id) {
      updateMutation.mutate({ ...template, id: editingTemplate.id } as Template);
    } else {
      createMutation.mutate(template as Template);
    }
  };

  const handleCancel = () => {
    setEditingTemplate(null);
  };

  const handleSaveEnhanced = (enhanced: Template) => {
    setEditingTemplate(enhanced);
  };

  if (templatesQuery.isLoading) {
    return <div>Loading templates...</div>;
  }

  if (templatesQuery.isError) {
    return <div>Error loading templates</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Prompt Templates</h1>
            {!editingTemplate && (
              <Button onClick={() => setEditingTemplate({} as Template)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Template
              </Button>
            )}
          </div>

          {editingTemplate ? (
            <TemplateForm
              template={editingTemplate}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <TemplateList
              templates={templatesQuery.data || []}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>

        <PromptPreview
          template={selectedTemplate}
          dynamicFields={dynamicFields}
          onDynamicFieldsChange={setDynamicFields}
          onSaveEnhanced={handleSaveEnhanced}
        />
      </div>
    </div>
  );
}