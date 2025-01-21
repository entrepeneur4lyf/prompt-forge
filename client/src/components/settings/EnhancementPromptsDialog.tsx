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
import { enhancePrompt } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Wand2, X, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

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
  const [metaMetaPrompt, setMetaMetaPrompt] = useState(
    localStorage.getItem('metaMetaPrompt') || 'Enhance this prompt enhancement instruction to be more effective and precise while maintaining its core purpose.'
  );
  const [enhancingPromptId, setEnhancingPromptId] = useState<string | null>(null);

  const enhanceMutation = useMutation({
    mutationFn: enhancePrompt,
    onSuccess: (data) => {
      if (enhancingPromptId) {
        const [category, item] = enhancingPromptId.split('|');
        setPrompts((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            [item]: data.enhancedPrompt,
          },
        }));
        setEnhancingPromptId(null);
        toast({
          title: 'Success',
          description: 'Enhancement prompt updated successfully',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to enhance prompt',
        variant: 'destructive',
      });
      setEnhancingPromptId(null);
    },
  });

  const handleSave = () => {
    saveCustomPrompts(prompts);
    localStorage.setItem('metaMetaPrompt', metaMetaPrompt);
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

  const handleMetaEnhance = async (category: string, item: string) => {
    const promptId = `${category}|${item}`;
    setEnhancingPromptId(promptId);

    const currentPrompt = prompts[category][item];
    const enhancementPrompt = `${metaMetaPrompt}\n\nCurrent Enhancement Prompt:\n${currentPrompt}`;

    enhanceMutation.mutate(enhancementPrompt);
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
          <div className="relative">
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
              className="min-h-[100px] pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2"
              onClick={() => handleMetaEnhance(promptCategory, item)}
              disabled={enhanceMutation.isPending}
            >
              {enhancingPromptId === `${promptCategory}|${item}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
            </Button>
          </div>
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

        <div className="sticky top-0 z-10 bg-background p-4 border-b">
          <div className="flex gap-2 items-center">
            <Input
              value={metaMetaPrompt}
              onChange={(e) => setMetaMetaPrompt(e.target.value)}
              className="flex-1"
              placeholder="Enter meta enhancement prompt..."
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMetaMetaPrompt('')}
              title="Clear meta prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
              {renderPromptFields('domains', templateDomains, 'domains')}
            </TabsContent>

            <TabsContent value="providers">
              {renderPromptFields('providers', providerTypes, 'providers')}
            </TabsContent>

            <TabsContent value="models">
              {renderPromptFields('models', modelTypes, 'models')}
            </TabsContent>

            <TabsContent value="roles">
              {renderPromptFields('roles', roleTypes, 'roles')}
            </TabsContent>

            <TabsContent value="methodologies">
              {renderPromptFields('methodologies', methodologyTypes, 'methodologies')}
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