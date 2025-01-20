import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  defaultPrompts, 
  getCustomPrompts, 
  saveCustomPrompts, 
  resetToDefaultPrompts 
} from '@/lib/defaultPrompts';
import { 
  templateDomains, 
  modelTypes, 
  roleTypes, 
  methodologyTypes,
  providerTypes 
} from '@/lib/types';

interface EnhancementPromptsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EnhancementPromptsDialog({ 
  open, 
  onClose 
}: EnhancementPromptsDialogProps) {
  const { toast } = useToast();
  const [prompts, setPrompts] = useState(getCustomPrompts());
  const [activeTab, setActiveTab] = useState('domains');

  const handleSave = () => {
    saveCustomPrompts(prompts);
    toast({
      title: 'Prompts Saved',
      description: 'Your custom enhancement prompts have been saved.',
    });
    onClose();
  };

  const handleReset = () => {
    setPrompts(defaultPrompts);
    resetToDefaultPrompts();
    toast({
      title: 'Prompts Reset',
      description: 'Enhancement prompts have been reset to defaults.',
    });
  };

  const renderPromptFields = (
    category: string,
    items: readonly string[],
    promptCategory: keyof typeof prompts
  ) => (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item}>
          <label className="text-sm font-medium mb-2 block">
            {item}
          </label>
          <Textarea
            value={prompts[promptCategory][item]}
            onChange={(e) =>
              setPrompts((prev) => ({
                ...prev,
                [promptCategory]: {
                  ...prev[promptCategory],
                  [item]: e.target.value,
                },
              }))
            }
            className="min-h-[100px]"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Enhancement Prompts</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="methodologies">Methodologies</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            <TabsContent value="domains">
              {renderPromptFields('Domains', templateDomains, 'domains')}
            </TabsContent>

            <TabsContent value="providers">
              {renderPromptFields('Providers', providerTypes, 'providers')}
            </TabsContent>

            <TabsContent value="models">
              {renderPromptFields('Models', modelTypes, 'models')}
            </TabsContent>

            <TabsContent value="roles">
              {renderPromptFields('Roles', roleTypes, 'roles')}
            </TabsContent>

            <TabsContent value="methodologies">
              {renderPromptFields('Methodologies', methodologyTypes, 'methodologies')}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="destructive" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}