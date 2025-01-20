import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '@/lib/api';
import { Template, DynamicField } from '@/lib/types';
import TemplateList from '@/components/templates/TemplateList';
import TemplateForm from '@/components/templates/TemplateForm';
import PromptPreview from '@/components/templates/PromptPreview';
import SettingsDialog from '@/components/settings/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function Home() {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const { data: templates = [] } = useQuery({
    queryKey: ['/api/templates'],
    queryFn: getTemplates,
  });

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/templates'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/templates'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/templates'] }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Prompt Template Manager</h1>
        <Button variant="outline" onClick={() => setShowSettings(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <TemplateList 
            templates={templates}
            selectedTemplate={selectedTemplate}
            onSelect={setSelectedTemplate}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          
          <TemplateForm
            template={selectedTemplate}
            onSubmit={(template) => {
              if (template.id) {
                updateMutation.mutate(template);
              } else {
                createMutation.mutate(template);
              }
            }}
          />
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
